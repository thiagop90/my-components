'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  type ReactNode,
} from 'react'
import type { Slot } from '@/types/database'
import { useSearchParams, useRouter } from 'next/navigation'

interface SlotContextType {
  slots: Slot[]
  currentSlot: Slot
  slotId: string
  slotIndex: number
  isFirstSlot: boolean
  isLastSlot: boolean
  hasSlots: boolean
  navigateToSlot: (slotId: string | number) => void
  navigateToPreviousSlot: () => void
  navigateToNextSlot: () => void
}

const SlotContext = createContext<SlotContextType | undefined>(undefined)

interface SlotProviderProps {
  children: ReactNode
  slots: Slot[]
}

export function SlotProvider({ children, slots }: SlotProviderProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const slotId = searchParams.get('slotId') || ''
  const slotIndex = slots.findIndex((slot) => String(slot.id) === slotId)
  const currentSlot = slots[slotIndex]

  const navigateToSlot = useCallback(
    (slotId: string | number) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set('slotId', String(slotId))
      router.push(`?${params.toString()}`)
    },
    [router, searchParams],
  )

  const navigateToPreviousSlot = useCallback(() => {
    if (slotIndex > 0) {
      const previousSlot = slots[slotIndex - 1]
      navigateToSlot(previousSlot.id)
    }
  }, [slotIndex, slots, navigateToSlot])

  const navigateToNextSlot = useCallback(() => {
    if (slotIndex < slots.length - 1) {
      const nextSlot = slots[slotIndex + 1]
      navigateToSlot(nextSlot.id)
    }
  }, [slotIndex, slots, navigateToSlot])

  const slotManagement = {
    slots,
    slotId,
    currentSlot,
    slotIndex,
    isFirstSlot: slotIndex === 0,
    isLastSlot: slotIndex === slots.length - 1,
    hasSlots: slots.length > 0,
    navigateToSlot,
    navigateToPreviousSlot,
    navigateToNextSlot,
  }

  return (
    <SlotContext.Provider value={slotManagement}>
      {children}
    </SlotContext.Provider>
  )
}

export function useSlotContext() {
  const context = useContext(SlotContext)
  if (context === undefined) {
    throw new Error('useSlotContext must be used within a SlotProvider')
  }
  return context
}
