// Copyright © 2025 Algorivm

// Core
import { useState, useEffect } from 'react'

export function useSystemTheme() {
  // Initialize state with the current system theme
  const [ theme, setTheme ] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
    }
    // Default to 'light' if matchMedia is not supported
    return 'light'
  })

  useEffect(() => {
    if (!window.matchMedia) {
      return () => {}
    }

    // Create a MediaQueryList object
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    // Define a handler for theme changes
    const handleChange = (event: MediaQueryListEvent) => {
      setTheme(event.matches ? 'dark' : 'light')
    }

    // Add the event listener for changes
    mediaQuery.addEventListener('change', handleChange)

    // Cleanup the event listener on unmount
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return {
    theme,
    oppositeTheme: theme === 'dark' ? 'light' : 'dark'
  }
}
