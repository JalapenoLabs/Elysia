// Copyright © 2025 Elysia


// Core
import { useState, useEffect } from 'react'

// Typescript
import type { ApiAbstracted } from '@/types'
import type { AnyObjectSchema } from 'yup'

// Utility
import { useValidator } from '@/framework/validators'
import { cloneDeep, isEqual } from 'lodash-es'

const johnnyCache: Record<string, any> = {} // Get it? #MusicPun 🤪

export function usePullBackendData<Shape = Record<string, any>>(
  apiEndpoint: () => Promise<ApiAbstracted<Shape>>,
  options?: {
    wait?: boolean
    defaultState?: Shape
    cacheKey?: string
  }
) {
  // By default, no caching is enabled. If a cache key is provided then the default state
  // will be the cached value but we'll still fetch the new data in the background
  if (options?.cacheKey) {
    options.defaultState = johnnyCache[options?.cacheKey]
    if (options.defaultState) {
      console.debug('Cache key provided, restoring state:', options.defaultState)
    }
  }

  const [ flip, flop ] = useState<boolean>(false)
  const [ data, setData ] = useState<ApiAbstracted<Shape> | null>(
    options?.defaultState
      ? {
        data: options.defaultState,
        success: true,
        errors: [],
        validationErrors: {}
      }
      : null
  )
  const [ isLoading, setLoading ] = useState<boolean>(!options?.defaultState)

  useEffect(() => {
    if (options?.wait) {
      return () => {}
    }
    let isCancelled: boolean = false
    async function main() {
      try {
        setLoading(true)
        const response = await apiEndpoint()
        if (isCancelled) {
          return
        }

        setData(response)

        if (options?.cacheKey) {
          johnnyCache[options.cacheKey] = response.data
          console.debug('Updated api cache:', johnnyCache)
        }
      }
      catch (error) {
        if (isCancelled) {
          return
        }
        console.error(error)
      }
      finally {
        if (!isCancelled) {
          setLoading(false)
        }
      }
    }

    main()

    return () => {
      isCancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ flip, options?.wait ])

  return {
    data,
    isLoading,
    refresh: () => flop(!flip)
  }
}

export function usePushBackendData<Shape = Record<string, any>>(
  apiEndpoint: () => Promise<ApiAbstracted<Shape>>
) {
  const [ isLoading, setLoading ] = useState<boolean>(false)
  const [ response, setResponse ] = useState<ApiAbstracted<Shape> | null>(null)

  async function submit(): Promise<ApiAbstracted | null> {
    if (isLoading) {
      return null
    }

    try {
      setResponse(null)
      setLoading(true)
      const result = await apiEndpoint()
      setLoading(false)
      setResponse(result)
      return result
    }
    catch (error) {
      setLoading(false)
      if (error instanceof Error) {
        return {
          data: {} as Shape,
          success: false,
          errors: [
            error.message
          ],
          validationErrors: {}
        }
      }
      else {
        console.error(error)
      }
    }

    return {
      data: {} as Shape,
      success: false,
      errors: [ 'unknown' ],
      validationErrors: {}
    }
  }

  return {
    submit,
    response,
    isLoading
  }
}

export function useBackendFormProxy<Shape = Record<string, any>>(
  apiEndpoint: (request: Shape) => Promise<ApiAbstracted<Shape>>,
  validator: AnyObjectSchema,
  defaultState: Shape,
  exhaustiveDeps: any[] = []
) {
  const [ proxy, setProxy ] = useState<Shape>(cloneDeep(defaultState))

  // Reset the proxy if the default state changes
  useEffect(() => {
    if (defaultState && !isEqual(proxy, defaultState)) {
      console.debug('Default state has changed, resetting proxy')
      setProxy(cloneDeep(defaultState))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ defaultState, ...exhaustiveDeps ])

  const adjudication = useValidator<Shape>(
    validator,
    proxy
  )

  const form = usePushBackendData(
    () => apiEndpoint(adjudication.sanitized)
  )

  // TODO: Form response errors should be merged with the adjudication errors so it's always one errorset

  return {
    ...form,
    ...adjudication,
    proxy,
    setProxy,
    setField: (field: keyof Shape, value: any) => setProxy({
      ...proxy,
      [field]: value
    }),
    hasChanged: !isEqual(proxy, defaultState),
    reset: () => setProxy(
      cloneDeep(defaultState)
    )
  }
}
