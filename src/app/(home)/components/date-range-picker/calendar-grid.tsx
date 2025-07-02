'use client'

import { cn } from '@/lib/utils'
import { WEEK_DAYS } from '@/lib/date-constants'
import type { Dayjs } from 'dayjs'
import { Button } from '@/components/ui/button'
import dayjs from 'dayjs'

interface CalendarGridProps {
  days: Dayjs[]
  onDateClick: (date: Dayjs) => void
  isDateSelected: (date: Dayjs) => boolean
  isDateInRange: (date: Dayjs) => boolean
  isCurrentMonth: (date: Dayjs) => boolean
}

export function CalendarGrid({
  days,
  onDateClick,
  isDateSelected,
  isDateInRange,
  isCurrentMonth,
}: CalendarGridProps) {
  const weeks = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }

  function isToday(date: Dayjs) {
    return date.isSame(dayjs(), 'day')
  }

  return (
    <table className="w-full">
      <thead>
        <tr>
          {WEEK_DAYS.map((day, index) => (
            <th
              key={index}
              className="text-muted-foreground size-9 text-xs font-medium"
            >
              {day}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {weeks.map((week, weekIndex) => (
          <tr key={weekIndex}>
            {week.map((date, dayIndex) => {
              const isSelected = isDateSelected(date)
              const isInRange = isDateInRange(date)
              const isCurrentMonthDay = isCurrentMonth(date)
              const isTodayDate = isToday(date)

              return (
                <td key={dayIndex} className="py-px">
                  <Button
                    size="icon"
                    variant={isSelected ? 'default' : 'ghost'}
                    onClick={() => onDateClick(date)}
                    className={cn('', {
                      'bg-secondary': isTodayDate && !isSelected,
                      'bg-secondary rounded-none': isInRange && !isSelected,
                      '': isCurrentMonthDay,
                      'text-muted-foreground opacity-50 hover:opacity-100':
                        !isCurrentMonthDay && !isSelected,
                      'text-foreground opacity-100':
                        !isCurrentMonthDay && isInRange && !isSelected,
                    })}
                  >
                    {date.date()}
                  </Button>
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
