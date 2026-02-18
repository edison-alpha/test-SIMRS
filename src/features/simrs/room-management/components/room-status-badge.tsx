import { Badge } from '@/components/ui/badge'
import { type RoomStatus } from '@/features/simrs/data'

interface RoomStatusBadgeProps {
  status: RoomStatus
}

/**
 * Room Status Badge Component
 * Displays room status with color coding
 * Implements requirement 7.6
 */
export function RoomStatusBadge({ status }: RoomStatusBadgeProps) {
  const statusConfig: Record<
    RoomStatus,
    { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
  > = {
    Tersedia: { label: 'Tersedia', variant: 'default' },
    Terisi: { label: 'Terisi', variant: 'destructive' },
    Maintenance: { label: 'Maintenance', variant: 'secondary' },
    Reservasi: { label: 'Reservasi', variant: 'outline' },
  }

  const config = statusConfig[status]

  return <Badge variant={config.variant}>{config.label}</Badge>
}
