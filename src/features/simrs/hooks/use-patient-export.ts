import { Patient } from '@/features/simrs/data/patient-schema'
import { calculateAge, formatDateTime } from '@/lib/simrs-utils'
import { format } from 'date-fns'

export function usePatientExport() {
  const exportToCSV = (patients: Patient[]) => {
    // Indonesian column headers
    const headers = [
      'No. RM',
      'NIK',
      'Nama Lengkap',
      'Umur',
      'Jenis Kelamin',
      'Nomor Registrasi',
      'Tanggal Masuk',
      'Ruangan/Bed',
      'Status',
    ]

    // Convert patients to CSV rows
    const rows = patients.map((p) => [
      p.noRM,
      p.nik,
      p.namaLengkap,
      calculateAge(p.tanggalLahir).toString(),
      p.jenisKelamin,
      p.nomorRegistrasi,
      formatDateTime(p.tanggalJamMasuk),
      `${p.namaRuangan}/${p.nomorBed}`,
      p.status,
    ])

    // Create CSV content
    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(','))
      .join('\n')

    // Create blob and download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const filename = `daftar-pasien-${format(new Date(), 'yyyyMMdd-HHmmss')}.csv`

    // Create download link
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', filename)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  }

  return { exportToCSV }
}
