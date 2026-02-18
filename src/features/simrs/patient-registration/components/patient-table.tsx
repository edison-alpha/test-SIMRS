import { useEffect, useMemo, useState } from 'react'
import {
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Search, UserX, FileX } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { DataTablePagination } from '@/components/data-table'
import { usePatientStore, type PatientFilters } from '@/features/simrs/hooks'
import { patientColumns } from './patient-columns'
import { PatientSearchForm } from './patient-search-form'
import { PatientBulkActions } from './patient-bulk-actions'

interface PatientTableProps {
  isLoading?: boolean
}

/**
 * Patient Table Component
 * Displays patient data with search, pagination, and action buttons
 * Implements requirements 3.1, 3.2, 3.4, 3.6
 * Enhanced with advanced search and filter (Requirement 2.4)
 * Enhanced with bulk operations (Requirement 4.4)
 */
export function PatientTable({ isLoading = false }: PatientTableProps) {
  const { patients, searchPatients, filterPatients } = usePatientStore()
  
  // Local UI states
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'tanggalJamMasuk', desc: true }, // Default sort by admission date descending
  ])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilters, setActiveFilters] = useState<PatientFilters>({})

  // Filter patients based on search query and filters
  const filteredData = useMemo(() => {
    let result = patients

    // Apply search query
    if (searchQuery.trim()) {
      result = searchPatients(searchQuery)
    }

    // Apply advanced filters
    if (Object.keys(activeFilters).length > 0) {
      result = filterPatients(activeFilters)
    }

    // If both search and filters are active, apply both
    if (searchQuery.trim() && Object.keys(activeFilters).length > 0) {
      const searchResults = searchPatients(searchQuery)
      const filterResults = filterPatients(activeFilters)
      // Intersection of both results
      result = searchResults.filter((patient) =>
        filterResults.some((fp) => fp.id === patient.id)
      )
    }

    return result
  }, [patients, searchQuery, activeFilters, searchPatients, filterPatients])

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: filteredData,
    columns: patientColumns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
      sorting: [
        { id: 'tanggalJamMasuk', desc: true }, // Default sort by admission date descending
      ],
    },
  })

  // Reset to first page when filter changes
  useEffect(() => {
    table.setPageIndex(0)
  }, [searchQuery, activeFilters, table])

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  // Handle filter
  const handleFilter = (filters: PatientFilters) => {
    setActiveFilters(filters)
  }

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery('')
    setActiveFilters({})
  }

  // Show skeleton while loading
  if (isLoading) {
    return <PatientTableSkeleton />
  }

  const hasFilters = searchQuery.trim() || Object.keys(activeFilters).length > 0

  return (
    <div
      className={cn(
        'max-sm:has-[div[role="toolbar"]]:mb-16',
        'flex flex-1 flex-col gap-4'
      )}
    >
      <PatientSearchForm
        onSearch={handleSearch}
        onFilter={handleFilter}
        searchQuery={searchQuery}
        activeFilters={activeFilters}
      />
      <PatientBulkActions table={table} />
      <div className='overflow-hidden rounded-md border'>
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className='group/row'>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        colSpan={header.colSpan}
                        className={cn(
                          'bg-background group-hover/row:bg-muted',
                          header.column.columnDef.meta?.className,
                          header.column.columnDef.meta?.thClassName
                        )}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className='group/row'
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          'bg-background group-hover/row:bg-muted',
                          cell.column.columnDef.meta?.className,
                          cell.column.columnDef.meta?.tdClassName
                        )}
                      >
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
                    colSpan={patientColumns.length}
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
      <DataTablePagination table={table} className='mt-auto' />
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
        <UserX className='h-10 w-10 text-muted-foreground' />
      </div>
      <h3 className='text-lg font-semibold text-foreground mb-1'>
        Belum Ada Data Pasien
      </h3>
      <p className='text-sm text-muted-foreground text-center max-w-md mb-4'>
        Data pasien akan muncul di sini setelah ditambahkan. 
        Silakan tambahkan pasien baru melalui halaman Pendaftaran.
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
        Tidak ditemukan pasien yang sesuai dengan pencarian atau filter yang dipilih.
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
 * Patient Table Skeleton Component
 * Shows loading state while data is being fetched
 */
function PatientTableSkeleton() {
  return (
    <div className='flex flex-1 flex-col gap-4'>
      {/* Search and Filter Skeleton */}
      <div className='flex flex-wrap items-end justify-between gap-4 p-4 border rounded-lg bg-background'>
        <div className='flex flex-1 gap-4 min-w-[300px]'>
          <Skeleton className='h-10 flex-1' />
          <Skeleton className='h-10 w-24' />
        </div>
        <Skeleton className='h-10 w-32' />
      </div>

      {/* Bulk Actions Skeleton */}
      <div className='flex items-center gap-2'>
        <Skeleton className='h-9 w-32' />
        <Skeleton className='h-9 w-24' />
        <div className='flex-1' />
        <Skeleton className='h-9 w-28' />
      </div>

      {/* Table Skeleton */}
      <div className='overflow-hidden rounded-md border'>
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow>
                {/* Checkbox */}
                <TableHead className='w-12 bg-background'>
                  <Skeleton className='h-4 w-4' />
                </TableHead>
                {/* No. RM */}
                <TableHead className='bg-background'>
                  <Skeleton className='h-4 w-20' />
                </TableHead>
                {/* Nama Lengkap */}
                <TableHead className='bg-background'>
                  <Skeleton className='h-4 w-32' />
                </TableHead>
                {/* NIK */}
                <TableHead className='bg-background'>
                  <Skeleton className='h-4 w-28' />
                </TableHead>
                {/* Jenis Kelamin */}
                <TableHead className='bg-background'>
                  <Skeleton className='h-4 w-24' />
                </TableHead>
                {/* Tanggal Lahir */}
                <TableHead className='bg-background'>
                  <Skeleton className='h-4 w-28' />
                </TableHead>
                {/* No. HP */}
                <TableHead className='bg-background'>
                  <Skeleton className='h-4 w-24' />
                </TableHead>
                {/* Nomor Registrasi */}
                <TableHead className='bg-background'>
                  <Skeleton className='h-4 w-28' />
                </TableHead>
                {/* Tanggal Masuk */}
                <TableHead className='bg-background'>
                  <Skeleton className='h-4 w-28' />
                </TableHead>
                {/* Cara Masuk */}
                <TableHead className='bg-background'>
                  <Skeleton className='h-4 w-24' />
                </TableHead>
                {/* DPJP */}
                <TableHead className='bg-background'>
                  <Skeleton className='h-4 w-32' />
                </TableHead>
                {/* Diagnosa */}
                <TableHead className='bg-background'>
                  <Skeleton className='h-4 w-32' />
                </TableHead>
                {/* Kelas */}
                <TableHead className='bg-background'>
                  <Skeleton className='h-4 w-20' />
                </TableHead>
                {/* Ruangan/Bed */}
                <TableHead className='bg-background'>
                  <Skeleton className='h-4 w-24' />
                </TableHead>
                {/* Cara Bayar */}
                <TableHead className='bg-background'>
                  <Skeleton className='h-4 w-24' />
                </TableHead>
                {/* Status */}
                <TableHead className='bg-background'>
                  <Skeleton className='h-4 w-20' />
                </TableHead>
                {/* Actions */}
                <TableHead className='w-12 bg-background'>
                  <Skeleton className='h-4 w-4' />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 10 }).map((_, i) => (
                <TableRow key={i}>
                  {/* Checkbox */}
                  <TableCell className='bg-background'>
                    <Skeleton className='h-4 w-4' />
                  </TableCell>
                  {/* No. RM */}
                  <TableCell className='bg-background'>
                    <Skeleton className='h-4 w-20' />
                  </TableCell>
                  {/* Nama Lengkap */}
                  <TableCell className='bg-background'>
                    <div className='flex items-center gap-2'>
                      <Skeleton className='h-8 w-8 rounded-full' />
                      <Skeleton className='h-4 w-28' />
                    </div>
                  </TableCell>
                  {/* NIK */}
                  <TableCell className='bg-background'>
                    <Skeleton className='h-4 w-28' />
                  </TableCell>
                  {/* Jenis Kelamin */}
                  <TableCell className='bg-background'>
                    <Skeleton className='h-5 w-20 rounded-full' />
                  </TableCell>
                  {/* Tanggal Lahir */}
                  <TableCell className='bg-background'>
                    <Skeleton className='h-4 w-24' />
                  </TableCell>
                  {/* No. HP */}
                  <TableCell className='bg-background'>
                    <Skeleton className='h-4 w-24' />
                  </TableCell>
                  {/* Nomor Registrasi */}
                  <TableCell className='bg-background'>
                    <Skeleton className='h-4 w-24' />
                  </TableCell>
                  {/* Tanggal Masuk */}
                  <TableCell className='bg-background'>
                    <Skeleton className='h-4 w-28' />
                  </TableCell>
                  {/* Cara Masuk */}
                  <TableCell className='bg-background'>
                    <Skeleton className='h-5 w-20 rounded-full' />
                  </TableCell>
                  {/* DPJP */}
                  <TableCell className='bg-background'>
                    <Skeleton className='h-4 w-32' />
                  </TableCell>
                  {/* Diagnosa */}
                  <TableCell className='bg-background'>
                    <Skeleton className='h-4 w-32' />
                  </TableCell>
                  {/* Kelas */}
                  <TableCell className='bg-background'>
                    <Skeleton className='h-5 w-16 rounded-full' />
                  </TableCell>
                  {/* Ruangan/Bed */}
                  <TableCell className='bg-background'>
                    <Skeleton className='h-4 w-20' />
                  </TableCell>
                  {/* Cara Bayar */}
                  <TableCell className='bg-background'>
                    <Skeleton className='h-5 w-20 rounded-full' />
                  </TableCell>
                  {/* Status */}
                  <TableCell className='bg-background'>
                    <Skeleton className='h-5 w-14 rounded-full' />
                  </TableCell>
                  {/* Actions */}
                  <TableCell className='bg-background'>
                    <Skeleton className='h-8 w-8 rounded' />
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
