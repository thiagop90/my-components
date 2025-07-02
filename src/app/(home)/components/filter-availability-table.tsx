'use client'

import type { AvailabilityCounts } from '@/actions/availability-actions'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export type FilterType = 'all' | 'sold' | 'available' | 'standby'

interface Filter {
  value: FilterType
  label: string
  countKey: keyof AvailabilityCounts
}

const filters: Filter[] = [
  { value: 'all', label: 'Todos', countKey: 'all' },
  { value: 'available', label: 'Disponíveis', countKey: 'available' },
  { value: 'sold', label: 'Vendidos', countKey: 'sold' },
  { value: 'standby', label: 'Standby', countKey: 'standby' },
]

interface FilterAvailabilityTableProps {
  counts: AvailabilityCounts
}

export function FilterAvailabilityTable({
  counts,
}: FilterAvailabilityTableProps) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const currentFilter = searchParams.get('filter') ?? 'all'

  function handleFilterChange(filter: string) {
    const params = new URLSearchParams(searchParams)
    if (filter === 'all') {
      params.delete('filter')
    } else {
      params.set('filter', filter)
    }
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <Tabs defaultValue={currentFilter} onValueChange={handleFilterChange}>
      <TabsList className="text-foreground h-auto gap-2 rounded-none bg-transparent px-0 py-1">
        {filters.map(({ value, label, countKey }) => (
          <TabsTrigger key={value} value={value}>
            {label}
            <Badge
              variant="outline"
              className="bg-secondary text-muted-foreground rounded-full px-1.5 py-px"
            >
              {counts[countKey]}
            </Badge>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
