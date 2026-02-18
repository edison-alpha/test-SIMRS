import { useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table'
import { Search, FileX, Building2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination } from '@/components/data-table'
import { useRoomStore } from '@/features/simrs/hooks/use-room-store'
import { roomColumns } from './room-columns'

interface RoomTableProps {
  isLoading?: boolean
}

/**
 * Room Table Component
 * Displays rooms with pagination, search, and status filter
 * Implements requirements 7.1, 7.2, 7.3, 7.5, 7.6, 7.7, 7.8
 * 
 * Optimized with:
 * - Loading skeleton for better UX
 * - Clear empty states for no data and no search results
 * - Efficient state management with single useEffect
 */
export function RoomTable({ isLoading = false }: RoomTableProps) {
  const { rooms } = useRoomStore()
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [globalFilter, setGlobalFilter] = useState('')

  const table = useReactTable({
    data: rooms,
    columns: roomColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _columnId, filterValue) => {
      const searchValue = filterValue.toLowerCase()
      const roomNumber = String(row.getValue('roomNumber')).toLowerCase()
      const roomType = String(row.getValue('roomType')).toLowerCase()
      const floor = String(row.getValue('floor')).toLowerCase()
      
      return (
        roomNumber.includes(searchValue) ||
        roomType.includes(searchValue) ||
        floor.includes(searchValue)
      )
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
  })

  const statusFilter = columnFilters.find((f) => f.id === 'status')?.value as
    | string[]
    | undefined

  const handleStatusFilterChange = (value: string) => {
    if (value === 'all') {
      setColumnFilters((prev) => prev.filter((f) => f.id !== 'status'))
    } else {
      setColumnFilters((prev) => [
        ...prev.filter((f) => f.id !== 'status'),
        { id: 'status', value: [value] },
      ])
    }
  }

  const handleClearFilters = () => {
    setGlobalFilter('')
    setColumnFilters((prev) => prev.filter((f) => f.id !== 'status'))
  }

  const hasFilters = globalFilter.trim() || (statusFilter && statusFilter.length > 0)

  if (isLoading) {
    return <RoomTableSkeleton />
  }

  return (
    <div className='space-y-4'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div className='relative flex-1'>
          <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Cari nomor kamar, tipe, atau lantai...'
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className='pl-8'
          />
        </div>
        <Select
          value={statusFilter?.[0] || 'all'}
          onValueChange={handleStatusFilterChange}
        >
          <SelectTrigger className='w-full sm:w-[180px]'>
            <SelectValue placeholder='Filter Status' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Semua Status</SelectItem>
            <SelectItem value='Tersedia'>Tersedia</SelectItem>
            <SelectItem value='Terisi'>Terisi</SelectItem>
            <SelectItem value='Maintenance'>Maintenance</SelectItem>
            <SelectItem value='Reservasi'>Reservasi</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='rounded-md border'>
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={roomColumns.length}
                    className='h-40 text-center'
                  >
                    {hasFilters ? (
                      <EmptySearchState onClear={handleClearFilters} />
                    ) : (
                      <EmptyDataState />
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <DataTablePagination table={table} />
    </div>
  )
}

/**
 * Empty State Component - No Data Available
 */
function EmptyDataState() {
  return (
    <div className='flex flex-col items-center justify-center py-10 px-4'>
      <div className='rounded-full bg-muted p-4 mb-4'>
        <Building2 className='h-10 w-10 text-muted-foreground' />
      </div>
      <h3 className='text-lg font-semibold text-foreground mb-1'>
        Belum Ada Data Kamar
      </h3>
      <p className='text-sm text-muted-foreground text-center max-w-md mb-4'>
        Data kamar akan muncul di sini setelah ditambahkan. 
        Silakan tambahkan kamar baru untuk memulai.
      </p>
    </div>
  )
}

/**
 * Empty State Component - Search/Filter Returns No Results
 */
function EmptySearchState({ onClear }: { onClear: () => void }) {
  return (
    <div className='flex flex-col items-center justify-center py-10 px-4'>
      <div className='rounded-full bg-muted p-4 mb-4'>
        <Search className='h-10 w-10 text-muted-foreground' />
      </div>
      <h3 className='text-lg font-semibold text-foreground mb-1'>
        Tidak Ada Hasil Pencarian
      </h3>
      <p className='text-sm text-muted-foreground text-center max-w-md mb-4'>
        Tidak ditemukan kamar yang sesuai dengan pencarian atau filter yang dipilih.
        Coba gunakan kata kunci lain atau hapus filter.
      </p>
      <Button variant='outline' onClick={onClear} size='sm'>
        <FileX className='mr-2 h-4 w-4' />
        Hapus Filter
      </Button>
    </div>
  )
}

/**
 * Room Table Skeleton Component
 * Shows loading state while data is being fetched
 */
function RoomTableSkeleton() {
  return (
    <div className='space-y-4'>
      {/* Search and Filter Skeleton */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <Skeleton className='h-10 flex-1' />
        <Skeleton className='h-10 w-[180px]' />
      </div>

      {/* Table Skeleton */}
      <div className='rounded-md border'>
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead><Skeleton className='h-4 w-16' /></TableHead>
                <TableHead><Skeleton className='h-4 w-32' /></TableHead>
                <TableHead><Skeleton className='h-4 w-20' /></TableHead>
                <TableHead><Skeleton className='h-4 w-12' /></TableHead>
                <TableHead><Skeleton className='h-4 w-20' /></TableHead>
                <TableHead><Skeleton className='h-4 w-24' /></TableHead>
                <TableHead><Skeleton className='h-4 w-20' /></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className='h-4 w-16' /></TableCell>
                  <TableCell><Skeleton className='h-4 w-32' /></TableCell>
                  <TableCell><Skeleton className='h-4 w-20' /></TableCell>
                  <TableCell><Skeleton className='h-4 w-8' /></TableCell>
                  <TableCell><Skeleton className='h-6 w-20 rounded-full' /></TableCell>
                  <TableCell><Skeleton className='h-4 w-24' /></TableCell>
                  <TableCell>
                    <div className='flex gap-2'>
                      <Skeleton className='h-8 w-8' />
                      <Skeleton className='h-8 w-8' />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination Skeleton */}
      <div className='flex items-center justify-between px-2'>
        <Skeleton className='h-4 w-48' />
        <div className='flex items-center gap-2'>
          <Skeleton className='h-8 w-8' />
          <Skeleton className='h-8 w-8' />
          <Skeleton className='h-4 w-16' />
          <Skeleton className='h-8 w-8' />
          <Skeleton className='h-8 w-8' />
        </div>
      </div>
    </div>
  )
}
