import { type ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table'
import { type Room } from '@/features/simrs/data'
import { usePatientStore } from '@/features/simrs/hooks/use-patient-store'
import { RoomStatusBadge } from './room-status-badge'
import { DataTableRowActions } from './data-table-row-actions'

/**
 * Room Table Columns
 * Defines columns for the room management table with Indonesian headers
 * Implements requirements 7.1, 7.5, 7.6, 7.7
 */
export const roomColumns: ColumnDef<Room>[] = [
  {
    accessorKey: 'roomNumber',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='No. Kamar' />
    ),
    cell: ({ row }) => (
      <div className='font-medium'>{row.getValue('roomNumber')}</div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: 'roomType',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tipe' />
    ),
    cell: ({ row }) => <div>{row.getValue('roomType')}</div>,
    enableSorting: true,
  },
  {
    accessorKey: 'floor',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Lantai' />
    ),
    cell: ({ row }) => <div>{row.getValue('floor')}</div>,
    enableSorting: true,
  },
  {
    accessorKey: 'capacity',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Kapasitas' />
    ),
    cell: ({ row }) => <div>{row.getValue('capacity')}</div>,
    enableSorting: true,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status') as Room['status']
      return <RoomStatusBadge status={status} />
    },
    enableSorting: true,
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'assignedPatientId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Pasien' />
    ),
    cell: ({ row }) => {
      const patientId = row.getValue('assignedPatientId') as string | undefined
      const { getPatientById } = usePatientStore()
      
      if (!patientId) {
        return <div className='text-muted-foreground'>-</div>
      }
      
      const patient = getPatientById(patientId)
      return <div>{patient?.name || '-'}</div>
    },
    enableSorting: false,
  },
  {
    id: 'actions',
    cell: DataTableRowActions,
  },
]
