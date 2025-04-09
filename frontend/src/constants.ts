// Copyright © 2024 Elysia

// Urls
export const UrlTree = {
  root: '/',

  // Homepage:
  home: '/home',
  pricing: '/pricing',
  about: '/about',
  contact: '/contact',

  // Auth:
  login: '/login',
  signup: '/signup',
  logout: '/logout',
  forgotPassword: '/forgot-password',
  resetPassword: '/reset-password',

  // Dashboard:
  dashboard: '/dashboard',
  profile: '/dashboard/profile',

  // Legal
  terms: '/terms-of-service',
  privacy: '/privacy-policy'
} as const

type UrlValue = typeof UrlTree[keyof typeof UrlTree]
export const UNAUTHORIZED_REDIRECT_TO: UrlValue = '/login' as const
export const UNKNOWN_ROUTE_REDIRECT_TO: UrlValue = '/dashboard' as const

// Storage keys
export const PROFILE_STORAGE_KEY = 'profile' as const
export const AUTH_TOKEN_KEY = 'authToken' as const
export const REDUX_CORE_SLICE_PERSIST_KEY = 'core' as const

// Language
export const SUPPORTED_LANGUAGES = [
  'en-US', // United States
  'en-GB' // United Kingdom
] as const

export type SupportedLanguages = typeof SUPPORTED_LANGUAGES[number]
export const DEFAULT_LANGUAGE: SupportedLanguages = 'en-US' as const

// Auth
export const MIN_ZXCVBN_STRENGTH: number = 3 as const

// API
export const API_RENEW_ACCESS_TOKEN_OFFSET_MS = 60_000 as const
export const ERROR_CODES_I18N_PREFIX = 'errors.backend.' as const
