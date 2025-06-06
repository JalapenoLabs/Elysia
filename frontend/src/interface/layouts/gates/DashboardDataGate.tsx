// Copyright © 2025 Elysia

// Core
import { Navigate, Outlet } from 'react-router'

// State
import { getState, useSelector } from '@/framework/redux-store'

// UI
import { Navigator } from '../Navigator'
import { Loader } from '@/interface/widget/Loader'

// API
import { usePullBackendData } from '@/api/apiHooks'
import { getInstitution } from '@/api/routes/institutions/get'
import { getInstruments } from '@/api/routes/example'

// Misc
import { UNAUTHORIZED_REDIRECT_TO } from '@/constants'

export function DashboardDataGate() {
  const user = useSelector((state) => state.auth.user)

  const institution = usePullBackendData(getInstitution)
  const instruments = usePullBackendData(getInstruments, {
    cacheKey: 'instruments'
  })

  if (user?.id === undefined || user?.id === null) {
    console.log('Unauthorized user, redirecting from (DashboardGate) to', UNAUTHORIZED_REDIRECT_TO)
    return <Navigate
      to={UNAUTHORIZED_REDIRECT_TO}
    />
  }

  const isReady
    = !institution.isLoading
    && !instruments.isLoading

  if (!isReady) {
    return <Loader
      fullscreen
    />
  }

  console.log('DashboardDataGate: All data loaded, rendering Outlet', getState())

  return <Navigator>
    <Outlet />
  </Navigator>
}
