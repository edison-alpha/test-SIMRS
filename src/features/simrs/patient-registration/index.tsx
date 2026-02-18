import { useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { PatientDialogs, DeleteConfirmDialog } from './components/patient-dialogs'
import { PatientDetailModal } from './components/patient-detail-modal'
import { PatientPrimaryButtons } from './components/patient-primary-buttons'
import { PatientRegistrationProvider } from './components/patient-registration-provider'
import { PatientTable } from './components/patient-table'
import { usePatientStore } from '@/features/simrs/hooks/use-patient-store'

/**
 * Patient Registration Module
 * Main component for managing patient registration with CRUD operations
 * Implements requirements 3.1, 3.2, 3.4, 3.6
 * 
 * Data Loading Strategy:
 * - Data loading is triggered only once in this parent component
 * - isLoading state is passed down to PatientTable for skeleton display
 * - Child components do not trigger data loading to avoid duplication
 */
export function PatientRegistration() {
  const { loadMockData, isLoaded, isLoading } = usePatientStore()

  // Load data on mount - only once at parent level
  useEffect(() => {
    if (!isLoaded && !isLoading) {
      loadMockData()
    }
  }, [isLoaded, isLoading, loadMockData])

  return (
    <PatientRegistrationProvider>
      <Header>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='flex flex-wrap items-end justify-between gap-2 mb-6'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              Daftar Pasien Rawat Inap
            </h2>
            <p className='text-muted-foreground'>
              Kelola data pasien rawat inap di sini.
            </p>
          </div>
          <PatientPrimaryButtons />
        </div>
        <PatientTable isLoading={isLoading} />
      </Main>

      <PatientDialogs />
      <DeleteConfirmDialog />
      <PatientDetailModal />
    </PatientRegistrationProvider>
  )
}
