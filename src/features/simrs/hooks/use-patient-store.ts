/**
 * Patient Store - Zustand State Management
 * Manages patient data with CRUD operations and mock data
 * Enhanced with comprehensive admission fields and localStorage persistence
 * Uses consistent date serialization (ISO strings) for production compatibility
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Patient, PatientFormData } from '@/features/simrs/data'
import { generateId, generateNoRM, generateNomorRegistrasi, validateNIK } from '@/lib/simrs-utils'
import { fetchMockPatients } from '@/features/simrs/data/mock-data'
import { saveFile, deleteFile } from '@/lib/file-storage'

/**
 * Helper type for serializing Date to ISO string
 * Used when storing dates in Zustand/localStorage
 */
type SerializableDate = string & { __brand: 'SerializableDate' }

/**
 * Custom storage that ensures dates are stored as ISO strings
 */
const customStorage = createJSONStorage<{ userAddedPatients: Patient[] }>(() => ({
  getItem: (name) => {
    const str = localStorage.getItem(name)
    if (!str) return null
    
    try {
      const data = JSON.parse(str)
      // Dates are already ISO strings from JSON.parse, no conversion needed
      return data
    } catch {
      return null
    }
  },
  setItem: (name, value) => {
    // Dates will be automatically converted to ISO strings by JSON.stringify
    localStorage.setItem(name, JSON.stringify(value))
  },
  removeItem: (name) => {
    localStorage.removeItem(name)
  },
}))

/**
 * Patient Filter Options
 * Defines the available filters for patient search
 * Requirement 2.4: Search and Filter
 */
export interface PatientFilters {
  status?: 'Aktif' | 'Keluar'
  kelasPerawatan?: string[]
  caraBayar?: string[]
  tanggalMasukStart?: Date
  tanggalMasukEnd?: Date
}

/**
 * Patient Store Interface
 * Defines the shape of the patient store state and actions
 */
interface PatientStore {
  // State
  patients: Patient[]
  isLoaded: boolean
  isLoading: boolean
  userAddedPatients: Patient[] // Track user-added patients separately

  // Actions
  addPatient: (patientData: PatientFormData, rujukanFile?: File) => Promise<Patient>
  updatePatient: (id: string, updates: Partial<PatientFormData>, rujukanFile?: File) => Promise<Patient | null>
  deletePatient: (id: string) => boolean
  dischargePatient: (id: string, tanggalKeluar: Date) => Patient | null
  getPatientById: (id: string) => Patient | undefined
  getPatientByNIK: (nik: string) => Patient | undefined
  getPatientByNoRM: (noRM: string) => Patient | undefined
  getPatientByNomorRegistrasi: (nomorRegistrasi: string) => Patient | undefined
  searchPatients: (query: string) => Patient[]
  filterPatients: (filters: PatientFilters) => Patient[]
  
  // Analytics (Requirements 3.1, 3.2, 3.3)
  getTopDiagnoses: (limit?: number) => { diagnosa: string; count: number; percentage: number }[]
  getAdmissionTrend: (days: number) => { date: string; count: number; byCaraMasuk: Record<string, number> }[]
  getBedOccupancyByClass: () => { kelas: string; total: number; occupied: number; percentage: number }[]
  
  // Utilities
  generateNoRM: () => string
  generateNomorRegistrasi: () => string
  validateNIK: (nik: string) => boolean
  
  // Data loading
  loadMockData: () => Promise<void>
}

/**
 * Patient Store Implementation
 * Uses Zustand for state management with localStorage persistence
 */
export const usePatientStore = create<PatientStore>()(
  persist(
    (set, get) => ({
      // Initial state
      patients: [],
      isLoaded: false,
      isLoading: false,
      userAddedPatients: [],

      /**
       * Adds a new patient to the store
       * Generates ID, noRM, nomorRegistrasi, status, and timestamps automatically
       * Handles file upload for rujukan
       * 
       * @param patientData - Patient form data without auto-generated fields
       * @param rujukanFile - Optional rujukan file to upload
       * @returns The newly created patient
       */
      addPatient: async (patientData: PatientFormData, rujukanFile?: File): Promise<Patient> => {
        const now = new Date()
        const existingNoRMs = get().patients.map(p => p.noRM)
        const existingNomorRegistrasi = get().patients.map(p => p.nomorRegistrasi)
        
        // Handle file upload if provided
        let fileSuratRujukan: string | undefined
        if (rujukanFile) {
          try {
            const storedFile = await saveFile(rujukanFile)
            fileSuratRujukan = storedFile.id
          } catch (error) {
            throw new Error('Gagal menyimpan file rujukan. ' + (error instanceof Error ? error.message : ''))
          }
        }

        // Create patient with ISO string dates for consistency
        const newPatient = {
          ...patientData,
          id: generateId(),
          noRM: generateNoRM(existingNoRMs),
          nomorRegistrasi: generateNomorRegistrasi(existingNomorRegistrasi),
          status: 'Aktif' as const,
          fileSuratRujukan: fileSuratRujukan || patientData.fileSuratRujukan,
          registrationDate: now.toISOString() as SerializableDate,
          createdAt: now.toISOString() as SerializableDate,
          updatedAt: now.toISOString() as SerializableDate,
          // Convert Date objects to ISO strings
          tanggalLahir: patientData.tanggalLahir.toISOString() as SerializableDate,
          tanggalJamMasuk: patientData.tanggalJamMasuk.toISOString() as SerializableDate,
          tanggalSuratRujukan: patientData.tanggalSuratRujukan?.toISOString() as SerializableDate | undefined,
        } as unknown as Patient

        set((state) => {
          // Add new patient and re-sort by tanggalJamMasuk (newest first)
          const updatedPatients = [...state.patients, newPatient].sort((a, b) => {
            const dateA = new Date(a.tanggalJamMasuk).getTime()
            const dateB = new Date(b.tanggalJamMasuk).getTime()
            return dateB - dateA
          })
          
          return {
            patients: updatedPatients,
            userAddedPatients: [...state.userAddedPatients, newPatient],
          }
        })

        return newPatient
      },

      /**
       * Updates an existing patient
       * Preserves ID, noRM, nomorRegistrasi, and registration date as per requirements
       * Handles file upload for rujukan
       * 
       * @param id - Patient ID to update
       * @param updates - Partial patient data to update
       * @param rujukanFile - Optional new rujukan file to upload
       * @returns The updated patient, or null if not found
       */
      updatePatient: async (id: string, updates: Partial<PatientFormData>, rujukanFile?: File): Promise<Patient | null> => {
        let updatedPatient: Patient | null = null

        // Handle file upload if provided
        let fileSuratRujukan: string | undefined
        if (rujukanFile) {
          try {
            const storedFile = await saveFile(rujukanFile)
            fileSuratRujukan = storedFile.id
            
            // Delete old file if exists
            const oldPatient = get().patients.find(p => p.id === id)
            if (oldPatient?.fileSuratRujukan) {
              deleteFile(oldPatient.fileSuratRujukan)
            }
          } catch (error) {
            throw new Error('Gagal menyimpan file rujukan. ' + (error instanceof Error ? error.message : ''))
          }
        }

        set((state) => {
          // Update patient and re-sort by tanggalJamMasuk if date changed
          const updatedPatients = state.patients.map((patient) => {
            if (patient.id === id) {
              // Convert Date objects to ISO strings for consistency
              const processedUpdates: Record<string, unknown> = { ...updates }
              if (updates.tanggalLahir instanceof Date) {
                processedUpdates.tanggalLahir = updates.tanggalLahir.toISOString()
              }
              if (updates.tanggalJamMasuk instanceof Date) {
                processedUpdates.tanggalJamMasuk = updates.tanggalJamMasuk.toISOString()
              }
              if (updates.tanggalSuratRujukan instanceof Date) {
                processedUpdates.tanggalSuratRujukan = updates.tanggalSuratRujukan.toISOString()
              }
              
              // Preserve ID, noRM, nomorRegistrasi, and registration date
              updatedPatient = {
                ...patient,
                ...processedUpdates,
                id: patient.id,
                noRM: patient.noRM,
                nomorRegistrasi: patient.nomorRegistrasi,
                registrationDate: patient.registrationDate,
                fileSuratRujukan: fileSuratRujukan || updates.fileSuratRujukan || patient.fileSuratRujukan,
                updatedAt: new Date().toISOString(),
              } as unknown as Patient
              return updatedPatient
            }
            return patient
          })

          // Re-sort if tanggalJamMasuk was updated
          if (updates.tanggalJamMasuk) {
            updatedPatients.sort((a, b) => {
              const dateA = new Date(a.tanggalJamMasuk).getTime()
              const dateB = new Date(b.tanggalJamMasuk).getTime()
              return dateB - dateA
            })
          }

          return {
            patients: updatedPatients,
            userAddedPatients: state.userAddedPatients.map((patient) => {
              if (patient.id === id && updatedPatient) {
                return updatedPatient
              }
              return patient
            }),
          }
        })

        return updatedPatient
      },

  /**
   * Deletes a patient from the store
   * Also deletes associated rujukan file if exists
   * 
   * @param id - Patient ID to delete
   * @returns True if patient was deleted, false if not found
   */
  deletePatient: (id: string): boolean => {
    const { patients } = get()
    const patient = patients.find((p) => p.id === id)

    if (!patient) {
      return false
    }

    // Delete rujukan file if exists
    if (patient.fileSuratRujukan) {
      deleteFile(patient.fileSuratRujukan)
    }

    set((state) => ({
      patients: state.patients.filter((p) => p.id !== id),
      userAddedPatients: state.userAddedPatients.filter((p) => p.id !== id),
    }))

    return true
  },

  /**
   * Discharges a patient (marks as Keluar)
   * 
   * @param id - Patient ID to discharge
   * @param tanggalKeluar - Discharge date
   * @returns The updated patient, or null if not found
   */
  dischargePatient: (id: string, tanggalKeluar: Date): Patient | null => {
    let dischargedPatient: Patient | null = null

    set((state) => ({
      patients: state.patients.map((patient) => {
        if (patient.id === id) {
          dischargedPatient = {
            ...patient,
            status: 'Keluar',
            tanggalKeluar,
            updatedAt: new Date(),
          }
          return dischargedPatient
        }
        return patient
      }),
    }))

    return dischargedPatient
  },

  /**
   * Retrieves a patient by ID
   * 
   * @param id - Patient ID to find
   * @returns The patient if found, undefined otherwise
   */
  getPatientById: (id: string): Patient | undefined => {
    return get().patients.find((patient) => patient.id === id)
  },

  /**
   * Retrieves a patient by NIK
   * 
   * @param nik - NIK to find
   * @returns The patient if found, undefined otherwise
   */
  getPatientByNIK: (nik: string): Patient | undefined => {
    return get().patients.find((patient) => patient.nik === nik)
  },

  /**
   * Retrieves a patient by No. RM
   * 
   * @param noRM - Medical record number to find
   * @returns The patient if found, undefined otherwise
   */
  getPatientByNoRM: (noRM: string): Patient | undefined => {
    return get().patients.find((patient) => patient.noRM === noRM)
  },

  /**
   * Retrieves a patient by Nomor Registrasi
   * 
   * @param nomorRegistrasi - Registration number to find
   * @returns The patient if found, undefined otherwise
   */
  getPatientByNomorRegistrasi: (nomorRegistrasi: string): Patient | undefined => {
    return get().patients.find((patient) => patient.nomorRegistrasi === nomorRegistrasi)
  },

  /**
   * Searches patients by multiple fields
   * Case-insensitive search across NIK, No. RM, name, phone, and registration number
   * 
   * @param query - Search query string
   * @returns Array of matching patients
   */
  searchPatients: (query: string): Patient[] => {
    if (!query.trim()) {
      return get().patients
    }

    const lowerQuery = query.toLowerCase().trim()

    return get().patients.filter((patient) => {
      return (
        (patient.nik && patient.nik.includes(lowerQuery)) ||
        (patient.noRM && patient.noRM.toLowerCase().includes(lowerQuery)) ||
        (patient.namaLengkap && patient.namaLengkap.toLowerCase().includes(lowerQuery)) ||
        (patient.noHandphone && patient.noHandphone.includes(lowerQuery)) ||
        (patient.nomorRegistrasi && patient.nomorRegistrasi.toLowerCase().includes(lowerQuery)) ||
        // Legacy fields for backward compatibility
        (patient.name && patient.name.toLowerCase().includes(lowerQuery)) ||
        (patient.phoneNumber && patient.phoneNumber.includes(lowerQuery))
      )
    })
  },

  /**
   * Filters patients by advanced criteria
   * Requirement 2.4: Search and Filter
   * Supports filtering by: Status, Kelas Perawatan, Cara Bayar, Tanggal Masuk range
   * 
   * @param filters - Filter criteria object
   * @returns Array of patients matching all filter criteria
   */
  filterPatients: (filters: PatientFilters): Patient[] => {
    let filtered = get().patients

    // Filter by status
    if (filters.status) {
      filtered = filtered.filter((patient) => patient.status === filters.status)
    }

    // Filter by kelas perawatan (multi-select)
    if (filters.kelasPerawatan && filters.kelasPerawatan.length > 0) {
      filtered = filtered.filter((patient) => 
        filters.kelasPerawatan!.includes(patient.kelasPerawatan)
      )
    }

    // Filter by cara bayar (multi-select)
    if (filters.caraBayar && filters.caraBayar.length > 0) {
      filtered = filtered.filter((patient) => 
        filters.caraBayar!.includes(patient.caraBayar)
      )
    }

    // Filter by tanggal masuk range
    if (filters.tanggalMasukStart) {
      filtered = filtered.filter((patient) => {
        const patientDate = new Date(patient.tanggalJamMasuk)
        const startDate = new Date(filters.tanggalMasukStart!)
        // Set time to start of day for comparison
        startDate.setHours(0, 0, 0, 0)
        patientDate.setHours(0, 0, 0, 0)
        return patientDate >= startDate
      })
    }

    if (filters.tanggalMasukEnd) {
      filtered = filtered.filter((patient) => {
        const patientDate = new Date(patient.tanggalJamMasuk)
        const endDate = new Date(filters.tanggalMasukEnd!)
        // Set time to end of day for comparison
        endDate.setHours(23, 59, 59, 999)
        patientDate.setHours(0, 0, 0, 0)
        return patientDate <= endDate
      })
    }

    return filtered
  },

  /**
   * Gets top diagnoses with count and percentage
   * Requirement 3.1: Top 10 Diagnoses Trend
   * 
   * @param limit - Maximum number of diagnoses to return (default: 10)
   * @returns Array of diagnoses with count and percentage, sorted by count descending
   */
  getTopDiagnoses: (limit: number = 10): { diagnosa: string; count: number; percentage: number }[] => {
    const { patients } = get()
    
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
        percentage: total > 0 ? Math.round((count / total) * 100 * 10) / 10 : 0, // Round to 1 decimal
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
    
    return sortedDiagnoses
  },

  /**
   * Gets patient admission trend over time
   * Requirement 3.3: Patient Admission Trends
   * 
   * @param days - Number of days to look back (7, 30, or 90)
   * @returns Array of daily admission counts with breakdown by Cara Masuk
   */
  getAdmissionTrend: (days: number): { date: string; count: number; byCaraMasuk: Record<string, number> }[] => {
    const { patients } = get()
    const now = new Date()
    const startDate = new Date(now)
    startDate.setDate(startDate.getDate() - days)
    startDate.setHours(0, 0, 0, 0)
    
    // Filter patients within date range
    const recentPatients = patients.filter((patient) => {
      const admissionDate = new Date(patient.tanggalJamMasuk)
      return admissionDate >= startDate
    })
    
    // Group by date
    const dateMap = new Map<string, { count: number; byCaraMasuk: Record<string, number> }>()
    
    // Initialize all dates in range
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + i)
      const dateStr = date.toISOString().split('T')[0] // YYYY-MM-DD format
      dateMap.set(dateStr, { count: 0, byCaraMasuk: {} })
    }
    
    // Count admissions by date and cara masuk
    recentPatients.forEach((patient) => {
      const admissionDate = new Date(patient.tanggalJamMasuk)
      const dateStr = admissionDate.toISOString().split('T')[0]
      
      const entry = dateMap.get(dateStr)
      if (entry) {
        entry.count++
        const caraMasuk = patient.caraMasuk
        entry.byCaraMasuk[caraMasuk] = (entry.byCaraMasuk[caraMasuk] || 0) + 1
      }
    })
    
    // Convert to array and sort by date
    const trend = Array.from(dateMap.entries())
      .map(([date, data]) => ({
        date,
        count: data.count,
        byCaraMasuk: data.byCaraMasuk,
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
    
    return trend
  },

  /**
   * Gets bed occupancy statistics by care class
   * Requirement 3.2: Live Bed Occupancy Monitoring
   * 
   * @returns Array of bed occupancy data by Kelas Perawatan
   */
  getBedOccupancyByClass: (): { kelas: string; total: number; occupied: number; percentage: number }[] => {
    const { patients } = get()
    
    // Define care classes and their typical bed counts
    // In a real system, this would come from room/bed configuration
    const careClasses = ['VVIP', 'VIP', 'Kelas 1', 'Kelas 2', 'Kelas 3', 'ICU']
    
    // Count occupied beds by class (only active patients)
    const occupiedByClass = new Map<string, number>()
    
    patients
      .filter((patient) => patient.status === 'Aktif')
      .forEach((patient) => {
        const kelas = patient.kelasPerawatan
        occupiedByClass.set(kelas, (occupiedByClass.get(kelas) || 0) + 1)
      })
    
    // Calculate occupancy for each class
    // Note: Total bed count should ideally come from room management system
    // For now, we'll estimate based on occupied beds with a reasonable multiplier
    const occupancyData = careClasses.map((kelas) => {
      const occupied = occupiedByClass.get(kelas) || 0
      // Estimate total beds: use occupied + some buffer
      // In production, this should query the room management system
      const total = Math.max(occupied, Math.ceil(occupied * 1.5)) || 10 // Default 10 if no patients
      const percentage = total > 0 ? Math.round((occupied / total) * 100) : 0
      
      return {
        kelas,
        total,
        occupied,
        percentage,
      }
    })
    
    return occupancyData
  },

  /**
   * Generates a unique No. RM
   * 
   * @returns Unique medical record number
   */
  generateNoRM: (): string => {
    const existingNoRMs = get().patients.map(p => p.noRM)
    return generateNoRM(existingNoRMs)
  },

  /**
   * Generates a unique Nomor Registrasi
   * 
   * @returns Unique registration number
   */
  generateNomorRegistrasi: (): string => {
    const existingNomorRegistrasi = get().patients.map(p => p.nomorRegistrasi)
    return generateNomorRegistrasi(existingNomorRegistrasi)
  },

  /**
   * Validates NIK format
   * 
   * @param nik - NIK to validate
   * @returns True if valid, false otherwise
   */
  validateNIK: (nik: string): boolean => {
    return validateNIK(nik)
  },

  /**
   * Loads mock data from generator
   * Merges with user-added patients from localStorage
   * Called on store initialization
   */
  loadMockData: async (): Promise<void> => {
    const state = get()
    
    // Prevent multiple simultaneous loads
    if (state.isLoading) {
      return
    }
    
    // If already loaded, skip
    if (state.isLoaded && state.patients.length > 0) {
      return
    }
    
    try {
      set({ isLoading: true })
      const mockPatients = await fetchMockPatients()
      
      // Merge mock data with user-added patients
      const { userAddedPatients } = get()
      
      // Sort all patients by admission date (tanggalJamMasuk) - newest first
      const allPatients = [...mockPatients, ...userAddedPatients].sort((a, b) => {
        const dateA = new Date(a.tanggalJamMasuk).getTime()
        const dateB = new Date(b.tanggalJamMasuk).getTime()
        return dateB - dateA
      })
      
      set({
        patients: allPatients,
        isLoaded: true,
        isLoading: false,
      })
    } catch (error) {
      // Still load user-added patients even if mock data fails
      const { userAddedPatients } = get()
      set({
        patients: userAddedPatients,
        isLoaded: true,
        isLoading: false,
      })
    }
  },
}),
    {
      name: 'simrs-patient-storage',
      storage: customStorage,
      partialize: (state) => ({
        userAddedPatients: state.userAddedPatients,
      }),
    }
  )
)

/**
 * Initialize store by loading mock data
 * This should be called once when the app starts
 */
export function initializePatientStore(): void {
  usePatientStore.getState().loadMockData()
}
