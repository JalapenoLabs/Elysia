// Copyright © 2025 Elysia

// Core
import { lazy, Suspense } from 'react'

// Typescript
import type { PasswordStrengthBarProps } from 'react-password-strength-bar'

// UI
import { Loader } from './Loader'

// This file is a lazy loading wrapper around the PasswordStrengthBar component.
// Lazy because it loads zxcvbn strength library under the hood, which is really large!
// https://www.npmjs.com/package/react-password-strength-bar

type Props = PasswordStrengthBarProps

const PasswordStrengthBar = lazy(() => import('react-password-strength-bar'))

export function PasswordStrength(props: Props) {
  return <Suspense fallback={<Loader />}>
    <PasswordStrengthBar { ...props } />
  </Suspense>
}
