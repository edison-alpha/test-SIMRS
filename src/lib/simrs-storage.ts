/**
 * SIMRS Local Storage Utilities
 * Provides persistence layer for patients and rooms using browser local storage
 */

import type { Patient } from '@/features/simrs/data/patient-schema'
import type { Room } from '@/features/simrs/data/room-schema'

/**
 * Patient data as stored in JSON/localStorage
 */
interface PatientJson {
  id: string
  nik: string
  namaLengkap: string
  tempatLahir?: string
  tanggalLahir: string
  jenisKelamin: 'Laki-laki' | 'Perempuan'
  noHandphone: string
  alamatDomisili: string
  nomorRegistrasi: string
  tanggalJamMasuk: string
  caraMasuk: 'IGD' | 'Rawat Jalan-Poli' | 'Rujukan Luar'
  dpjp: string
  diagnosaMasuk: string
  keluhanUtama?: string
  asalRujukan?: 'Puskesmas' | 'RS Lain' | 'Klinik' | 'Dokter Pribadi'
  namaFaskesPerujuk?: string
  nomorSuratRujukan?: string
  tanggalSuratRujukan?: string
  diagnosaRujukan?: string
  fileSuratRujukan?: string
  kelasPerawatan: 'VVIP' | 'VIP' | 'Kelas 1' | 'Kelas 2' | 'Kelas 3' | 'ICU'
  namaRuangan: string
  nomorBed: string
  namaPenanggungJawab: string
  hubunganDenganPasien: 'Suami' | 'Istri' | 'Orang Tua' | 'Anak' | 'Saudara' | 'Lainnya'
  noHPPenanggungJawab: string
  alamatPenanggungJawab?: string
  caraBayar: 'Umum-Pribadi' | 'BPJS Kesehatan' | 'Asuransi Swasta' | 'Jaminan Perusahaan'
  nomorKartuPolis?: string
  kelasHakRawat?: 'Kelas 1' | 'Kelas 2' | 'Kelas 3'
  status: 'Aktif' | 'Keluar'
  tanggalKeluar?: string
  name?: string
  dateOfBirth?: string
  gender?: 'Laki-laki' | 'Perempuan'
  address?: string
  phoneNumber?: string
  emergencyContact?: string
  registrationDate: string
  noRM: string
  createdAt: string
  updatedAt: string
}

/**
 * Room data as stored in JSON/localStorage
 */
interface RoomJson {
  id: string
  roomNumber: string
  roomType: string
  floor: number
  capacity: number
  status: 'Tersedia' | 'Terisi' | 'Maintenance' | 'Reservasi'
  assignedPatientId?: string
  createdAt: string
  updatedAt: string
}

/**
 * Storage keys for local storage
 */
const STORAGE_KEYS = {
  PATIENTS: 'simrs_patients',
  ROOMS: 'simrs_rooms',
} as const

/**
 * Error messages for storage operations
 */
const STORAGE_ERRORS = {
  SAVE_FAILED: 'Gagal menyimpan data. Silakan coba lagi.',
  LOAD_FAILED: 'Gagal memuat data. Silakan refresh halaman.',
  PARSE_FAILED: 'Data tidak valid. Menggunakan data kosong.',
} as const

/**
 * Serializes patients to JSON with date handling
 * Converts Date objects to ISO strings for storage
 */
function serializePatients(patients: Patient[]): string {
  return JSON.stringify(patients, (_key, value) => {
    // Convert Date objects to ISO strings
    if (value instanceof Date) {
      return value.toISOString()
    }
    return value
  })
}

/**
 * Deserializes patients from JSON with date reconstruction
 * Converts ISO strings back to Date objects
 * Updated to handle comprehensive admission fields
 */
function deserializePatients(json: string): Patient[] {
  const parsed = JSON.parse(json)
  
  if (!Array.isArray(parsed)) {
    throw new Error('Invalid patient data format')
  }
  
  return parsed.map((patient: PatientJson) => ({
    ...patient,
    // New comprehensive date fields
    tanggalLahir: new Date(patient.tanggalLahir),
    tanggalJamMasuk: new Date(patient.tanggalJamMasuk),
    tanggalSuratRujukan: patient.tanggalSuratRujukan ? new Date(patient.tanggalSuratRujukan) : undefined,
    tanggalKeluar: patient.tanggalKeluar ? new Date(patient.tanggalKeluar) : undefined,
    // Legacy date fields for backward compatibility
    dateOfBirth: patient.dateOfBirth ? new Date(patient.dateOfBirth) : undefined,
    registrationDate: new Date(patient.registrationDate),
    createdAt: new Date(patient.createdAt),
    updatedAt: new Date(patient.updatedAt),
  })) as Patient[]
}

/**
 * Serializes rooms to JSON with date handling
 * Converts Date objects to ISO strings for storage
 */
function serializeRooms(rooms: Room[]): string {
  return JSON.stringify(rooms, (_key, value) => {
    // Convert Date objects to ISO strings
    if (value instanceof Date) {
      return value.toISOString()
    }
    return value
  })
}

/**
 * Deserializes rooms from JSON with date reconstruction
 * Converts ISO strings back to Date objects
 */
function deserializeRooms(json: string): Room[] {
  const parsed = JSON.parse(json)
  
  if (!Array.isArray(parsed)) {
    throw new Error('Invalid room data format')
  }
  
  return parsed.map((room: RoomJson) => ({
    ...room,
    createdAt: new Date(room.createdAt),
    updatedAt: new Date(room.updatedAt),
  })) as Room[]
}

/**
 * Saves patients to local storage
 * @param patients - Array of patient records to save
 * @throws Error if save operation fails
 */
export function savePatients(patients: Patient[]): void {
  try {
    const serialized = serializePatients(patients)
    localStorage.setItem(STORAGE_KEYS.PATIENTS, serialized)
  } catch (error) {
    console.error('Failed to save patients:', error)
    throw new Error(STORAGE_ERRORS.SAVE_FAILED)
  }
}

/**
 * Loads patients from local storage
 * @returns Array of patient records, or empty array if no data exists
 * @throws Error if load operation fails
 */
export function loadPatients(): Patient[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PATIENTS)
    
    // Return empty array if no data exists
    if (!data) {
      return []
    }
    
    return deserializePatients(data)
  } catch (error) {
    console.error('Failed to load patients:', error)
    
    // If parsing fails, return empty array and log warning
    if (error instanceof SyntaxError) {
      console.warn(STORAGE_ERRORS.PARSE_FAILED)
      return []
    }
    
    throw new Error(STORAGE_ERRORS.LOAD_FAILED)
  }
}

/**
 * Saves rooms to local storage
 * @param rooms - Array of room records to save
 * @throws Error if save operation fails
 */
export function saveRooms(rooms: Room[]): void {
  try {
    const serialized = serializeRooms(rooms)
    localStorage.setItem(STORAGE_KEYS.ROOMS, serialized)
  } catch (error) {
    console.error('Failed to save rooms:', error)
    throw new Error(STORAGE_ERRORS.SAVE_FAILED)
  }
}

/**
 * Loads rooms from local storage
 * @returns Array of room records, or empty array if no data exists
 * @throws Error if load operation fails
 */
export function loadRooms(): Room[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ROOMS)
    
    // Return empty array if no data exists
    if (!data) {
      return []
    }
    
    return deserializeRooms(data)
  } catch (error) {
    console.error('Failed to load rooms:', error)
    
    // If parsing fails, return empty array and log warning
    if (error instanceof SyntaxError) {
      console.warn(STORAGE_ERRORS.PARSE_FAILED)
      return []
    }
    
    throw new Error(STORAGE_ERRORS.LOAD_FAILED)
  }
}

/**
 * Clears all SIMRS data from local storage
 * Useful for testing and data reset
 */
export function clearAllData(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.PATIENTS)
    localStorage.removeItem(STORAGE_KEYS.ROOMS)
  } catch (error) {
    console.error('Failed to clear data:', error)
    throw new Error('Gagal menghapus data.')
  }
}

/**
 * Checks if local storage is available
 * @returns True if local storage is available and working
 */
export function isStorageAvailable(): boolean {
  try {
    const testKey = '__simrs_storage_test__'
    localStorage.setItem(testKey, 'test')
    localStorage.removeItem(testKey)
    return true
  } catch {
    return false
  }
}
