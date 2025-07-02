'use client'

import { AddSlotForm } from '@/app/(home)/components/forms/add-slot-form'
import { Button } from '@/components/ui/button'
import { useSlotManagement } from '@/hooks/use-slot-management'
import type { Slot } from '@/types/slot'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export function AvailabilityTableHeader({
  availableSlots,
}: {
  availableSlots: Slot[]
}) {
  const {
    slotName,
    isFirstSlot,
    isLastSlot,
    navigateToSlot,
    navigateToPreviousSlot,
    navigateToNextSlot,
  } = useSlotManagement(availableSlots)

  return (
    <div className="bg-secondary m-3 flex h-9 w-auto items-center rounded-md">
      {isFirstSlot ? (
        <AddSlotForm isFirstSlot={isFirstSlot} navigate={navigateToSlot} />
      ) : (
        <Button
          className="rounded-r-none border-r"
          size="icon"
          variant="ghost"
          onClick={navigateToPreviousSlot}
        >
          <ChevronLeft />
        </Button>
      )}

      <span className="w-20 flex-1 truncate px-3 text-center text-xs font-semibold">
        {slotName}
      </span>

      {isLastSlot ? (
        <AddSlotForm isFirstSlot={isFirstSlot} navigate={navigateToSlot} />
      ) : (
        <Button
          className="rounded-l-none border-l"
          size="icon"
          variant="ghost"
          onClick={navigateToNextSlot}
        >
          <ChevronRight />
        </Button>
      )}
    </div>
  )
}
