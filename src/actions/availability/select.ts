'use server'

import { AvailabilityModel } from '@/lib/models/availability'
import type {
  Availability,
  AvailabilityCounts,
  FilterType,
} from '@/types/database'

interface AvailabilityResponse {
  data: Availability[]
  counts: AvailabilityCounts
}

export async function getAvailability(
  serviceId: number,
  slotId: number,
  filter: FilterType,
): Promise<AvailabilityResponse> {
  try {
    const data = await AvailabilityModel.findByServiceAndSlot(
      serviceId,
      slotId,
      filter,
    )

    const counts = await AvailabilityModel.findCountsByServiceAndSlot(
      serviceId,
      slotId,
    )

    return { data, counts }
  } catch (error) {
    console.error('Erro ao buscar disponibilidades:', error)
    return {
      data: [],
      counts: { all: 0, available: 0, sold: 0, standby: 0 },
    }
  }
}
