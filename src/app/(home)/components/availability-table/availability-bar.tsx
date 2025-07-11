import { cn } from '@/lib/utils'
import { useAvailabilitySegments } from '@/hooks/use-availability-segments'
import { AvailabilityBarContent } from './availability-bar-content'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useState } from 'react'
import type { Availability } from '@/types/database'

interface AvailabilityBarProps {
  dayData: Availability
}

export function AvailabilityBar({ dayData }: AvailabilityBarProps) {
  const [isOpen, setIsOpen] = useState(false)

  const { allSegments, visibleSegments, totalVisible, currentFilter } =
    useAvailabilitySegments(dayData)

  if (totalVisible === 0) return null

  return (
    <Popover modal open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div
          className={cn(
            'flex h-7 w-9 cursor-pointer flex-col items-center justify-center px-1.5',
            isOpen ? 'bg-background rounded-sm shadow' : '',
          )}
        >
          <p className="mb-0.5 text-[11px] font-semibold">{totalVisible}</p>
          <div className="flex h-1 w-full overflow-hidden rounded-sm">
            {visibleSegments.map((segment) => (
              <div
                key={segment.key}
                className={segment.color}
                style={{
                  width:
                    currentFilter === 'all'
                      ? `${(segment.value / dayData.total) * 100}%`
                      : '100%',
                }}
              />
            ))}
          </div>
        </div>
      </PopoverTrigger>

      <PopoverContent className="bg-secondary w-auto rounded-[18px] border p-1">
        <AvailabilityBarContent
          segments={allSegments}
          dayData={dayData}
          activeFilter={currentFilter}
        />
      </PopoverContent>
    </Popover>
  )
}
