/**
 * Analytics Tab Component
 * Detailed analytics and trends for SIMRS
 */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { DiagnosisList } from './diagnosis-list'
import { BedOccupancyMonitor } from './bed-occupancy-monitor'
import { usePatientStore } from '@/features/simrs/hooks/use-patient-store'
import { useRoomStore } from '@/features/simrs/hooks/use-room-store'

export function AnalyticsTab() {
  const patients = usePatientStore((state) => state.patients)
  const isLoadingPatients = usePatientStore((state) => state.isLoading)
  const isLoadingRooms = useRoomStore((state) => state.isLoading)
  const isLoading = isLoadingPatients || isLoadingRooms
  
  const activePatients = patients.filter((p) => p.status === 'Aktif')
  const dischargedPatients = patients.filter((p) => p.status === 'Keluar')

  // Calculate admission statistics
  const todayAdmissions = patients.filter((p) => {
    const today = new Date()
    const admissionDate = new Date(p.tanggalJamMasuk)
    return (
      admissionDate.getDate() === today.getDate() &&
      admissionDate.getMonth() === today.getMonth() &&
      admissionDate.getFullYear() === today.getFullYear()
    )
  }).length

  // Calculate average length of stay for discharged patients
  const avgLengthOfStay = dischargedPatients.length > 0
    ? Math.round(
        dischargedPatients.reduce((sum, p) => {
          if (p.tanggalKeluar) {
            const admission = new Date(p.tanggalJamMasuk)
            const discharge = new Date(p.tanggalKeluar)
            const days = Math.ceil(
              (discharge.getTime() - admission.getTime()) / (1000 * 60 * 60 * 24)
            )
            return sum + days
          }
          return sum
        }, 0) / dischargedPatients.length
      )
    : 0

  if (isLoading) {
    return <AnalyticsTabSkeleton />
  }

  return (
    <div className='space-y-4'>
      {/* Analytics Summary Cards */}
      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Pasien Aktif
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
              <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
              <circle cx='9' cy='7' r='4' />
              <path d='M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' />
            </svg>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{activePatients.length}</div>
            <p className='text-xs text-muted-foreground'>
              Pasien yang sedang dirawat
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Pasien Keluar
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
              <path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' />
              <polyline points='16 17 21 12 16 7' />
              <line x1='21' x2='9' y1='12' y2='12' />
            </svg>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{dischargedPatients.length}</div>
            <p className='text-xs text-muted-foreground'>
              Total pasien yang sudah pulang
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Masuk Hari Ini
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
              <path d='M3 3v18h18' />
              <path d='M7 15l4-4 4 4 4-6' />
            </svg>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{todayAdmissions}</div>
            <p className='text-xs text-muted-foreground'>
              Pasien masuk hari ini
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Rata-rata LOS
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
              <circle cx='12' cy='12' r='10' />
              <path d='M12 6v6l4 2' />
            </svg>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{avgLengthOfStay} hari</div>
            <p className='text-xs text-muted-foreground'>
              Length of Stay rata-rata
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
        {/* Top 10 Diagnoses - 4 columns */}
        <Card className='col-span-1 lg:col-span-4'>
          <CardHeader>
            <CardTitle>Top 10 Diagnosa Masuk</CardTitle>
            <CardDescription>
              Diagnosa paling sering pada pasien yang masuk
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DiagnosisList maxItems={10} />
          </CardContent>
        </Card>

        {/* Bed Occupancy - 3 columns (compact mode) */}
        <Card className='col-span-1 lg:col-span-3'>
          <CardHeader>
            <CardTitle>Hunian Bed</CardTitle>
            <CardDescription>
              Monitoring hunian bed per kelas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BedOccupancyMonitor compact />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


function AnalyticsTabSkeleton() {
  return (
    <div className='space-y-4'>
      {/* Analytics Summary Cards Skeleton */}
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

      {/* Two Column Layout Skeleton */}
      <div className='grid grid-cols-1 gap-4 lg:grid-cols-7'>
        <Card className='col-span-1 lg:col-span-4'>
          <CardHeader>
            <Skeleton className='h-6 w-48 mb-2' />
            <Skeleton className='h-4 w-64' />
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className='flex items-center justify-between'>
                  <Skeleton className='h-4 w-48' />
                  <Skeleton className='h-4 w-16' />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className='col-span-1 lg:col-span-3'>
          <CardHeader>
            <Skeleton className='h-6 w-32 mb-2' />
            <Skeleton className='h-4 w-48' />
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className='space-y-2'>
                  <div className='flex items-center justify-between'>
                    <Skeleton className='h-4 w-20' />
                    <Skeleton className='h-4 w-12' />
                  </div>
                  <Skeleton className='h-2 w-full rounded-full' />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
