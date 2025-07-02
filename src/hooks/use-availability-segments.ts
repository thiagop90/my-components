'use client'

import { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import type { FilterType } from '@/app/(home)/components/filter-availability-table'
import type { ActiveAvailability } from '@/types/availability'

export interface SegmentData {
  key: FilterType
  label: string
  value: number
  color: string
}

export function useAvailabilitySegments(dayData: ActiveAvailability) {
  const searchParams = useSearchParams()
  const filter = (searchParams.get('filter') as FilterType) ?? 'all'

  return useMemo(() => {
    const { sold, standby, total } = dayData
    const available = Math.max(total - sold - standby, 0)

    const allSegments: SegmentData[] = [
      {
        key: 'available',
        label: 'Disponível',
        value: available,
        color: 'bg-emerald-400',
      },
      {
        key: 'sold',
        label: 'Vendido',
        value: sold,
        color: 'bg-rose-400',
      },
      {
        key: 'standby',
        label: 'Standby',
        value: standby,
        color: 'bg-amber-400',
      },
    ]

    const visibleSegments = allSegments.filter((segment) => segment.value > 0)

    const displaySegments =
      filter === 'all'
        ? visibleSegments
        : visibleSegments.filter((segment) => segment.key === filter)

    const totalVisible = displaySegments.reduce(
      (acc, segment) => acc + segment.value,
      0,
    )

    return {
      allSegments,
      visibleSegments: displaySegments,
      totalVisible,
      currentFilter: filter,
      isFiltered: filter !== 'all',
    }
  }, [dayData, filter])
}
