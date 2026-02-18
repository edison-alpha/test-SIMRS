/**
 * Room Dialogs
 * Form dialog for creating and editing rooms, and delete confirmation dialog
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  roomFormSchema,
  roomTypeOptions,
  roomStatusOptions,
  type RoomFormData,
} from '@/features/simrs/data/room-schema'
import { useRoomStore } from '@/features/simrs/hooks/use-room-store'
import { useRoomManagement } from './room-management-provider'

/**
 * Room Form Dialog
 * Handles both create and edit modes for room data
 */
export function RoomDialogs() {
  const { open, setOpen, currentRow } = useRoomManagement()
  const { addRoom, updateRoom, isRoomNumberUnique } = useRoomStore()
  
  const isEdit = open === 'edit' && !!currentRow
  const isOpen = open === 'create' || open === 'edit'

  const form = useForm<RoomFormData>({
    resolver: zodResolver(roomFormSchema),
    defaultValues: {
      roomNumber: '',
      roomType: '',
      floor: 1,
      capacity: 1,
      status: 'Tersedia',
    },
  })

  // Reset form when dialog opens/closes or currentRow changes
  useEffect(() => {
    if (isEdit && currentRow) {
      form.reset({
        roomNumber: currentRow.roomNumber,
        roomType: currentRow.roomType,
        floor: currentRow.floor,
        capacity: currentRow.capacity,
        status: currentRow.status,
      })
    } else if (open === 'create') {
      form.reset({
        roomNumber: '',
        roomType: '',
        floor: 1,
        capacity: 1,
        status: 'Tersedia',
      })
    }
  }, [open, currentRow, isEdit, form])

  const onSubmit = (values: RoomFormData) => {
    try {
      // Validate room number uniqueness
      if (!isRoomNumberUnique(values.roomNumber, currentRow?.id)) {
        form.setError('roomNumber', {
          type: 'manual',
          message: 'Nomor kamar sudah digunakan. Silakan gunakan nomor kamar yang berbeda.',
        })
        toast.error('Nomor kamar sudah terdaftar', {
          description: 'Silakan gunakan nomor kamar yang berbeda atau periksa data kamar yang sudah ada.',
        })
        return
      }

      if (isEdit && currentRow) {
        // Update existing room
        updateRoom(currentRow.id, values)
        toast.success('Kamar berhasil diperbarui', {
          description: `Data kamar ${values.roomNumber} telah diperbarui.`,
        })
      } else {
        // Create new room
        addRoom(values)
        toast.success('Kamar berhasil ditambahkan', {
          description: `Kamar ${values.roomNumber} telah ditambahkan ke sistem.`,
        })
      }
      
      form.reset()
      setOpen(null)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui'
      toast.error('Gagal menyimpan data kamar', {
        description: `${errorMessage}. Silakan coba lagi atau hubungi administrator.`,
      })
      console.error('Error saving room:', error)
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
            {isEdit ? 'Edit Kamar' : 'Tambah Kamar Baru'}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Perbarui data kamar di sini. Klik simpan setelah selesai.'
              : 'Buat data kamar baru di sini. Klik simpan setelah selesai.'}
          </DialogDescription>
        </DialogHeader>
        
        <div className='max-h-[60vh] overflow-y-auto py-1 pe-3'>
          <Form {...form}>
            <form
              id='room-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 px-0.5'
            >
              {/* Room Number Field */}
              <FormField
                control={form.control}
                name='roomNumber'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-1 sm:grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='sm:col-span-2 sm:text-end'>
                      No. Kamar
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Contoh: 101, A-201'
                        className='sm:col-span-4'
                        autoComplete='off'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className='sm:col-span-4 sm:col-start-3' />
                  </FormItem>
                )}
              />

              {/* Room Type Field */}
              <FormField
                control={form.control}
                name='roomType'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-1 sm:grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='sm:col-span-2 sm:text-end'>
                      Tipe Kamar
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='sm:col-span-4'>
                          <SelectValue placeholder='Pilih tipe kamar' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roomTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className='sm:col-span-4 sm:col-start-3' />
                  </FormItem>
                )}
              />

              {/* Floor Field */}
              <FormField
                control={form.control}
                name='floor'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-1 sm:grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='sm:col-span-2 sm:text-end'>
                      Lantai
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='1'
                        className='sm:col-span-4'
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormMessage className='sm:col-span-4 sm:col-start-3' />
                  </FormItem>
                )}
              />

              {/* Capacity Field */}
              <FormField
                control={form.control}
                name='capacity'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-1 sm:grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='sm:col-span-2 sm:text-end'>
                      Kapasitas
                    </FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='1'
                        className='sm:col-span-4'
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                      />
                    </FormControl>
                    <FormMessage className='sm:col-span-4 sm:col-start-3' />
                  </FormItem>
                )}
              />

              {/* Status Field */}
              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem className='grid grid-cols-1 sm:grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='sm:col-span-2 sm:text-end'>
                      Status
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='sm:col-span-4'>
                          <SelectValue placeholder='Pilih status kamar' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roomStatusOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className='sm:col-span-4 sm:col-start-3' />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        <DialogFooter>
          <Button type='submit' form='room-form'>
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/**
 * Delete Confirmation Dialog
 * Confirms room deletion with Indonesian messages
 * Prevents deletion of occupied rooms
 */
export function DeleteRoomConfirmDialog() {
  const { open, setOpen, currentRow } = useRoomManagement()
  const { deleteRoom, canDeleteRoom } = useRoomStore()
  
  const isOpen = open === 'delete'
  const isOccupied = currentRow?.status === 'Terisi'

  const handleConfirm = () => {
    if (currentRow) {
      try {
        // Check if room can be deleted
        if (!canDeleteRoom(currentRow.id)) {
          toast.error('Kamar tidak dapat dihapus', {
            description: 'Kamar sedang terisi oleh pasien. Silakan kosongkan kamar terlebih dahulu.',
          })
          return
        }

        const success = deleteRoom(currentRow.id)
        if (success) {
          toast.success('Kamar berhasil dihapus', {
            description: `Kamar ${currentRow.roomNumber} telah dihapus dari sistem.`,
          })
          setOpen(null)
        } else {
          toast.error('Gagal menghapus kamar', {
            description: 'Terjadi kesalahan saat menghapus kamar. Silakan coba lagi.',
          })
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan yang tidak diketahui'
        toast.error('Gagal menghapus kamar', {
          description: `${errorMessage}. Silakan coba lagi atau hubungi administrator.`,
        })
        console.error('Error deleting room:', error)
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
          <DialogTitle>
            {isOccupied ? 'Tidak Dapat Menghapus' : 'Konfirmasi Hapus'}
          </DialogTitle>
          <DialogDescription>
            {isOccupied ? (
              <>
                Kamar{' '}
                <span className='font-semibold text-foreground'>
                  {currentRow?.roomNumber}
                </span>{' '}
                tidak dapat dihapus karena sedang terisi. Silakan kosongkan kamar
                terlebih dahulu.
              </>
            ) : (
              <>
                Apakah Anda yakin ingin menghapus kamar{' '}
                <span className='font-semibold text-foreground'>
                  {currentRow?.roomNumber}
                </span>
                ? Tindakan ini tidak dapat dibatalkan.
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className='gap-2 sm:gap-0'>
          {isOccupied ? (
            <Button
              type='button'
              onClick={handleCancel}
            >
              Tutup
            </Button>
          ) : (
            <>
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
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
