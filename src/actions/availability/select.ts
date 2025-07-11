'use server'

import { AvailabilityModel } from '@/lib/models/availability'
import type { Availability, AvailabilityCounts } from '@/types/database'

interface AvailabilityResponse {
  data: Availability[]
  counts: AvailabilityCounts
}

export async function getAvailability(
  serviceId: number,
  slotId: number,
): Promise<AvailabilityResponse> {
  try {
    const data = await AvailabilityModel.findByServiceAndSlot(serviceId, slotId)

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
