'use server'

import { revalidatePath } from 'next/cache'
import { slots } from '@/lib/database'
import type { Slot } from '@/types/slot'

export async function getAvailableSlots(): Promise<Slot[]> {
  try {
    return [...slots]
  } catch (error) {
    console.error('Erro ao buscar slots:', error)
    return []
  }
}

export async function createSlot(formData: FormData) {
  try {
    const name = formData.get('slotName') as string
    const isFirstSlot = formData.get('isFirstSlot') === 'true'

    const normalizedName = name.trim()

    if (!normalizedName) {
      return {
        success: false,
        message: 'Nome do slot é obrigatório',
        slot: null,
      }
    }

    if (
      slots.some(
        (slot) => slot.name.toLowerCase() === normalizedName.toLowerCase(),
      )
    ) {
      return {
        success: false,
        message: 'Já existe um slot com esse nome',
        slot: null,
      }
    }

    const newSlot: Slot = {
      id: crypto.randomUUID(),
      name,
    }

    if (isFirstSlot) {
      slots.unshift(newSlot)
    } else {
      slots.push(newSlot)
    }

    revalidatePath('/')

    return {
      success: true,
      message: `Slot "${normalizedName}" criado com sucesso!`,
      slot: newSlot,
    }
  } catch (error) {
    console.error('Erro ao criar slot:', error)
    return {
      success: false,
      message: 'Erro interno do servidor',
      slot: null,
    }
  }
}
