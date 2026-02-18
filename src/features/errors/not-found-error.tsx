import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function NotFoundError() {
  const navigate = useNavigate()
  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] leading-tight font-bold'>404</h1>
        <span className='font-medium'>Ups! Halaman Tidak Ditemukan!</span>
        <p className='text-center text-muted-foreground'>
          Sepertinya halaman yang Anda cari <br />
          tidak ada atau mungkin telah dihapus.
        </p>
        <div className='mt-6 flex gap-4'>
          <Button variant='outline' onClick={() => navigate(-1)}>
            Kembali
          </Button>
          <Button onClick={() => navigate('/')}>Ke Beranda</Button>
        </div>
      </div>
    </div>
  )
}
