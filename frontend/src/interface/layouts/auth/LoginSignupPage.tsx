// Copyright © 2025 Elysia

// Core
import { Navigate } from 'react-router'
import { UrlTree } from '@/constants'

// UI
import { useSelector } from '@/framework/redux-store'
import { AuthenticatePanel } from './AuthenticatePanel'

type LoginProps = {
  login?: boolean
  signup?: never
}

type SignupProps = {
  login?: never
  signup?: boolean
}

type Props = LoginProps | SignupProps

export function LoginSignupPage(props: Props) {
  const userid = useSelector((state) => state.auth.user?.id)
  if (userid) {
    return <Navigate to={UrlTree.dashboard} />
  }

  return <div
    className='hero is-fullheight has-background'
    style={{
      backgroundImage: 'url(/images/dark/Pattern.png)'
    }}
  >
    <div className='hero-body'>
      <div className='container is-max-fullhd'>
        <div className='subcontainer is-mini'>
          <AuthenticatePanel { ...props } />
        </div>
      </div>
    </div>
  </div>
}
