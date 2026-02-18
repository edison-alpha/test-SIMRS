/**
 * Home Page - Redirects to Dashboard
 */

import { Navigate } from 'react-router-dom'

export function HomePage() {
  return <Navigate to="/simrs/dashboard" replace />
}
