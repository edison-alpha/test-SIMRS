/**
 * Mock Data Generator Script
 * Generates patient records with complete admission data structure
 * Data range: October 2025 - February 2026
 * 
 * Run with: npx tsx scripts/generate-mock-data.ts
 */

import { writeFileSync } from 'fs'
import { join } from 'path'

// ===== TYPES =====
type Gender = 'Laki-laki' | 'Perempuan'
type CaraMasuk = 'IGD' | 'Rawat Jalan-Poli' | 'Rujukan Luar'
type KelasPerawatan = 'VVIP' | 'VIP' | 'Kelas 1' | 'Kelas 2' | 'Kelas 3' | 'ICU'
type CaraBayar = 'Umum-Pribadi' | 'BPJS Kesehatan' | 'Asuransi Swasta' | 'Jaminan Perusahaan'
type HubunganDenganPasien = 'Suami' | 'Istri' | 'Orang Tua' | 'Anak' | 'Saudara' | 'Lainnya'
type AsalRujukan = 'Puskesmas' | 'RS Lain' | 'Klinik' | 'Dokter Pribadi'
type PatientStatus = 'Aktif' | 'Keluar'
type RoomStatus = 'Tersedia' | 'Terisi' | 'Maintenance' | 'Reservasi'

// ===== SHARED DATA =====
const firstNames = [
  'Ahmad', 'Budi', 'Citra', 'Dewi', 'Eko', 'Fitri', 'Gunawan', 'Hani', 'Indra', 'Joko',
  'Kartika', 'Lina', 'Made', 'Nur', 'Omar', 'Putri', 'Qori', 'Rina', 'Siti', 'Tono',
  'Umar', 'Vina', 'Wati', 'Xena', 'Yudi', 'Zahra', 'Agus', 'Bella', 'Cahya', 'Dian',
  'Eka', 'Fajar', 'Gita', 'Hendra', 'Ika', 'Jaya', 'Kiki', 'Luki', 'Maya', 'Nanda',
  'Oki', 'Pandu', 'Qomar', 'Rudi', 'Sari', 'Tari', 'Umi', 'Vino', 'Wawan', 'Yanto',
  'Adi', 'Bayu', 'Candra', 'Doni', 'Edi', 'Feri', 'Gani', 'Hadi', 'Irfan', 'Jaka',
  'Krisna', 'Lukman', 'Maman', 'Noval', 'Oki', 'Pras', 'Qodir', 'Reza', 'Sandi', 'Taufik'
]

const lastNames = [
  'Pratama', 'Wijaya', 'Santoso', 'Kusuma', 'Putra', 'Sari', 'Wibowo', 'Lestari', 'Hidayat', 'Rahayu',
  'Setiawan', 'Permata', 'Nugroho', 'Anggraini', 'Saputra', 'Maharani', 'Firmansyah', 'Puspita', 'Hakim', 'Safitri',
  'Ramadhan', 'Utami', 'Kurniawan', 'Dewanti', 'Gunawan', 'Pertiwi', 'Susanto', 'Melati', 'Budiman', 'Cahyani',
  'Prasetyo', 'Handayani', 'Suryanto', 'Indrawati', 'Hermawan', 'Fitriani', 'Maulana', 'Nurjanah', 'Irawan', 'Susilawati'
]

const cities = [
  'Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Semarang', 'Makassar', 'Palembang', 'Tangerang',
  'Depok', 'Bekasi', 'Bogor', 'Yogyakarta', 'Malang', 'Solo', 'Denpasar', 'Balikpapan',
  'Pontianak', 'Manado', 'Batam', 'Pekanbaru', 'Banjarmasin', 'Padang', 'Samarinda', 'Jambi',
  'Cirebon', 'Sukabumi', 'Tasikmalaya', 'Serang', 'Cilegon', 'Mataram'
]

const streets = [
  'Jl. Merdeka', 'Jl. Sudirman', 'Jl. Gatot Subroto', 'Jl. Ahmad Yani', 'Jl. Diponegoro',
  'Jl. Pahlawan', 'Jl. Veteran', 'Jl. Pemuda', 'Jl. Kartini', 'Jl. Imam Bonjol',
  'Jl. Hayam Wuruk', 'Jl. Gajah Mada', 'Jl. Thamrin', 'Jl. Rasuna Said', 'Jl. Kuningan',
  'Jl. Sisingamangaraja', 'Jl. Panglima Polim', 'Jl. Teuku Umar', 'Jl. Cikini Raya', 'Jl. Salemba'
]

const diagnoses = [
  'Demam Berdarah Dengue (DBD)', 'Typhoid Fever', 'Pneumonia', 'Gastroenteritis Akut',
  'Appendicitis', 'Diabetes Mellitus Tipe 2', 'Hipertensi Grade 2', 'Stroke Iskemik',
  'Infark Miokard Akut', 'Gagal Jantung Kongestif', 'Asma Bronkial', 'PPOK Eksaserbasi',
  'Gagal Ginjal Kronik', 'Sirosis Hepatis', 'Pankreatitis Akut', 'Kolangitis',
  'Fraktur Femur', 'Trauma Kepala Sedang', 'Luka Bakar Grade 2', 'Post Operasi Laparotomi',
  'Bronkitis Akut', 'Diare Akut', 'Malaria', 'Tuberkulosis Paru', 'Hepatitis A',
  'Kolesistitis', 'Peritonitis', 'Ileus Obstruktif', 'Hernia Inguinalis', 'Abses Hepar',
  'Sepsis', 'Meningitis', 'Ensefalitis', 'Dengue Shock Syndrome', 'COVID-19',
  'Pneumothorax', 'Efusi Pleura', 'Empiema', 'Abses Paru', 'Bronkiektasis'
]

const doctors = [
  'dr. Andi Wijaya, Sp.PD', 'dr. Budi Santoso, Sp.B', 'dr. Citra Dewi, Sp.A',
  'dr. Dedi Kurniawan, Sp.JP', 'dr. Eka Putri, Sp.S', 'dr. Fajar Hidayat, Sp.OG',
  'dr. Gita Lestari, Sp.M', 'dr. Hendra Gunawan, Sp.THT', 'dr. Indah Permata, Sp.KK',
  'dr. Joko Susilo, Sp.An', 'dr. Kartika Sari, Sp.Rad', 'dr. Lukman Hakim, Sp.U',
  'dr. Maya Sari, Sp.PD', 'dr. Nanda Pratama, Sp.B', 'dr. Oscar Wijaya, Sp.A',
  'dr. Putri Lestari, Sp.PD', 'dr. Qomar Hidayat, Sp.B', 'dr. Rina Susanti, Sp.A',
  'dr. Sandi Pratama, Sp.JP', 'dr. Tari Wulandari, Sp.S'
]

const roomNames = [
  'Melati', 'Mawar', 'Anggrek', 'Dahlia', 'Tulip', 'Sakura', 'Kenanga', 'Cempaka',
  'Flamboyan', 'Bougenville', 'Teratai', 'Kamboja', 'Lily', 'Lavender', 'Jasmine',
  'Azalea', 'Gardenia', 'Magnolia', 'Peony', 'Zinnia'
]

const asalRujukanOptions: AsalRujukan[] = ['Puskesmas', 'RS Lain', 'Klinik', 'Dokter Pribadi']
const faskesNames = [
  'Puskesmas Sejahtera', 'RSUD Kota Medan', 'Klinik Pratama Medika', 'RS Siloam',
  'Puskesmas Sukajadi', 'RS Mayapada', 'Klinik Rawat Inap 24 Jam', 'RS Premier',
  'Puskesmas Harapan', 'RS Eka Hospital', 'Klinik Keluarga Sehat', 'RS Mitra Keluarga'
]

const insuranceCompanies = ['Allianz', 'Prudential', 'Manulife', 'AIA', 'AXA Mandiri', 'Sinarmas MSIG']
const companyNames = ['PT. Pertamina', 'PT. PLN', 'PT. Telkom', 'PT. Garuda Indonesia', 'PT. Bank Mandiri']

// ===== UTILITY FUNCTIONS =====

function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

function generateNIK(): string {
  return Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join('')
}

function generatePhone(): string {
  return '08' + Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join('')
}

function generateNoRM(index: number): string {
  const year = 2026
  return `RM-${year}-${String(index + 1).padStart(5, '0')}`
}

function generateNomorRegistrasi(date: Date, index: number): string {
  const year = date.getFullYear()
  return `REG-${year}-${String(index + 1).padStart(5, '0')}`
}

function randomPick<T>(array: readonly T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

// ===== PATIENT GENERATOR =====

const caraMasukOptions: readonly CaraMasuk[] = ['IGD', 'Rawat Jalan-Poli', 'Rujukan Luar']
const kelasPerawatanOptions: readonly KelasPerawatan[] = ['VVIP', 'VIP', 'Kelas 1', 'Kelas 2', 'Kelas 3', 'ICU']
const caraBayarOptions: readonly CaraBayar[] = ['Umum-Pribadi', 'BPJS Kesehatan', 'Asuransi Swasta', 'Jaminan Perusahaan']
const hubunganOptions: readonly HubunganDenganPasien[] = ['Suami', 'Istri', 'Orang Tua', 'Anak', 'Saudara', 'Lainnya']
const kelasHakRawatOptions = ['Kelas 1', 'Kelas 2', 'Kelas 3'] as const

function generatePatients(count: number) {
  console.log(`🏥 Generating ${count.toLocaleString()} patient records...`)
  const startDate = new Date('2025-02-01')
  const endDate = new Date('2026-02-17')
  
  const patients = Array.from({ length: count }, (_, index) => {
    if (index % 1000 === 0) {
      console.log(`   Progress: ${index.toLocaleString()} / ${count.toLocaleString()}`)
    }

    const firstName = randomPick(firstNames)
    const lastName = randomPick(lastNames)
    const namaLengkap = `${firstName} ${lastName}`
    const jenisKelamin: Gender = Math.random() > 0.5 ? 'Laki-laki' : 'Perempuan'
    const tanggalLahir = new Date(
      1950 + Math.floor(Math.random() * 60),
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1
    )
    const tanggalJamMasuk = randomDate(startDate, endDate)
    const city = randomPick(cities)
    const street = randomPick(streets)
    const caraMasuk = randomPick(caraMasukOptions)
    const kelasPerawatan = randomPick(kelasPerawatanOptions)
    const caraBayar = randomPick(caraBayarOptions)
    const roomName = randomPick(roomNames)
    const hubungan = randomPick(hubunganOptions)
    
    // 80% Aktif, 20% Keluar
    const status: PatientStatus = Math.random() < 0.8 ? 'Aktif' : 'Keluar'
    const tanggalKeluar = status === 'Keluar' 
      ? randomDate(tanggalJamMasuk, endDate)
      : undefined

    // Generate room number based on class
    let roomNumber: string
    if (kelasPerawatan === 'VVIP') {
      roomNumber = `VVIP-${Math.floor(Math.random() * 10) + 1}`
    } else if (kelasPerawatan === 'VIP') {
      roomNumber = `VIP-${Math.floor(Math.random() * 50) + 1}`
    } else if (kelasPerawatan === 'ICU') {
      roomNumber = `ICU-${Math.floor(Math.random() * 30) + 1}`
    } else {
      roomNumber = `${Math.floor(Math.random() * 500) + 1}`
    }

    // Referral data - only for Rujukan Luar
    let asalRujukan: AsalRujukan | undefined
    let namaFaskesPerujuk: string | undefined
    let nomorSuratRujukan: string | undefined
    let tanggalSuratRujukan: string | undefined
    let diagnosaRujukan: string | undefined
    let fileSuratRujukan: string | undefined

    if (caraMasuk === 'Rujukan Luar') {
      asalRujukan = randomPick(asalRujukanOptions)
      namaFaskesPerujuk = randomPick(faskesNames)
      nomorSuratRujukan = `RUJ-${Math.floor(Math.random() * 1000000)}`
      const refDate = new Date(tanggalJamMasuk)
      refDate.setDate(refDate.getDate() - Math.floor(Math.random() * 7) - 1)
      tanggalSuratRujukan = refDate.toISOString()
      diagnosaRujukan = randomPick(diagnoses)
      fileSuratRujukan = Math.random() > 0.5 ? `rujukan_${nomorSuratRujukan}.pdf` : undefined
    }

    // Payment data based on caraBayar
    let nomorKartuPolis: string | undefined
    let kelasHakRawat: string | undefined

    if (caraBayar === 'BPJS Kesehatan') {
      nomorKartuPolis = Array.from({ length: 13 }, () => Math.floor(Math.random() * 10)).join('')
      kelasHakRawat = randomPick(kelasHakRawatOptions)
    } else if (caraBayar === 'Asuransi Swasta') {
      nomorKartuPolis = `${randomPick(insuranceCompanies)}-${Math.floor(Math.random() * 100000000)}`
    } else if (caraBayar === 'Jaminan Perusahaan') {
      nomorKartuPolis = `${randomPick(companyNames)}-${Math.floor(Math.random() * 100000)}`
    }

    // Guarantor info
    const guarantorFirstName = randomPick(firstNames)
    const guarantorLastName = randomPick(lastNames)
    const namaPenanggungJawab = `${guarantorFirstName} ${guarantorLastName}`

    return {
      // System fields
      id: `patient-${index + 1}`,
      
      // Identity Data (Requirement 1.1)
      noRM: generateNoRM(index),
      nik: generateNIK(),
      namaLengkap,
      tempatLahir: city,
      tanggalLahir: tanggalLahir.toISOString(),
      jenisKelamin,
      noHandphone: generatePhone(),
      alamatDomisili: `${street} No. ${Math.floor(Math.random() * 100) + 1}, ${city}`,
      
      // Visit Registration Data (Requirement 1.2)
      nomorRegistrasi: generateNomorRegistrasi(tanggalJamMasuk, index),
      tanggalJamMasuk: tanggalJamMasuk.toISOString(),
      caraMasuk,
      dpjp: randomPick(doctors),
      diagnosaMasuk: randomPick(diagnoses),
      keluhanUtama: `Pasien mengeluh ${['nyeri', 'mual', 'demam', 'sesak napas', 'pusing'][Math.floor(Math.random() * 5)]} sejak ${Math.floor(Math.random() * 7) + 1} hari yang lalu`,
      
      // Referral Data (Requirement 1.3) - conditional
      asalRujukan,
      namaFaskesPerujuk,
      nomorSuratRujukan,
      tanggalSuratRujukan,
      diagnosaRujukan,
      fileSuratRujukan,
      
      // Room Placement (Requirement 1.4)
      kelasPerawatan,
      namaRuangan: roomName,
      nomorBed: roomNumber,
      
      // Guarantor Information (Requirement 1.5)
      namaPenanggungJawab,
      hubunganDenganPasien: hubungan,
      noHPPenanggungJawab: generatePhone(),
      alamatPenanggungJawab: Math.random() > 0.3 ? `${randomPick(streets)} No. ${Math.floor(Math.random() * 100) + 1}, ${randomPick(cities)}` : undefined,
      
      // Payment Guarantee (Requirement 1.6)
      caraBayar,
      nomorKartuPolis,
      kelasHakRawat,
      
      // Status
      status,
      tanggalKeluar: tanggalKeluar?.toISOString(),
      
      // Legacy fields for backward compatibility
      name: namaLengkap,
      phoneNumber: generatePhone(),
      
      // Metadata
      registrationDate: tanggalJamMasuk.toISOString(),
      createdAt: tanggalJamMasuk.toISOString(),
      updatedAt: tanggalJamMasuk.toISOString(),
    }
  })

  // Sort by admission date (newest first)
  patients.sort((a, b) => new Date(b.tanggalJamMasuk).getTime() - new Date(a.tanggalJamMasuk).getTime())
  
  console.log(`✅ Generated ${patients.length.toLocaleString()} patients`)
  return patients
}

// ===== ROOM GENERATOR =====

const roomTypesByClass: Record<string, string[]> = {
  'VVIP': ['Suite VVIP', 'Presidential Suite'],
  'VIP': ['Suite VIP', 'Deluxe VIP'],
  'Kelas 1': ['Standard Kelas 1', 'Superior Kelas 1'],
  'Kelas 2': ['Standard Kelas 2', 'Economy Kelas 2'],
  'Kelas 3': ['Standard Kelas 3', 'Shared Kelas 3'],
  'ICU': ['ICU Umum', 'ICU Khusus', 'ICCU', 'NICU', 'PICU']
}

function generateRooms(count: number) {
  console.log(`\n🏨 Generating ${count} room records...`)
  const rooms = []
  let roomCounter = 1

  // Distribution for 500 rooms
  const classDistribution = {
    'VVIP': 10,
    'VIP': 50,
    'Kelas 1': 100,
    'Kelas 2': 150,
    'Kelas 3': 160,
    'ICU': 30
  }

  Object.entries(classDistribution).forEach(([roomClass, classCount]) => {
    const types = roomTypesByClass[roomClass]
    
    for (let i = 0; i < classCount; i++) {
      const floor = Math.floor(Math.random() * 8) + 1 // Floors 1-8
      const roomType = randomPick(types)
      
      // Determine capacity based on class
      let capacity: number
      if (roomClass === 'VVIP' || roomClass === 'VIP') {
        capacity = 1
      } else if (roomClass === 'Kelas 1' || roomClass === 'Kelas 2') {
        capacity = Math.random() > 0.5 ? 1 : 2
      } else if (roomClass === 'Kelas 3') {
        capacity = Math.floor(Math.random() * 3) + 2 // 2-4 beds
      } else { // ICU
        capacity = 1
      }

      // Generate room number
      let roomNumber: string
      if (roomClass === 'VVIP') {
        roomNumber = `VVIP-${String(i + 1).padStart(2, '0')}`
      } else if (roomClass === 'VIP') {
        roomNumber = `VIP-${String(i + 1).padStart(3, '0')}`
      } else if (roomClass === 'ICU') {
        roomNumber = `ICU-${String(i + 1).padStart(2, '0')}`
      } else {
        roomNumber = `${floor}${String(i + 1).padStart(2, '0')}`
      }

      // Status distribution: 60% Tersedia, 30% Terisi, 8% Maintenance, 2% Reservasi
      const rand = Math.random()
      let status: RoomStatus
      if (rand < 0.60) {
        status = 'Tersedia'
      } else if (rand < 0.90) {
        status = 'Terisi'
      } else if (rand < 0.98) {
        status = 'Maintenance'
      } else {
        status = 'Reservasi'
      }

      const createdAt = new Date('2025-01-01')
      
      rooms.push({
        id: `room-${roomCounter}`,
        roomNumber,
        roomType,
        floor,
        capacity,
        status,
        assignedPatientId: status === 'Terisi' ? `patient-${Math.floor(Math.random() * 20000) + 1}` : undefined,
        createdAt: createdAt.toISOString(),
        updatedAt: createdAt.toISOString(),
      })

      roomCounter++
    }
  })

  // Sort by room number
  rooms.sort((a, b) => a.roomNumber.localeCompare(b.roomNumber))
  
  console.log(`✅ Generated ${rooms.length} rooms`)
  console.log(`   Status distribution:`)
  const statusCounts = rooms.reduce((acc, room) => {
    acc[room.status] = (acc[room.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  Object.entries(statusCounts).forEach(([status, count]) => {
    const percentage = ((count as number) / rooms.length * 100).toFixed(1)
    console.log(`   - ${status}: ${count} (${percentage}%)`)
  })
  
  return rooms
}

// ===== MAIN =====

async function main() {
  console.log('🚀 Starting mock data generation...\n')
  const startTime = Date.now()

  // Generate data
  const patients = generatePatients(1000)
  const rooms = generateRooms(200)

  // Create output directory
  const outputDir = join(process.cwd(), 'public', 'mock-data')
  
  // Write to JSON files
  console.log(`\n💾 Writing data to JSON files...`)
  
  const patientsPath = join(outputDir, 'patients.json')
  writeFileSync(patientsPath, JSON.stringify(patients, null, 2))
  console.log(`✅ Patients saved to: ${patientsPath}`)
  console.log(`   File size: ${(Buffer.byteLength(JSON.stringify(patients)) / 1024 / 1024).toFixed(2)} MB`)

  const roomsPath = join(outputDir, 'rooms.json')
  writeFileSync(roomsPath, JSON.stringify(rooms, null, 2))
  console.log(`✅ Rooms saved to: ${roomsPath}`)
  console.log(`   File size: ${(Buffer.byteLength(JSON.stringify(rooms)) / 1024).toFixed(2)} KB`)

  const endTime = Date.now()
  console.log(`\n🎉 Done! Generated in ${((endTime - startTime) / 1000).toFixed(2)}s`)
}

main().catch(console.error)
