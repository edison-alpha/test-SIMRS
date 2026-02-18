/**
 * Patient List Module
 * Displays list of patients currently admitted to inpatient care
 */

import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { PatientTable } from './components/patient-table'

export function PatientList() {
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
            Daftar Pasien Rawat Inap
          </h1>
          <p className='text-muted-foreground mt-2'>
            Daftar pasien yang sedang menjalani perawatan rawat inap
          </p>
        </div>

        <PatientTable />
      </Main>
    </>
  )
}

export default PatientList
