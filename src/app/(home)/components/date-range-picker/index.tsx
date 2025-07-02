'use client'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Calendar } from 'lucide-react'
import { useDateRange, type DateRange } from '@/hooks/use-date-range'
import { CalendarHeader } from './calendar-header'
import { CalendarGrid } from './calendar-grid'
import { Label } from '@/components/ui/label'

interface DateRangePickerProps {
  selected: DateRange
  onSelect: (range: DateRange) => void
}

export function DateRangePicker({ selected, onSelect }: DateRangePickerProps) {
  const {
    isOpen,
    setIsOpen,
    currentMonth,
    formatDateRange,
    generateCalendarDays,
    handleDateClick,
    isDateInRange,
    isDateSelected,
    isCurrentMonth,
    navigateMonth,
  } = useDateRange({ selected, onSelect })

  const calendarDays = generateCalendarDays()

  return (
    <div className="space-y-2">
      <Label htmlFor="period">Período</Label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            id="period"
            variant="outline"
            className="w-full justify-between font-normal"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span>{formatDateRange()}</span>
            <Calendar className="text-muted-foreground" />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          className="bg-secondary w-auto rounded-[18px] p-1"
          align="center"
        >
          <div className="bg-background rounded-xl border p-3">
            <CalendarHeader
              currentMonth={currentMonth}
              onNavigate={navigateMonth}
            />

            <CalendarGrid
              days={calendarDays}
              onDateClick={handleDateClick}
              isDateSelected={isDateSelected}
              isDateInRange={isDateInRange}
              isCurrentMonth={isCurrentMonth}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
