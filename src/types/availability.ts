export interface BaseAvailability {
  id: string
  slotId: string
  date: string
}

export interface ActiveAvailability extends BaseAvailability {
  status: 'active'
  total: number
  sold: number
  standby: number
}

export interface BlockedAvailability extends BaseAvailability {
  status: 'blocked'
}

export type Availability = ActiveAvailability | BlockedAvailability
