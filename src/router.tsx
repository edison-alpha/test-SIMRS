/**
 * SIMRS Application Router Configuration
 * React Router setup with all routes
 */

import { createBrowserRouter, Outlet } from 'react-router-dom'

// Components
import { NavigationProgress } from '@/components/navigation-progress'
import { Toaster } from '@/components/ui/sonner'

// Layouts
import { AuthenticatedLayout } from './layouts/authenticated-layout'

// Error Pages
import { GeneralError } from '@/features/errors/general-error'
import { NotFoundError } from '@/features/errors/not-found-error'
import { Error401 } from '@/pages/errors/401'
import { Error403 } from '@/pages/errors/403'
import { Error404 } from '@/pages/errors/404'
import { Error500 } from '@/pages/errors/500'
import { Error503 } from '@/pages/errors/503'

// Pages
import { HomePage } from '@/pages'
import { SimrsDashboard } from '@/features/simrs/dashboard'
import { PatientRegistration } from '@/features/simrs/patient-registration'
import { PatientAdmission } from '@/features/simrs/patient-admission'
import { RoomManagement } from '@/features/simrs/room-management'
import { ErrorPage } from '@/pages/errors/error-page'

// Root layout component dengan NavigationProgress
function RootLayout() {
  return (
    <>
      <NavigationProgress />
      <Outlet />
      <Toaster duration={5000} />
    </>
  )
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <GeneralError />,
    children: [
      // Error routes (public)
      { path: '401', element: <Error401 /> },
      { path: '403', element: <Error403 /> },
      { path: '404', element: <Error404 /> },
      { path: '500', element: <Error500 /> },
      { path: '503', element: <Error503 /> },
      
      // Authenticated routes
      {
        element: <AuthenticatedLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'simrs/dashboard', element: <SimrsDashboard /> },
          { path: 'simrs/daftar-pasien', element: <PatientRegistration /> },
          { path: 'simrs/pendaftaran-pasien-baru', element: <PatientAdmission /> },
          { path: 'simrs/pendaftaran-pasien-baru/:patientId', element: <PatientAdmission /> },
          { path: 'simrs/manajemen-kamar', element: <RoomManagement /> },
          { path: 'errors/:error', element: <ErrorPage /> },
        ],
      },
      
      // 404 catch-all
      { path: '*', element: <NotFoundError /> },
    ],
  },
])
