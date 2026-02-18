/**
 * Guarantor Section Component
 * Guarantor information form fields
 * Implements Requirement 1.5: Guarantor Information
 */

import { useFormContext } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import type { AdmissionFormData } from '@/features/simrs/data'
import { useState } from 'react'

/**
 * GuarantorSection - Guarantor information form fields
 * 
 * Features:
 * - Nama Penanggung Jawab (mandatory)
 * - Hubungan dengan Pasien dropdown (mandatory)
 * - No. HP Penanggung Jawab (mandatory)
 * - Alamat Penanggung Jawab (optional)
 * - "Same as patient" checkbox for address
 * - Indonesian labels and error messages
 * 
 * Fields (Requirement 1.5):
 * - Nama Penanggung Jawab (mandatory)
 * - Hubungan dengan Pasien (Suami/Istri/Orang Tua/Anak/Saudara/Lainnya)
 * - No. HP Penanggung Jawab (mandatory)
 * - Alamat Penanggung Jawab (optional if same as patient)
 * 
 * Validates: Requirements 1.5
 */
export function GuarantorSection() {
  const form = useFormContext<AdmissionFormData>()
  const [sameAsPatient, setSameAsPatient] = useState(false)
  
  // Watch patient address for "same as patient" functionality
  const alamatDomisili = form.watch('alamatDomisili')

  /**
   * Handle "Same as patient" checkbox change
   * Copies patient address to guarantor address when checked
   */
  const handleSameAsPatientChange = (checked: boolean) => {
    setSameAsPatient(checked)
    if (checked && alamatDomisili) {
      form.setValue('alamatPenanggungJawab', alamatDomisili)
    } else if (!checked) {
      form.setValue('alamatPenanggungJawab', '')
    }
  }

  return (
    <div className='space-y-4'>
      {/* Nama Penanggung Jawab */}
      <FormField
        control={form.control}
        name='namaPenanggungJawab'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Nama Penanggung Jawab <span className='text-destructive'>*</span>
            </FormLabel>
            <FormControl>
              <Input
                placeholder='Masukkan nama penanggung jawab'
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Hubungan dengan Pasien */}
      <FormField
        control={form.control}
        name='hubunganDenganPasien'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Hubungan dengan Pasien <span className='text-destructive'>*</span>
            </FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder='Pilih hubungan dengan pasien' />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value='Suami'>Suami</SelectItem>
                <SelectItem value='Istri'>Istri</SelectItem>
                <SelectItem value='Orang Tua'>Orang Tua</SelectItem>
                <SelectItem value='Anak'>Anak</SelectItem>
                <SelectItem value='Saudara'>Saudara</SelectItem>
                <SelectItem value='Lainnya'>Lainnya</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* No. HP Penanggung Jawab */}
      <FormField
        control={form.control}
        name='noHPPenanggungJawab'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              No. HP Penanggung Jawab <span className='text-destructive'>*</span>
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

      {/* Alamat Penanggung Jawab */}
      <FormField
        control={form.control}
        name='alamatPenanggungJawab'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Alamat Penanggung Jawab</FormLabel>
            
            {/* "Same as patient" checkbox */}
            <div className='flex items-center space-x-2 mb-2'>
              <Checkbox
                id='sameAsPatient'
                checked={sameAsPatient}
                onCheckedChange={handleSameAsPatientChange}
                disabled={!alamatDomisili}
              />
              <label
                htmlFor='sameAsPatient'
                className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer'
              >
                Sama dengan alamat pasien
              </label>
            </div>
            
            <FormControl>
              <Textarea
                placeholder='Masukkan alamat lengkap penanggung jawab'
                className='min-h-[100px] resize-none'
                disabled={sameAsPatient}
                {...field}
              />
            </FormControl>
            <FormMessage />
            {sameAsPatient && (
              <p className='text-xs text-muted-foreground'>
                Alamat otomatis diisi dari alamat domisili pasien
              </p>
            )}
          </FormItem>
        )}
      />

      {/* Summary info */}
      {form.watch('namaPenanggungJawab') && form.watch('hubunganDenganPasien') && (
        <div className='rounded-lg border border-border bg-muted/50 p-4'>
          <p className='text-sm font-medium text-muted-foreground mb-2'>
            Ringkasan Penanggung Jawab
          </p>
          <div className='space-y-1 text-sm'>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Nama:</span>
              <span className='font-medium'>{form.watch('namaPenanggungJawab')}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Hubungan:</span>
              <span className='font-medium'>{form.watch('hubunganDenganPasien')}</span>
            </div>
            {form.watch('noHPPenanggungJawab') && (
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>No. HP:</span>
                <span className='font-medium'>{form.watch('noHPPenanggungJawab')}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
