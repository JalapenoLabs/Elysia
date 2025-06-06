// Copyright © 2025 Elysia

// Core
import { localStorageJson } from '@/common/utility'

// Typescript
import type { AccessToken } from '@/types'

// Redux
import { dispatch } from '@/framework/redux-store'
import { setAccessToken, setUser } from '@/stores/auth/reducer'

// API
import { renewToken } from '@/api/routes/token/renew'
import { verifyToken } from '@/api/routes/token/verify'

// Misc
import { accessTokenValidator } from './validators'
import { AUTH_TOKEN_KEY } from '@/constants'

export function persistAuthToken(accessToken: AccessToken): AccessToken {
  const expiresInMs = accessToken.expires_in * 1_000
  accessToken.expires_at = new Date(
    Date.now() + expiresInMs
  ).toISOString()

  // Persist the auth token
  console.debug('Setting access token:', accessToken)
  localStorageJson.setItem(
    AUTH_TOKEN_KEY,
    accessToken
  )

  return accessToken
}

export function removeAuthToken(): void {
  // Remove the auth token
  console.debug('Removing access token')
  localStorage.removeItem(AUTH_TOKEN_KEY)
}

// This is used to determine if the auth token is still valid or if it's been saved incorrectly or expired
export function validateAuthToken(accessToken: AccessToken): boolean {
  try {
    if (!accessToken) {
      return false
    }
    accessTokenValidator.validateSync(accessToken)
    return true
  }
  catch (error: unknown) {
    console.error('Error validating access token:', error)
    return false
  }
}

export async function restoreUserSession(): Promise<boolean> {
  const accessToken = localStorageJson.getItem<AccessToken>(AUTH_TOKEN_KEY)
  if (!accessToken?.access_token) {
    console.log('No access token found in local storage')
    return false
  }

  if (!validateAuthToken(accessToken)) {
    console.log('Invalid access token found in local storage')
    localStorage.removeItem(AUTH_TOKEN_KEY)
    return false
  }

  // Check if the saved auth token has expired
  const expiresAt = new Date(accessToken.expires_at)
  const now = Date.now()

  if (now > expiresAt.valueOf()) {
    console.log('Access token expired... Cannot restore')
    localStorage.removeItem(AUTH_TOKEN_KEY)
    return false
  }

  console.debug('Restoring access token from local storage')

  // We must set the access token BEFORE making HTTP requests
  dispatch(
    setAccessToken(accessToken)
  )

  const getUser = await verifyToken()
  if (!getUser.success) {
    // If the token is invalid, remove it from local storage
    dispatch(
      setAccessToken(null)
    )
    localStorage.removeItem(AUTH_TOKEN_KEY)

    return false
  }

  // If it's successful, set the user in the redux store
  dispatch(
    setUser(
      getUser.data
    )
  )
  dispatch(
    setAccessToken(
      accessToken
    )
  )

  // We don't care if this is successful or not in this scope
  renewToken().catch(console.error)

  return true
}
