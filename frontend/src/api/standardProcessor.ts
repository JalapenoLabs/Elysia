// Copyright © 2025 Elysia


// Typescript
import type { ResponsePromise } from 'ky'
import type { ApiAbstracted } from '@/types'

// Misc
import { ERROR_CODES_I18N_PREFIX } from '@/constants'

export async function standardProcessor<Response = Record<string, any>>(
  ky: ResponsePromise<Response>
): Promise<ApiAbstracted<Response>> {
  const response = await ky
    .catch((error) => ({
      ok: false,
      status: -1,
      statusText: error.message,
      json: () => ({ catch: () => ({}) })
    }))

  const json: Record<string, any> = await response
    .json()
    .catch(console.error)
    || {}

  // If it was a successful request
  if (response.status === 200 || response.status === 201) {
    return {
      success: true,
      data: json as Response,
      validationErrors: {},
      errors: []
    }
  }

  const errors = []
  const validationErrors = {}

  if (json) {
    if (json?.code) {
      // i18n error
      errors.push(ERROR_CODES_I18N_PREFIX + json.code)
    }
    else if (json?.error) {
      // Non i18n error
      errors.push(json.error)
    }
  }

  // Fallback
  if (!errors.length) {
    switch (response.statusText) {
    case 'Failed to fetch':
      errors.push('errors.network-error')
      break
    default:
      errors.push('unknown')
    }
  }

  return {
    success: false,
    data: null,
    validationErrors,
    errors
  }
}
