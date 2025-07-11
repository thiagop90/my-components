'use server'

import { ServiceModel } from '@/lib/models/service'

export async function getServices() {
  try {
    return await ServiceModel.getAll()
  } catch (error) {
    console.error('Erro ao buscar serviços:', error)
    throw new Error('Erro ao carregar serviços')
  }
}
