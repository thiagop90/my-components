'use client'

import { useState } from 'react'
import dayjs, { type Dayjs } from 'dayjs'
import 'dayjs/locale/pt-br'

export interface DateRange {
  startDate: Dayjs | null
  endDate: Dayjs | null
}

dayjs.locale('pt-br')

interface UseDateRangeProps {
  selected: DateRange
  onSelect: (range: DateRange) => void
}

export function useDateRange({ selected, onSelect }: UseDateRangeProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(dayjs())
  const [selectingStart, setSelectingStart] = useState(true)

  function formatDateRange() {
    if (!selected.startDate || !selected.endDate) {
      return 'Selecione um período'
    }

    const startFormatted = selected.startDate.format('DD MMM, YYYY')
    const endFormatted = selected.endDate.format('DD MMM, YYYY')

    return `${startFormatted} - ${endFormatted}`
  }

  function generateCalendarDays() {
    const startOfMonth = currentMonth.startOf('month')
    const endOfMonth = currentMonth.endOf('month')
    const startOfCalendar = startOfMonth.startOf('week')
    const endOfCalendar = endOfMonth.endOf('week')

    const days = []
    let current = startOfCalendar

    while (
      current.isBefore(endOfCalendar) ||
      current.isSame(endOfCalendar, 'day')
    ) {
      days.push(current)
      current = current.add(1, 'day')
    }

    return days
  }

  function handleDateClick(date: Dayjs) {
    let newRange: DateRange

    if (selectingStart || !selected.startDate) {
      newRange = { startDate: date, endDate: null }
      setSelectingStart(false)
    } else {
      if (date.isBefore(selected.startDate)) {
        newRange = { startDate: date, endDate: selected.startDate }
      } else {
        newRange = { startDate: selected.startDate, endDate: date }
      }
      setSelectingStart(true)
      setIsOpen(false)
    }

    onSelect(newRange)
  }

  function isDateInRange(date: Dayjs) {
    if (!selected.startDate || !selected.endDate) return false

    return (
      date.isAfter(selected.startDate, 'day') &&
      date.isBefore(selected.endDate, 'day')
    )
  }

  function isDateSelected(date: dayjs.Dayjs): boolean {
    if (!selected.startDate && !selected.endDate) return false

    return (
      (selected.startDate?.isSame(date, 'day') ?? false) ||
      (selected.endDate?.isSame(date, 'day') ?? false)
    )
  }

  function isCurrentMonth(date: Dayjs) {
    return date.isSame(currentMonth, 'month')
  }

  function navigateMonth(direction: 'prev' | 'next') {
    setCurrentMonth((prev) =>
      direction === 'prev' ? prev.subtract(1, 'month') : prev.add(1, 'month'),
    )
  }

  return {
    isOpen,
    setIsOpen,
    currentMonth,
    dateRange: selected,
    formatDateRange,
    generateCalendarDays,
    handleDateClick,
    isDateInRange,
    isDateSelected,
    isCurrentMonth,
    navigateMonth,
  }
}
