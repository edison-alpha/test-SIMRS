/**
 * Patient Print Hook
 * Implements Requirement 4.3: Print functionality
 * - Support printing patient list
 * - Support printing individual patient detail
 * - Add hospital header and timestamp
 */

import { type Patient } from '@/features/simrs/data'
import { formatDateTime, calculateAge, maskNIK, formatRoomBed } from '@/lib/simrs-utils'

export interface PrintOptions {
  hospitalName?: string
  hospitalAddress?: string
  hospitalPhone?: string
}

const DEFAULT_OPTIONS: PrintOptions = {
  hospitalName: 'Rumah Sakit Umum',
  hospitalAddress: 'Jalan Sumbawa 6 63139 Madiun Jawa Timur · 14 km',
  hospitalPhone: 'Telp: +62 351 464325',
}

/**
 * Hook for printing patient data
 */
export function usePatientPrint(options: PrintOptions = {}) {
  const config = { ...DEFAULT_OPTIONS, ...options }

  /**
   * Generate hospital header HTML
   */
  const generateHeader = (title: string) => {
    const timestamp = formatDateTime(new Date())
    
    return `
      <div class="print-header">
        <h1>${config.hospitalName}</h1>
        <p>${config.hospitalAddress}</p>
        <p>${config.hospitalPhone}</p>
      </div>
      <div class="print-title">${title}</div>
      <div class="print-metadata">
        <span>Tanggal Cetak: ${timestamp}</span>
      </div>
    `
  }

  /**
   * Generate footer HTML
   */
  const generateFooter = () => {
    return `
      <div class="print-footer">
        <p>Dokumen ini dicetak dari Sistem Informasi Manajemen Rumah Sakit (SIMRS)</p>
      </div>
    `
  }

  /**
   * Print individual patient detail
   */
  const printPatientDetail = (patient: Patient) => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      throw new Error('Gagal membuka jendela cetak. Pastikan popup tidak diblokir.')
    }

    const html = `
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Detail Pasien - ${patient.namaLengkap}</title>
        <style>
          ${getPrintStyles()}
        </style>
      </head>
      <body>
        <div class="print-container">
          ${generateHeader('Detail Data Pasien')}
          
          ${generatePatientDetailHTML(patient)}
          
          ${generateFooter()}
        </div>
      </body>
      </html>
    `

    printWindow.document.write(html)
    printWindow.document.close()
    
    // Wait for content to load before printing
    printWindow.onload = () => {
      printWindow.focus()
      printWindow.print()
      // Don't close automatically to allow user to save as PDF
    }
  }

  /**
   * Print patient list
   */
  const printPatientList = (patients: Patient[]) => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      throw new Error('Gagal membuka jendela cetak. Pastikan popup tidak diblokir.')
    }

    const html = `
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Daftar Pasien</title>
        <style>
          ${getPrintStyles()}
        </style>
      </head>
      <body>
        <div class="print-container">
          ${generateHeader('Daftar Pasien')}
          
          <p style="margin-bottom: 10px; font-size: 10pt;">
            Total Pasien: <strong>${patients.length}</strong>
          </p>
          
          ${generatePatientListHTML(patients)}
          
          ${generateFooter()}
        </div>
      </body>
      </html>
    `

    printWindow.document.write(html)
    printWindow.document.close()
    
    printWindow.onload = () => {
      printWindow.focus()
      printWindow.print()
    }
  }

  return {
    printPatientDetail,
    printPatientList,
  }
}

/**
 * Generate HTML for patient detail
 */
function generatePatientDetailHTML(patient: Patient): string {
  const sections = []

  // Section 1: Data Identitas Pasien
  sections.push(`
    <div class="print-section">
      <div class="print-section-title">Data Identitas Pasien</div>
      <div class="print-field">
        <div class="print-field-label">No. RM:</div>
        <div class="print-field-value">${patient.noRM}</div>
      </div>
      <div class="print-field">
        <div class="print-field-label">NIK:</div>
        <div class="print-field-value">${patient.nik}</div>
      </div>
      <div class="print-field">
        <div class="print-field-label">Nama Lengkap:</div>
        <div class="print-field-value">${patient.namaLengkap}</div>
      </div>
      ${patient.tempatLahir ? `
      <div class="print-field">
        <div class="print-field-label">Tempat Lahir:</div>
        <div class="print-field-value">${patient.tempatLahir}</div>
      </div>
      ` : ''}
      <div class="print-field">
        <div class="print-field-label">Tanggal Lahir:</div>
        <div class="print-field-value">${formatDateTime(patient.tanggalLahir).split(' ')[0]}</div>
      </div>
      <div class="print-field">
        <div class="print-field-label">Umur:</div>
        <div class="print-field-value">${calculateAge(patient.tanggalLahir)} tahun</div>
      </div>
      <div class="print-field">
        <div class="print-field-label">Jenis Kelamin:</div>
        <div class="print-field-value">${patient.jenisKelamin}</div>
      </div>
      <div class="print-field">
        <div class="print-field-label">No. Handphone:</div>
        <div class="print-field-value">${patient.noHandphone}</div>
      </div>
      <div class="print-field">
        <div class="print-field-label">Alamat Domisili:</div>
        <div class="print-field-value">${patient.alamatDomisili}</div>
      </div>
    </div>
  `)

  // Section 2: Data Registrasi Kunjungan
  sections.push(`
    <div class="print-section">
      <div class="print-section-title">Data Registrasi Kunjungan</div>
      <div class="print-field">
        <div class="print-field-label">Nomor Registrasi:</div>
        <div class="print-field-value">${patient.nomorRegistrasi}</div>
      </div>
      <div class="print-field">
        <div class="print-field-label">Tanggal & Jam Masuk:</div>
        <div class="print-field-value">${formatDateTime(patient.tanggalJamMasuk)}</div>
      </div>
      <div class="print-field">
        <div class="print-field-label">Cara Masuk:</div>
        <div class="print-field-value">${patient.caraMasuk}</div>
      </div>
      <div class="print-field">
        <div class="print-field-label">DPJP:</div>
        <div class="print-field-value">${patient.dpjp}</div>
      </div>
      <div class="print-field">
        <div class="print-field-label">Diagnosa Masuk:</div>
        <div class="print-field-value">${patient.diagnosaMasuk}</div>
      </div>
      ${patient.keluhanUtama ? `
      <div class="print-field">
        <div class="print-field-label">Keluhan Utama:</div>
        <div class="print-field-value">${patient.keluhanUtama}</div>
      </div>
      ` : ''}
    </div>
  `)

  // Section 3: Data Rujukan (conditional)
  if (patient.caraMasuk === 'Rujukan Luar') {
    sections.push(`
      <div class="print-section">
        <div class="print-section-title">Data Rujukan</div>
        ${patient.asalRujukan ? `
        <div class="print-field">
          <div class="print-field-label">Asal Rujukan:</div>
          <div class="print-field-value">${patient.asalRujukan}</div>
        </div>
        ` : ''}
        ${patient.namaFaskesPerujuk ? `
        <div class="print-field">
          <div class="print-field-label">Nama Faskes Perujuk:</div>
          <div class="print-field-value">${patient.namaFaskesPerujuk}</div>
        </div>
        ` : ''}
        ${patient.nomorSuratRujukan ? `
        <div class="print-field">
          <div class="print-field-label">Nomor Surat Rujukan:</div>
          <div class="print-field-value">${patient.nomorSuratRujukan}</div>
        </div>
        ` : ''}
        ${patient.tanggalSuratRujukan ? `
        <div class="print-field">
          <div class="print-field-label">Tanggal Surat Rujukan:</div>
          <div class="print-field-value">${formatDateTime(patient.tanggalSuratRujukan).split(' ')[0]}</div>
        </div>
        ` : ''}
        ${patient.diagnosaRujukan ? `
        <div class="print-field">
          <div class="print-field-label">Diagnosa Rujukan:</div>
          <div class="print-field-value">${patient.diagnosaRujukan}</div>
        </div>
        ` : ''}
      </div>
    `)
  }

  // Section 4: Penempatan Kamar
  sections.push(`
    <div class="print-section">
      <div class="print-section-title">Penempatan Kamar</div>
      <div class="print-field">
        <div class="print-field-label">Kelas Perawatan:</div>
        <div class="print-field-value">${patient.kelasPerawatan}</div>
      </div>
      <div class="print-field">
        <div class="print-field-label">Nama Ruangan/Bangsal:</div>
        <div class="print-field-value">${patient.namaRuangan}</div>
      </div>
      <div class="print-field">
        <div class="print-field-label">Nomor Bed:</div>
        <div class="print-field-value">${patient.nomorBed}</div>
      </div>
    </div>
  `)

  // Section 5: Penanggung Jawab Pasien
  sections.push(`
    <div class="print-section">
      <div class="print-section-title">Penanggung Jawab Pasien</div>
      <div class="print-field">
        <div class="print-field-label">Nama Penanggung Jawab:</div>
        <div class="print-field-value">${patient.namaPenanggungJawab}</div>
      </div>
      <div class="print-field">
        <div class="print-field-label">Hubungan dengan Pasien:</div>
        <div class="print-field-value">${patient.hubunganDenganPasien}</div>
      </div>
      <div class="print-field">
        <div class="print-field-label">No. HP Penanggung Jawab:</div>
        <div class="print-field-value">${patient.noHPPenanggungJawab}</div>
      </div>
      ${patient.alamatPenanggungJawab ? `
      <div class="print-field">
        <div class="print-field-label">Alamat Penanggung Jawab:</div>
        <div class="print-field-value">${patient.alamatPenanggungJawab}</div>
      </div>
      ` : ''}
    </div>
  `)

  // Section 6: Penjaminan Biaya
  sections.push(`
    <div class="print-section">
      <div class="print-section-title">Penjaminan Biaya</div>
      <div class="print-field">
        <div class="print-field-label">Cara Bayar:</div>
        <div class="print-field-value">${patient.caraBayar}</div>
      </div>
      ${patient.nomorKartuPolis ? `
      <div class="print-field">
        <div class="print-field-label">Nomor Kartu/Polis:</div>
        <div class="print-field-value">${patient.nomorKartuPolis}</div>
      </div>
      ` : ''}
      ${patient.kelasHakRawat ? `
      <div class="print-field">
        <div class="print-field-label">Kelas Hak Rawat:</div>
        <div class="print-field-value">${patient.kelasHakRawat}</div>
      </div>
      ` : ''}
    </div>
  `)

  // Status Section
  sections.push(`
    <div class="print-section">
      <div class="print-section-title">Status Pasien</div>
      <div class="print-field">
        <div class="print-field-label">Status:</div>
        <div class="print-field-value">
          <span class="status-badge">${patient.status}</span>
        </div>
      </div>
      ${patient.tanggalKeluar ? `
      <div class="print-field">
        <div class="print-field-label">Tanggal Keluar:</div>
        <div class="print-field-value">${formatDateTime(patient.tanggalKeluar)}</div>
      </div>
      ` : ''}
    </div>
  `)

  return sections.join('\n')
}

/**
 * Generate HTML for patient list table
 */
function generatePatientListHTML(patients: Patient[]): string {
  const rows = patients.map(patient => `
    <tr>
      <td>${patient.noRM}</td>
      <td>${maskNIK(patient.nik)}</td>
      <td>${patient.namaLengkap}</td>
      <td>${calculateAge(patient.tanggalLahir)} tahun</td>
      <td>${patient.jenisKelamin}</td>
      <td>${patient.nomorRegistrasi}</td>
      <td>${formatDateTime(patient.tanggalJamMasuk)}</td>
      <td>${formatRoomBed(patient.namaRuangan, patient.nomorBed)}</td>
      <td><span class="status-badge">${patient.status}</span></td>
    </tr>
  `).join('')

  return `
    <table class="print-table">
      <thead>
        <tr>
          <th>No. RM</th>
          <th>NIK</th>
          <th>Nama</th>
          <th>Umur</th>
          <th>Jenis Kelamin</th>
          <th>Nomor Registrasi</th>
          <th>Tanggal Masuk</th>
          <th>Ruangan/Bed</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `
}

/**
 * Get print styles as string
 */
function getPrintStyles(): string {
  return `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: Arial, sans-serif;
      font-size: 12pt;
      line-height: 1.5;
      color: #000;
      background: #fff;
      padding: 20px;
    }

    .print-container {
      max-width: 100%;
    }

    .print-header {
      text-align: center;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 2px solid #000;
    }

    .print-header h1 {
      font-size: 18pt;
      font-weight: bold;
      margin: 0 0 5px 0;
    }

    .print-header p {
      font-size: 10pt;
      margin: 2px 0;
    }

    .print-title {
      font-size: 14pt;
      font-weight: bold;
      text-align: center;
      margin: 15px 0;
      text-transform: uppercase;
    }

    .print-metadata {
      font-size: 9pt;
      margin-bottom: 15px;
      display: flex;
      justify-content: space-between;
    }

    .print-section {
      margin-bottom: 20px;
      page-break-inside: avoid;
    }

    .print-section-title {
      font-size: 12pt;
      font-weight: bold;
      margin-bottom: 10px;
      padding-bottom: 5px;
      border-bottom: 1px solid #333;
    }

    .print-field {
      display: grid;
      grid-template-columns: 200px 1fr;
      gap: 10px;
      margin-bottom: 8px;
      font-size: 10pt;
    }

    .print-field-label {
      font-weight: 600;
    }

    .print-field-value {
      word-wrap: break-word;
    }

    .print-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
      font-size: 9pt;
    }

    .print-table th,
    .print-table td {
      border: 1px solid #333;
      padding: 6px 8px;
      text-align: left;
    }

    .print-table th {
      background-color: #f0f0f0;
      font-weight: bold;
    }

    .print-table tr {
      page-break-inside: avoid;
    }

    .print-footer {
      margin-top: 30px;
      text-align: center;
      font-size: 8pt;
      padding-top: 10px;
      border-top: 1px solid #333;
    }

    .status-badge {
      border: 1px solid #333;
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 9pt;
      display: inline-block;
    }

    @media print {
      body {
        padding: 0;
      }
    }
  `
}
