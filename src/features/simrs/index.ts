/**
 * SIMRS Feature Exports
 * Central export point for all SIMRS features
 */

// Dashboard
export { SimrsDashboard } from './dashboard'

// Patient Management
export { PatientAdmission } from './patient-admission'
export { PatientRegistration } from './patient-registration'

// Room Management
export { RoomManagement } from './room-management'

// Data Types & Schemas
export * from './data'

// Hooks - All centralized in hooks folder
export {
  usePatientStore,
  initializePatientStore,
  useRoomStore,
  initializeRoomStore,
  useDashboardStats,
  usePatientPrint,
  usePatientExport,
  type PatientFilters,
  type PrintOptions,
} from './hooks'
