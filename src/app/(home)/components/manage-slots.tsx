import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { AddSlotForm } from './forms/add-slot-form'
import { cn } from '@/lib/utils'
import { SlotSelector } from './slot-selector'
import { useSlotContext } from '@/context/slot-context'

export function ManageSlots() {
  const {
    slotId,
    isFirstSlot,
    isLastSlot,
    hasSlots,
    navigateToPreviousSlot,
    navigateToNextSlot,
  } = useSlotContext()

  if (!hasSlots && slotId) {
    return <AddSlotForm />
  }

  return (
    <div className="flex h-9 w-full rounded-md">
      {slotId &&
        (isFirstSlot ? (
          <AddSlotForm size="icon" className="rounded-r-none" />
        ) : (
          <Button
            className="rounded-r-none shadow-none focus-visible:z-10"
            size="icon"
            variant="secondary"
            onClick={navigateToPreviousSlot}
          >
            <ChevronLeft />
          </Button>
        ))}

      <SlotSelector
        className={cn(
          'bg-muted w-full border-transparent font-medium shadow-none focus-visible:z-10',
          slotId &&
            'border-x-border justify-center rounded-none font-medium [&_svg]:hidden',
        )}
      />

      {slotId &&
        (isLastSlot ? (
          <AddSlotForm size="icon" className="rounded-l-none" />
        ) : (
          <Button
            className="rounded-l-none shadow-none focus-visible:z-10"
            size="icon"
            variant="secondary"
            onClick={navigateToNextSlot}
          >
            <ChevronRight />
          </Button>
        ))}
    </div>
  )
}
