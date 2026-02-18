/**
 * Overview Tab Component
 * Main dashboard view with key statistics and charts
 */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useDashboardStats } from '@/features/simrs/hooks/use-dashboard-stats'
import { usePatientStore } from '@/features/simrs/hooks/use-patient-store'
import { useRoomStore } from '@/features/simrs/hooks/use-room-store'
import { RecentPatients } from './recent-patients'
import { PatientOverviewChart } from './patient-overview-chart'

export function OverviewTab() {
  const stats = useDashboardStats(5)
  const isLoadingPatients = usePatientStore((state) => state.isLoading)
  const isLoadingRooms = useRoomStore((state) => state.isLoading)
  const isLoading = isLoadingPatients || isLoadingRooms

  if (isLoading) {
    return <OverviewTabSkeleton />
  }

  return (
    <div className='space-y-4'>
      {/* Statistics Cards */}
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Pasien</CardTitle>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              className='h-4 w-4 text-muted-foreground'
            >
              <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
              <circle cx='9' cy='7' r='4' />
              <path d='M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' />
            </svg>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.totalPatients}</div>
            <p className='text-xs text-muted-foreground'>
              Semua pasien terdaftar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Kamar</CardTitle>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              className='h-4 w-4 text-muted-foreground'
            >
              <rect width='18' height='18' x='3' y='3' rx='2' />
              <path d='M3 9h18' />
              <path d='M9 21V9' />
            </svg>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.totalRooms}</div>
            <p className='text-xs text-muted-foreground'>
              Kamar tersedia di RS
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Kamar Terisi</CardTitle>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              className='h-4 w-4 text-muted-foreground'
            >
              <path d='M2 9v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9' />
              <path d='M2 9h20' />
              <path d='M12 3v6' />
            </svg>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.occupiedRooms}</div>
            <p className='text-xs text-muted-foreground'>
              Kamar sedang digunakan
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              BOR
            </CardTitle>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              className='h-4 w-4 text-muted-foreground'
            >
              <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
            </svg>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.occupancyRate}%</div>
            <p className='text-xs text-muted-foreground'>
              Bed Occupancy Rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content - Overview Chart and Recent Patients */}
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
        <Card className='col-span-1 lg:col-span-4'>
          <CardHeader>
            <CardTitle>Ringkasan Pasien Masuk</CardTitle>
            <CardDescription>
              Grafik pasien masuk per bulan berdasarkan data aktual
            </CardDescription>
          </CardHeader>
          <CardContent className='ps-2'>
            <PatientOverviewChart />
          </CardContent>
        </Card>

        <Card className='col-span-1 lg:col-span-3'>
          <CardHeader>
            <CardTitle>Pasien Terdaftar Terakhir</CardTitle>
            <CardDescription>
              {stats.recentPatients.length > 0
                ? `${stats.recentPatients.length} pasien terbaru`
                : 'Belum ada pasien'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RecentPatients patients={stats.recentPatients} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


function OverviewTabSkeleton() {
  return (
    <div className='space-y-4'>
      {/* Statistics Cards Skeleton */}
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-4 w-4 rounded' />
            </CardHeader>
            <CardContent>
              <Skeleton className='h-8 w-16 mb-2' />
              <Skeleton className='h-3 w-32' />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Skeleton */}
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
        <Card className='col-span-1 lg:col-span-4'>
          <CardHeader>
            <Skeleton className='h-6 w-48 mb-2' />
            <Skeleton className='h-4 w-64' />
          </CardHeader>
          <CardContent className='ps-2'>
            <Skeleton className='h-[300px] w-full' />
          </CardContent>
        </Card>

        <Card className='col-span-1 lg:col-span-3'>
          <CardHeader>
            <Skeleton className='h-6 w-48 mb-2' />
            <Skeleton className='h-4 w-32' />
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className='flex items-center gap-4'>
                  <Skeleton className='h-10 w-10 rounded-full' />
                  <div className='flex-1 space-y-2'>
                    <Skeleton className='h-4 w-32' />
                    <Skeleton className='h-3 w-24' />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
