/**
 * Admission Trend Chart Component
 * Displays patient admission trends over time with breakdown by Cara Masuk
 * Requirement 3.3: Patient Admission Trends
 */

import { useState, useMemo } from 'react'
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts'
import { usePatientStore } from '@/features/simrs/hooks/use-patient-store'
import { Button } from '@/components/ui/button'
import { format, subDays } from 'date-fns'
import { id as localeId } from 'date-fns/locale'

/**
 * Custom tooltip props
 */
interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    color: string
  }>
  label?: string
}

/**
 * Time range options for the chart
 */
type TimeRange = '7days' | '30days' | '3months'

interface AdmissionTrendChartProps {
  /**
   * Initial time range to display
   * @default '30days'
   */
  defaultTimeRange?: TimeRange
  /**
   * Height of the chart in pixels
   * @default 350
   */
  height?: number
  /**
   * Callback when time range changes
   */
  onTimeRangeChange?: (range: TimeRange) => void
}

/**
 * Time range configuration
 */
const TIME_RANGES: Record<TimeRange, { label: string; days: number }> = {
  '7days': { label: '7 Hari', days: 7 },
  '30days': { label: '30 Hari', days: 30 },
  '3months': { label: '3 Bulan', days: 90 },
}

/**
 * Color mapping for Cara Masuk
 */
const CARA_MASUK_COLORS: Record<string, string> = {
  'IGD': 'hsl(var(--destructive))',
  'Rawat Jalan-Poli': 'hsl(var(--primary))',
  'Rujukan Luar': 'hsl(var(--chart-3))',
}

/**
 * Custom tooltip to display admission details
 */
function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    // Format date for display
    const date = new Date(label || '')
    const formattedDate = format(date, 'dd MMM yyyy', { locale: localeId })
    
    // Calculate total
    const total = payload.reduce((sum: number, entry) => sum + (entry.value || 0), 0)
    
    return (
      <div className='rounded-lg border bg-background p-3 shadow-sm'>
        <div className='grid gap-2'>
          <div className='flex flex-col'>
            <span className='text-[0.70rem] uppercase text-muted-foreground'>
              Tanggal
            </span>
            <span className='font-bold text-muted-foreground'>
              {formattedDate}
            </span>
          </div>
          <div className='flex flex-col'>
            <span className='text-[0.70rem] uppercase text-muted-foreground'>
              Total Pasien
            </span>
            <span className='font-bold'>
              {total} pasien
            </span>
          </div>
          <div className='border-t pt-2'>
            {payload.map((entry, index: number) => (
              <div key={index} className='flex items-center justify-between gap-4 text-sm'>
                <div className='flex items-center gap-2'>
                  <div
                    className='h-2 w-2 rounded-full'
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className='text-muted-foreground'>{entry.name}</span>
                </div>
                <span className='font-medium'>{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  return null
}

/**
 * AdmissionTrendChart Component
 * 
 * Displays a line chart showing patient admission trends over time
 * with breakdown by Cara Masuk (IGD, Rawat Jalan-Poli, Rujukan Luar).
 * Includes time range selector for 7 days, 30 days, and 3 months.
 * 
 * @example
 * ```tsx
 * <AdmissionTrendChart defaultTimeRange="30days" />
 * ```
 */
export function AdmissionTrendChart({
  defaultTimeRange = '30days',
  height = 350,
  onTimeRangeChange,
}: AdmissionTrendChartProps) {
  const [timeRange, setTimeRange] = useState<TimeRange>(defaultTimeRange)
  
  // Get patients directly and compute trend data locally
  const patients = usePatientStore((state) => state.patients)
  
  // Compute trend data using useMemo
  const chartData = useMemo(() => {
    if (patients.length === 0) return []
    
    const days = TIME_RANGES[timeRange].days
    const now = new Date()
    const startDate = subDays(now, days)
    startDate.setHours(0, 0, 0, 0)
    
    // Filter patients within date range
    const recentPatients = patients.filter((patient) => {
      const admissionDate = new Date(patient.tanggalJamMasuk)
      return admissionDate >= startDate
    })
    
    // Group by date
    const dateMap = new Map<string, { count: number; byCaraMasuk: Record<string, number> }>()
    
    // Initialize all dates in range
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + i)
      const dateStr = date.toISOString().split('T')[0]
      dateMap.set(dateStr, { count: 0, byCaraMasuk: {} })
    }
    
    // Count admissions by date and cara masuk
    recentPatients.forEach((patient) => {
      const admissionDate = new Date(patient.tanggalJamMasuk)
      const dateStr = admissionDate.toISOString().split('T')[0]
      
      const entry = dateMap.get(dateStr)
      if (entry) {
        entry.count++
        const caraMasuk = patient.caraMasuk
        entry.byCaraMasuk[caraMasuk] = (entry.byCaraMasuk[caraMasuk] || 0) + 1
      }
    })
    
    // Convert to array and sort by date
    const trend = Array.from(dateMap.entries())
      .map(([date, data]) => ({
        date,
        displayDate: format(new Date(date), 'dd/MM', { locale: localeId }),
        IGD: data.byCaraMasuk['IGD'] || 0,
        'Rawat Jalan-Poli': data.byCaraMasuk['Rawat Jalan-Poli'] || 0,
        'Rujukan Luar': data.byCaraMasuk['Rujukan Luar'] || 0,
        total: data.count,
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
    
    return trend
  }, [patients, timeRange])

  // Handle time range change
  const handleTimeRangeChange = (range: TimeRange) => {
    setTimeRange(range)
    onTimeRangeChange?.(range)
  }

  // Show empty state if no data
  if (chartData.length === 0 || chartData.every(d => d.total === 0)) {
    return (
      <div className='space-y-4'>
        {/* Time Range Selector */}
        <div className='flex justify-end gap-2'>
          {(Object.keys(TIME_RANGES) as TimeRange[]).map((range) => (
            <Button
              key={range}
              variant={timeRange === range ? 'default' : 'outline'}
              size='sm'
              onClick={() => handleTimeRangeChange(range)}
            >
              {TIME_RANGES[range].label}
            </Button>
          ))}
        </div>
        
        {/* Empty State */}
        <div
          className='flex items-center justify-center text-muted-foreground'
          style={{ height }}
        >
          <div className='text-center'>
            <p className='text-sm'>Belum ada data pasien masuk</p>
            <p className='text-xs mt-1'>Data akan muncul setelah pasien terdaftar</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      {/* Time Range Selector */}
      <div className='flex justify-end gap-2'>
        {(Object.keys(TIME_RANGES) as TimeRange[]).map((range) => (
          <Button
            key={range}
            variant={timeRange === range ? 'default' : 'outline'}
            size='sm'
            onClick={() => handleTimeRangeChange(range)}
          >
            {TIME_RANGES[range].label}
          </Button>
        ))}
      </div>

      {/* Chart */}
      <ResponsiveContainer width='100%' height={height}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray='3 3' className='stroke-muted' />
          <XAxis
            dataKey='displayDate'
            stroke='#888888'
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke='#888888'
            fontSize={12}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{
              paddingTop: '20px',
            }}
            iconType='line'
          />
          <Line
            type='monotone'
            dataKey='IGD'
            stroke={CARA_MASUK_COLORS['IGD']}
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
            name='IGD'
          />
          <Line
            type='monotone'
            dataKey='Rawat Jalan-Poli'
            stroke={CARA_MASUK_COLORS['Rawat Jalan-Poli']}
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
            name='Rawat Jalan-Poli'
          />
          <Line
            type='monotone'
            dataKey='Rujukan Luar'
            stroke={CARA_MASUK_COLORS['Rujukan Luar']}
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
            name='Rujukan Luar'
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
