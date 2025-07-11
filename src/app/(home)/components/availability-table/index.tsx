'use client'

import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import type { Availability } from '@/types/database'
import { AvailabilityTableContainer } from './availability-table-container'
import { ManageSlots } from '../manage-slots'
import { AvailabilityTableCell } from './availability-table-cell'
import { cn } from '@/lib/utils'

import { useAvailabilityTable } from '@/hooks/use-availability-table'
import { AvailabilityDays } from './availability-days'
import { Button } from '@/components/ui/button'
import { PlusIcon } from 'lucide-react'

interface AvailabilityTableProps {
  serviceId: number | null
  data: Availability[]
}

export function AvailabilityTable({ serviceId, data }: AvailabilityTableProps) {
  const { tableData } = useAvailabilityTable(data)

  return (
    <AvailabilityTableContainer>
      <table
        className={cn(
          'w-full border-separate border-spacing-0 select-none [&_td]:border-neutral-200/70 [&_th]:border-b [&_tr]:border-neutral-200/70 [&_tr:not(:last-child)_td]:border-b',
        )}
      >
        <thead className="sticky top-0 z-20">
          <tr>
            <th
              className={cn(
                'bg-background/90 border-neutral-200/70 backdrop-blur-lg',
                'sticky top-0 left-0 z-10 border-r',
              )}
            >
              <div className="w-[200px] p-4">
                {serviceId ? (
                  <ManageSlots />
                ) : (
                  <Button variant="secondary" disabled className="w-full">
                    <PlusIcon />
                    Adicionar slot
                  </Button>
                )}
              </div>
            </th>

            <AvailabilityDays />
          </tr>
        </thead>

        <tbody>
          {tableData.map((monthData) => (
            <tr key={`month-${monthData.monthIndex}`}>
              <td
                className={cn(
                  'bg-background/80 sticky left-0 z-10 border-r backdrop-blur-lg',
                )}
              >
                <div className="relative flex h-9 items-center px-4 capitalize">
                  <span className="text-sm font-medium">
                    {monthData.monthName}
                  </span>
                  {monthData.monthIndex === dayjs().month() && (
                    <div className="bg-primary absolute inset-y-2 left-0 w-1 rounded-r" />
                  )}
                </div>
              </td>

              {monthData.days.map((dayData, dayIndex) => {
                const today = dayjs().date()
                const isToday = dayIndex + 1 === today

                return (
                  <td key={`day-${dayIndex}`}>
                    <AvailabilityTableCell
                      dayData={dayData}
                      dayIndex={dayIndex}
                      daysCount={monthData.daysCount}
                      isToday={isToday}
                    />
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </AvailabilityTableContainer>
  )
}
