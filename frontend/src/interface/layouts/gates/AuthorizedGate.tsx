// Copyright © 2025 Elysia

// Core
import { Outlet, Navigate } from 'react-router'

// Redux
import { useSelector } from '@/framework/redux-store'

import { UNAUTHORIZED_REDIRECT_TO } from '@/constants'

export function AuthorizedGate() {
  const user = useSelector((state) => state.auth.user)

  if (!user) {
    console.log('Unauthorized user, redirecting from (AuthorizedGate) to', UNAUTHORIZED_REDIRECT_TO)
    return <Navigate
      to={UNAUTHORIZED_REDIRECT_TO}
    />
  }

  return <Outlet />
}
