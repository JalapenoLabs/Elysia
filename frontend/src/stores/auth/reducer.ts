// Copyright © 2024 Algorivm

// Core
import { createSlice } from '@reduxjs/toolkit'

// Typescript
import type { PayloadAction } from '@reduxjs/toolkit'
import type { AccessToken, CommercialUser, Institution } from '@/types'

export type AuthState = {
  user: CommercialUser | null
  accessToken: AccessToken | null
  institution: Institution | null
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  institution: null
} as const

export const slice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<CommercialUser | null>) => {
      state.user = action.payload
    },
    setAccessToken: (state, action: PayloadAction<AccessToken | null>) => {
      state.accessToken = action.payload
    },
    setInstitution: (state, action: PayloadAction<Institution | null>) => {
      state.institution = action.payload
    },
    logout: () => {
      console.log('Logging out...')
      return { ...initialState }
    }
  }
})

export const {
  setUser,
  setAccessToken,
  setInstitution,
  logout
} = slice.actions
