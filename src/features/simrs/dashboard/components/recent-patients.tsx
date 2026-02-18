import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import type { Patient } from '@/features/simrs/data/patient-schema'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

interface RecentPatientsProps {
  patients: Patient[]
}

export function RecentPatients({ patients }: RecentPatientsProps) {
  if (patients.length === 0) {
    return (
      <div className='flex items-center justify-center py-8 text-sm text-muted-foreground'>
        Belum ada pasien terdaftar
      </div>
    )
  }

  return (
    <div className='space-y-8'>
      {patients.map((patient) => {
        // Get initials from name (use namaLengkap or fallback to legacy name field)
        const displayName = patient.namaLengkap || patient.name || 'Unknown'
        const initials = displayName
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)

        return (
          <div key={patient.id} className='flex items-center gap-4'>
            <Avatar className='h-9 w-9'>
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className='flex flex-1 flex-wrap items-center justify-between gap-2'>
              <div className='space-y-1'>
                <p className='text-sm font-medium leading-none'>
                  {displayName}
                </p>
                <p className='text-sm text-muted-foreground'>
                  {patient.jenisKelamin || patient.gender} • {patient.noHandphone || patient.phoneNumber}
                </p>
              </div>
              <div className='text-sm text-muted-foreground'>
                {format(patient.registrationDate, 'dd MMM yyyy', {
                  locale: idLocale,
                })}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
