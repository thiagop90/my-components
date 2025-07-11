'use server'

import type { ActionState } from '@/lib/form-state'
import { generateAvailableDates } from '@/lib/generate-available-dates'
import { AvailabilityModel } from '@/lib/models/availability'
import { revalidatePath } from 'next/cache'

export async function blockAvailability(
  serviceId: number,
  _actionState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const slotId = parseInt(formData.get('slotId') as string)
    const startDate = formData.get('startDate') as string
    const endDate = formData.get('endDate') as string
    const excludedWeekdays = formData
      .getAll('excludedWeekdays')
      .map((day) => Number(day))

    if (!slotId || !startDate || !endDate) {
      return {
        success: false,
        message: 'Preencha todos os campos obrigatórios.',
        payload: formData,
      }
    }

    const availableDates = generateAvailableDates(
      startDate,
      endDate,
      excludedWeekdays,
    )

    const existingAvailabilities = await AvailabilityModel.findByDates(
      serviceId,
      slotId,
      availableDates,
    )

    const activeDates = existingAvailabilities
      .filter((av) => av.status === 'active')
      .map((av) => av.date)

    const existingDates = existingAvailabilities.map((av) => av.date)

    const datesToCreateBlock = availableDates.filter(
      (date) => !existingDates.includes(date),
    )

    const datesToUpdateBlock = activeDates

    if (datesToCreateBlock.length === 0 && datesToUpdateBlock.length === 0) {
      return {
        success: false,
        message: 'Todas as datas selecionadas já estão bloqueadas.',
        payload: formData,
      }
    }

    for (const date of datesToCreateBlock) {
      await AvailabilityModel.createBlock({
        slot_id: slotId,
        service_id: serviceId,
        date,
      })
    }

    for (const date of datesToUpdateBlock) {
      await AvailabilityModel.updateStatus(serviceId, slotId, date)
    }

    const totalBlocked = datesToCreateBlock.length + datesToUpdateBlock.length

    revalidatePath('/')

    return {
      success: true,
      message: `Bloqueio aplicado em ${totalBlocked} data(s). ${datesToCreateBlock.length} criado(s), ${datesToUpdateBlock.length} atualizado(s).`,
    }
  } catch (error) {
    console.error('Erro ao criar bloqueio:', error)
    return {
      success: false,
      message: 'Erro ao criar bloqueio.',
    }
  }
}

export async function unblockAvailabilityById(id: number) {
  try {
    const availability = await AvailabilityModel.findById(id)
    if (availability && availability.total === 0) {
      await AvailabilityModel.deleteById(id)
    } else {
      await AvailabilityModel.unblockById(id)
    }

    revalidatePath('/')

    return {
      success: true,
      message: 'Data desbloqueada com sucesso.',
    }
  } catch (error) {
    return { success: false, message: 'Erro ao desbloquear a data.' }
  }
}
