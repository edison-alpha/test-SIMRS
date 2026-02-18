/**
 * Visit Section Component
 * Visit registration data form fields
 * Implements Requirement 1.2: Visit Registration Data
 */

import { useFormContext } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { usePatientStore } from '@/features/simrs/hooks/use-patient-store'
import { format } from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { CalendarIcon, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AdmissionFormData } from '@/features/simrs/data'

/**
 * Mock DPJP (Dokter Penanggung Jawab Pasien) data
 * In production, this would come from a doctor management system
 */
const DPJP_OPTIONS = [
  { value: 'dr-ahmad-sp-pd', label: 'dr. Ahmad Wijaya, Sp.PD' },
  { value: 'dr-siti-sp-og', label: 'dr. Siti Nurhaliza, Sp.OG' },
  { value: 'dr-budi-sp-a', label: 'dr. Budi Santoso, Sp.A' },
  { value: 'dr-rina-sp-jp', label: 'dr. Rina Kusuma, Sp.JP' },
  { value: 'dr-hendra-sp-b', label: 'dr. Hendra Gunawan, Sp.B' },
  { value: 'dr-maya-sp-an', label: 'dr. Maya Sari, Sp.An' },
  { value: 'dr-rudi-sp-s', label: 'dr. Rudi Hartono, Sp.S' },
  { value: 'dr-dewi-sp-m', label: 'dr. Dewi Lestari, Sp.M' },
  { value: 'dr-agus-sp-tht', label: 'dr. Agus Prasetyo, Sp.THT' },
  { value: 'dr-linda-sp-kk', label: 'dr. Linda Wijayanti, Sp.KK' },
]

/**
 * VisitSection - Visit registration data form fields
 * 
 * Features:
 * - Auto-generated Nomor Registrasi (display only in create mode)
 * - Tanggal & Jam Masuk (default to current datetime)
 * - Cara Masuk dropdown (IGD/Rawat Jalan-Poli/Rujukan Luar)
 * - DPJP dropdown/autocomplete
 * - Diagnosa Masuk (mandatory)
 * - Keluhan Utama (optional)
 * - Read-only Nomor Registrasi in edit mode (Requirement 2.3)
 * - Indonesian labels and error messages
 * 
 * Fields (Requirement 1.2):
 * - Nomor Registrasi (auto-generated, unique per visit, read-only in edit)
 * - Tanggal & Jam Masuk (default to current datetime)
 * - Cara Masuk (IGD/Rawat Jalan-Poli/Rujukan Luar)
 * - DPJP (mandatory dropdown/autocomplete)
 * - Diagnosa Masuk (mandatory, ICD-10 code or free text)
 * - Keluhan Utama (optional text area)
 * 
 * Validates: Requirements 1.2, 2.3
 */
export function VisitSection({ isEditMode = false }: { isEditMode?: boolean }) {
  const form = useFormContext<AdmissionFormData>()
  const { generateNomorRegistrasi } = usePatientStore()
  
  // Generate and display Nomor Registrasi (only in create mode)
  const nomorRegistrasi = !isEditMode ? generateNomorRegistrasi() : null
  
  // Watch tanggalJamMasuk for display
  const tanggalJamMasuk = form.watch('tanggalJamMasuk')

  return (
    <div className='space-y-4'>
      {/* Nomor Registrasi (Auto-generated in create mode, display only in edit mode) */}
      {!isEditMode && (
        <div className='rounded-lg border border-border bg-muted/50 p-4'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-medium text-muted-foreground'>
                Nomor Registrasi
              </p>
              <p className='text-lg font-semibold mt-1'>
                {nomorRegistrasi}
              </p>
            </div>
            <div className='text-xs text-muted-foreground'>
              (Otomatis)
            </div>
          </div>
        </div>
      )}

      {/* Tanggal & Jam Masuk */}
      <FormField
        control={form.control}
        name='tanggalJamMasuk'
        render={({ field }) => (
          <FormItem className='flex flex-col'>
            <FormLabel>
              Tanggal & Jam Masuk <span className='text-destructive'>*</span>
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
                      <span className='flex items-center gap-2'>
                        <CalendarIcon className='h-4 w-4 opacity-50' />
                        {format(field.value, 'dd MMMM yyyy', { locale: localeId })}
                        <Clock className='h-4 w-4 opacity-50 ml-2' />
                        {format(field.value, 'HH:mm')}
                      </span>
                    ) : (
                      <span>Pilih tanggal & jam masuk</span>
                    )}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0' align='start'>
                <Calendar
                  mode='single'
                  captionLayout='dropdown'
                  selected={field.value}
                  onSelect={(date) => {
                    if (date) {
                      // Preserve time when selecting date
                      const currentTime = field.value || new Date()
                      date.setHours(currentTime.getHours())
                      date.setMinutes(currentTime.getMinutes())
                      field.onChange(date)
                    }
                  }}
                  disabled={(date) =>
                    date > new Date() || date < new Date('2020-01-01')
                  }
                  locale={localeId}
                  fromYear={2020}
                  toYear={new Date().getFullYear()}
                />
                <div className='p-3 border-t'>
                  <div className='flex items-center gap-2'>
                    <Clock className='h-4 w-4 text-muted-foreground' />
                    <Input
                      type='time'
                      value={field.value ? format(field.value, 'HH:mm') : ''}
                      onChange={(e) => {
                        const [hours, minutes] = e.target.value.split(':')
                        const newDate = field.value ? new Date(field.value) : new Date()
                        newDate.setHours(parseInt(hours, 10))
                        newDate.setMinutes(parseInt(minutes, 10))
                        field.onChange(newDate)
                      }}
                      className='flex-1'
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <FormMessage />
            {tanggalJamMasuk && (
              <p className='text-sm text-muted-foreground'>
                {format(tanggalJamMasuk, "EEEE, dd MMMM yyyy 'pukul' HH:mm", { locale: localeId })}
              </p>
            )}
          </FormItem>
        )}
      />

      {/* Cara Masuk */}
      <FormField
        control={form.control}
        name='caraMasuk'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Cara Masuk <span className='text-destructive'>*</span>
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder='Pilih cara masuk pasien' />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value='IGD'>IGD (Instalasi Gawat Darurat)</SelectItem>
                <SelectItem value='Rawat Jalan-Poli'>Rawat Jalan - Poli</SelectItem>
                <SelectItem value='Rujukan Luar'>Rujukan Luar</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* DPJP (Dokter Penanggung Jawab Pasien) */}
      <FormField
        control={form.control}
        name='dpjp'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Dokter Penanggung Jawab Pasien (DPJP) <span className='text-destructive'>*</span>
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder='Pilih dokter penanggung jawab' />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {DPJP_OPTIONS.map((doctor) => (
                  <SelectItem key={doctor.value} value={doctor.label}>
                    {doctor.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Diagnosa Masuk */}
      <FormField
        control={form.control}
        name='diagnosaMasuk'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Diagnosa Masuk <span className='text-destructive'>*</span>
            </FormLabel>
            <FormControl>
              <Input
                placeholder='Masukkan diagnosa masuk (ICD-10 atau teks bebas)'
                {...field}
              />
            </FormControl>
            <FormMessage />
            <p className='text-xs text-muted-foreground'>
              Contoh: A09 (Diare), J18.9 (Pneumonia), atau deskripsi diagnosa
            </p>
          </FormItem>
        )}
      />

      {/* Keluhan Utama */}
      <FormField
        control={form.control}
        name='keluhanUtama'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Keluhan Utama</FormLabel>
            <FormControl>
              <Textarea
                placeholder='Masukkan keluhan utama pasien (opsional)'
                className='min-h-[100px] resize-none'
                {...field}
              />
            </FormControl>
            <FormMessage />
            <p className='text-xs text-muted-foreground'>
              Keluhan atau gejala yang dirasakan pasien saat masuk
            </p>
          </FormItem>
        )}
      />
    </div>
  )
}
