import { cn } from '@/lib/utils'
import dayjs from 'dayjs'
import { useMemo } from 'react'

export function AvailabilityDays() {
  return useMemo(() => {
    const today = dayjs().date()

    return Array.from({ length: 31 }, (_, i) => {
      const dayNumber = i + 1
      const isToday = dayNumber === today

      return (
        <th key={`day-${dayNumber}`}>
          <div
            className={cn(
              'bg-secondary mx-0.5 mt-2 flex h-7 w-9 items-center justify-center rounded-sm',
              i === 0 && 'ml-4',
              i === 30 && 'mr-4',
              isToday && 'text-primary-foreground bg-primary',
            )}
          >
            <span className="text-xs font-semibold">{dayNumber}</span>
          </div>
        </th>
      )
    })
  }, [])
}
