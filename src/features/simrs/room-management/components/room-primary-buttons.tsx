import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRoomManagement } from './room-management-provider'

/**
 * Room Primary Buttons
 * Provides the "Add Room" button for creating new rooms
 * Implements requirement 6.1
 */
export function RoomPrimaryButtons() {
  const { setOpen, setCurrentRow } = useRoomManagement()

  return (
    <div className='flex items-center gap-2'>
      <Button
        variant='default'
        size='sm'
        onClick={() => {
          setCurrentRow(null)
          setOpen('create')
        }}
      >
        <Plus className='mr-2 h-4 w-4' />
        Tambah Kamar
      </Button>
    </div>
  )
}
