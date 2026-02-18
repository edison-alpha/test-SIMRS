import { useEffect } from 'react'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { RoomDialogs, DeleteRoomConfirmDialog } from './components/room-dialogs'
import { RoomPrimaryButtons } from './components/room-primary-buttons'
import { RoomManagementProvider } from './components/room-management-provider'
import { RoomTable } from './components/room-table'
import { useRoomStore } from '@/features/simrs/hooks/use-room-store'

/**
 * Room Management Module
 * Main component for managing hospital rooms with CRUD operations
 * Implements requirements 6.1, 7.1, 8.1, 9.1
 * 
 * Data Loading Strategy:
 * - Data loading is triggered only once in this parent component
 * - isLoading state is passed down to RoomTable for skeleton display
 * - Child components do not trigger data loading to avoid duplication
 */
export function RoomManagement() {
  const { loadMockData, isLoaded, isLoading } = useRoomStore()

  // Load data on mount - only once at parent level
  useEffect(() => {
    if (!isLoaded && !isLoading) {
      loadMockData()
    }
  }, [isLoaded, isLoading, loadMockData])

  return (
    <RoomManagementProvider>
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
              Manajemen Kamar
            </h2>
            <p className='text-muted-foreground'>
              Kelola data kamar dan ketersediaan di sini.
            </p>
          </div>
          <RoomPrimaryButtons />
        </div>
        <RoomTable isLoading={isLoading} />
      </Main>

      <RoomDialogs />
      <DeleteRoomConfirmDialog />
    </RoomManagementProvider>
  )
}
