import { type Table } from '@tanstack/react-table'
import { Download, CircleArrowUp } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import { type Patient } from '@/features/simrs/data'
import { usePatientStore, usePatientExport } from '@/features/simrs/hooks'

type PatientBulkActionsProps<TData> = {
  table: Table<TData>
}

/**
 * Patient Bulk Actions Component
 * Provides bulk operations for selected patients
 * Implements Requirement 4.4: Bulk operations
 * - Bulk export to CSV
 * - Bulk status update
 */
export function PatientBulkActions<TData>({
  table,
}: PatientBulkActionsProps<TData>) {
  const { dischargePatient } = usePatientStore()
  const { exportToCSV } = usePatientExport()
  const selectedRows = table.getFilteredSelectedRowModel().rows

  /**
   * Handle bulk export to CSV
   * Exports all selected patients to CSV file
   */
  const handleBulkExport = () => {
    const selectedPatients = selectedRows.map((row) => row.original as Patient)
    
    try {
      exportToCSV(selectedPatients)
      toast.success(
        `${selectedPatients.length} data pasien berhasil diekspor ke CSV.`
      )
      table.resetRowSelection()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui'
      toast.error('Gagal mengekspor data pasien', {
        description: `${errorMessage}. Silakan coba lagi atau hubungi administrator jika masalah berlanjut.`,
      })
      console.error('Export error:', error)
    }
  }

  /**
   * Handle bulk status update
   * Updates status for all selected patients
   */
  const handleBulkStatusChange = (status: 'Aktif' | 'Keluar') => {
    const selectedPatients = selectedRows.map((row) => row.original as Patient)
    
    try {
      if (status === 'Keluar') {
        // Discharge all selected active patients
        const dischargedCount = selectedPatients.filter((patient) => {
          if (patient.status === 'Aktif') {
            dischargePatient(patient.id, new Date())
            return true
          }
          return false
        }).length

        if (dischargedCount > 0) {
          toast.success(
            `${dischargedCount} pasien berhasil dipulangkan.`
          )
        } else {
          toast.info('Tidak ada pasien aktif yang dipilih.')
        }
      }
      
      table.resetRowSelection()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui'
      toast.error('Gagal mengubah status pasien', {
        description: `${errorMessage}. Silakan coba lagi atau hubungi administrator jika masalah berlanjut.`,
      })
      console.error('Status update error:', error)
    }
  }

  return (
    <BulkActionsToolbar table={table} entityName='pasien'>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant='outline'
                size='icon'
                className='size-8'
                aria-label='Ubah status'
                title='Ubah status'
              >
                <CircleArrowUp />
                <span className='sr-only'>Ubah status</span>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Ubah status</p>
          </TooltipContent>
        </Tooltip>
        <DropdownMenuContent sideOffset={14}>
          <DropdownMenuItem
            onClick={() => handleBulkStatusChange('Keluar')}
          >
            Pulangkan Pasien
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='outline'
            size='icon'
            onClick={handleBulkExport}
            className='size-8'
            aria-label='Export pasien'
            title='Export pasien'
          >
            <Download />
            <span className='sr-only'>Export pasien</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Export ke CSV</p>
        </TooltipContent>
      </Tooltip>
    </BulkActionsToolbar>
  )
}
