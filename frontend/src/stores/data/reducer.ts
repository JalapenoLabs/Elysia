// Copyright © 2025 Elysia


// Core
import { createSlice } from '@reduxjs/toolkit'

// Typescript
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Song } from '@/types'

export type DataState = {
  userSongs?: Song[]
  instruments: string[]
}

type DataStateKey = keyof DataState

const initialState: DataState = {
  userSongs: [],
  instruments: []
} as const

export const slice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setData: <Key extends DataStateKey>(
      state: DataState,
      action: PayloadAction<{
        key: Key,
        value: DataState[Key]
      }>
    ) => {
      state[action.payload.key] = action.payload.value
    },
    setInstruments: (state: DataState, action: PayloadAction<string[]>) => {
      state.instruments = action.payload
    },
    resetData: () => initialState
  }
})

export const {
  setData,
  setInstruments,
  resetData
} = slice.actions
