/**
 * Patient Table Component
 * Displays list of inpatients with sorting, search, and pagination
 */

import { useState } from 'react'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import { useInpatientList, type SortField } from '../hooks/use-patient-list'
import type { Patient } from '../../data/types'

export function PatientTable() {
  const {
    patients,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    sortField,
    sortOrder,
    setSorting,
    currentPage,
    pageSize,
    totalPages,
    totalRecords,
    setCurrentPage,
    setPageSize,
  } = useInpatientList()

  console.log('🎨 PatientTable render - isLoading:', isLoading, 'patients:', patients.length)

  const [localSearch, setLocalSearch] = useState(searchQuery)

  const handleSearch = (value: string) => {
    setLocalSearch(value)
    setSearchQuery(value)
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSorting(field, sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSorting(field, 'asc')
    }
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className='ml-2 h-4 w-4' />
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className='ml-2 h-4 w-4' />
    ) : (
      <ArrowDown className='ml-2 h-4 w-4' />
    )
  }

  if (error) {
    return (
      <div className='rounded-lg border border-destructive/50 bg-destructive/10 p-8 text-center space-y-3'>
        <div className='flex justify-center'>
          <div className='rounded-full bg-destructive/20 p-3'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-6 w-6 text-destructive'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
              />
            </svg>
          </div>
        </div>
        <div>
          <p className='text-destructive font-semibold text-lg'>Gagal Memuat Data Pasien</p>
          <p className='text-sm text-muted-foreground mt-2'>
            {error || 'Terjadi kesalahan saat mengambil data dari server.'}
          </p>
          <p className='text-sm text-muted-foreground mt-1'>
            Silakan refresh halaman atau hubungi administrator jika masalah berlanjut.
          </p>
        </div>
        <Button
          variant='outline'
          onClick={() => window.location.reload()}
          className='mt-2'
        >
          Refresh Halaman
        </Button>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      {/* Search Bar */}
      <div className='flex items-center gap-2'>
        <div className='relative flex-1 max-w-sm'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='Cari nama, NIK, atau No. RM...'
            value={localSearch}
            onChange={(e) => handleSearch(e.target.value)}
            className='pl-9'
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Table */}
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[100px]'>No. RM</TableHead>
              <TableHead>
                <Button
                  variant='ghost'
                  onClick={() => handleSort('namaLengkap')}
                  className='-ml-4'
                  disabled={isLoading}
                >
                  Nama Pasien
                  {getSortIcon('namaLengkap')}
                </Button>
              </TableHead>
              <TableHead>NIK</TableHead>
              <TableHead>
                <Button
                  variant='ghost'
                  onClick={() => handleSort('tanggalJamMasuk')}
                  className='-ml-4'
                  disabled={isLoading}
                >
                  Tanggal Masuk
                  {getSortIcon('tanggalJamMasuk')}
                </Button>
              </TableHead>
              <TableHead>Ruangan</TableHead>
              <TableHead>Bed</TableHead>
              <TableHead>Kelas</TableHead>
              <TableHead>DPJP</TableHead>
              <TableHead>Diagnosa</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <LoadingRows />
            ) : patients.length === 0 ? (
              <EmptyState searchQuery={searchQuery} />
            ) : (
              patients.map((patient: Patient) => (
                <TableRow key={patient.id}>
                  <TableCell className='font-medium'>{patient.noRM}</TableCell>
                  <TableCell>
                    <div>
                      <div className='font-medium'>{patient.namaLengkap}</div>
                      <div className='text-sm text-muted-foreground'>
                        {patient.jenisKelamin}, {calculateAge(patient.tanggalLahir)} tahun
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className='text-sm'>{patient.nik}</TableCell>
                  <TableCell>
                    {format(new Date(patient.tanggalJamMasuk), 'dd MMM yyyy HH:mm', { locale: idLocale })}
                  </TableCell>
                  <TableCell>{patient.namaRuangan}</TableCell>
                  <TableCell>{patient.nomorBed}</TableCell>
                  <TableCell>
                    <Badge variant='outline'>{patient.kelasPerawatan}</Badge>
                  </TableCell>
                  <TableCell className='text-sm'>{patient.dpjp}</TableCell>
                  <TableCell className='max-w-[200px] truncate text-sm'>
                    {patient.diagnosaMasuk}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {!isLoading && patients.length > 0 && (
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <p className='text-sm text-muted-foreground'>
              Menampilkan {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, totalRecords)} dari {totalRecords.toLocaleString()} data
            </p>
            <Select
              value={String(pageSize)}
              onValueChange={(value) => setPageSize(Number(value))}
              disabled={isLoading}
            >
              <SelectTrigger className='w-[100px]'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='10'>10 / hal</SelectItem>
                <SelectItem value='20'>20 / hal</SelectItem>
                <SelectItem value='50'>50 / hal</SelectItem>
                <SelectItem value='100'>100 / hal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='icon'
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1 || isLoading}
            >
              <ChevronsLeft className='h-4 w-4' />
            </Button>
            <Button
              variant='outline'
              size='icon'
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
            >
              <ChevronLeft className='h-4 w-4' />
            </Button>
            <div className='flex items-center gap-1'>
              <span className='text-sm'>
                Halaman {currentPage} dari {totalPages}
              </span>
            </div>
            <Button
              variant='outline'
              size='icon'
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages || isLoading}
            >
              <ChevronRight className='h-4 w-4' />
            </Button>
            <Button
              variant='outline'
              size='icon'
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages || isLoading}
            >
              <ChevronsRight className='h-4 w-4' />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

function LoadingRows() {
  console.log('💀 Rendering skeleton rows...')
  return (
    <>
      {Array.from({ length: 10 }).map((_, i) => (
        <TableRow key={i}>
          <TableCell>
            <Skeleton className='h-4 w-20' />
          </TableCell>
          <TableCell>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-32' />
              <Skeleton className='h-3 w-24' />
            </div>
          </TableCell>
          <TableCell>
            <Skeleton className='h-4 w-32' />
          </TableCell>
          <TableCell>
            <Skeleton className='h-4 w-28' />
          </TableCell>
          <TableCell>
            <Skeleton className='h-4 w-20' />
          </TableCell>
          <TableCell>
            <Skeleton className='h-4 w-12' />
          </TableCell>
          <TableCell>
            <Skeleton className='h-6 w-16 rounded-full' />
          </TableCell>
          <TableCell>
            <Skeleton className='h-4 w-32' />
          </TableCell>
          <TableCell>
            <Skeleton className='h-4 w-40' />
          </TableCell>
        </TableRow>
      ))}
    </>
  )
}

function EmptyState({ searchQuery }: { searchQuery: string }) {
  return (
    <TableRow>
      <TableCell colSpan={9} className='h-40 text-center'>
        <div className='flex flex-col items-center justify-center gap-3 py-8'>
          <div className='rounded-full bg-muted p-3'>
            <Search className='h-8 w-8 text-muted-foreground' />
          </div>
          <div className='space-y-1'>
            <p className='font-medium text-foreground'>
              {searchQuery
                ? 'Tidak Ada Hasil Pencarian'
                : 'Belum Ada Data Pasien Rawat Inap'}
            </p>
            <p className='text-sm text-muted-foreground'>
              {searchQuery
                ? `Tidak ditemukan data yang cocok dengan "${searchQuery}"`
                : 'Data pasien rawat inap akan muncul di sini setelah ditambahkan'}
            </p>
          </div>
          {searchQuery && (
            <p className='text-xs text-muted-foreground mt-1'>
              💡 Coba gunakan kata kunci lain atau hapus filter pencarian
            </p>
          )}
        </div>
      </TableCell>
    </TableRow>
  )
}

function calculateAge(birthDate: Date | string): number {
  const today = new Date()
  const birthDateObj = birthDate instanceof Date ? birthDate : new Date(birthDate)
  
  if (isNaN(birthDateObj.getTime())) {
    return 0
  }
  
  let age = today.getFullYear() - birthDateObj.getFullYear()
  const monthDiff = today.getMonth() - birthDateObj.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
    age--
  }
  
  return age
}
