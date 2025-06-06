// Copyright © 2025 Elysia

// Core
import { useEffect } from 'react'
import { Outlet } from 'react-router'

// Redux
// import { dispatch } from '@/framework/redux-store'

export function ResetReduxGate() {
  useEffect(() => {
    // Reset the redux state
    // dispatch(
    // )
  }, [])

  return <Outlet />
}
