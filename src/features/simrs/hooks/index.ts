/**
 * SIMRS Hooks Exports
 * Central export point for all SIMRS hooks
 */

export { usePatientStore, initializePatientStore, type PatientFilters } from './use-patient-store'
export { useRoomStore, initializeRoomStore } from './use-room-store'
export {
  useDashboardStats,
  calculateOccupancyRate,
  getRecentPatients,
  getRoomStatusDistribution,
  type DashboardStats,
} from './use-dashboard-stats'
export { usePatientPrint, type PrintOptions } from './use-patient-print'
export { usePatientExport } from './use-patient-export'
