/**
 * Hook to manage initial application loading state
 * Shows loading screen for a minimum duration on first load
 */

import { useState, useEffect, useRef } from 'react'

const MINIMUM_LOADING_DURATION = 5000 // Minimum 5 seconds to show loading screen (simulated slow loading)
const LOADING_KEY = 'simrs_initial_loaded'

export function useInitialLoading() {
  const [isLoading, setIsLoading] = useState(() => {
    // Initialize from sessionStorage synchronously
    const alreadyLoaded = typeof window !== 'undefined' && 
      sessionStorage.getItem(LOADING_KEY) === 'true'
    return !alreadyLoaded
  })
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // If already loaded, don't start timer
    if (!isLoading) return

    // Set minimum loading time
    timerRef.current = setTimeout(() => {
      setIsLoading(false)
      sessionStorage.setItem(LOADING_KEY, 'true')
    }, MINIMUM_LOADING_DURATION)

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [isLoading])

  return {
    isLoading,
    hasLoadedBefore: !isLoading,
  }
}
