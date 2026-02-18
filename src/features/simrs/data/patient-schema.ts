import { z } from 'zod'

/**
 * Patient Validation Schema
 * Zod schemas for validating patient data with Indonesian error messages
 * Enhanced with comprehensive admission fields
 */

/**
 * Gender enum schema with Indonesian labels
 */
export const genderSchema = z.union([
  z.literal('Laki-laki'),
  z.literal('Perempuan'),
])

/**
 * Cara Masuk (Admission Method) enum schema
 */
export const caraMasukSchema = z.enum(['IGD', 'Rawat Jalan-Poli', 'Rujukan Luar'])

/**
 * Asal Rujukan (Referral Source) enum schema
 */
export const asalRujukanSchema = z.enum(['Puskesmas', 'RS Lain', 'Klinik', 'Dokter Pribadi'])

/**
 * Kelas Perawatan (Care Class) enum schema
 */
export const kelasPerawatanSchema = z.enum(['VVIP', 'VIP', 'Kelas 1', 'Kelas 2', 'Kelas 3', 'ICU'])

/**
 * Hubungan dengan Pasien (Relationship with Patient) enum schema
 */
export const hubunganDenganPasienSchema = z.enum(['Suami', 'Istri', 'Orang Tua', 'Anak', 'Saudara', 'Lainnya'])

/**
 * Cara Bayar (Payment Method) enum schema
 */
export const caraBayarSchema = z.enum(['Umum-Pribadi', 'BPJS Kesehatan', 'Asuransi Swasta', 'Jaminan Perusahaan'])

/**
 * Kelas Hak Rawat (BPJS Care Class Entitlement) enum schema
 */
export const kelasHakRawatSchema = z.enum(['Kelas 1', 'Kelas 2', 'Kelas 3'])

/**
 * Patient Status enum schema
 */
export const patientStatusSchema = z.enum(['Aktif', 'Keluar'])

/**
 * Patient form validation schema (Admission Schema)
 * Used for validating patient creation and update forms
 * Enhanced with comprehensive admission fields
 * 
 * Validates Requirements 1.1-1.7:
 * - 1.1: Patient Identity Data (mandatory)
 * - 1.2: Visit Registration Data (mandatory)
 * - 1.3: Referral Data (conditional)
 * - 1.4: Room Placement (mandatory)
 * - 1.5: Guarantor Information (mandatory)
 * - 1.6: Payment Guarantee (mandatory)
 * - 1.7: Form Validation (NIK 16 digits, Indonesian messages, conditional validations)
 */
export const admissionSchema = z.object({
  // ===== IDENTITY DATA (1.1) =====
  // noRM is auto-generated, not in form
  nik: z
    .string()
    .min(1, 'NIK tidak boleh kosong. Silakan masukkan NIK pasien.')
    .regex(/^\d{16}$/, 'NIK harus terdiri dari 16 digit angka. Contoh: 3201234567890123'),
  
  namaLengkap: z
    .string()
    .min(2, 'Nama terlalu pendek. Minimal 2 karakter.')
    .max(100, 'Nama terlalu panjang. Maksimal 100 karakter.'),
  
  tempatLahir: z
    .string()
    .max(100, 'Tempat lahir terlalu panjang. Maksimal 100 karakter.')
    .optional(),
  
  tanggalLahir: z
    .date()
    .max(new Date(), 'Tanggal lahir tidak boleh di masa depan. Silakan pilih tanggal yang benar.')
    .refine((date) => date !== undefined, {
      message: 'Tanggal lahir tidak boleh kosong. Silakan pilih tanggal lahir.',
    }),
  
  jenisKelamin: genderSchema,
  
  noHandphone: z
    .string()
    .min(1, 'No. HP tidak boleh kosong. Silakan masukkan nomor handphone.')
    .regex(/^[0-9]{10,15}$/, 'No. HP harus terdiri dari 10-15 digit angka. Contoh: 081234567890'),
  
  alamatDomisili: z
    .string()
    .min(10, 'Alamat terlalu pendek. Minimal 10 karakter untuk alamat lengkap.')
    .max(500, 'Alamat terlalu panjang. Maksimal 500 karakter.'),
  
  // ===== VISIT REGISTRATION DATA (1.2) =====
  // nomorRegistrasi is auto-generated, not in form
  tanggalJamMasuk: z.date().refine((date) => date !== undefined, {
    message: 'Tanggal masuk tidak boleh kosong. Silakan pilih tanggal dan jam masuk.',
  }),
  
  caraMasuk: caraMasukSchema,
  
  dpjp: z
    .string()
    .min(1, 'DPJP belum dipilih. Silakan pilih dokter penanggung jawab pasien.'),
  
  diagnosaMasuk: z
    .string()
    .min(3, 'Diagnosa terlalu pendek. Minimal 3 karakter.')
    .max(500, 'Diagnosa terlalu panjang. Maksimal 500 karakter.'),
  
  keluhanUtama: z
    .string()
    .max(1000, 'Keluhan utama terlalu panjang. Maksimal 1000 karakter.')
    .optional(),
  
  // ===== REFERRAL DATA (1.3) - Conditional =====
  asalRujukan: asalRujukanSchema.optional(),
  
  namaFaskesPerujuk: z
    .string()
    .max(200, 'Nama faskes perujuk terlalu panjang. Maksimal 200 karakter.')
    .optional(),
  
  nomorSuratRujukan: z
    .string()
    .max(100, 'Nomor surat rujukan terlalu panjang. Maksimal 100 karakter.')
    .optional(),
  
  tanggalSuratRujukan: z.date().optional(),
  
  diagnosaRujukan: z
    .string()
    .max(500, 'Diagnosa rujukan terlalu panjang. Maksimal 500 karakter.')
    .optional(),
  
  fileSuratRujukan: z
    .string()
    .optional(), // File path/URL
  
  // ===== ROOM PLACEMENT (1.4) =====
  kelasPerawatan: kelasPerawatanSchema,
  
  namaRuangan: z
    .string()
    .min(1, 'Ruangan belum dipilih. Silakan pilih ruangan untuk pasien.'),
  
  nomorBed: z
    .string()
    .min(1, 'Bed belum dipilih. Silakan pilih nomor bed untuk pasien.'),
  
  // ===== GUARANTOR INFORMATION (1.5) =====
  namaPenanggungJawab: z
    .string()
    .min(2, 'Nama penanggung jawab terlalu pendek. Minimal 2 karakter.')
    .max(100, 'Nama penanggung jawab terlalu panjang. Maksimal 100 karakter.'),
  
  hubunganDenganPasien: hubunganDenganPasienSchema,
  
  noHPPenanggungJawab: z
    .string()
    .min(1, 'No. HP penanggung jawab tidak boleh kosong.')
    .regex(/^[0-9]{10,15}$/, 'No. HP penanggung jawab harus terdiri dari 10-15 digit angka. Contoh: 081234567890'),
  
  alamatPenanggungJawab: z
    .string()
    .max(500, 'Alamat penanggung jawab terlalu panjang. Maksimal 500 karakter.')
    .optional(),
  
  // ===== PAYMENT GUARANTEE (1.6) =====
  caraBayar: caraBayarSchema,
  
  nomorKartuPolis: z
    .string()
    .max(100, 'Nomor kartu/polis terlalu panjang. Maksimal 100 karakter.')
    .optional(),
  
  kelasHakRawat: kelasHakRawatSchema.optional(),
  
  // ===== LEGACY FIELDS (for backward compatibility) =====
  // Keep old fields as optional to maintain compatibility
  name: z.string().optional(),
  dateOfBirth: z.date().optional(),
  gender: genderSchema.optional(),
  address: z.string().optional(),
  phoneNumber: z.string().optional(),
  emergencyContact: z.string().optional(),
})
.refine((data) => {
  // Requirement 1.7: If Rujukan Luar, referral fields are required
  if (data.caraMasuk === 'Rujukan Luar') {
    return data.asalRujukan && data.namaFaskesPerujuk && data.nomorSuratRujukan && data.tanggalSuratRujukan
  }
  return true
}, {
  message: 'Data rujukan lengkap wajib diisi untuk pasien rujukan luar. Pastikan asal rujukan, nama faskes, nomor surat, dan tanggal surat rujukan sudah terisi.',
  path: ['asalRujukan']
})
.refine((data) => {
  // Requirement 1.7: If not Umum-Pribadi, card/policy number is required
  if (data.caraBayar !== 'Umum-Pribadi') {
    return data.nomorKartuPolis && data.nomorKartuPolis.length > 0
  }
  return true
}, {
  message: 'Nomor kartu/polis tidak boleh kosong untuk pembayaran BPJS atau asuransi. Silakan masukkan nomor kartu/polis.',
  path: ['nomorKartuPolis']
})
.refine((data) => {
  // Requirement 1.7: If BPJS Kesehatan, kelasHakRawat is required
  if (data.caraBayar === 'BPJS Kesehatan') {
    return data.kelasHakRawat !== undefined
  }
  return true
}, {
  message: 'Kelas hak rawat belum dipilih. Untuk BPJS Kesehatan, silakan pilih kelas hak rawat pasien.',
  path: ['kelasHakRawat']
})

/**
 * Alias for backward compatibility
 * @deprecated Use admissionSchema instead
 */
export const patientFormSchema = admissionSchema

/**
 * Complete patient schema including auto-generated fields
 */
export const patientSchema = admissionSchema.extend({
  id: z.string(),
  noRM: z.string(), // Auto-generated medical record number
  nomorRegistrasi: z.string(), // Auto-generated registration number
  status: patientStatusSchema.default('Aktif'),
  tanggalKeluar: z.date().optional(),
  registrationDate: z.date(), // Legacy field
  createdAt: z.date(),
  updatedAt: z.date(),
})

/**
 * Type inference for admission form data
 */
export type AdmissionFormData = z.infer<typeof admissionSchema>

/**
 * Type inference for patient form data
 * @deprecated Use AdmissionFormData instead
 */
export type PatientFormData = AdmissionFormData

/**
 * Type inference for complete patient data
 */
export type Patient = z.infer<typeof patientSchema>

/**
 * Schema for patient list (array of patients)
 */
export const patientListSchema = z.array(patientSchema)
