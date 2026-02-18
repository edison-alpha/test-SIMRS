/**
 * File Storage Utilities
 * Handles file upload and storage in localStorage using base64 encoding
 */

export interface StoredFile {
  id: string
  name: string
  type: string
  size: number
  data: string // base64 encoded
  uploadedAt: Date
}

const STORAGE_KEY_PREFIX = 'simrs_file_'
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB limit

/**
 * Convert file to base64 string
 */
export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const result = reader.result as string
      resolve(result)
    }
    reader.onerror = (error) => reject(error)
  })
}

/**
 * Save file to localStorage
 */
export async function saveFile(file: File): Promise<StoredFile> {
  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`Ukuran file terlalu besar. Maksimal ${MAX_FILE_SIZE / 1024 / 1024}MB`)
  }

  // Convert to base64
  const base64Data = await fileToBase64(file)

  // Create stored file object
  const storedFile: StoredFile = {
    id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: file.name,
    type: file.type,
    size: file.size,
    data: base64Data,
    uploadedAt: new Date(),
  }

  // Save to localStorage
  try {
    localStorage.setItem(
      `${STORAGE_KEY_PREFIX}${storedFile.id}`,
      JSON.stringify(storedFile)
    )
  } catch (error) {
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      throw new Error('Penyimpanan penuh. Silakan hapus beberapa file lama.')
    }
    throw error
  }

  return storedFile
}

/**
 * Get file from localStorage
 */
export function getFile(fileId: string): StoredFile | null {
  try {
    const data = localStorage.getItem(`${STORAGE_KEY_PREFIX}${fileId}`)
    if (!data) return null

    const storedFile = JSON.parse(data)
    // Convert date string back to Date object
    storedFile.uploadedAt = new Date(storedFile.uploadedAt)
    return storedFile
  } catch (error) {
    console.error('Error getting file:', error)
    return null
  }
}

/**
 * Delete file from localStorage
 */
export function deleteFile(fileId: string): boolean {
  try {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}${fileId}`)
    return true
  } catch (error) {
    console.error('Error deleting file:', error)
    return false
  }
}

/**
 * Get all stored files
 */
export function getAllFiles(): StoredFile[] {
  const files: StoredFile[] = []

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith(STORAGE_KEY_PREFIX)) {
        const data = localStorage.getItem(key)
        if (data) {
          const storedFile = JSON.parse(data)
          storedFile.uploadedAt = new Date(storedFile.uploadedAt)
          files.push(storedFile)
        }
      }
    }
  } catch (error) {
    console.error('Error getting all files:', error)
  }

  return files
}

/**
 * Download file from stored data
 */
export function downloadFile(storedFile: StoredFile): void {
  const link = document.createElement('a')
  link.href = storedFile.data
  link.download = storedFile.name
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Get file size in human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Validate file type for rujukan
 */
export function validateRujukanFile(file: File): { valid: boolean; error?: string } {
  const allowedTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
  ]

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Format file tidak didukung. Gunakan PDF, JPG, atau PNG.',
    }
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `Ukuran file terlalu besar. Maksimal ${MAX_FILE_SIZE / 1024 / 1024}MB.`,
    }
  }

  return { valid: true }
}
