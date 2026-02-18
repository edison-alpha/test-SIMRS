/**
 * Room Placement Section Component
 * Room placement data form fields
 * Implements Requirement 1.4: Room Placement
 */

import { useFormContext } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { AdmissionFormData } from '@/features/simrs/data'
import { useRoomStore } from '@/features/simrs/hooks/use-room-store'
import { useMemo } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Info } from 'lucide-react'

/**
 * Mapping between Kelas Perawatan and Room Types
 * Used to filter rooms based on selected care class
 * Matches the room types generated in generate-mock-data.ts
 */
const KELAS_TO_ROOM_TYPE_MAP: Record<string, string[]> = {
  'VVIP': ['Suite VVIP', 'Presidential Suite'],
  'VIP': ['Suite VIP', 'Deluxe VIP'],
  'Kelas 1': ['Standard Kelas 1', 'Superior Kelas 1'],
  'Kelas 2': ['Standard Kelas 2', 'Economy Kelas 2'],
  'Kelas 3': ['Standard Kelas 3', 'Shared Kelas 3'],
  'ICU': ['ICU Umum', 'ICU Khusus', 'ICCU', 'NICU', 'PICU'],
}

/**
 * RoomPlacementSection - Room placement data form fields
 * 
 * Features:
 * - Kelas Perawatan dropdown (VVIP/VIP/Kelas 1/Kelas 2/Kelas 3/ICU)
 * - Nama Ruangan dropdown (filtered by kelas)
 * - Nomor Bed dropdown (filtered by kelas and availability)
 * - Shows only available beds (status: "Tersedia")
 * - Indonesian labels and error messages
 * - Real-time filtering based on selected kelas
 * 
 * Fields (Requirement 1.4):
 * - Kelas Perawatan (VVIP/VIP/Kelas 1/Kelas 2/Kelas 3/ICU)
 * - Nama Ruangan/Bangsal (dropdown, mandatory)
 * - Nomor Bed (dropdown showing only available beds, mandatory)
 * 
 * Validates: Requirements 1.4
 */
export function RoomPlacementSection() {
  const form = useFormContext<AdmissionFormData>()
  const { rooms } = useRoomStore()
  
  // Watch selected values for filtering
  const kelasPerawatan = form.watch('kelasPerawatan')
  const namaRuangan = form.watch('namaRuangan')

  /**
   * Get available rooms filtered by kelas perawatan
   * Only shows rooms with status "Tersedia" (Available)
   * If no rooms available, shows all rooms for that kelas with warning
   */
  const availableRoomsByKelas = useMemo(() => {
    if (!kelasPerawatan) return []
    
    const allowedRoomTypes = KELAS_TO_ROOM_TYPE_MAP[kelasPerawatan] || []
    
    // First, try to get available rooms
    const availableRooms = rooms.filter((room) => {
      const matchesKelas = allowedRoomTypes.includes(room.roomType)
      const isAvailable = room.status === 'Tersedia'
      return matchesKelas && isAvailable
    })
    
    // If no available rooms, show all rooms for that kelas (for emergency cases)
    if (availableRooms.length === 0) {
      console.warn(`⚠️ No available rooms for ${kelasPerawatan}, showing all rooms`)
      return rooms.filter((room) => allowedRoomTypes.includes(room.roomType))
    }
    
    return availableRooms
  }, [rooms, kelasPerawatan])
  
  // Check if showing non-available rooms
  const hasNoAvailableRooms = useMemo(() => {
    if (!kelasPerawatan) return false
    const allowedRoomTypes = KELAS_TO_ROOM_TYPE_MAP[kelasPerawatan] || []
    const availableCount = rooms.filter((room) => 
      allowedRoomTypes.includes(room.roomType) && room.status === 'Tersedia'
    ).length
    return availableCount === 0
  }, [rooms, kelasPerawatan])

  /**
   * Get unique room names from available rooms
   */
  const uniqueRoomNames = useMemo(() => {
    const names = new Set(availableRoomsByKelas.map((room) => room.roomNumber))
    return Array.from(names).sort()
  }, [availableRoomsByKelas])

  /**
   * Get available beds for selected room
   */
  const availableBedsForRoom = useMemo(() => {
    if (!namaRuangan) return []
    
    return availableRoomsByKelas
      .filter((room) => room.roomNumber === namaRuangan)
      .map((room) => ({
        value: room.roomNumber, // Using roomNumber as bed identifier
        label: `${room.roomNumber} - ${room.roomType} (Lantai ${room.floor})`,
        room,
      }))
  }, [availableRoomsByKelas, namaRuangan])

  /**
   * Reset dependent fields when kelas changes
   */
  const handleKelasChange = (value: string) => {
    form.setValue('kelasPerawatan', value as AdmissionFormData['kelasPerawatan'])
    // Reset room and bed when kelas changes
    form.setValue('namaRuangan', '')
    form.setValue('nomorBed', '')
  }

  /**
   * Reset bed field when room changes
   */
  const handleRoomChange = (value: string) => {
    form.setValue('namaRuangan', value)
    // Reset bed when room changes
    form.setValue('nomorBed', '')
  }

  return (
    <div className='space-y-4'>
      {/* Warning if no available rooms */}
      {hasNoAvailableRooms && kelasPerawatan && (
        <Alert variant='destructive'>
          <Info className='h-4 w-4' />
          <AlertDescription>
            Tidak ada kamar tersedia untuk {kelasPerawatan}. Menampilkan semua kamar untuk kasus darurat.
            Silakan koordinasi dengan bagian kamar untuk ketersediaan.
          </AlertDescription>
        </Alert>
      )}
      
      {/* Kelas Perawatan */}
      <FormField
        control={form.control}
        name='kelasPerawatan'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Kelas Perawatan <span className='text-destructive'>*</span>
            </FormLabel>
            <Select onValueChange={handleKelasChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder='Pilih kelas perawatan' />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value='VVIP'>VVIP</SelectItem>
                <SelectItem value='VIP'>VIP</SelectItem>
                <SelectItem value='Kelas 1'>Kelas 1</SelectItem>
                <SelectItem value='Kelas 2'>Kelas 2</SelectItem>
                <SelectItem value='Kelas 3'>Kelas 3</SelectItem>
                <SelectItem value='ICU'>ICU</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Show info if kelas is selected but no rooms available */}
      {kelasPerawatan && availableRoomsByKelas.length === 0 && (
        <Alert>
          <Info className='h-4 w-4' />
          <AlertDescription>
            Tidak ada kamar tersedia untuk kelas perawatan {kelasPerawatan}.
            Silakan pilih kelas perawatan lain atau hubungi bagian manajemen kamar.
          </AlertDescription>
        </Alert>
      )}

      {/* Nama Ruangan/Bangsal */}
      <FormField
        control={form.control}
        name='namaRuangan'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Nama Ruangan/Bangsal <span className='text-destructive'>*</span>
            </FormLabel>
            <Select 
              onValueChange={handleRoomChange} 
              value={field.value}
              disabled={!kelasPerawatan || availableRoomsByKelas.length === 0}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder='Pilih ruangan/bangsal' />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {uniqueRoomNames.length === 0 ? (
                  <div className='p-2 text-sm text-muted-foreground text-center'>
                    Tidak ada ruangan tersedia
                  </div>
                ) : (
                  uniqueRoomNames.map((roomName) => (
                    <SelectItem key={roomName} value={roomName}>
                      {roomName}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <FormMessage />
            {kelasPerawatan && availableRoomsByKelas.length > 0 && (
              <p className='text-xs text-muted-foreground'>
                {availableRoomsByKelas.length} kamar tersedia untuk kelas {kelasPerawatan}
              </p>
            )}
          </FormItem>
        )}
      />

      {/* Nomor Bed */}
      <FormField
        control={form.control}
        name='nomorBed'
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Nomor Bed <span className='text-destructive'>*</span>
            </FormLabel>
            <Select 
              onValueChange={field.onChange} 
              value={field.value}
              disabled={!namaRuangan || availableBedsForRoom.length === 0}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder='Pilih nomor bed' />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {availableBedsForRoom.length === 0 ? (
                  <div className='p-2 text-sm text-muted-foreground text-center'>
                    {namaRuangan ? 'Tidak ada bed tersedia' : 'Pilih ruangan terlebih dahulu'}
                  </div>
                ) : (
                  availableBedsForRoom.map((bed) => (
                    <SelectItem key={bed.value} value={bed.value}>
                      {bed.label}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <FormMessage />
            {namaRuangan && availableBedsForRoom.length > 0 && (
              <p className='text-xs text-muted-foreground'>
                {availableBedsForRoom.length} bed tersedia di {namaRuangan}
              </p>
            )}
          </FormItem>
        )}
      />

      {/* Summary info */}
      {kelasPerawatan && namaRuangan && (
        <div className='rounded-lg border border-border bg-muted/50 p-4'>
          <p className='text-sm font-medium text-muted-foreground mb-2'>
            Ringkasan Penempatan Kamar
          </p>
          <div className='space-y-1 text-sm'>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Kelas Perawatan:</span>
              <span className='font-medium'>{kelasPerawatan}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>Ruangan:</span>
              <span className='font-medium'>{namaRuangan}</span>
            </div>
            {form.watch('nomorBed') && (
              <div className='flex justify-between'>
                <span className='text-muted-foreground'>Bed:</span>
                <span className='font-medium'>{form.watch('nomorBed')}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
