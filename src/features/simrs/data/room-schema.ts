import { z } from 'zod'

/**
 * Room Validation Schema
 * Zod schemas for validating room data with Indonesian error messages
 */

/**
 * Room status enum schema with Indonesian labels
 */
export const roomStatusSchema = z.union([
  z.literal('Tersedia'),
  z.literal('Terisi'),
  z.literal('Maintenance'),
  z.literal('Reservasi'),
])

/**
 * Room form validation schema
 * Used for validating room creation and update forms
 */
export const roomFormSchema = z.object({
  roomNumber: z
    .string()
    .min(1, 'Nomor kamar tidak boleh kosong. Silakan masukkan nomor kamar.')
    .max(20, 'Nomor kamar terlalu panjang. Maksimal 20 karakter.')
    .regex(/^[A-Za-z0-9\-]+$/, 'Nomor kamar hanya boleh berisi huruf, angka, dan tanda hubung (-)'),
  
  roomType: z
    .string()
    .min(1, 'Tipe kamar belum dipilih. Silakan pilih tipe kamar dari daftar.')
    .max(50, 'Tipe kamar terlalu panjang. Maksimal 50 karakter.'),
  
  floor: z
    .number({
      message: 'Lantai tidak boleh kosong. Silakan masukkan nomor lantai.',
    })
    .int('Lantai harus berupa angka bulat, bukan desimal.')
    .min(1, 'Lantai minimal adalah 1. Silakan masukkan angka yang valid.')
    .max(50, 'Lantai maksimal adalah 50. Silakan masukkan angka yang lebih kecil.'),
  
  capacity: z
    .number({
      message: 'Kapasitas tidak boleh kosong. Silakan masukkan jumlah kapasitas.',
    })
    .int('Kapasitas harus berupa angka bulat, bukan desimal.')
    .min(1, 'Kapasitas minimal adalah 1 orang. Silakan masukkan angka yang valid.')
    .max(10, 'Kapasitas maksimal adalah 10 orang. Silakan masukkan angka yang lebih kecil.'),
  
  status: roomStatusSchema,
  
  assignedPatientId: z.string().optional(),
})

/**
 * Complete room schema including auto-generated fields
 */
export const roomSchema = roomFormSchema.extend({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

/**
 * Type inference for room form data
 */
export type RoomFormData = z.infer<typeof roomFormSchema>

/**
 * Type inference for complete room data
 */
export type Room = z.infer<typeof roomSchema>

/**
 * Schema for room list (array of rooms)
 */
export const roomListSchema = z.array(roomSchema)

/**
 * Room type options for dropdown
 */
export const roomTypeOptions = [
  { value: 'VIP', label: 'VIP' },
  { value: 'Kelas 1', label: 'Kelas 1' },
  { value: 'Kelas 2', label: 'Kelas 2' },
  { value: 'Kelas 3', label: 'Kelas 3' },
  { value: 'ICU', label: 'ICU' },
  { value: 'ICCU', label: 'ICCU' },
  { value: 'NICU', label: 'NICU' },
  { value: 'Isolasi', label: 'Isolasi' },
] as const

/**
 * Room status options for dropdown with Indonesian labels
 */
export const roomStatusOptions = [
  { value: 'Tersedia', label: 'Tersedia' },
  { value: 'Terisi', label: 'Terisi' },
  { value: 'Maintenance', label: 'Maintenance' },
  { value: 'Reservasi', label: 'Reservasi' },
] as const
