// Copyright © 2025 Navarrotech

import * as fsModule from 'fs'
import * as pathModule from 'path'

declare global {
  const fs: typeof fsModule
  const path: typeof pathModule
  interface JSON {
    parse<Type = Record<string, any>>(text: string): Type
    parseSafe<Type = Record<string, any>>(text: string): Type | undefined
    stringifySafe<Type = Record<string, any>>(
      value: Type,
      replacer?: (this: any, key: string, value: any) => any,
      space?: string | number
    ): string | undefined
  }
}

export {}
