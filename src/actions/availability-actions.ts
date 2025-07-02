/* eslint-disable no-unmodified-loop-condition */
'use server'

import { availabilities, slots } from '@/lib/database'
import { isActiveAvailability } from '@/lib/utils'
import { type Availability } from '@/types/availability'
import { revalidatePath } from 'next/cache'
import { randomUUID } from 'node:crypto'

export interface AvailabilityCounts {
  all: number
  available: number
  sold: number
  standby: number
}

export async function listAvailability(slotName: string, filter?: string) {
  const targetSlot = slots.find((slot) => slot.name === slotName)

  if (!targetSlot) {
    throw new Error(`Slot "${slotName}" não encontrado`)
  }

  const baseData = availabilities.filter(
    (item) => item.slotId === targetSlot.id,
  )

  const blockedDates = baseData.filter((item) => item.status === 'blocked')
  const activeDates = baseData.filter((item) => item.status === 'active')

  const counts: AvailabilityCounts = {
    all: activeDates.length,
    available: activeDates.filter(
      (item) => item.total - item.sold - item.standby > 0,
    ).length,
    sold: activeDates.filter((item) => item.sold > 0).length,
    standby: activeDates.filter((item) => item.standby > 0).length,
  }

  let filteredActive = activeDates

  if (filter === 'sold') {
    filteredActive = activeDates.filter((item) => item.sold > 0)
  } else if (filter === 'standby') {
    filteredActive = activeDates.filter((item) => item.standby > 0)
  } else if (filter === 'available') {
    filteredActive = activeDates.filter(
      (item) => item.total - item.sold - item.standby > 0,
    )
  }

  const data = [...filteredActive, ...blockedDates]

  return {
    data,
    counts,
  }
}

export async function insertAvailability(formData: FormData) {
  try {
    const startDate = formData.get('startDate') as string
    const endDate = formData.get('endDate') as string
    const slotId = formData.get('slotId') as string
    const quantity = formData.get('quantity') as string

    const start = new Date(startDate)
    const end = new Date(endDate)

    // Gerar todas as datas entre start e end
    const dates: string[] = []

    for (
      let currentDate = new Date(start);
      currentDate <= end;
      currentDate.setDate(currentDate.getDate() + 1)
    ) {
      dates.push(currentDate.toISOString().split('T')[0])
    }

    // Busca de datas/horários existentes
    const existingCombinations = new Set(
      availabilities
        .filter((existing) => existing.slotId === slotId)
        .map((existing) => existing.date),
    )

    // Filtrar datas que já têm disponibilidade no mesmo horário
    const availableDates = dates.filter(
      (date) => !existingCombinations.has(date),
    )

    if (availableDates.length === 0) {
      return {
        success: false,
        message:
          'Todas as datas selecionadas já possuem disponibilidade para este horário',
      }
    }

    const newAvailabilities: Availability[] = availableDates.map((date) => ({
      id: randomUUID(),
      date,
      slotId,
      status: 'active',
      total: Number(quantity),
      sold: 0,
      standby: 0,
    }))

    availabilities.push(...newAvailabilities)

    revalidatePath('/')

    return {
      success: true,
      message: `${newAvailabilities.length} disponibilidade(s) criada(s) com sucesso!`,
    }
  } catch (error) {
    console.error('Erro ao criar disponibilidade:', error)
    return {
      success: false,
      message: 'Erro interno do servidor',
    }
  }
}

export async function updateAvailability(formData: FormData) {
  try {
    const startDate = formData.get('startDate') as string
    const endDate = formData.get('endDate') as string
    const slotId = formData.get('slotId') as string
    const quantity = formData.get('quantity') as string

    const start = new Date(startDate)
    const end = new Date(endDate)

    // Gerar todas as datas entre start e end
    const dates: string[] = []

    for (
      let currentDate = new Date(start);
      currentDate <= end;
      currentDate.setDate(currentDate.getDate() + 1)
    ) {
      dates.push(currentDate.toISOString().split('T')[0])
    }

    // Buscar disponibilidades existentes no período e slot especificados
    const existingAvailabilities = availabilities.filter(
      (availability) =>
        availability.slotId === slotId &&
        dates.includes(availability.date) &&
        availability.status === 'active',
    )

    if (existingAvailabilities.length === 0) {
      return {
        success: false,
        message:
          'Nenhuma disponibilidade encontrada para o período selecionado',
      }
    }

    // Atualizar as quantidades
    let updatedCount = 0
    existingAvailabilities.forEach((availability) => {
      const newTotal = Number(quantity)

      // Verificar se a nova quantidade não é menor que as vendas + standby
      if (availability.status === 'active') {
        const usedQuantity = availability.sold + availability.standby
        if (newTotal >= usedQuantity) {
          availability.total = newTotal
          updatedCount++
        }
      }
    })

    if (updatedCount === 0) {
      return {
        success: false,
        message:
          'A nova quantidade deve ser maior ou igual às vendas existentes',
      }
    }

    revalidatePath('/')

    return {
      success: true,
      message: `${updatedCount} disponibilidade(s) atualizada(s) com sucesso!`,
    }
  } catch (error) {
    console.error('Erro ao atualizar disponibilidade:', error)
    return {
      success: false,
      message: 'Erro interno do servidor',
    }
  }
}

export async function blockAvailability(formData: FormData) {
  try {
    const startDate = formData.get('startDate') as string
    const endDate = formData.get('endDate') as string
    const slotId = formData.get('slotId') as string

    const start = new Date(startDate)
    const end = new Date(endDate)

    // Gerar todas as datas entre start e end
    const dates: string[] = []

    for (
      let currentDate = new Date(start);
      currentDate <= end;
      currentDate.setDate(currentDate.getDate() + 1)
    ) {
      dates.push(currentDate.toISOString().split('T')[0])
    }

    let blockedCount = 0

    dates.forEach((date) => {
      const existing = availabilities.some(
        (availability) =>
          availability.slotId === slotId && availability.date === date,
      )

      if (!existing) {
        // Criar nova entrada bloqueada apenas se ainda não existe
        const newBlockedAvailability: Availability = {
          id: randomUUID(),
          date,
          slotId,
          status: 'blocked',
        }
        availabilities.push(newBlockedAvailability)
        blockedCount++
      }
    })

    if (blockedCount === 0) {
      return {
        success: false,
        message: 'Todas as datas selecionadas já estão bloqueadas ou ocupadas.',
      }
    }

    revalidatePath('/')

    return {
      success: true,
      message: `${blockedCount} data(s) bloqueada(s) com sucesso!`,
    }
  } catch (error) {
    console.error('Erro ao bloquear disponibilidade:', error)
    return {
      success: false,
      message: 'Erro interno do servidor',
    }
  }
}

export async function unblockAvailabilityById(slotId: string) {
  try {
    const index = availabilities.findIndex(
      (availability) =>
        availability.id === slotId && availability.status === 'blocked',
    )

    if (index === -1) {
      return {
        success: false,
        message: 'Disponibilidade bloqueada não encontrada',
      }
    }

    availabilities.splice(index, 1)

    revalidatePath('/')

    return {
      success: true,
      message: 'Disponibilidade desbloqueada com sucesso!',
    }
  } catch (error) {
    console.error('Erro ao desbloquear disponibilidade:', error)
    return {
      success: false,
      message: 'Erro interno do servidor',
    }
  }
}

export async function updateAvailabilityById(id: string, available: number) {
  const item = availabilities.find((item) => item.id === id)

  if (!item) {
    return {
      success: false,
      error: 'Registro não encontrado',
    }
  }

  if (!isActiveAvailability(item)) {
    return {
      success: false,
      error: 'Apenas registros ativos podem ser atualizados',
    }
  }

  const newTotal = available + item.sold + item.standby
  item.total = newTotal

  revalidatePath('/')

  return { success: true }
}
