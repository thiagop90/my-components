export interface Service {
  id: number
  name: string
  created_at: Date
  updated_at: Date
}

export interface Slot {
  id: number
  name: string
  service_id: number
  created_at: Date
  updated_at: Date
}

export interface Availability {
  id: number
  slot_id: number
  service_id: number
  date: string
  status: 'active' | 'blocked'
  total: number
  sold: number
  standby: number
  created_at: Date
  updated_at: Date
}

export interface InsertAvailabilityRequest {
  slot_id: number
  service_id: number
  date: string
  total: number
}

export type FilterType = 'all' | 'sold' | 'available' | 'standby'

export interface AvailabilityCounts {
  all: number
  available: number
  sold: number
  standby: number
}
