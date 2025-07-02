import type { Availability } from '@/types/availability'
import { AvailabilityBar } from './availability-bar'
import { cn } from '@/lib/utils'
import { AvailabilityBlocker } from './availability-blocked'

interface AvailabilityTableCellProps {
  dayData: Availability | null
  dayIndex: number
  daysCount: number
}

export function AvailabilityTableCell({
  dayData,
  dayIndex,
  daysCount,
}: AvailabilityTableCellProps) {
  if (dayIndex >= daysCount) {
    return <div className="h-9 bg-neutral-100" />
  }

  return (
    <div
      className={cn(
        'mx-0.5 flex h-9 items-center',
        dayIndex === 0 && 'ml-3',
        dayIndex === 30 && 'mr-3',
      )}
    >
      {dayData?.status === 'blocked' && (
        <AvailabilityBlocker dayData={dayData} />
      )}
      {dayData?.status === 'active' && <AvailabilityBar dayData={dayData} />}
    </div>
  )
}
