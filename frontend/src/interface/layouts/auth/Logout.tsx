// Copyright © 2025 Algorivm

// Core
import { useEffect, useState } from 'react'
import { Navigate } from 'react-router'

// UI
import { Loader } from '@/interface/widget/Loader'

// Utility & Constants
import { userLogout } from '@/api/routes/users/logout'
import { UNAUTHORIZED_REDIRECT_TO } from '@/constants'

export function Logout() {
  const [ isComplete, finish ] = useState<boolean>(false)

  useEffect(() => {
    userLogout()
      .catch(console.error)
      .finally(() => {
        finish(true)
      })
  }, [])

  if (isComplete) {
    return <Navigate to={UNAUTHORIZED_REDIRECT_TO} />
  }

  return <div className='hero is-fullheight has-background'>
    <div className='hero-body'>
      <div className='container is-max-fullhd'>
        <div className='subcontainer is-mini'>
          <Loader />
          <h1 className='title'>Logging out...</h1>
        </div>
      </div>
    </div>
  </div>
}
