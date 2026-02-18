import { useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { QuickActions } from './components/quick-actions'
import { OverviewTab } from './components/overview-tab'
import { AnalyticsTab } from './components/analytics-tab'
import { usePatientStore } from '@/features/simrs/hooks/use-patient-store'
import { useRoomStore } from '@/features/simrs/hooks/use-room-store'

export function SimrsDashboard() {
  const { loadMockData: loadPatients, isLoaded: patientsLoaded } = usePatientStore()
  const { loadMockData: loadRooms, isLoaded: roomsLoaded } = useRoomStore()

  useEffect(() => {
    if (!patientsLoaded) {
      loadPatients()
    }
    if (!roomsLoaded) {
      loadRooms()
    }
  }, [loadPatients, loadRooms, patientsLoaded, roomsLoaded])

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <h1 className='text-2xl font-bold tracking-tight'>
            Dashboard SIMRS
          </h1>
          <div className='flex items-center space-x-2'>
            <QuickActions />
          </div>
        </div>

        <Tabs
          orientation='vertical'
          defaultValue='overview'
          className='space-y-4'
        >
          <div className='w-full overflow-x-auto pb-2'>
            <TabsList>
              <TabsTrigger value='overview'>Ringkasan</TabsTrigger>
              <TabsTrigger value='analytics'>Analitik</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value='overview' className='space-y-4'>
            <OverviewTab />
          </TabsContent>

          <TabsContent value='analytics' className='space-y-4'>
            <AnalyticsTab />
          </TabsContent>
        </Tabs>
      </Main>
    </>
  )
}
