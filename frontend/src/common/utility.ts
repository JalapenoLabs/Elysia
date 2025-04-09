// Copyright © 2025 Elysia


export function parseJSONSafe<Type>(jsonStr: string): Type {
  try {
    return JSON.parse(jsonStr) as Type
  }
  catch (error: unknown) {
    if (error instanceof Error) {
      console.debug('JSONParseSafe error:', error.message)
    }
    return null
  }
}

export const localStorageJson = {
  ...localStorage,
  setItem: function setJsonItem(key: string, value: Record<string, any> | any[]): void {
    localStorage.setItem(key, JSON.stringify(value))
  },
  getItem: function getItemJson<Type>(key: string): Type | null {
    const jsonStr = localStorage.getItem(key)
    return parseJSONSafe<Type>(jsonStr)
  },
  removeItem(key: string): void {
    localStorage.removeItem(key)
  }
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}
