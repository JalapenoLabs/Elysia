// Copyright © 2025 Elysia

// Core
import { useState, useEffect } from 'react'

// Typescript
import type { ReactNode } from 'react'

type RepeaterProps = {
  calc: (() => string | number)
  format?: (value: string) => string | ReactNode
  time?: number
}

export function Repeater({ calc, format, time = 1_000 }: RepeaterProps) {
  const [ children, setValue ] = useState<string | number>(calc)

  useEffect(() => {
    console.log('Repeater mounted')
    const interval = setInterval(() => {
      setValue(calc())
    }, time)

    return () => {
      clearInterval(interval)
    }
  }, [ time, calc ])

  return format?.(String(children)) || children
}
