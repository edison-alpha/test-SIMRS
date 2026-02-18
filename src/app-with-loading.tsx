/**
 * SIMRS App Container with Loading Screen
 * Handles initial loading state before showing the main application
 */

import { useState, useEffect } from 'react'
import { AxiosError } from 'axios'
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { toast } from 'sonner'

// Context Providers
import { ThemeProvider } from './context/theme-provider'
import { DirectionProvider } from './context/direction-provider'
import { FontProvider } from './context/font-provider'

// Components
import { LoadingScreen } from './components/loading-screen'

// Utilities
import { handleServerError } from '@/lib/handle-server-error'

// Router
import { router } from './router'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // eslint-disable-next-line no-console
        if (import.meta.env.DEV) console.log({ failureCount, error })

        if (failureCount >= 0 && import.meta.env.DEV) return false
        if (failureCount > 3 && import.meta.env.PROD) return false

        return !(
          error instanceof AxiosError &&
          [401, 403].includes(error.response?.status ?? 0)
        )
      },
      refetchOnWindowFocus: import.meta.env.PROD,
      staleTime: 10 * 1000, // 10s
    },
    mutations: {
      onError: (error) => {
        handleServerError(error)

        if (error instanceof AxiosError) {
          if (error.response?.status === 304) {
            toast.error('Content not modified!')
          }
        }
      },
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 500) {
          toast.error('Internal Server Error!')
        }
      }
    },
  }),
})

// Check if already loaded in this session
const checkAlreadyLoaded = () => {
  if (typeof window === 'undefined') return false
  return sessionStorage.getItem('simrs_initial_loaded') === 'true'
}

export function AppWithLoading() {
  const [isLoading, setIsLoading] = useState(() => !checkAlreadyLoaded())
  const [showContent, setShowContent] = useState(() => checkAlreadyLoaded())

  useEffect(() => {
    // Hide the HTML initial loader immediately when React mounts
    if (typeof window !== 'undefined' && window.hideInitialLoader) {
      window.hideInitialLoader()
    }

    // Skip if already loaded
    if (checkAlreadyLoaded()) {
      return
    }

    // Minimum loading duration: 5 seconds (simulated slow loading)
    const timer = setTimeout(() => {
      setIsLoading(false)
      sessionStorage.setItem('simrs_initial_loaded', 'true')
      // Small delay before showing content for smooth transition
      requestAnimationFrame(() => {
        setShowContent(true)
      })
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <LoadingScreen 
        isLoading={isLoading} 
        onLoadingComplete={() => {}}
      />
      {showContent && (
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <FontProvider>
              <DirectionProvider>
                <RouterProvider router={router} />
              </DirectionProvider>
            </FontProvider>
          </ThemeProvider>
        </QueryClientProvider>
      )}
    </>
  )
}
