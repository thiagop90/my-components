'use client'

import type { Slot } from '@/types/slot'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo } from 'react'

export function useSlotManagement(availableSlots: Slot[]) {
  const { replace } = useRouter()
  const searchParams = useSearchParams()

  const slots = useMemo(() => availableSlots, [availableSlots])

  const slotName = searchParams.get('slot') || ''

  // Encontrar o slot atual pelo nome
  const slot = slots.find((s) => s.name === slotName)
  const slotIndex = slots.findIndex((s) => s.name === slotName)

  const navigateToSlot = useCallback(
    (slotName: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set('slot', slotName)
      replace(`?${params.toString()}`)
    },
    [replace, searchParams],
  )

  const navigateToPreviousSlot = useCallback(() => {
    if (slotIndex > 0) {
      const previousSlot = slots[slotIndex - 1]
      navigateToSlot(previousSlot.name)
    }
  }, [slotIndex, slots, navigateToSlot])

  const navigateToNextSlot = useCallback(() => {
    if (slotIndex < slots.length - 1) {
      const nextSlot = slots[slotIndex + 1]
      navigateToSlot(nextSlot.name)
    }
  }, [slotIndex, slots, navigateToSlot])

  return {
    slotName,
    slotId: slot?.id || '',
    availableSlots: slots,
    slotIndex,
    isFirstSlot: slotIndex === 0,
    isLastSlot: slotIndex === slots.length - 1,
    navigateToSlot,
    navigateToPreviousSlot,
    navigateToNextSlot,
  }
}
