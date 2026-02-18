import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { Plus, Users } from 'lucide-react'

export function QuickActions() {
  const navigate = useNavigate()

  return (
    <div className='flex items-center gap-2'>
      <Button
        variant='default'
        size='sm'
        onClick={() => navigate('/simrs/pendaftaran-pasien-baru')}
      >
        <Plus className='mr-2 h-4 w-4' />
        Daftar Pasien Baru
      </Button>
      <Button
        variant='outline'
        size='sm'
        onClick={() => navigate('/simrs/daftar-pasien')}
      >
        <Users className='mr-2 h-4 w-4' />
        Lihat Daftar Pasien
      </Button>
    </div>
  )
}
