'use server'

import type { ActionState } from '@/lib/form-state'
import { generateAvailableDates } from '@/lib/generate-available-dates'
import { AvailabilityModel } from '@/lib/models/availability'
import { revalidatePath } from 'next/cache'

export async function insertAvailability(
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
    const quantity = Number(formData.get('quantity'))

    if (!slotId || !startDate || !endDate || !quantity) {
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

    const existingDates = existingAvailabilities.map(
      (availability) => availability.date,
    )

    const datesToInsert = availableDates.filter(
      (date) => !existingDates.includes(date),
    )

    if (datesToInsert.length === 0) {
      return {
        success: false,
        message: 'Nenhuma data selecionada está disponível.',
        payload: formData,
      }
    }

    for (const date of datesToInsert) {
      await AvailabilityModel.insertAvailability({
        slot_id: slotId,
        service_id: serviceId,
        date,
        total: quantity,
      })
    }

    revalidatePath('/')

    return {
      success: true,
      message: `Disponibilidade criada para ${datesToInsert.length} data(s).`,
    }
  } catch (error) {
    console.error('Erro ao criar disponibilidade:', error)
    return {
      success: false,
      message: 'Erro ao criar disponibilidade.',
    }
  }
}
