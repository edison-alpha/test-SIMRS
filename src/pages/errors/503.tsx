/**
 * 503 Service Unavailable Error Page
 */

import { MaintenanceError } from '@/features/errors/maintenance-error'

export function Error503() {
  return <MaintenanceError />
}
