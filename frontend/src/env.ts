// Copyright © 2024 Elysia

export const NODE_ENV: string = import.meta.env.NODE_ENV || 'development'
export const IS_DEV = NODE_ENV === 'development'
export const IS_PROD = NODE_ENV === 'production'

export const API_ROOT: string = import.meta.env.VITE_API_ROOT
  || `${window.location.protocol}//${window.location.hostname}`

console.debug('Running in', NODE_ENV)
