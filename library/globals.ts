// Copyright © 2025 Jalapeno Labs

import * as fs from 'fs'
import * as path from 'path'

// @ts-ignore
globalThis.fs = fs
// @ts-ignore
globalThis.path = path

JSON.parseSafe = function safeParseJson<Type = Record<string, any>>(jsonString: string): Type | null {
  try {
    return JSON.parse(jsonString) as Type
  }
  catch (error) {
    console.error('Failed to parse JSON:', error)
    return null
  }
}

JSON.stringifySafe = function safeStringifyJson<Type = Record<string, any>>(
  obj: Type,
  replacer?: (this: any, key: string, value: any) => any,
  space?: string | number
): string {
  try {
    return JSON.stringify(obj, replacer, space)
  }
  catch (error) {
    console.error('Failed to stringify JSON:', error)
    return undefined
  }
}
