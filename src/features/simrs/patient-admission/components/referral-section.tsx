/**
 * Referral Section Component
 * Referral data form fields (conditional based on caraMasuk)
 * Implements Requirement 1.3: Referral Data
 */

import { useFormContext } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { format } from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { CalendarIcon, Upload, FileText, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AdmissionFormData } from '@/features/simrs/data'
import { useState, useRef } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'

/**
 * ReferralSection - Referral data form fields
 * 
 * Features:
 * - Conditional rendering based on caraMasuk === 'Rujukan Luar'
 * - Asal Rujukan dropdown
 * - Nama Faskes Perujuk input
 * - Nomor Surat Rujukan input
 * - Tanggal Surat Rujukan date picker
 * - Diagnosa Rujukan textarea
 * - File upload for surat rujukan (images and PDFs)
 * - Indonesian labels and error messages
 * 
 * Fields (Requirement 1.3):
 * - Asal Rujukan (Puskesmas/RS Lain/Klinik/Dokter Pribadi)
 * - Nama Faskes Perujuk (mandatory)
 * - Nomor Surat Rujukan (mandatory)
 * - Tanggal Surat Rujukan (mandatory)
 * - Diagnosa Rujukan (optional)
 * - File Surat Rujukan (optional file upload)
 * 
 * Validates: Requirements 1.3, 1.7
 */
export function ReferralSection() {
  const form = useFormContext<AdmissionFormData>()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string>('')
  
  // Watch caraMasuk to determine if this section should be shown
  const caraMasuk = form.watch('caraMasuk')
  
  // Only show this section if caraMasuk is 'Rujukan Luar'
  if (caraMasuk !== 'Rujukan Luar') {
    return null
  }

  /**
   * Handle file upload
   * Validates file type (images and PDFs) and size (max 5MB)
   */
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Reset errors
    setFileError('')

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      setFileError('Tipe file tidak didukung. Hanya gambar (JPEG, PNG, GIF) dan PDF yang diperbolehkan.')
      return
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB in bytes
    if (file.size > maxSize) {
      setFileError('Ukuran file terlalu besar. Maksimal 5MB.')
      return
    }

    // Store file and create a mock URL
    setUploadedFile(file)
    
    // In production, this would upload to a server and get a URL
    // For now, we'll create a local object URL
    const fileUrl = URL.createObjectURL(file)
    form.setValue('fileSuratRujukan', fileUrl)
  }

  /**
   * Remove uploaded file
   */
  const handleRemoveFile = () => {
    setUploadedFile(null)
    setFileError('')
    form.setValue('fileSuratRujukan', undefined)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  /**
   * Trigger file input click
   */
  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className='space-y-4'>
      {/* Asal Rujukan */}
      <FormField
        control={form.control}
        name='asalRujukan'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Asal Rujukan <span className='text-destructive'>*</span>
            </FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder='Pilih asal rujukan' />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value='Puskesmas'>Puskesmas</SelectItem>
                <SelectItem value='RS Lain'>Rumah Sakit Lain</SelectItem>
                <SelectItem value='Klinik'>Klinik</SelectItem>
                <SelectItem value='Dokter Pribadi'>Dokter Pribadi</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Nama Faskes Perujuk */}
      <FormField
        control={form.control}
        name='namaFaskesPerujuk'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Nama Fasilitas Kesehatan Perujuk <span className='text-destructive'>*</span>
            </FormLabel>
            <FormControl>
              <Input
                placeholder='Masukkan nama faskes perujuk'
                {...field}
              />
            </FormControl>
            <FormMessage />
            <p className='text-xs text-muted-foreground'>
              Contoh: Puskesmas Cibinong, RS Siloam, Klinik Sehat Sentosa
            </p>
          </FormItem>
        )}
      />

      {/* Nomor Surat Rujukan */}
      <FormField
        control={form.control}
        name='nomorSuratRujukan'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Nomor Surat Rujukan <span className='text-destructive'>*</span>
            </FormLabel>
            <FormControl>
              <Input
                placeholder='Masukkan nomor surat rujukan'
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Tanggal Surat Rujukan */}
      <FormField
        control={form.control}
        name='tanggalSuratRujukan'
        render={({ field }) => (
          <FormItem className='flex flex-col'>
            <FormLabel>
              Tanggal Surat Rujukan <span className='text-destructive'>*</span>
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
                      <span>Pilih tanggal surat rujukan</span>
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
                    date > new Date() || date < new Date('2020-01-01')
                  }
                  initialFocus
                  locale={localeId}
                  fromYear={2020}
                  toYear={new Date().getFullYear()}
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Diagnosa Rujukan */}
      <FormField
        control={form.control}
        name='diagnosaRujukan'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Diagnosa Rujukan</FormLabel>
            <FormControl>
              <Textarea
                placeholder='Masukkan diagnosa rujukan (opsional)'
                className='min-h-[100px] resize-none'
                {...field}
              />
            </FormControl>
            <FormMessage />
            <p className='text-xs text-muted-foreground'>
              Diagnosa yang tercantum dalam surat rujukan
            </p>
          </FormItem>
        )}
      />

      {/* File Surat Rujukan */}
      <FormField
        control={form.control}
        name='fileSuratRujukan'
        render={() => (
          <FormItem>
            <FormLabel>File Surat Rujukan</FormLabel>
            <FormControl>
              <div className='space-y-2'>
                <input
                  ref={fileInputRef}
                  type='file'
                  accept='image/jpeg,image/jpg,image/png,image/gif,application/pdf'
                  onChange={handleFileUpload}
                  className='hidden'
                />
                
                {!uploadedFile ? (
                  <Button
                    type='button'
                    variant='outline'
                    className='w-full'
                    onClick={handleUploadClick}
                  >
                    <Upload className='mr-2 h-4 w-4' />
                    Unggah File Surat Rujukan
                  </Button>
                ) : (
                  <div className='flex items-center gap-2 p-3 border border-border rounded-md bg-muted/50'>
                    <FileText className='h-5 w-5 text-muted-foreground' />
                    <div className='flex-1 min-w-0'>
                      <p className='text-sm font-medium truncate'>
                        {uploadedFile.name}
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        {(uploadedFile.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      onClick={handleRemoveFile}
                    >
                      <X className='h-4 w-4' />
                    </Button>
                  </div>
                )}
              </div>
            </FormControl>
            <FormMessage />
            {fileError && (
              <Alert variant='destructive' className='mt-2'>
                <AlertDescription>{fileError}</AlertDescription>
              </Alert>
            )}
            <p className='text-xs text-muted-foreground'>
              Format: JPEG, PNG, GIF, PDF. Maksimal 5MB.
            </p>
          </FormItem>
        )}
      />
    </div>
  )
}
