'use client'

import { useMemo } from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import type { Availability } from '@/types/database'

dayjs.locale('pt-br')

export interface MonthRowData {
  monthIndex: number
  monthName: string
  daysCount: number
  days: readonly (Availability | null)[]
}

export function useAvailabilityTable(data: Availability[]) {
  const currentYear = dayjs().year()

  const tableData = useMemo(() => {
    return Array.from({ length: 12 }, (_, monthIndex) => {
      const monthName = dayjs().month(monthIndex).format('MMMM')
      const daysInMonth = dayjs(
        `${currentYear}-${monthIndex + 1}-01`,
      ).daysInMonth()

      const days = Array.from({ length: 31 }, (_, dayIndex) => {
        if (dayIndex >= daysInMonth) return null

        const dateKey = dayjs(
          `${currentYear}-${monthIndex + 1}-${dayIndex + 1}`,
        ).format('YYYY-MM-DD')
        return data.find((d) => d.date === dateKey) || null
      })

      return {
        monthIndex,
        monthName,
        daysCount: daysInMonth,
        days,
      }
    })
  }, [data, currentYear])

  return { tableData }
}
