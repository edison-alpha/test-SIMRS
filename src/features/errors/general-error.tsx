import { useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type GeneralErrorProps = React.HTMLAttributes<HTMLDivElement> & {
  minimal?: boolean
}

export function GeneralError({
  className,
  minimal = false,
}: GeneralErrorProps) {
  const navigate = useNavigate()
  return (
    <div className={cn('h-svh w-full', className)}>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        {!minimal && (
          <h1 className='text-[7rem] leading-tight font-bold'>500</h1>
        )}
        <span className='font-medium'>Ups! Terjadi kesalahan {`:')`}</span>
        <p className='text-center text-muted-foreground'>
          Kami mohon maaf atas ketidaknyamanan ini. <br /> Silakan coba lagi nanti.
        </p>
        {!minimal && (
          <div className='mt-6 flex gap-4'>
            <Button variant='outline' onClick={() => navigate(-1)}>
              Kembali
            </Button>
            <Button onClick={() => navigate('/')}>Ke Beranda</Button>
          </div>
        )}
      </div>
    </div>
  )
}
