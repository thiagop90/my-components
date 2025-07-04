import { FilterAvailabilityTable } from './components/filter-availability-table'
import { AvailabilityTable } from './components/availability-table'
import { listAvailability } from '@/actions/availability-actions'
import { getAvailableSlots } from '@/actions/slot-actions'
import { redirect } from 'next/navigation'

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
    params.set('slot', '08:00')
    if (filter) params.set('filter', filter)
    redirect(`/?${params.toString()}`)
  }

  const [{ counts, data }, availableSlots] = await Promise.all([
    listAvailability(slotName, filter),
    getAvailableSlots(),
  ])

  return (
    <main className="mx-auto min-h-dvh max-w-5xl space-y-6 overflow-hidden border-x px-4 py-10 sm:px-8">
      <div className="flex flex-col-reverse gap-4 border-b sm:flex-row sm:items-start">
        <FilterAvailabilityTable counts={counts} />

        <ManageAvailabilityTable slots={availableSlots} />
      </div>

      <div className="bg-secondary rounded-[20px] border p-1.5">
        <AvailabilityTable data={data} availableSlots={availableSlots} />
      </div>
    </main>
  )
}
