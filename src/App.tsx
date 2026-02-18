/**
 * SIMRS Application Root Component
 * Main routing configuration with React Router
 */

import { Outlet } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import { NavigationProgress } from '@/components/navigation-progress'

export function App() {
  return (
    <>
      <NavigationProgress />
      <Outlet />
      <Toaster duration={5000} />
    </>
  )
}
