'use client'

import { useMemo } from 'react'
import { createColumnHelper } from '@tanstack/react-table'
import { AvailabilityTableHeader } from './availability-table-header'
import { AvailabilityTableCell } from './availability-table-cell'
import type { MonthRowData } from '@/hooks/use-availability-table'
import { cn } from '@/lib/utils'
import type { Slot } from '@/types/slot'
import dayjs from 'dayjs'

const columnHelper = createColumnHelper<MonthRowData>()

export function AvailabilityColumns(availableSlots: Slot[]) {
  return useMemo(
    () => [
      // Coluna do mês
      columnHelper.accessor('monthName', {
        id: 'month',
        header: () => (
          <AvailabilityTableHeader availableSlots={availableSlots} />
        ),
        cell: ({ getValue, row }) => {
          const currentMonth = dayjs().month()
          const isCurrentMonth = row.original.monthIndex === currentMonth

          return (
            <div className="relative flex h-9 items-center px-4 capitalize">
              <span className="text-sm font-medium">{getValue()}</span>
              {isCurrentMonth && (
                <div className="absolute top-1/2 right-2 h-3.5 w-1 -translate-y-1/2 rounded bg-neutral-900" />
              )}
            </div>
          )
        },
      }),

      // Colunas dos dias (1-31)
      ...Array.from({ length: 31 }, (_, i) =>
        columnHelper.accessor((row) => row.days[i], {
          id: `day-${i + 1}`,
          header: () => {
            const today = dayjs().date()
            const isToday = i + 1 === today
            return (
              <div
                className={cn(
                  'bg-secondary mx-0.5 mt-2 flex h-7 w-9 items-center justify-center rounded-sm',
                  i === 0 && 'ml-4',
                  i === 30 && 'mr-4',
                  isToday && 'text-primary-foreground bg-neutral-900',
                )}
              >
                <span className="text-xs font-semibold">{i + 1}</span>
              </div>
            )
          },
          cell: ({ getValue, row }) => {
            const today = dayjs().date()
            const isToday = i + 1 === today

            return (
              <AvailabilityTableCell
                dayData={getValue()}
                dayIndex={i}
                daysCount={row.original.daysCount}
                isToday={isToday}
              />
            )
          },
        }),
      ),
    ],
    [availableSlots],
  )
}
