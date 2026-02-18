import { Plus, Download, Printer } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { usePatientStore, usePatientExport, usePatientPrint } from '@/features/simrs/hooks'
import { toast } from 'sonner'

/**
 * Patient Primary Buttons
 * Provides the "Add Patient", "Export to CSV", and "Print" buttons
 * Implements Requirements 4.2 (Export) and 4.3 (Print)
 */
export function PatientPrimaryButtons() {
  const navigate = useNavigate()
  const { patients } = usePatientStore()
  const { exportToCSV } = usePatientExport()
  const { printPatientList } = usePatientPrint()

  const handleExport = () => {
    if (patients.length === 0) {
      toast.error('Tidak ada data untuk diekspor', {
        description: 'Belum ada data pasien yang dapat diekspor. Silakan tambahkan data pasien terlebih dahulu.',
      })
      return
    }

    try {
      exportToCSV(patients)
      toast.success(`Berhasil mengekspor ${patients.length} data pasien`, {
        description: 'File CSV telah berhasil diunduh ke komputer Anda.',
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui'
      toast.error('Gagal mengekspor data', {
        description: `${errorMessage}. Silakan coba lagi atau hubungi administrator.`,
      })
    }
  }

  const handlePrint = () => {
    if (patients.length === 0) {
      toast.error('Tidak ada data untuk dicetak', {
        description: 'Belum ada data pasien yang dapat dicetak. Silakan tambahkan data pasien terlebih dahulu.',
      })
      return
    }

    try {
      printPatientList(patients)
      toast.success('Membuka jendela cetak...', {
        description: 'Silakan atur pengaturan cetak dan klik tombol Print.',
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui'
      toast.error('Gagal mencetak daftar pasien', {
        description: `${errorMessage}. Silakan coba lagi atau hubungi administrator.`,
      })
      console.error('Error printing patient list:', error)
    }
  }

  return (
    <div className='flex items-center gap-2'>
      <Button
        variant='outline'
        size='sm'
        onClick={handlePrint}
        disabled={patients.length === 0}
      >
        <Printer className='mr-2 h-4 w-4' />
        Cetak
      </Button>
      <Button
        variant='outline'
        size='sm'
        onClick={handleExport}
        disabled={patients.length === 0}
      >
        <Download className='mr-2 h-4 w-4' />
        Export ke CSV
      </Button>
      <Button
        variant='default'
        size='sm'
        onClick={() => navigate('/simrs/pendaftaran-pasien-baru')}
      >
        <Plus className='mr-2 h-4 w-4' />
        Tambah Pasien
      </Button>
    </div>
  )
}
