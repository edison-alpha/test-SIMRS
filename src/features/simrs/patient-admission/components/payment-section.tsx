/**
 * Payment Section Component
 * Payment guarantee form fields
 * Implements Requirement 1.6: Payment Guarantee
 */

import { useFormContext } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { AdmissionFormData } from '@/features/simrs/data'

/**
 * PaymentSection - Payment guarantee form fields
 * 
 * Features:
 * - Cara Bayar dropdown (mandatory)
 * - Nomor Kartu/Polis (conditional - mandatory if not Umum-Pribadi)
 * - Kelas Hak Rawat (conditional - mandatory for BPJS Kesehatan)
 * - Conditional field rendering based on payment method
 * - Indonesian labels and error messages
 * 
 * Fields (Requirement 1.6):
 * - Cara Bayar (Umum-Pribadi/BPJS Kesehatan/Asuransi Swasta/Jaminan Perusahaan)
 * - Nomor Kartu/Polis (mandatory if not Umum)
 * - Kelas Hak Rawat (mandatory for BPJS, Kelas 1/2/3)
 * 
 * Validates: Requirements 1.6
 */
export function PaymentSection() {
  const form = useFormContext<AdmissionFormData>()
  
  // Watch caraBayar to conditionally show fields
  const caraBayar = form.watch('caraBayar')
  
  // Determine if card/policy number should be shown
  const showNomorKartuPolis = caraBayar && caraBayar !== 'Umum-Pribadi'
  
  // Determine if BPJS class entitlement should be shown
  const showKelasHakRawat = caraBayar === 'BPJS Kesehatan'

  return (
    <div className='space-y-4'>
      {/* Cara Bayar */}
      <FormField
        control={form.control}
        name='caraBayar'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Cara Bayar <span className='text-destructive'>*</span>
            </FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder='Pilih cara bayar' />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value='Umum-Pribadi'>Umum-Pribadi</SelectItem>
                <SelectItem value='BPJS Kesehatan'>BPJS Kesehatan</SelectItem>
                <SelectItem value='Asuransi Swasta'>Asuransi Swasta</SelectItem>
                <SelectItem value='Jaminan Perusahaan'>Jaminan Perusahaan</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Nomor Kartu/Polis - Conditional */}
      {showNomorKartuPolis && (
        <FormField
          control={form.control}
          name='nomorKartuPolis'
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Nomor Kartu/Polis <span className='text-destructive'>*</span>
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={
                    caraBayar === 'BPJS Kesehatan'
                      ? 'Masukkan nomor kartu BPJS'
                      : caraBayar === 'Asuransi Swasta'
                      ? 'Masukkan nomor polis asuransi'
                      : 'Masukkan nomor kartu/polis'
                  }
                  {...field}
                />
              </FormControl>
              <FormMessage />
              {caraBayar === 'BPJS Kesehatan' && (
                <p className='text-xs text-muted-foreground'>
                  Contoh: 0001234567890
                </p>
              )}
            </FormItem>
          )}
        />
      )}

      {/* Kelas Hak Rawat - Conditional for BPJS */}
      {showKelasHakRawat && (
        <FormField
          control={form.control}
          name='kelasHakRawat'
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Kelas Hak Rawat <span className='text-destructive'>*</span>
              </FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Pilih kelas hak rawat BPJS' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value='Kelas 1'>Kelas 1</SelectItem>
                  <SelectItem value='Kelas 2'>Kelas 2</SelectItem>
                  <SelectItem value='Kelas 3'>Kelas 3</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
              <p className='text-xs text-muted-foreground'>
                Pilih kelas sesuai dengan kartu BPJS pasien
              </p>
            </FormItem>
          )}
        />
      )}

      {/* Summary info */}
      {caraBayar && (
        <div className='rounded-lg border border-border bg-muted/50 p-4'>
          <p className='text-sm font-medium text-muted-foreground mb-2'>
            Ringkasan Penjaminan Biaya
          </p>
          <div className='space-y-1 text-sm'>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Cara Bayar:</span>
              <span className='font-medium'>{caraBayar}</span>
            </div>
            {showNomorKartuPolis && form.watch('nomorKartuPolis') && (
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Nomor Kartu/Polis:</span>
                <span className='font-medium'>{form.watch('nomorKartuPolis')}</span>
              </div>
            )}
            {showKelasHakRawat && form.watch('kelasHakRawat') && (
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Kelas Hak Rawat:</span>
                <span className='font-medium'>{form.watch('kelasHakRawat')}</span>
              </div>
            )}
          </div>
          
          {/* Payment method specific notes */}
          {caraBayar === 'Umum-Pribadi' && (
            <div className='mt-3 pt-3 border-t border-border'>
              <p className='text-xs text-muted-foreground'>
                ℹ️ Pasien akan membayar sendiri seluruh biaya perawatan
              </p>
            </div>
          )}
          {caraBayar === 'BPJS Kesehatan' && (
            <div className='mt-3 pt-3 border-t border-border'>
              <p className='text-xs text-muted-foreground'>
                ℹ️ Pastikan kartu BPJS aktif dan sesuai dengan kelas hak rawat
              </p>
            </div>
          )}
          {caraBayar === 'Asuransi Swasta' && (
            <div className='mt-3 pt-3 border-t border-border'>
              <p className='text-xs text-muted-foreground'>
                ℹ️ Verifikasi coverage asuransi sebelum melanjutkan perawatan
              </p>
            </div>
          )}
          {caraBayar === 'Jaminan Perusahaan' && (
            <div className='mt-3 pt-3 border-t border-border'>
              <p className='text-xs text-muted-foreground'>
                ℹ️ Pastikan surat jaminan perusahaan sudah diterima
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
