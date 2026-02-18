/**
 * Patient Overview Chart Component
 * Displays monthly patient admission overview in bar chart
 * Dynamically adjusts date range based on actual patient data
 */

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'
import { usePatientStore } from '@/features/simrs/hooks/use-patient-store'
import { useMemo } from 'react'

export function PatientOverviewChart() {
  const patients = usePatientStore((state) => state.patients)

  // Generate monthly data based on actual patient data range
  const monthlyData = useMemo(() => {
    if (patients.length === 0) {
      return []
    }

    // Find the earliest and latest admission dates from actual data
    // Use reduce to avoid stack overflow with large datasets
    let minTime = Infinity
    let maxTime = -Infinity
    
    patients.forEach(p => {
      const time = new Date(p.tanggalJamMasuk).getTime()
      if (time < minTime) minTime = time
      if (time > maxTime) maxTime = time
    })
    
    const minDate = new Date(minTime)
    const maxDate = new Date(maxTime)
    
    // Set to start of month for minDate and end of month for maxDate
    const startDate = new Date(minDate.getFullYear(), minDate.getMonth(), 1)
    const endDate = new Date(maxDate.getFullYear(), maxDate.getMonth() + 1, 0)
    
    // Create array of months in the range
    const monthsData: Array<{ name: string; total: number; year: number; month: number }> = []
    
    const current = new Date(startDate)
    while (current <= endDate) {
      const year = current.getFullYear()
      const month = current.getMonth()
      const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
        'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
      ]
      
      monthsData.push({
        name: `${monthNames[month]} ${year}`,
        total: 0,
        year,
        month,
      })
      
      // Move to next month
      current.setMonth(current.getMonth() + 1)
    }

    // Count patients by month
    patients.forEach((patient) => {
      const admissionDate = new Date(patient.tanggalJamMasuk)
      const year = admissionDate.getFullYear()
      const month = admissionDate.getMonth()
      
      // Find matching month in our data
      const monthData = monthsData.find(
        (m) => m.year === year && m.month === month
      )
      
      if (monthData) {
        monthData.total++
      }
    })

    return monthsData
  }, [patients])

  // Calculate total for display
  const totalAdmissions = useMemo(() => {
    return monthlyData.reduce((sum, month) => sum + month.total, 0)
  }, [monthlyData])

  // Get date range for display
  const dateRange = useMemo(() => {
    if (monthlyData.length === 0) return ''
    const firstMonth = monthlyData[0].name
    const lastMonth = monthlyData[monthlyData.length - 1].name
    return `${firstMonth} - ${lastMonth}`
  }, [monthlyData])

  // Show empty state if no data
  if (monthlyData.length === 0) {
    return (
      <div className='flex items-center justify-center h-[320px] text-muted-foreground'>
        <div className='text-center'>
          <p className='text-sm'>Belum ada data pasien</p>
          <p className='text-xs mt-1'>Data akan muncul setelah pasien terdaftar</p>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-2'>
      <div className='flex items-center justify-between text-sm text-muted-foreground'>
        <span>Total Pasien Masuk: {totalAdmissions.toLocaleString()}</span>
        <span>Periode: {dateRange}</span>
      </div>
      <ResponsiveContainer width='100%' height={320}>
        <BarChart data={monthlyData}>
          <XAxis
            dataKey='name'
            stroke='#888888'
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            direction='ltr'
            stroke='#888888'
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value.toLocaleString()}`}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className='rounded-lg border bg-background p-2 shadow-sm'>
                    <div className='grid grid-cols-2 gap-2'>
                      <div className='flex flex-col'>
                        <span className='text-[0.70rem] uppercase text-muted-foreground'>
                          Bulan
                        </span>
                        <span className='font-bold text-muted-foreground'>
                          {payload[0].payload.name}
                        </span>
                      </div>
                      <div className='flex flex-col'>
                        <span className='text-[0.70rem] uppercase text-muted-foreground'>
                          Pasien
                        </span>
                        <span className='font-bold'>
                          {payload[0].value?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              }
              return null
            }}
          />
          <Bar
            dataKey='total'
            fill='currentColor'
            radius={[4, 4, 0, 0]}
            className='fill-primary'
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
