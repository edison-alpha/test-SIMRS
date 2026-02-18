/**
 * SIMRS Core Types
 * TypeScript type definitions for the Hospital Management System
 */

/**
 * Patient gender options in Indonesian
 */
export type Gender = 'Laki-laki' | 'Perempuan'

/**
 * Cara Masuk (Admission Method) options
 */
export type CaraMasuk = 'IGD' | 'Rawat Jalan-Poli' | 'Rujukan Luar'

/**
 * Asal Rujukan (Referral Source) options
 */
export type AsalRujukan = 'Puskesmas' | 'RS Lain' | 'Klinik' | 'Dokter Pribadi'

/**
 * Kelas Perawatan (Care Class) options
 */
export type KelasPerawatan = 'VVIP' | 'VIP' | 'Kelas 1' | 'Kelas 2' | 'Kelas 3' | 'ICU'

/**
 * Hubungan dengan Pasien (Relationship with Patient) options
 */
export type HubunganDenganPasien = 'Suami' | 'Istri' | 'Orang Tua' | 'Anak' | 'Saudara' | 'Lainnya'

/**
 * Cara Bayar (Payment Method) options
 */
export type CaraBayar = 'Umum-Pribadi' | 'BPJS Kesehatan' | 'Asuransi Swasta' | 'Jaminan Perusahaan'

/**
 * Kelas Hak Rawat (BPJS Care Class Entitlement) options
 */
export type KelasHakRawat = 'Kelas 1' | 'Kelas 2' | 'Kelas 3'

/**
 * Patient Status options
 */
export type PatientStatus = 'Aktif' | 'Keluar'

/**
 * Room status options in Indonesian
 * - Tersedia: Available
 * - Terisi: Occupied
 * - Maintenance: Under maintenance
 * - Reservasi: Reserved
 */
export type RoomStatus = 'Tersedia' | 'Terisi' | 'Maintenance' | 'Reservasi'

/**
 * Patient data model
 * Enhanced with comprehensive admission fields
 */
export interface Patient {
  // System fields
  id: string
  
  // ===== IDENTITY DATA (Requirement 1.1) =====
  noRM: string                    // Auto-generated, unique medical record number
  nik: string                     // 16 digits National Identity Number
  namaLengkap: string             // Full name
  tempatLahir?: string            // Place of birth (optional)
  tanggalLahir: Date              // Date of birth
  jenisKelamin: Gender            // Gender
  noHandphone: string             // Phone number
  alamatDomisili: string          // Residential address
  
  // ===== VISIT REGISTRATION DATA (Requirement 1.2) =====
  nomorRegistrasi: string         // Auto-generated per visit
  tanggalJamMasuk: Date           // Admission date and time
  caraMasuk: CaraMasuk            // Admission method
  dpjp: string                    // Doctor in charge
  diagnosaMasuk: string           // Admission diagnosis
  keluhanUtama?: string           // Main complaint (optional)
  
  // ===== REFERRAL DATA (Requirement 1.3) - Conditional =====
  asalRujukan?: AsalRujukan       // Referral source
  namaFaskesPerujuk?: string      // Referring facility name
  nomorSuratRujukan?: string      // Referral letter number
  tanggalSuratRujukan?: Date      // Referral letter date
  diagnosaRujukan?: string        // Referral diagnosis
  fileSuratRujukan?: string       // Referral letter file path/URL
  
  // ===== ROOM PLACEMENT (Requirement 1.4) =====
  kelasPerawatan: KelasPerawatan  // Care class
  namaRuangan: string             // Room/ward name
  nomorBed: string                // Bed number
  
  // ===== GUARANTOR INFORMATION (Requirement 1.5) =====
  namaPenanggungJawab: string     // Guarantor name
  hubunganDenganPasien: HubunganDenganPasien  // Relationship with patient
  noHPPenanggungJawab: string     // Guarantor phone number
  alamatPenanggungJawab?: string  // Guarantor address (optional if same as patient)
  
  // ===== PAYMENT GUARANTEE (Requirement 1.6) =====
  caraBayar: CaraBayar            // Payment method
  nomorKartuPolis?: string        // Card/policy number (mandatory if not Umum)
  kelasHakRawat?: KelasHakRawat   // Care class entitlement (mandatory for BPJS)
  
  // ===== STATUS =====
  status: PatientStatus           // Patient status (Aktif/Keluar)
  tanggalKeluar?: Date            // Discharge date (optional)
  
  // ===== LEGACY FIELDS (for backward compatibility) =====
  name?: string                   // Old name field
  dateOfBirth?: Date              // Old date of birth field
  gender?: Gender                 // Old gender field
  address?: string                // Old address field
  phoneNumber?: string            // Old phone number field
  emergencyContact?: string       // Old emergency contact field
  registrationDate: Date          // Legacy registration date
  
  // Metadata
  createdAt: Date
  updatedAt: Date
}

/**
 * Room data model
 */
export interface Room {
  id: string
  roomNumber: string
  roomType: string
  floor: number
  capacity: number
  status: RoomStatus
  assignedPatientId?: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Dashboard statistics model
 */
export interface DashboardStats {
  totalPatients: number
  totalRooms: number
  occupiedRooms: number
  availableRooms: number
  occupancyRate: number
  recentPatients: Patient[]
  roomStatusDistribution: {
    available: number
    occupied: number
    maintenance: number
    reserved: number
  }
}

/**
 * Patient form data (without auto-generated fields)
 * Excludes: id, noRM, nomorRegistrasi, status, registrationDate, createdAt, updatedAt
 */
export type PatientFormData = Omit<
  Patient,
  'id' | 'noRM' | 'nomorRegistrasi' | 'status' | 'tanggalKeluar' | 'registrationDate' | 'createdAt' | 'updatedAt'
>

/**
 * Room form data (without auto-generated fields)
 */
export type RoomFormData = Omit<Room, 'id' | 'createdAt' | 'updatedAt'>
