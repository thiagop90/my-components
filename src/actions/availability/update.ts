'use server'

import { revalidatePath } from 'next/cache'
import { generateAvailableDates } from '@/lib/generate-available-dates'
import { AvailabilityModel } from '@/lib/models/availability'
import type { ActionState } from '@/lib/form-state'

export async function updateAvailabilityTotal(
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
    const newTotal = Number(formData.get('quantity'))

    if (!slotId || !startDate || !endDate || !newTotal) {
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

    const existingAvailabilities = await AvailabilityModel.findDetailsByDates(
      serviceId,
      slotId,
      availableDates,
    )

    const activeAvailabilities = existingAvailabilities.filter(
      (av) => av.status === 'active',
    )

    if (activeAvailabilities.length === 0) {
      return {
        success: false,
        message:
          'Nenhuma disponibilidade ativa encontrada para as datas selecionadas.',
        payload: formData,
      }
    }

    const availabilitiesToUpdate = activeAvailabilities.filter((av) => {
      const currentTotal = av.total
      const soldAndStandby = av.sold + av.standby

      return newTotal !== currentTotal && newTotal >= soldAndStandby
    })

    if (availabilitiesToUpdate.length === 0) {
      return {
        success: false,
        message:
          'Nenhuma disponibilidade pode ser atualizada. Verifique se o novo valor é diferente do atual e maior ou igual às vendas.',
        payload: formData,
      }
    }

    for (const availability of availabilitiesToUpdate) {
      await AvailabilityModel.updateTotal(
        serviceId,
        slotId,
        availability.date,
        newTotal,
      )
    }

    revalidatePath('/')

    return {
      success: true,
      message: `Disponibilidade atualizada para ${availabilitiesToUpdate.length} data(s).`,
    }
  } catch (error) {
    console.error('Erro ao atualizar disponibilidade:', error)
    return {
      success: false,
      message: 'Erro ao atualizar disponibilidade.',
    }
  }
}

export async function updateAvailabilityById(id: number, formData: FormData) {
  try {
    const available = Number(formData.get('available'))

    const availability = await AvailabilityModel.findById(id)

    if (!availability) {
      return {
        success: false,
        message: 'Disponibilidade não encontrada.',
      }
    }

    const totalSold = availability.sold + availability.standby

    const currentAvailable = availability.total - totalSold

    if (available === currentAvailable) {
      return {
        success: false,
        message: 'O valor inserido deve ser diferente do atual.',
      }
    }

    const newTotal = available + totalSold

    await AvailabilityModel.updateTotal(
      availability.service_id,
      availability.slot_id,
      availability.date,
      newTotal,
    )

    revalidatePath('/')

    return {
      success: true,
      message: 'Quantidade disponível atualizada com sucesso.',
    }
  } catch (error) {
    console.error('Erro ao atualizar disponibilidade', error)
    return {
      success: false,
      message: 'Erro ao atualizar disponibilidade',
    }
  }
}
