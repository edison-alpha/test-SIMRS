/**
 * SIMRS Data Layer Exports
 * Central export point for all SIMRS data models, schemas, and types
 */

// Patient exports
export {
  genderSchema,
  caraMasukSchema,
  asalRujukanSchema,
  kelasPerawatanSchema,
  hubunganDenganPasienSchema,
  caraBayarSchema,
  kelasHakRawatSchema,
  patientStatusSchema,
  admissionSchema,
  patientFormSchema,
  patientSchema,
  patientListSchema,
  type AdmissionFormData,
  type PatientFormData,
  type Patient,
} from './patient-schema'

// Room exports
export {
  roomStatusSchema,
  roomFormSchema,
  roomSchema,
  roomListSchema,
  roomTypeOptions,
  roomStatusOptions,
  type RoomFormData,
  type Room,
} from './room-schema'

// Type exports
export type {
  Gender,
  CaraMasuk,
  AsalRujukan,
  KelasPerawatan,
  HubunganDenganPasien,
  CaraBayar,
  KelasHakRawat,
  PatientStatus,
  RoomStatus,
  Patient as PatientType,
  Room as RoomType,
  DashboardStats,
  PatientFormData as PatientFormDataType,
  RoomFormData as RoomFormDataType,
} from './types'
