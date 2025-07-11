import { Checkbox } from '@/components/ui/checkbox'
import dayjs from 'dayjs'
import 'dayjs/locale/pt-br'
import { useState } from 'react'

dayjs.locale('pt-br')

export function WeekdayExcluder() {
  const [excludedDays, setExcludedDays] = useState<number[]>([])

  const weekDays = []
  for (let i = 0; i < 7; i++) {
    const day = dayjs().day(i)
    weekDays.push({
      value: i,
      label: day.format('ddd'),
    })
  }

  function handleDayToggle(dayValue: number) {
    setExcludedDays((prev) => {
      if (prev.includes(dayValue)) {
        return prev.filter((day) => day !== dayValue)
      } else {
        return [...prev, dayValue]
      }
    })
  }

  return (
    <div className="flex justify-between">
      {weekDays.map((item) => {
        const isChecked = excludedDays.includes(item.value)

        return (
          <label
            key={item.value}
            className={`border-input relative flex size-8 cursor-pointer items-center justify-center gap-3 rounded-md border text-center transition-colors outline-none ${
              isChecked
                ? 'border-primary bg-primary text-primary-foreground'
                : 'hover:bg-accent hover:text-accent-foreground'
            } has-focus-visible:border-ring has-focus-visible:ring-ring/50 has-focus-visible:ring-[3px]`}
          >
            <Checkbox
              name="excludedWeekdays"
              value={item.value}
              checked={isChecked}
              onCheckedChange={() => handleDayToggle(item.value)}
              className="sr-only after:absolute after:inset-0"
            />
            <span className="text-xs font-medium">
              {item.label[0].toUpperCase()}
            </span>
          </label>
        )
      })}
    </div>
  )
}
