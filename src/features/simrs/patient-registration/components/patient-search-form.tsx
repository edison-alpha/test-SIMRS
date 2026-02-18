import { useState } from 'react'
import { Search, X, Filter, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { DatePicker } from '@/components/date-picker'
import { cn } from '@/lib/utils'
import type { PatientFilters } from '@/features/simrs/hooks/use-patient-store'

/**
 * Patient Search Form Component
 * Provides advanced search and filtering capabilities for patient list
 * Requirement 2.4: Search and Filter
 * 
 * Features:
 * - Quick search by: NIK, No. RM, Nama, Nomor Registrasi
 * - Advanced filters: Status, Kelas Perawatan, Cara Bayar, Tanggal Masuk range
 * - Active filters displayed as removable chips
 * - Clear all filters button
 */

interface PatientSearchFormProps {
  onSearch: (query: string) => void
  onFilter: (filters: PatientFilters) => void
  searchQuery: string
  activeFilters: PatientFilters
}

export function PatientSearchForm({
  onSearch,
  onFilter,
  searchQuery,
  activeFilters,
}: PatientSearchFormProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery)
  const [localFilters, setLocalFilters] = useState<PatientFilters>(activeFilters)

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setLocalSearchQuery(value)
    onSearch(value)
  }

  // Handle filter changes
  const handleFilterChange = (
    key: keyof PatientFilters,
    value: PatientFilters[keyof PatientFilters]
  ) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onFilter(newFilters)
  }

  // Handle multi-select filter changes
  const handleMultiSelectChange = (
    key: 'kelasPerawatan' | 'caraBayar',
    value: string
  ) => {
    const currentValues = localFilters[key] || []
    const newValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value]
    
    handleFilterChange(key, newValues.length > 0 ? newValues : undefined)
  }

  // Clear all filters
  const handleClearAll = () => {
    setLocalSearchQuery('')
    setLocalFilters({})
    onSearch('')
    onFilter({})
  }

  // Remove individual filter
  const handleRemoveFilter = (key: keyof PatientFilters, value?: string) => {
    if (key === 'kelasPerawatan' || key === 'caraBayar') {
      if (value) {
        const currentValues = localFilters[key] || []
        const newValues = currentValues.filter((v) => v !== value)
        handleFilterChange(key, newValues.length > 0 ? newValues : undefined)
      }
    } else {
      const newFilters = { ...localFilters }
      delete newFilters[key]
      setLocalFilters(newFilters)
      onFilter(newFilters)
    }
  }

  // Count active filters
  const activeFilterCount = Object.entries(localFilters).reduce((count, [key, value]) => {
    if (key === 'kelasPerawatan' || key === 'caraBayar') {
      return count + (Array.isArray(value) ? value.length : 0)
    }
    return count + (value !== undefined ? 1 : 0)
  }, 0)

  // Check if any filters are active
  const hasActiveFilters = activeFilterCount > 0 || localSearchQuery.trim() !== ''

  return (
    <div className='space-y-4'>
      {/* Quick Search */}
      <div className='flex gap-2'>
        <div className='relative flex-1'>
          <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
          <Input
            placeholder='Cari NIK, No. RM, nama, atau nomor registrasi...'
            value={localSearchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className='pl-9'
          />
          {localSearchQuery && (
            <Button
              variant='ghost'
              size='sm'
              className='absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0'
              onClick={() => handleSearchChange('')}
            >
              <X className='h-4 w-4' />
            </Button>
          )}
        </div>
        
        {/* Advanced Filter Toggle */}
        <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
          <CollapsibleTrigger asChild>
            <Button variant='outline' className='gap-2'>
              <Filter className='h-4 w-4' />
              Filter
              {activeFilterCount > 0 && (
                <Badge variant='secondary' className='ml-1 px-1.5'>
                  {activeFilterCount}
                </Badge>
              )}
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform',
                  isAdvancedOpen && 'rotate-180'
                )}
              />
            </Button>
          </CollapsibleTrigger>
        </Collapsible>

        {/* Clear All Button */}
        {hasActiveFilters && (
          <Button
            variant='ghost'
            size='sm'
            onClick={handleClearAll}
            className='gap-2'
          >
            <X className='h-4 w-4' />
            Hapus Semua
          </Button>
        )}
      </div>

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div className='flex flex-wrap gap-2'>
          {localSearchQuery && (
            <Badge variant='secondary' className='gap-1 pr-1'>
              Pencarian: {localSearchQuery}
              <Button
                variant='ghost'
                size='sm'
                className='h-4 w-4 p-0 hover:bg-transparent'
                onClick={() => handleSearchChange('')}
              >
                <X className='h-3 w-3' />
              </Button>
            </Badge>
          )}
          
          {localFilters.status && (
            <Badge variant='secondary' className='gap-1 pr-1'>
              Status: {localFilters.status}
              <Button
                variant='ghost'
                size='sm'
                className='h-4 w-4 p-0 hover:bg-transparent'
                onClick={() => handleRemoveFilter('status')}
              >
                <X className='h-3 w-3' />
              </Button>
            </Badge>
          )}
          
          {localFilters.kelasPerawatan?.map((kelas) => (
            <Badge key={kelas} variant='secondary' className='gap-1 pr-1'>
              Kelas: {kelas}
              <Button
                variant='ghost'
                size='sm'
                className='h-4 w-4 p-0 hover:bg-transparent'
                onClick={() => handleRemoveFilter('kelasPerawatan', kelas)}
              >
                <X className='h-3 w-3' />
              </Button>
            </Badge>
          ))}
          
          {localFilters.caraBayar?.map((cara) => (
            <Badge key={cara} variant='secondary' className='gap-1 pr-1'>
              Cara Bayar: {cara}
              <Button
                variant='ghost'
                size='sm'
                className='h-4 w-4 p-0 hover:bg-transparent'
                onClick={() => handleRemoveFilter('caraBayar', cara)}
              >
                <X className='h-3 w-3' />
              </Button>
            </Badge>
          ))}
          
          {localFilters.tanggalMasukStart && (
            <Badge variant='secondary' className='gap-1 pr-1'>
              Dari: {new Date(localFilters.tanggalMasukStart).toLocaleDateString('id-ID')}
              <Button
                variant='ghost'
                size='sm'
                className='h-4 w-4 p-0 hover:bg-transparent'
                onClick={() => handleRemoveFilter('tanggalMasukStart')}
              >
                <X className='h-3 w-3' />
              </Button>
            </Badge>
          )}
          
          {localFilters.tanggalMasukEnd && (
            <Badge variant='secondary' className='gap-1 pr-1'>
              Sampai: {new Date(localFilters.tanggalMasukEnd).toLocaleDateString('id-ID')}
              <Button
                variant='ghost'
                size='sm'
                className='h-4 w-4 p-0 hover:bg-transparent'
                onClick={() => handleRemoveFilter('tanggalMasukEnd')}
              >
                <X className='h-3 w-3' />
              </Button>
            </Badge>
          )}
        </div>
      )}

      {/* Advanced Filters */}
      <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
        <CollapsibleContent className='space-y-4 rounded-md border p-4'>
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            {/* Status Filter */}
            <div className='space-y-2'>
              <Label htmlFor='status-filter'>Status</Label>
              <Select
                value={localFilters.status || 'all'}
                onValueChange={(value) =>
                  handleFilterChange('status', value === 'all' ? undefined : value as 'Aktif' | 'Keluar')
                }
              >
                <SelectTrigger id='status-filter' className='w-full'>
                  <SelectValue placeholder='Semua Status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='all'>Semua Status</SelectItem>
                  <SelectItem value='Aktif'>Aktif</SelectItem>
                  <SelectItem value='Keluar'>Keluar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Kelas Perawatan Filter (Multi-select) */}
            <div className='space-y-2'>
              <Label>Kelas Perawatan</Label>
              <div className='space-y-2'>
                {['VVIP', 'VIP', 'Kelas 1', 'Kelas 2', 'Kelas 3', 'ICU'].map((kelas) => (
                  <label key={kelas} className='flex items-center gap-2 text-sm'>
                    <input
                      type='checkbox'
                      checked={localFilters.kelasPerawatan?.includes(kelas) || false}
                      onChange={() => handleMultiSelectChange('kelasPerawatan', kelas)}
                      className='h-4 w-4 rounded border-gray-300'
                    />
                    {kelas}
                  </label>
                ))}
              </div>
            </div>

            {/* Cara Bayar Filter (Multi-select) */}
            <div className='space-y-2'>
              <Label>Cara Bayar</Label>
              <div className='space-y-2'>
                {[
                  'Umum-Pribadi',
                  'BPJS Kesehatan',
                  'Asuransi Swasta',
                  'Jaminan Perusahaan',
                ].map((cara) => (
                  <label key={cara} className='flex items-center gap-2 text-sm'>
                    <input
                      type='checkbox'
                      checked={localFilters.caraBayar?.includes(cara) || false}
                      onChange={() => handleMultiSelectChange('caraBayar', cara)}
                      className='h-4 w-4 rounded border-gray-300'
                    />
                    {cara}
                  </label>
                ))}
              </div>
            </div>

            {/* Date Range Filter */}
            <div className='space-y-2'>
              <Label>Tanggal Masuk</Label>
              <div className='space-y-2'>
                <div>
                  <Label htmlFor='date-start' className='text-xs text-muted-foreground'>
                    Dari
                  </Label>
                  <DatePicker
                    selected={localFilters.tanggalMasukStart}
                    onSelect={(date) => handleFilterChange('tanggalMasukStart', date)}
                    placeholder='Pilih tanggal awal'
                  />
                </div>
                <div>
                  <Label htmlFor='date-end' className='text-xs text-muted-foreground'>
                    Sampai
                  </Label>
                  <DatePicker
                    selected={localFilters.tanggalMasukEnd}
                    onSelect={(date) => handleFilterChange('tanggalMasukEnd', date)}
                    placeholder='Pilih tanggal akhir'
                  />
                </div>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
