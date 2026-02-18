/**
 * SIMRS Utility Functions
 * Common utility functions for SIMRS features
 */

/**
 * Generates a unique ID
 * 
 * @returns UUID-like string
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

/**
 * Generates a unique No. RM (Medical Record Number)
 * Format: RM-YYYY-NNNNN
 * 
 * @param existingNoRMs - Array of existing No. RM to check for uniqueness
 * @returns Unique medical record number
 */
export function generateNoRM(existingNoRMs: string[] = []): string {
  const year = new Date().getFullYear()
  const prefix = `RM-${year}-`
  
  // Find the highest existing number for this year
  let maxNumber = 0
  existingNoRMs.forEach((noRM) => {
    if (noRM.startsWith(prefix)) {
      const numberPart = parseInt(noRM.substring(prefix.length), 10)
      if (!isNaN(numberPart) && numberPart > maxNumber) {
        maxNumber = numberPart
      }
    }
  })
  
  // Generate next number
  const nextNumber = maxNumber + 1
  const paddedNumber = String(nextNumber).padStart(5, '0')
  
  return `${prefix}${paddedNumber}`
}

/**
 * Generates a unique Nomor Registrasi (Registration Number)
 * Format: REG-YYYY-NNNNN
 * 
 * @param existingNomorRegistrasi - Array of existing registration numbers to check for uniqueness
 * @returns Unique registration number
 */
export function generateNomorRegistrasi(existingNomorRegistrasi: string[] = []): string {
  const year = new Date().getFullYear()
  const prefix = `REG-${year}-`
  
  // Find the highest existing number for this year
  let maxNumber = 0
  existingNomorRegistrasi.forEach((nomorReg) => {
    if (nomorReg.startsWith(prefix)) {
      const numberPart = parseInt(nomorReg.substring(prefix.length), 10)
      if (!isNaN(numberPart) && numberPart > maxNumber) {
        maxNumber = numberPart
      }
    }
  })
  
  // Generate next number
  const nextNumber = maxNumber + 1
  const paddedNumber = String(nextNumber).padStart(5, '0')
  
  return `${prefix}${paddedNumber}`
}

/**
 * Validates NIK format (16 digits)
 * 
 * @param nik - NIK to validate
 * @returns True if valid, false otherwise
 */
export function validateNIK(nik: string): boolean {
  return /^\d{16}$/.test(nik)
}

/**
 * Masks NIK to show only last 4 digits
 * Example: "3201234567890123" -> "****-****-****-0123"
 * Implements requirement 2.1
 * 
 * @param nik - 16-digit NIK string
 * @returns Masked NIK string
 */
export function maskNIK(nik: string): string {
  if (!nik || nik.length !== 16) {
    return nik
  }
  
  const lastFour = nik.slice(-4)
  return `****-****-****-${lastFour}`
}

/**
 * Calculates age from date of birth
 * Handles both Date objects and ISO string dates
 * 
 * @param dateOfBirth - Date of birth (Date object or ISO string)
 * @returns Age in years
 */
export function calculateAge(dateOfBirth: Date | string): number {
  const today = new Date()
  const birthDate = dateOfBirth instanceof Date ? dateOfBirth : new Date(dateOfBirth)
  
  if (isNaN(birthDate.getTime())) {
    console.error('Invalid date of birth:', dateOfBirth)
    return 0
  }
  
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  
  return age
}

/**
 * Formats date and time in Indonesian format
 * Example: "15/02/2024 14:30"
 * Handles both Date objects and ISO string dates
 * 
 * @param date - Date to format (Date object or ISO string)
 * @returns Formatted date string
 */
export function formatDateTime(date: Date | string): string {
  const dateObj = date instanceof Date ? date : new Date(date)
  
  if (isNaN(dateObj.getTime())) {
    console.error('Invalid date:', date)
    return '-'
  }
  
  const day = String(dateObj.getDate()).padStart(2, '0')
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const year = dateObj.getFullYear()
  const hours = String(dateObj.getHours()).padStart(2, '0')
  const minutes = String(dateObj.getMinutes()).padStart(2, '0')
  
  return `${day}/${month}/${year} ${hours}:${minutes}`
}

/**
 * Formats room and bed information
 * Example: "Ruang A / Bed 101"
 * 
 * @param roomName - Room name
 * @param bedNumber - Bed number
 * @returns Formatted room/bed string
 */
export function formatRoomBed(roomName: string, bedNumber: string): string {
  return `${roomName} / ${bedNumber}`
}
