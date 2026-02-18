import { Badge } from '@/components/ui/badge'
import { type Patient } from '@/features/simrs/data'

interface PatientStatusBadgeProps {
  status: Patient['status']
}

/**
 * Patient Status Badge Component
 * Displays patient status with color coding
 * - Aktif: green (default variant)
 * - Keluar: gray (secondary variant)
 * Implements requirement 2.1
 */
export function PatientStatusBadge({ status }: PatientStatusBadgeProps) {
  const statusConfig: Record<
    'Aktif' | 'Keluar',
    { label: string; variant: 'default' | 'secondary' }
  > = {
    Aktif: { label: 'Aktif', variant: 'default' },
    Keluar: { label: 'Keluar', variant: 'secondary' },
  }

  const config = statusConfig[status]

  return <Badge variant={config.variant}>{config.label}</Badge>
}
