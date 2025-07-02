'use client'

import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import type { Availability } from '@/types/availability'
import { AvailabilityTableContainer } from './availability-table-container'

import { cn } from '@/lib/utils'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useAvailabilityTable } from '@/hooks/use-availability-table'
import { AvailabilityColumns } from './availability-columns'
import type { Slot } from '@/types/slot'

dayjs.locale('pt-br')

interface AvailabilityTableProps {
  data: Availability[]
  availableSlots: Slot[]
}

export function AvailabilityTable({
  data,
  availableSlots,
}: AvailabilityTableProps) {
  const { tableData } = useAvailabilityTable(data)

  const columns = AvailabilityColumns(availableSlots)

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <AvailabilityTableContainer>
      <table
        className={cn(
          'w-full border-separate border-spacing-0 select-none [&_td]:border-neutral-200/70 [&_th]:border-b [&_tr]:border-neutral-200/70 [&_tr:not(:last-child)_td]:border-b',
        )}
      >
        <thead className="sticky top-0 z-20">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header, index) => (
                <th
                  key={header.id}
                  className={cn(
                    'bg-background/90 border-neutral-200/70 backdrop-blur-lg',
                    index === 0 && 'sticky top-0 left-0 z-10 border-r',
                  )}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell, index) => (
                <td
                  key={cell.id}
                  className={cn(
                    index === 0 &&
                      'bg-background/80 sticky left-0 z-10 border-r backdrop-blur-lg',
                  )}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </AvailabilityTableContainer>
  )
}
