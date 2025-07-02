'use client'

import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { MONTH_NAMES } from '@/lib/date-constants'
import type { Dayjs } from 'dayjs'

interface CalendarHeaderProps {
  currentMonth: Dayjs
  onNavigate: (direction: 'prev' | 'next') => void
}

export function CalendarHeader({
  currentMonth,
  onNavigate,
}: CalendarHeaderProps) {
  return (
    <div className="mb-1 flex items-center justify-between">
      <Button variant="ghost" size="icon" onClick={() => onNavigate('prev')}>
        <ChevronLeft />
      </Button>

      <div className="text-sm font-medium">
        {MONTH_NAMES[currentMonth.month()]} {currentMonth.year()}
      </div>

      <Button variant="ghost" size="icon" onClick={() => onNavigate('next')}>
        <ChevronRight />
      </Button>
    </div>
  )
}
