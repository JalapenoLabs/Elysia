// Copyright © 2025 Elysia


// Core
import { api } from '@/api'
import { standardProcessor } from '@/api/standardProcessor'

// Redux
// import { dispatch } from '@/framework/redux-store'
// import { setResults } from '@/stores/data/reducer'

type ValidResponse = string[]

export async function getExample() {
  const results = await standardProcessor<ValidResponse>(
    api.get<ValidResponse>('thing')
  )

  // if (results.success) {
  //   dispatch(
  //     setResults(results.data)
  //   )
  // }

  return results
}
