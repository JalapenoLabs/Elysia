// Copyright © 2024 Algorivm

// Core
import { configureStore, Action } from '@reduxjs/toolkit'
import {
  useDispatch as useDefaultDispatch,
  useSelector as useDefaultSelector
} from 'react-redux'

// Typescript
import type { ThunkAction } from '@reduxjs/toolkit'
import type { TypedUseSelectorHook } from 'react-redux'

// Redux-Persist
// https://www.npmjs.com/package/redux-persist
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

// Reducers
import { slice as authSlice } from '../stores/auth/reducer'
import { slice as coreSlice } from '../stores/core/reducer'
import { slice as dataSlice } from '../stores/data/reducer'

// Constants & Env
import { REDUX_CORE_SLICE_PERSIST_KEY } from '../constants'
import { NODE_ENV } from '../env'

// /////////////////////// //
//          Store          //
// /////////////////////// //

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    data: dataSlice.reducer,
    core: persistReducer(
      { storage, key: REDUX_CORE_SLICE_PERSIST_KEY },
      coreSlice.reducer
    ) as unknown as (typeof coreSlice.reducer)
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
      serializableCheck: false
    }),
  devTools: NODE_ENV === 'development'
})

// Create a persistor from the store, which will be used by the <PersistGate> in your app to rehydrate the store.
export const persistor = persistStore(store)

// /////////////////////// //
//    Common functions     //
// /////////////////////// //

export const dispatch = store.dispatch
export const getState = store.getState

export const useDispatch: () => AppDispatch = useDefaultDispatch
export const useSelector: TypedUseSelectorHook<RootState> = useDefaultSelector

// /////////////////////// //
//    Typescript Types     //
// /////////////////////// //

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type Thunk = ThunkAction<void, RootState, unknown, Action>
