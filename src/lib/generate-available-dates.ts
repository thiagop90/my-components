import dayjs from 'dayjs'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'

dayjs.extend(isSameOrBefore)

export function generateAvailableDates(
  startDate: string,
  endDate: string,
  excludedWeekdays: number[],
): string[] {
  const availableDates: string[] = []

  const start = dayjs(startDate)
  const end = dayjs(endDate)

  let current = start

  while (current.isSameOrBefore(end, 'day')) {
    const weekday = current.day()

    if (!excludedWeekdays.includes(weekday)) {
      availableDates.push(current.format('YYYY-MM-DD'))
    }

    current = current.add(1, 'day')
  }

  return availableDates
}
