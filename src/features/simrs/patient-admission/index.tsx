/**
 * Patient Admission Module (Rawat Inap)
 * Main entry point for the comprehensive inpatient admission feature
 */

import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { AdmissionForm } from './components/admission-form'

/**
 * PatientAdmission - Main page component for inpatient admission
 * 
 * Features:
 * - Comprehensive inpatient admission form
 * - Multi-section data collection (Identity, Visit, Room Placement, Payment, Guarantor, Referral)
 * - Form validation with Zod
 * - Progress tracking
 * - Draft functionality
 * 
 * Requirements: 1.1-1.7
 * Module: Rawat Inap (Inpatient Care)
 */
export function PatientAdmission() {
  return (
    <>
      <Header>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-6'>
          <h1 className='text-3xl font-bold tracking-tight'>
            Pendaftaran Pasien Rawat Inap
          </h1>
          <p className='text-muted-foreground mt-2'>
            Formulir pendaftaran pasien baru untuk rawat inap dengan data lengkap
          </p>
        </div>

        <AdmissionForm />
      </Main>
    </>
  )
}

export default PatientAdmission
