// Copyright © 2024 Elysia

// Core
import { createSlice } from '@reduxjs/toolkit'

// Typescript
import type { PayloadAction } from '@reduxjs/toolkit'

// Constants
import { DEFAULT_LANGUAGE } from '@/constants'

export type CoreState = {
  language: string
}

export const slice = createSlice({
  name: 'data',
  initialState: {
    language: DEFAULT_LANGUAGE
  } as CoreState,
  reducers: {
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload
    }
  }
})

export const {
  setLanguage
} = slice.actions
