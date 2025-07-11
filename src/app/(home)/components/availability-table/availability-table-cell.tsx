import type { Availability } from '@/types/database'
import { AvailabilityBar } from './availability-bar'
import { cn } from '@/lib/utils'
import { AvailabilityBlocked } from './availability-blocked'

interface AvailabilityTableCellProps {
  dayData: Availability | null
  dayIndex: number
  daysCount: number
  isToday: boolean
}

export function AvailabilityTableCell({
  dayData,
  dayIndex,
  daysCount,
  isToday,
}: AvailabilityTableCellProps) {
  if (dayIndex >= daysCount) {
    return <div className="h-9 bg-neutral-100" />
  }

  return (
    <div
      className={cn(
        'mx-0.5 flex h-9 items-center',
        dayIndex === 0 && 'ml-4',
        dayIndex === 30 && 'mr-4',
        isToday && 'bg-neutral-100/60',
      )}
    >
      {dayData?.status === 'active' && <AvailabilityBar dayData={dayData} />}
      {dayData?.status === 'blocked' && (
        <AvailabilityBlocked dayData={dayData} />
      )}
    </div>
  )
}
