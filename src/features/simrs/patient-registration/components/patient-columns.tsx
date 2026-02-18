import { type ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { type Patient } from '@/features/simrs/data'
import { maskNIK, calculateAge, formatDateTime, formatRoomBed } from '@/lib/simrs-utils'
import { DataTableRowActions } from './data-table-row-actions'
import { PatientStatusBadge } from './patient-status-badge'

/**
 * Patient Table Columns
 * Enhanced columns for patient list with comprehensive admission data
 * Implements requirement 2.1:
 * - No. RM, NIK (masked), Nama, Umur, Jenis Kelamin, Nomor Registrasi, 
 *   Tanggal Masuk, Ruangan/Bed, Status, Actions (View Detail)
 */
export const patientColumns: ColumnDef<Patient>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <div className='flex items-center justify-center'>
        <input
          type='checkbox'
          checked={table.getIsAllPageRowsSelected()}
          onChange={(e) => table.toggleAllPageRowsSelected(!!e.target.checked)}
          aria-label='Select all'
          className='h-4 w-4 cursor-pointer rounded border-gray-300'
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className='flex items-center justify-center'>
        <input
          type='checkbox'
          checked={row.getIsSelected()}
          onChange={(e) => row.toggleSelected(!!e.target.checked)}
          aria-label='Select row'
          className='h-4 w-4 cursor-pointer rounded border-gray-300'
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'noRM',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='No. RM' />
    ),
    cell: ({ row }) => (
      <div className='font-medium text-nowrap'>{row.getValue('noRM')}</div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: 'nik',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='NIK' />
    ),
    cell: ({ row }) => {
      const nik = row.getValue('nik') as string
      return (
        <div className='text-nowrap font-mono text-sm'>
          {maskNIK(nik)}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'namaLengkap',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nama' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-48'>{row.getValue('namaLengkap')}</LongText>
    ),
    enableHiding: false,
  },
  {
    accessorKey: 'tanggalLahir',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Umur' />
    ),
    cell: ({ row }) => {
      const dateOfBirth = row.getValue('tanggalLahir') as string | Date
      const age = calculateAge(dateOfBirth)
      return <div className='text-center'>{age} tahun</div>
    },
    enableSorting: true,
  },
  {
    accessorKey: 'jenisKelamin',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Jenis Kelamin' />
    ),
    cell: ({ row }) => {
      const gender = row.getValue('jenisKelamin') as string
      const icon = gender === 'Laki-laki' ? '♂' : '♀'
      return (
        <div className='flex items-center gap-1'>
          <span className='text-lg'>{icon}</span>
          <span>{gender}</span>
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'nomorRegistrasi',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nomor Registrasi' />
    ),
    cell: ({ row }) => (
      <div className='font-medium text-nowrap'>{row.getValue('nomorRegistrasi')}</div>
    ),
    enableSorting: false,
  },
  {
    accessorKey: 'tanggalJamMasuk',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tanggal Masuk' />
    ),
    cell: ({ row }) => {
      const date = row.getValue('tanggalJamMasuk') as string | Date
      return (
        <div className='text-nowrap'>
          {formatDateTime(new Date(date))}
        </div>
      )
    },
    sortingFn: (rowA, rowB, columnId) => {
      const dateA = new Date(rowA.getValue(columnId)).getTime()
      const dateB = new Date(rowB.getValue(columnId)).getTime()
      return dateA - dateB
    },
    enableSorting: true,
  },
  {
    id: 'ruanganBed',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Ruangan/Bed' />
    ),
    cell: ({ row }) => {
      const roomName = row.original.namaRuangan
      const bedNumber = row.original.nomorBed
      return (
        <div className='text-nowrap'>
          {formatRoomBed(roomName, bedNumber)}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as Patient['status']
      return <PatientStatusBadge status={status} />
    },
    enableSorting: false,
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
