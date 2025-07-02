import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { slots } from './database'
import type { Availability } from '@/types/availability'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getSlotNameById(slotId: string) {
  const slot = slots.find((slot) => slot.id === slotId)

  return slot?.name
}

export function isActiveAvailability(availability: Availability) {
  return availability.status === 'active'
}

export function isBlockedAvailability(availability: Availability) {
  return availability.status === 'blocked'
}
