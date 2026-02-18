/**
 * Diagnosis List Component
 * Displays top diagnoses in a simple bar list format (like Referrers)
 * Requirement 3.1: Top 10 Diagnoses Trend
 */

import { useMemo } from 'react'
import { usePatientStore } from '@/features/simrs/hooks/use-patient-store'

interface DiagnosisListProps {
  /**
   * Maximum number of diagnoses to display
   * @default 10
   */
  maxItems?: number
}

/**
 * DiagnosisList Component
 * 
 * Displays a simple bar list showing the top diagnoses
 * with their count and percentage. Similar to Referrers design.
 * 
 * @example
 * ```tsx
 * <DiagnosisList maxItems={10} />
 * ```
 */
export function DiagnosisList({ maxItems = 10 }: DiagnosisListProps) {
  // Get patients directly and compute top diagnoses locally
  const patients = usePatientStore((state) => state.patients)
  
  // Compute top diagnoses using useMemo
  const topDiagnoses = useMemo(() => {
    if (patients.length === 0) return []
    
    // Count diagnoses
    const diagnosisCount = new Map<string, number>()
    
    patients.forEach((patient) => {
      if (patient.diagnosaMasuk) {
        const diagnosis = patient.diagnosaMasuk.trim()
        diagnosisCount.set(diagnosis, (diagnosisCount.get(diagnosis) || 0) + 1)
      }
    })
    
    // Calculate total for percentage
    const total = patients.length
    
    // Convert to array and sort by count descending
    const sortedDiagnoses = Array.from(diagnosisCount.entries())
      .map(([diagnosa, count]) => ({
        diagnosa,
        count,
        percentage: total > 0 ? Math.round((count / total) * 100 * 10) / 10 : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, maxItems)
    
    return sortedDiagnoses
  }, [patients, maxItems])

  // Show empty state if no data
  if (topDiagnoses.length === 0) {
    return (
      <div className='flex items-center justify-center py-8 text-muted-foreground'>
        <div className='text-center'>
          <p className='text-sm'>Belum ada data diagnosa</p>
          <p className='text-xs mt-1'>Data akan muncul setelah pasien terdaftar</p>
        </div>
      </div>
    )
  }

  // Calculate max value for bar width calculation
  const maxCount = Math.max(...topDiagnoses.map((i) => i.count), 1)

  return (
    <ul className='space-y-3'>
      {topDiagnoses.map((item) => {
        const width = `${Math.round((item.count / maxCount) * 100)}%`
        return (
          <li
            key={item.diagnosa}
            className='flex items-center justify-between gap-3'
          >
            <div className='min-w-0 flex-1'>
              <div className='mb-1 truncate text-xs text-muted-foreground'>
                {item.diagnosa}
              </div>
              <div className='h-2.5 w-full rounded-full bg-muted'>
                <div
                  className='h-2.5 rounded-full bg-primary'
                  style={{ width }}
                />
              </div>
            </div>
            <div className='ps-2 text-xs font-medium tabular-nums'>
              {item.count} ({item.percentage}%)
            </div>
          </li>
        )
      })}
    </ul>
  )
}
