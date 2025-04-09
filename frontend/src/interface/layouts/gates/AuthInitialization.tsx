// Copyright © 2025 Algorivm

// Core
import { useState, useEffect } from 'react'

// Typescript
import type { ReactNode } from 'react'

// UI
import { Loader } from '@/interface/widget/Loader'

// Misc
import { restoreUserSession } from '@/framework/auth'

type Props = {
  children: ReactNode
}

// This step checks if the user is previously authorized
// And/or if an existing auth token is still valid
export function AuthInitialization({ children }: Props) {
  const [ isReady, setComplete ] = useState<boolean>(false)

  useEffect(() => {
    restoreUserSession().finally(() => setComplete(true))
  }, [])

  if (!isReady) {
    return <Loader
      fullscreen
    />
  }

  return children
}
