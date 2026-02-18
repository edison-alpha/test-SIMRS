import type { Patient, Room } from './types'

// Delay duration for simulating slow network (in milliseconds)
const MOCK_DELAY = 500 // 500ms delay as per requirements

/**
 * Simulate network delay
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Patient data from JSON structure
 */
interface PatientJsonData {
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
 * Room data from JSON structure
 */
interface RoomJsonData {
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
 * Load patients from JSON file
 */
export async function fetchMockPatients(): Promise<Patient[]> {
  try {
    // Simulate slow network
    await delay(MOCK_DELAY)
    
    const response = await fetch('/mock-data/patients.json')
    if (!response.ok) {
      throw new Error(`Failed to load patients: ${response.statusText}`)
    }
    const data = await response.json() as PatientJsonData[]
    
    // Convert ISO date strings back to Date objects
    return data.map((patient) => ({
      ...patient,
      tanggalLahir: new Date(patient.tanggalLahir),
      tanggalJamMasuk: new Date(patient.tanggalJamMasuk),
      tanggalKeluar: patient.tanggalKeluar ? new Date(patient.tanggalKeluar) : undefined,
      tanggalSuratRujukan: patient.tanggalSuratRujukan ? new Date(patient.tanggalSuratRujukan) : undefined,
      dateOfBirth: patient.dateOfBirth ? new Date(patient.dateOfBirth) : undefined,
      registrationDate: new Date(patient.registrationDate),
      createdAt: new Date(patient.createdAt),
      updatedAt: new Date(patient.updatedAt),
    })) as Patient[]
  } catch (error) {
    console.error('Error loading mock patients:', error)
    throw error
  }
}

/**
 * Load rooms from JSON file
 */
export async function fetchMockRooms(): Promise<Room[]> {
  try {
    // Simulate slow network
    await delay(MOCK_DELAY)
    
    const response = await fetch('/mock-data/rooms.json')
    if (!response.ok) {
      throw new Error(`Failed to load rooms: ${response.statusText}`)
    }
    const data = await response.json() as RoomJsonData[]
    
    // Convert ISO date strings back to Date objects
    return data.map((room) => ({
      ...room,
      createdAt: new Date(room.createdAt),
      updatedAt: new Date(room.updatedAt),
    })) as Room[]
  } catch (error) {
    console.error('Error loading mock rooms:', error)
    throw error
  }
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use fetchMockPatients instead
 */
export function generateMockPatients(): Patient[] {
  console.warn('generateMockPatients is deprecated. Data is now loaded from JSON files.')
  return []
}

/**
 * Legacy function for backward compatibility
 * @deprecated Use fetchMockRooms instead
 */
export function generateMockRooms(): Room[] {
  console.warn('generateMockRooms is deprecated. Data is now loaded from JSON files.')
  return []
}
