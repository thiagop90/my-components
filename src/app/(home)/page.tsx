import { FilterAvailabilityTable } from './components/filter-availability-table'
import { AvailabilityTable } from './components/availability-table'
import { listAvailability } from '@/actions/availability-actions'
import { getAvailableSlots } from '@/actions/slot-actions'
import { redirect } from 'next/navigation'
import { slots } from '@/lib/database'

import { ManageAvailabilityTable } from './components/manage-availability-table'

export default async function Home(props: {
  searchParams?: Promise<{
    slot?: string
    filter?: string
  }>
}) {
  const searchParams = await props.searchParams
  const slotName = searchParams?.slot
  const filter = searchParams?.filter

  if (!slotName) {
    const params = new URLSearchParams()
    params.set('slot', slots[1].name)
    if (filter) params.set('filter', filter)
    redirect(`/?${params.toString()}`)
  }

  const [{ counts, data }, availableSlots] = await Promise.all([
    listAvailability(slotName, filter),
    getAvailableSlots(),
  ])

  return (
    <main className="mx-auto min-h-dvh max-w-5xl space-y-6 overflow-hidden border-x px-4 py-10 sm:px-8">
      <div className="flex items-start justify-between border-b">
        <FilterAvailabilityTable counts={counts} />

        <ManageAvailabilityTable slots={availableSlots} />
      </div>

      <div className="bg-secondary rounded-[20px] border border-neutral-200/70 p-1.5">
        <AvailabilityTable data={data} availableSlots={availableSlots} />
      </div>
    </main>
  )
}
