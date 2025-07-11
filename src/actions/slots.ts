'use server'

import { revalidatePath } from 'next/cache'
import { SlotModel } from '@/lib/models/slot'

export async function getSlotsByService(serviceId: number) {
  try {
    return await SlotModel.getByServiceId(serviceId)
  } catch (error) {
    console.error('Erro ao buscar slots:', error)
    throw new Error('Erro ao carregar slots')
  }
}

export async function createSlot(serviceId: number, formData: FormData) {
  try {
    const name = formData.get('name') as string

    const nameWithoutSpaces = name.trim()

    if (!nameWithoutSpaces) {
      return {
        success: false,
        message: 'Nome do slot é obrigatório.',
      }
    }

    const existingSlot = await SlotModel.getByName(nameWithoutSpaces, serviceId)
    if (existingSlot) {
      return {
        success: false,
        message: 'Já existe um slot com este nome.',
      }
    }

    const slotId = await SlotModel.create(name, serviceId)

    revalidatePath('/')

    return {
      success: true,
      message: `Slot "${name}" criado com sucesso.`,
      slotId,
    }
  } catch (error) {
    console.error('Erro ao criar slot:', error)
    return {
      success: false,
      message: 'Erro ao criar slot.',
    }
  }
}

export async function updateSlot(
  slotId: number,
  serviceId: number,
  formData: FormData,
) {
  try {
    const name = formData.get('name') as string

    const nameWithoutSpaces = name.trim()

    if (!nameWithoutSpaces) {
      return {
        success: false,
        message: 'Nome do slot é obrigatório.',
      }
    }

    const existingSlot = await SlotModel.getByName(nameWithoutSpaces, serviceId)
    if (existingSlot) {
      return {
        success: false,
        message: 'Já existe um slot com este nome.',
      }
    }

    await SlotModel.updateName(nameWithoutSpaces, slotId)

    revalidatePath('/')

    return {
      success: true,
      message: 'Slot atualizado com sucesso.',
    }
  } catch (error) {
    console.error('Erro ao atualizar slot:', error)
    return {
      success: false,
      message: 'Erro ao atualizar slot.',
    }
  }
}

export async function deleteSlot(id: number) {
  try {
    await SlotModel.delete(id)

    revalidatePath('/')

    return {
      success: true,
      message: 'Slot excluído com sucesso.',
    }
  } catch (error) {
    console.error('Erro ao excluir slot:', error)
    return {
      success: false,
      message: 'Erro ao excluir slot.',
    }
  }
}
