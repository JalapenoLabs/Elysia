// Copyright © 2024 Elysia

// Core
import ky from 'ky'

// State
import { getState } from '@/framework/redux-store'

// Lib
import { userProfile } from '@/framework/profile'

// Misc
import { API_ROOT } from '@/env'

// Based on the Ky package
// https://www.npmjs.com/package/ky

export const api = ky.create({
  prefixUrl: `${API_ROOT}/api`,
  throwHttpErrors: false,
  hooks: {
    beforeRequest: [
      function applyHeaders(options) {
        const snapshot = getState()

        // Language
        options.headers.set(
          'Content-Language',
          userProfile.get().language
        )

        // Authorization
        const accessToken = snapshot.auth.accessToken?.access_token
        if (accessToken && !options.headers.has('Authorization')) {
          options.headers.set(
            'Authorization',
            `Bearer ${accessToken}`
          )
        }
        return options
      }
    ],
    afterResponse: [
      async function handleResponse(_request, _options, response) {
        switch (response.status) {
        // BAD RESPONSES:
        // LET THE SUB ROUTINE HANDLE THESE
        case 400: // Bad Request
        case 401: // Unauthorized
        case 403: // Permission error, user is not authorized to access the route
        case 404: // Not Found (We really shouldn't be using 404 for anything other than "bad route name")
        case 402: // Payment required
        case 500: // Internal Server Error
          return response
          // GOOD RESPONSES:
        case 200: // OK
        case 201: // Created
        case 301: // Moved Permanently
        case 302: // Moved Temporarily
        case 307: // Temporary Redirect
        case 308: // Permanent Redirect
          return response
        default:
          console.warn('Unexpected response status:', response.status)
          return response
        }
      }
    ]
  },
  retry: {
    limit: 2,
    methods: [ 'get', 'post', 'put', 'delete' ],
    statusCodes: [
      402, // Unauthorized
      413, // Payload Too Large
      429, // Too Many Requests
      500, // Internal Server Error
      502, // Bad Gateway
      503, // Service Unavailable
      504 // Gateway Timeout
    ],
    backoffLimit: 500
  }
})
