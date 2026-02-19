/**
 * Identity Section Component
 * Patient identity data form fields
 * Implements Requirement 1.1: Patient Identity Data
 */

import { useFormContext } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { usePatientStore } from '@/features/simrs/hooks/use-patient-store'
import { differenceInYears, format } from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { CalendarIcon, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Alert, AlertDescription } from '@/components/ui/alert'
import type { AdmissionFormData } from '@/features/simrs/data'

/**
 * IdentitySection - Patient identity data form fields
 * 
 * Features:
 * - Auto-generated No. RM (display only in create mode)
 * - NIK validation (16 digits)
 * - NIK uniqueness check (only in create mode)
 * - Age auto-calculation from tanggalLahir
 * - Read-only No. RM in edit mode (Requirement 2.3)
 * - Indonesian labels and error messages
 * 
 * Fields (Requirement 1.1):
 * - No. RM (auto-generated, unique, read-only in edit)
 * - NIK (16-digit validation, mandatory)
 * - Nama Lengkap (mandatory)
 * - Tempat Lahir (optional)
 * - Tanggal Lahir (mandatory, auto-calculate age)
 * - Jenis Kelamin (Laki-laki/Perempuan)
 * - No. Handphone (mandatory)
 * - Alamat Domisili (mandatory)
 * 
 * Validates: Requirements 1.1, 1.7, 2.3
 */
export function IdentitySection({ isEditMode = false }: { isEditMode?: boolean }) {
  const form = useFormContext<AdmissionFormData>()
  const { generateNoRM, getPatientByNIK } = usePatientStore()
  
  // Generate and display No. RM (only in create mode)
  const noRM = !isEditMode ? generateNoRM() : null
  
  // Watch NIK for uniqueness check NIK HARUS 16
  const nik = form.watch('nik')
  const nikExists = nik && nik.length === 16 ? getPatientByNIK(nik) : null
  
  // Watch tanggalLahir for age calculation
  const tanggalLahir = form.watch('tanggalLahir')
  const age = tanggalLahir ? differenceInYears(new Date(), tanggalLahir) : null

  return (
    <div className='space-y-4'>
      {/* No. RM (Auto-generated in create mode, display only in edit mode) */}
      {!isEditMode && (
        <div className='rounded-lg border border-border bg-muted/50 p-4'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>
                Nomor Rekam Medis (No. RM)
              </p>
              <p className='text-lg font-semibold mt-1'>
                {noRM}
              </p>
            </div>
            <div className='text-xs text-muted-foreground'>
              (Otomatis)
            </div>
          </div>
        </div>
      )}

      {/* NIK */}
      <FormField
        control={form.control}
        name='nik'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Nomor Induk Kependudukan (NIK) <span className='text-destructive'>*</span>
            </FormLabel>
            <FormControl>
              <Input
                placeholder='Masukkan 16 digit NIK'
                maxLength={16}
                {...field}
                onChange={(e) => {
                  // Only allow numbers
                  const value = e.target.value.replace(/\D/g, '')
                  field.onChange(value)
                }}
              />
            </FormControl>
            <FormMessage />
            {!isEditMode && nikExists && (
              <Alert variant='destructive' className='mt-2'>
                <AlertCircle className='h-4 w-4' />
                <AlertDescription>
                  NIK sudah terdaftar dalam sistem dengan No. RM: {nikExists.noRM}
                </AlertDescription>
              </Alert>
            )}
          </FormItem>
        )}
      />

      {/* Nama Lengkap */}
      <FormField
        control={form.control}
        name='namaLengkap'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Nama Lengkap <span className='text-destructive'>*</span>
            </FormLabel>
            <FormControl>
              <Input
                placeholder='Masukkan nama lengkap pasien'
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Tempat Lahir & Tanggal Lahir (side by side) */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {/* Tempat Lahir */}
        <FormField
          control={form.control}
          name='tempatLahir'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tempat Lahir</FormLabel>
              <FormControl>
                <Input
                  placeholder='Masukkan tempat lahir'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Tanggal Lahir */}
        <FormField
          control={form.control}
          name='tanggalLahir'
          render={({ field }) => (
            <FormItem className='flex flex-col'>
              <FormLabel>
                Tanggal Lahir <span className='text-destructive'>*</span>
              </FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant='outline'
                      className={cn(
                        'w-full pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                    >
                      {field.value ? (
                        format(field.value, 'dd MMMM yyyy', { locale: localeId })
                      ) : (
                        <span>Pilih tanggal lahir</span>
                      )}
                      <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <Calendar
                    mode='single'
                    captionLayout='dropdown'
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date('1900-01-01')
                    }
                    initialFocus
                    locale={localeId}
                    fromYear={1900}
                    toYear={new Date().getFullYear()}
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
              {age !== null && (
                <p className='text-sm text-muted-foreground'>
                  Umur: {age} tahun
                </p>
              )}
            </FormItem>
          )}
        />
      </div>

      {/* Jenis Kelamin */}
      <FormField
        control={form.control}
        name='jenisKelamin'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Jenis Kelamin <span className='text-destructive'>*</span>
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder='Pilih jenis kelamin' />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value='Laki-laki'>Laki-laki</SelectItem>
                <SelectItem value='Perempuan'>Perempuan</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* No. Handphone */}
      <FormField
        control={form.control}
        name='noHandphone'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              No. Handphone <span className='text-destructive'>*</span>
            </FormLabel>
            <FormControl>
              <Input
                placeholder='Contoh: 081234567890'
                maxLength={15}
                {...field}
                onChange={(e) => {
                  // Only allow numbers
                  const value = e.target.value.replace(/\D/g, '')
                  field.onChange(value)
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Alamat Domisili */}
      <FormField
        control={form.control}
        name='alamatDomisili'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Alamat Domisili <span className='text-destructive'>*</span>
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder='Masukkan alamat lengkap domisili pasien'
                className='min-h-[100px] resize-none'
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
