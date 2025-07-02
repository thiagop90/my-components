import dayjs from 'dayjs'
import { cn, getSlotNameById } from '@/lib/utils'
import type { SegmentData } from '@/hooks/use-availability-segments'
import type { FilterType } from '../filter-availability-table'
import { Pencil } from 'lucide-react'
import { useState } from 'react'
import type { ActiveAvailability } from '@/types/availability'
import { Button } from '@/components/ui/button'
import { AvailabilityEditForm } from '../forms/availability-edit-form'

interface AvailabilityBarContentProps {
  segments: SegmentData[]
  dayData: ActiveAvailability
  activeFilter: FilterType
}

export function AvailabilityBarContent({
  dayData,
  segments,
  activeFilter,
}: AvailabilityBarContentProps) {
  const [isEditing, setIsEditing] = useState(false)

  const slotName = getSlotNameById(dayData.slotId)
  const { date, id, total, sold, standby } = dayData
  const available = total - sold - standby

  const isSegmentFiltered = (segmentKey: FilterType) => {
    return activeFilter !== 'all' && activeFilter !== segmentKey
  }

  return (
    <div className="bg-background rounded-xl border">
      <div className="flex justify-between border-b p-3 text-xs font-semibold">
        <span>{slotName}</span>
        <span>{dayjs(date).format('DD/MM/YYYY')}</span>
      </div>

      <div className="bg-secondary m-3 rounded-lg">
        <div className="bg-secondary grid grid-cols-2 rounded-lg">
          {segments.map((segment) => (
            <div
              key={segment.key}
              className={cn(
                'flex flex-col items-center gap-2 px-4 py-3.5 first:col-span-2 first:border-b last:border-l',
                isSegmentFiltered(segment.key) &&
                  'pointer-events-none opacity-50',
              )}
            >
              <div className="flex items-center gap-1.5">
                <div className={cn('size-2 rounded-full', segment.color)} />
                <span className="text-xs font-medium">{segment.label}</span>
              </div>

              {segment.key === 'available' ? (
                isEditing ? (
                  <AvailabilityEditForm
                    availabilityId={id}
                    currentValue={available}
                    onCancel={() => setIsEditing(false)}
                  />
                ) : (
                  <div className="bg-background relative flex items-center gap-2 rounded-md border pl-2">
                    <span className="text-xs font-semibold">{available}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setIsEditing(true)}
                      className="size-7 rounded-none border-l"
                    >
                      <Pencil className="text-muted-foreground size-3.5" />
                    </Button>
                  </div>
                )
              ) : (
                <span className="text-xs font-semibold">{segment.value}</span>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between border-t p-3">
          <span className="text-xs font-medium">Total:</span>
          <span className="text-xs font-semibold">{total}</span>
        </div>
      </div>
    </div>
  )
}
