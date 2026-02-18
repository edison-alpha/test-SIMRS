/**
 * Patient Detail Modal
 * Displays comprehensive patient information in organized sections
 * Implements requirement 2.2: Detail View with all 6 data sections
 */

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { usePatientRegistration } from './patient-registration-provider'
import { usePatientStore, usePatientPrint } from '@/features/simrs/hooks'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { formatDateTime, calculateAge } from '@/lib/simrs-utils'
import { Edit, Printer, UserX } from 'lucide-react'

/**
 * Patient Detail Modal Component
 * Read-only view with Edit, Print, and Discharge buttons
 */
export function PatientDetailModal() {
  const { open, setOpen, currentRow } = usePatientRegistration()
  const { dischargePatient } = usePatientStore()
  const { printPatientDetail } = usePatientPrint()
  const navigate = useNavigate()
  
  const isOpen = open === 'view'
  const patient = currentRow

  if (!patient) {
    return null
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setOpen(null)
    }
  }

  const handleEdit = () => {
    // Navigate to edit route (Requirement 2.3)
    setOpen(null)
    navigate(`/simrs/pendaftaran-pasien-baru/${patient.id}`)
  }

  const handlePrint = () => {
    try {
      printPatientDetail(patient)
      toast.success('Membuka jendela cetak...', {
        description: 'Silakan atur pengaturan cetak dan klik tombol Print.',
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui'
      toast.error('Gagal mencetak data pasien', {
        description: `${errorMessage}. Silakan coba lagi atau hubungi administrator.`,
      })
      console.error('Error printing patient detail:', error)
    }
  }

  const handleDischarge = () => {
    if (patient.status === 'Keluar') {
      toast.warning('Pasien sudah dipulangkan', {
        description: 'Pasien ini sudah dalam status keluar dari rumah sakit.',
      })
      return
    }

    try {
      dischargePatient(patient.id, new Date())
      toast.success('Pasien berhasil dipulangkan', {
        description: `Pasien ${patient.namaLengkap} telah dipulangkan dari rumah sakit.`,
      })
      setOpen(null)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui'
      toast.error('Gagal memulangkan pasien', {
        description: `${errorMessage}. Silakan coba lagi atau hubungi administrator.`,
      })
      console.error('Error discharging patient:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className='sm:max-w-4xl max-h-[90vh]'>
        <DialogHeader className='text-start'>
          <DialogTitle>Detail Pasien</DialogTitle>
        </DialogHeader>

        {/* Action Buttons */}
        <div className='flex gap-2 flex-wrap'>
          <Button
            variant='outline'
            size='sm'
            onClick={handleEdit}
          >
            <Edit className='h-4 w-4 mr-2' />
            Edit
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={handlePrint}
          >
            <Printer className='h-4 w-4 mr-2' />
            Cetak
          </Button>
          {patient.status === 'Aktif' && (
            <Button
              variant='outline'
              size='sm'
              onClick={handleDischarge}
            >
              <UserX className='h-4 w-4 mr-2' />
              Pulangkan Pasien
            </Button>
          )}
        </div>

        <Separator />

        {/* Scrollable Content */}
        <ScrollArea className='max-h-[calc(90vh-200px)] pr-4'>
          <div className='space-y-6'>
            {/* Section 1: Data Identitas Pasien */}
            <DetailSection title='Data Identitas Pasien'>
              <DetailField label='No. RM' value={patient.noRM} />
              <DetailField label='NIK' value={patient.nik} />
              <DetailField label='Nama Lengkap' value={patient.namaLengkap} />
              {patient.tempatLahir && (
                <DetailField label='Tempat Lahir' value={patient.tempatLahir} />
              )}
              <DetailField
                label='Tanggal Lahir'
                value={formatDateTime(patient.tanggalLahir).split(' ')[0]}
              />
              <DetailField
                label='Umur'
                value={`${calculateAge(patient.tanggalLahir)} tahun`}
              />
              <DetailField label='Jenis Kelamin' value={patient.jenisKelamin} />
              <DetailField label='No. Handphone' value={patient.noHandphone} />
              <DetailField label='Alamat Domisili' value={patient.alamatDomisili} />
            </DetailSection>

            {/* Section 2: Data Registrasi Kunjungan */}
            <DetailSection title='Data Registrasi Kunjungan'>
              <DetailField label='Nomor Registrasi' value={patient.nomorRegistrasi} />
              <DetailField
                label='Tanggal & Jam Masuk'
                value={formatDateTime(patient.tanggalJamMasuk)}
              />
              <DetailField label='Cara Masuk' value={patient.caraMasuk} />
              <DetailField label='DPJP' value={patient.dpjp} />
              <DetailField label='Diagnosa Masuk' value={patient.diagnosaMasuk} />
              {patient.keluhanUtama && (
                <DetailField label='Keluhan Utama' value={patient.keluhanUtama} />
              )}
            </DetailSection>

            {/* Section 3: Data Rujukan (conditional) */}
            {patient.caraMasuk === 'Rujukan Luar' && (
              <DetailSection title='Data Rujukan'>
                {patient.asalRujukan && (
                  <DetailField label='Asal Rujukan' value={patient.asalRujukan} />
                )}
                {patient.namaFaskesPerujuk && (
                  <DetailField label='Nama Faskes Perujuk' value={patient.namaFaskesPerujuk} />
                )}
                {patient.nomorSuratRujukan && (
                  <DetailField label='Nomor Surat Rujukan' value={patient.nomorSuratRujukan} />
                )}
                {patient.tanggalSuratRujukan && (
                  <DetailField
                    label='Tanggal Surat Rujukan'
                    value={formatDateTime(patient.tanggalSuratRujukan).split(' ')[0]}
                  />
                )}
                {patient.diagnosaRujukan && (
                  <DetailField label='Diagnosa Rujukan' value={patient.diagnosaRujukan} />
                )}
                {patient.fileSuratRujukan && (
                  <DetailField label='File Surat Rujukan' value={patient.fileSuratRujukan} />
                )}
              </DetailSection>
            )}

            {/* Section 4: Penempatan Kamar */}
            <DetailSection title='Penempatan Kamar'>
              <DetailField label='Kelas Perawatan' value={patient.kelasPerawatan} />
              <DetailField label='Nama Ruangan/Bangsal' value={patient.namaRuangan} />
              <DetailField label='Nomor Bed' value={patient.nomorBed} />
            </DetailSection>

            {/* Section 5: Penanggung Jawab Pasien */}
            <DetailSection title='Penanggung Jawab Pasien'>
              <DetailField label='Nama Penanggung Jawab' value={patient.namaPenanggungJawab} />
              <DetailField label='Hubungan dengan Pasien' value={patient.hubunganDenganPasien} />
              <DetailField label='No. HP Penanggung Jawab' value={patient.noHPPenanggungJawab} />
              {patient.alamatPenanggungJawab && (
                <DetailField label='Alamat Penanggung Jawab' value={patient.alamatPenanggungJawab} />
              )}
            </DetailSection>

            {/* Section 6: Penjaminan Biaya */}
            <DetailSection title='Penjaminan Biaya'>
              <DetailField label='Cara Bayar' value={patient.caraBayar} />
              {patient.nomorKartuPolis && (
                <DetailField label='Nomor Kartu/Polis' value={patient.nomorKartuPolis} />
              )}
              {patient.kelasHakRawat && (
                <DetailField label='Kelas Hak Rawat' value={patient.kelasHakRawat} />
              )}
            </DetailSection>

            {/* Status Section */}
            <DetailSection title='Status Pasien'>
              <DetailField label='Status' value={patient.status} />
              {patient.tanggalKeluar && (
                <DetailField
                  label='Tanggal Keluar'
                  value={formatDateTime(patient.tanggalKeluar)}
                />
              )}
            </DetailSection>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

/**
 * Detail Section Component
 * Wrapper for organizing related fields
 */
function DetailSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className='space-y-3'>
      <h3 className='text-lg font-semibold text-foreground border-b pb-2'>
        {title}
      </h3>
      <div className='grid gap-3'>
        {children}
      </div>
    </div>
  )
}

/**
 * Detail Field Component
 * Displays a label-value pair
 */
function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-3 gap-2'>
      <dt className='text-sm font-medium text-muted-foreground'>
        {label}
      </dt>
      <dd className='text-sm text-foreground sm:col-span-2'>
        {value || '-'}
      </dd>
    </div>
  )
}
