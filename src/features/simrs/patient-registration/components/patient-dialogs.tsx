/**
 * Patient Dialogs
 * Form dialog for creating and editing patients, and delete confirmation dialog
 */

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { DatePicker } from '@/components/date-picker'
import { patientFormSchema, type PatientFormData } from '@/features/simrs/data'
import { usePatientStore } from '@/features/simrs/hooks/use-patient-store'
import { usePatientRegistration } from './patient-registration-provider'

/**
 * Patient Form Dialog
 * Handles both create and edit modes for patient data
 */
export function PatientDialogs() {
  const { open, setOpen, currentRow } = usePatientRegistration()
  const { addPatient, updatePatient } = usePatientStore()
  
  const isEdit = open === 'edit' && !!currentRow
  const isOpen = open === 'create' || open === 'edit'

  const form = useForm<PatientFormData>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      name: '',
      dateOfBirth: undefined,
      gender: 'Laki-laki',
      address: '',
      phoneNumber: '',
      emergencyContact: '',
    },
  })

  // Reset form when dialog opens/closes or currentRow changes
  useEffect(() => {
    if (isEdit && currentRow) {
      form.reset({
        name: currentRow.name,
        dateOfBirth: currentRow.dateOfBirth,
        gender: currentRow.gender,
        address: currentRow.address,
        phoneNumber: currentRow.phoneNumber,
        emergencyContact: currentRow.emergencyContact,
      })
    } else if (open === 'create') {
      form.reset({
        name: '',
        dateOfBirth: undefined,
        gender: 'Laki-laki',
        address: '',
        phoneNumber: '',
        emergencyContact: '',
      })
    }
  }, [open, currentRow, isEdit, form])

  const onSubmit = (values: PatientFormData) => {
    try {
      if (isEdit && currentRow) {
        // Update existing patient
        updatePatient(currentRow.id, values)
        toast.success('Data pasien berhasil diperbarui', {
          description: `Data pasien ${values.name || values.namaLengkap} telah diperbarui.`,
        })
      } else {
        // Create new patient
        addPatient(values)
        toast.success('Pasien berhasil ditambahkan', {
          description: `Pasien ${values.name || values.namaLengkap} telah ditambahkan ke sistem.`,
        })
      }
      
      form.reset()
      setOpen(null)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui'
      toast.error('Gagal menyimpan data pasien', {
        description: `${errorMessage}. Silakan periksa kembali data yang diisi atau hubungi administrator.`,
      })
      console.error('Error saving patient:', error)
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset()
      setOpen(null)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className='sm:max-w-2xl'>
        <DialogHeader className='text-start'>
          <DialogTitle>
            {isEdit ? 'Edit Pasien' : 'Tambah Pasien Baru'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Perbarui data pasien di sini. Klik simpan setelah selesai.'
              : 'Buat data pasien baru di sini. Klik simpan setelah selesai.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className='max-h-[60vh] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id='patient-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
              {/* Name Field */}
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-1 sm:grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='sm:col-span-2 sm:text-end'>
                      Nama
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Nama lengkap pasien'
                        className='sm:col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='sm:col-span-4 sm:col-start-3' />
                  </FormItem>
                )}
              />

              {/* Date of Birth Field */}
              <FormField
                control={form.control}
                name='dateOfBirth'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-1 sm:grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='sm:col-span-2 sm:text-end'>
                      Tanggal Lahir
                    </FormLabel>
                    <FormControl>
                      <div className='sm:col-span-4'>
                        <DatePicker
                          selected={field.value}
                          onSelect={field.onChange}
                          placeholder='Pilih tanggal lahir'
                        />
                      </div>
                    </FormControl>
                    <FormMessage className='sm:col-span-4 sm:col-start-3' />
                  </FormItem>
                )}
              />

              {/* Gender Field */}
              <FormField
                control={form.control}
                name='gender'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-1 sm:grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='sm:col-span-2 sm:text-end'>
                      Jenis Kelamin
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className='sm:col-span-4 flex gap-4'
                      >
                        <div className='flex items-center space-x-2'>
                          <RadioGroupItem value='Laki-laki' id='male' />
                          <label
                            htmlFor='male'
                            className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                          >
                            Laki-laki
                          </label>
                        </div>
                        <div className='flex items-center space-x-2'>
                          <RadioGroupItem value='Perempuan' id='female' />
                          <label
                            htmlFor='female'
                            className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                          >
                            Perempuan
                          </label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage className='sm:col-span-4 sm:col-start-3' />
                  </FormItem>
                )}
              />

              {/* Address Field */}
              <FormField
                control={form.control}
                name='address'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-1 sm:grid-cols-6 items-start space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='sm:col-span-2 sm:text-end sm:pt-2'>
                      Alamat
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Alamat lengkap pasien'
                        className='sm:col-span-4 resize-none'
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='sm:col-span-4 sm:col-start-3' />
                  </FormItem>
                )}
              />

              {/* Phone Number Field */}
              <FormField
                control={form.control}
                name='phoneNumber'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-1 sm:grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='sm:col-span-2 sm:text-end'>
                      No. Telepon
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='08123456789'
                        className='sm:col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='sm:col-span-4 sm:col-start-3' />
                  </FormItem>
                )}
              />

              {/* Emergency Contact Field */}
              <FormField
                control={form.control}
                name='emergencyContact'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-1 sm:grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='sm:col-span-2 sm:text-end'>
                      Kontak Darurat
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='08123456789'
                        className='sm:col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='sm:col-span-4 sm:col-start-3' />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        <DialogFooter>
          <Button type='submit' form='patient-form'>
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/**
 * Delete Confirmation Dialog
 * Confirms patient deletion with Indonesian messages
 */
export function DeleteConfirmDialog() {
  const { open, setOpen, currentRow } = usePatientRegistration()
  const { deletePatient } = usePatientStore()
  
  const isOpen = open === 'delete'

  const handleConfirm = () => {
    if (currentRow) {
      try {
        deletePatient(currentRow.id)
        toast.success('Pasien berhasil dihapus', {
          description: `Data pasien ${currentRow.name} telah dihapus dari sistem.`,
        })
        setOpen(null)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui'
        toast.error('Gagal menghapus pasien', {
          description: `${errorMessage}. Silakan coba lagi atau hubungi administrator.`,
        })
        console.error('Error deleting patient:', error)
      }
    }
  }

  const handleCancel = () => {
    setOpen(null)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader className='text-start'>
          <DialogTitle>Konfirmasi Hapus</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menghapus pasien{' '}
            <span className='font-semibold text-foreground'>
              {currentRow?.name}
            </span>
            ? Tindakan ini tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className='gap-2 sm:gap-0'>
          <Button
            type='button'
            variant='outline'
            onClick={handleCancel}
          >
            Batal
          </Button>
          <Button
            type='button'
            variant='destructive'
            onClick={handleConfirm}
          >
            Hapus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
