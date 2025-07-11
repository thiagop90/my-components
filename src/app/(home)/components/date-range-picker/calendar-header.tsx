'use client'

import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import dayjs, { type Dayjs } from 'dayjs'
import 'dayjs/locale/pt-br'

dayjs.locale('pt-br')

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

      <div className="text-sm font-medium capitalize">
        {currentMonth.format('MMMM YYYY')}
      </div>

      <Button variant="ghost" size="icon" onClick={() => onNavigate('next')}>
        <ChevronRight />
      </Button>
    </div>
  )
}
