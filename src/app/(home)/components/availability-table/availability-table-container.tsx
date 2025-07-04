'use client'

import { useRef, useState } from 'react'
import type { ReactNode, MouseEvent } from 'react'
import { cn } from '@/lib/utils'

interface AvailabilityTableContainerProps {
  children: ReactNode
  className?: string
}

export function AvailabilityTableContainer({
  children,
  className,
}: AvailabilityTableContainerProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [drag, setDrag] = useState<{ startX: number; scrollX: number } | null>(
    null,
  )

  function onMouseDown(e: MouseEvent) {
    if (!ref.current) return

    const target = e.target as HTMLElement
    const isInsidePopover = target.closest(
      '[data-radix-popper-content-wrapper]',
    )

    if (isInsidePopover) return

    setDrag({ startX: e.pageX, scrollX: ref.current.scrollLeft })
  }

  function onMouseMove(e: MouseEvent) {
    if (!ref.current || !drag) return
    e.preventDefault()
    ref.current.scrollLeft = drag.scrollX - (e.pageX - drag.startX)
  }

  function endDrag() {
    setDrag(null)
  }

  return (
    <div
      ref={ref}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
      className={cn(
        'bg-background relative w-full overflow-hidden rounded-xl border',
        drag ? 'cursor-grabbing' : 'cursor-grab',
        className,
      )}
    >
      {children}
    </div>
  )
}
