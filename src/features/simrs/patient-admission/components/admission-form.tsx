/**
 * Admission Form Component
 * Comprehensive patient admission form with all required sections
 * Implements Requirements 1.1-1.7
 */

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { admissionSchema, type AdmissionFormData } from '@/features/simrs/data'
import { usePatientStore } from '@/features/simrs/hooks/use-patient-store'
import { useRoomStore } from '@/features/simrs/hooks/use-room-store'
import { FormSection } from './form-section'
import { FormProgress } from './form-progress'
import { IdentitySection } from './identity-section'
import { VisitSection } from './visit-section'
import { ReferralSection } from './referral-section'
import { RoomPlacementSection } from './room-placement-section'
import { GuarantorSection } from './guarantor-section'
import { PaymentSection } from './payment-section'
import { Save, UserPlus, Edit } from 'lucide-react'

/**
 * AdmissionForm - Main component for patient admission
 * 
 * Features:
 * - Multi-section form with validation
 * - Progress indicator
 * - Auto-generation of No. RM and Nomor Registrasi (create mode only)
 * - Conditional rendering of referral section
 * - Form state persistence (draft functionality)
 * - Edit mode support with read-only No. RM and Nomor Registrasi
 * - Indonesian labels and error messages
 * 
 * Validates Requirements:
 * - 1.1: Patient Identity Data
 * - 1.2: Visit Registration Data
 * - 1.3: Referral Data (conditional)
 * - 1.4: Room Placement
 * - 1.5: Guarantor Information
 * - 1.6: Payment Guarantee
 * - 1.7: Form Validation
 * - 2.3: Edit Functionality
 */
export function AdmissionForm() {
  const navigate = useNavigate()
  const params = useParams<{ patientId?: string }>()
  const { addPatient, updatePatient, getPatientById, getPatientByNIK } = usePatientStore()
  const { rooms, updateRoom } = useRoomStore()
  const [isDraft, setIsDraft] = useState(false)
  
  // Determine if we're in edit mode
  const isEditMode = !!params.patientId
  const editingPatient = isEditMode && params.patientId ? getPatientById(params.patientId) : null

  const form = useForm<AdmissionFormData>({
    resolver: zodResolver(admissionSchema),
    defaultValues: {
      // Identity Data (1.1)
      nik: '',
      namaLengkap: '',
      tempatLahir: '',
      tanggalLahir: undefined,
      jenisKelamin: 'Laki-laki',
      noHandphone: '',
      alamatDomisili: '',
      
      // Visit Registration (1.2)
      tanggalJamMasuk: new Date(),
      caraMasuk: 'IGD',
      dpjp: '',
      diagnosaMasuk: '',
      keluhanUtama: '',
      
      // Referral Data (1.3) - conditional
      asalRujukan: undefined,
      namaFaskesPerujuk: '',
      nomorSuratRujukan: '',
      tanggalSuratRujukan: undefined,
      diagnosaRujukan: '',
      fileSuratRujukan: '',
      
      // Room Placement (1.4)
      kelasPerawatan: 'Kelas 3',
      namaRuangan: '',
      nomorBed: '',
      
      // Guarantor (1.5)
      namaPenanggungJawab: '',
      hubunganDenganPasien: 'Orang Tua',
      noHPPenanggungJawab: '',
      alamatPenanggungJawab: '',
      
      // Payment (1.6)
      caraBayar: 'Umum-Pribadi',
      nomorKartuPolis: '',
      kelasHakRawat: undefined,
    },
  })

  // Watch caraMasuk to conditionally show referral section
  const caraMasuk = form.watch('caraMasuk')
  const showReferralSection = caraMasuk === 'Rujukan Luar'

  // Watch caraBayar to conditionally show payment fields
  const caraBayar = form.watch('caraBayar')
  const showNomorKartu = caraBayar !== 'Umum-Pribadi'
  const showKelasHakRawat = caraBayar === 'BPJS Kesehatan'

  // Calculate form progress
  const formValues = form.watch()
  const sections = [
    {
      id: 'identity',
      title: 'Data Identitas Pasien',
      completed: !!(
        formValues.nik &&
        formValues.namaLengkap &&
        formValues.tanggalLahir &&
        formValues.jenisKelamin &&
        formValues.noHandphone &&
        formValues.alamatDomisili
      ),
      required: true,
    },
    {
      id: 'visit',
      title: 'Data Registrasi Kunjungan',
      completed: !!(
        formValues.tanggalJamMasuk &&
        formValues.caraMasuk &&
        formValues.dpjp &&
        formValues.diagnosaMasuk
      ),
      required: true,
    },
    {
      id: 'referral',
      title: 'Data Rujukan',
      completed: showReferralSection
        ? !!(
            formValues.asalRujukan &&
            formValues.namaFaskesPerujuk &&
            formValues.nomorSuratRujukan &&
            formValues.tanggalSuratRujukan
          )
        : true, // Not required if not showing
      required: showReferralSection,
    },
    {
      id: 'room',
      title: 'Penempatan Kamar',
      completed: !!(
        formValues.kelasPerawatan &&
        formValues.namaRuangan &&
        formValues.nomorBed
      ),
      required: true,
    },
    {
      id: 'guarantor',
      title: 'Penanggung Jawab Pasien',
      completed: !!(
        formValues.namaPenanggungJawab &&
        formValues.hubunganDenganPasien &&
        formValues.noHPPenanggungJawab
      ),
      required: true,
    },
    {
      id: 'payment',
      title: 'Penjaminan Biaya',
      completed: !!(
        formValues.caraBayar &&
        (!showNomorKartu || formValues.nomorKartuPolis) &&
        (!showKelasHakRawat || formValues.kelasHakRawat)
      ),
      required: true,
    },
  ]

  // Load draft from localStorage on mount (only in create mode)
  useEffect(() => {
    if (isEditMode && editingPatient) {
      // Pre-fill form with existing patient data (Requirement 2.3)
      form.reset({
        // Identity Data
        nik: editingPatient.nik,
        namaLengkap: editingPatient.namaLengkap,
        tempatLahir: editingPatient.tempatLahir || '',
        tanggalLahir: new Date(editingPatient.tanggalLahir),
        jenisKelamin: editingPatient.jenisKelamin,
        noHandphone: editingPatient.noHandphone,
        alamatDomisili: editingPatient.alamatDomisili,
        
        // Visit Registration
        tanggalJamMasuk: new Date(editingPatient.tanggalJamMasuk),
        caraMasuk: editingPatient.caraMasuk,
        dpjp: editingPatient.dpjp,
        diagnosaMasuk: editingPatient.diagnosaMasuk,
        keluhanUtama: editingPatient.keluhanUtama || '',
        
        // Referral Data
        asalRujukan: editingPatient.asalRujukan,
        namaFaskesPerujuk: editingPatient.namaFaskesPerujuk || '',
        nomorSuratRujukan: editingPatient.nomorSuratRujukan || '',
        tanggalSuratRujukan: editingPatient.tanggalSuratRujukan ? new Date(editingPatient.tanggalSuratRujukan) : undefined,
        diagnosaRujukan: editingPatient.diagnosaRujukan || '',
        fileSuratRujukan: editingPatient.fileSuratRujukan || '',
        
        // Room Placement
        kelasPerawatan: editingPatient.kelasPerawatan,
        namaRuangan: editingPatient.namaRuangan,
        nomorBed: editingPatient.nomorBed,
        
        // Guarantor
        namaPenanggungJawab: editingPatient.namaPenanggungJawab,
        hubunganDenganPasien: editingPatient.hubunganDenganPasien,
        noHPPenanggungJawab: editingPatient.noHPPenanggungJawab,
        alamatPenanggungJawab: editingPatient.alamatPenanggungJawab || '',
        
        // Payment
        caraBayar: editingPatient.caraBayar,
        nomorKartuPolis: editingPatient.nomorKartuPolis || '',
        kelasHakRawat: editingPatient.kelasHakRawat,
      })
      toast.info('Data pasien dimuat untuk diedit')
    } else {
      // Load draft from localStorage (create mode only)
      const draft = localStorage.getItem('admission-form-draft')
      if (draft) {
        try {
          const draftData = JSON.parse(draft)
          form.reset(draftData)
          setIsDraft(true)
          toast.info('Draft formulir dimuat')
        } catch (error) {
          console.error('Failed to load draft:', error)
        }
      }
    }
  }, [form, isEditMode, editingPatient])

  const onSubmit = async (values: AdmissionFormData) => {
    try {
      if (isEditMode && editingPatient) {
        // Edit mode: Update existing patient (Requirement 2.3)
        // Check NIK uniqueness (only if NIK changed)
        if (values.nik !== editingPatient.nik) {
          const existingPatient = getPatientByNIK(values.nik)
          if (existingPatient) {
            toast.error('NIK sudah terdaftar dalam sistem')
            form.setError('nik', {
              type: 'manual',
              message: 'NIK sudah terdaftar',
            })
            return
          }
        }

        // Check bed availability (only if bed changed)
        if (values.nomorBed !== editingPatient.nomorBed) {
          const selectedRoom = rooms.find(
            (room) => room.roomNumber === values.nomorBed && room.status === 'Tersedia'
          )
          
          if (!selectedRoom) {
            toast.error('Bed tidak tersedia', {
              description: 'Bed yang dipilih sudah tidak tersedia. Silakan pilih bed lain.',
            })
            form.setError('nomorBed', {
              type: 'manual',
              message: 'Bed tidak tersedia',
            })
            return
          }

          // Free up old bed
          const oldRoom = rooms.find((room) => room.roomNumber === editingPatient.nomorBed)
          if (oldRoom) {
            updateRoom(oldRoom.id, { status: 'Tersedia' })
          }

          // Occupy new bed
          updateRoom(selectedRoom.id, { status: 'Terisi' })
        }

        // Update patient
        const updatedPatient = await updatePatient(editingPatient.id, values)
        
        if (updatedPatient) {
          toast.success('Data pasien berhasil diperbarui', {
            description: `No. RM: ${updatedPatient.noRM}`,
          })
          
          // Navigate back to patient list
          navigate('/simrs/daftar-pasien')
        } else {
          toast.error('Gagal memperbarui data pasien')
        }
      } else {
        // Create mode: Add new patient
        // Requirement 1.7: Check NIK uniqueness
        const existingPatient = getPatientByNIK(values.nik)
        if (existingPatient) {
          toast.error('NIK sudah terdaftar dalam sistem')
          form.setError('nik', {
            type: 'manual',
            message: 'NIK sudah terdaftar',
          })
          return
        }

        // Check bed availability
        const selectedRoom = rooms.find(
          (room) => room.roomNumber === values.nomorBed && room.status === 'Tersedia'
        )
        
        if (!selectedRoom) {
          toast.error('Bed tidak tersedia', {
            description: 'Bed yang dipilih sudah tidak tersedia. Silakan pilih bed lain.',
          })
          form.setError('nomorBed', {
            type: 'manual',
            message: 'Bed tidak tersedia',
          })
          return
        }

        // Add patient (auto-generates noRM and nomorRegistrasi)
        const newPatient = await addPatient(values)
        
        // Update bed status to "Terisi" (Occupied)
        updateRoom(selectedRoom.id, { status: 'Terisi' })
        
        // Clear draft
        localStorage.removeItem('admission-form-draft')
        setIsDraft(false)
        
        // Show success message
        toast.success('Pasien berhasil didaftarkan', {
          description: `No. RM: ${newPatient.noRM} | Registrasi: ${newPatient.nomorRegistrasi}`,
        })
        
        // Navigate to patient list
        navigate('/simrs/daftar-pasien')
      }
    } catch (error) {
      toast.error(isEditMode ? 'Gagal memperbarui data pasien' : 'Gagal mendaftarkan pasien', {
        description: error instanceof Error ? error.message : 'Terjadi kesalahan',
      })
      console.error('Error saving patient:', error)
    }
  }

  const handleSaveDraft = () => {
    // Draft functionality only available in create mode
    if (isEditMode) {
      toast.info('Draft tidak tersedia dalam mode edit')
      return
    }
    
    const values = form.getValues()
    localStorage.setItem('admission-form-draft', JSON.stringify(values))
    setIsDraft(true)
    toast.success('Draft formulir disimpan')
  }

  const handleClearDraft = () => {
    // Draft functionality only available in create mode
    if (isEditMode) {
      return
    }
    
    localStorage.removeItem('admission-form-draft')
    setIsDraft(false)
    form.reset()
    toast.info('Draft formulir dihapus')
  }

  return (
    <div className='flex flex-col lg:flex-row gap-6'>
      {/* Main Form */}
      <div className='flex-1'>
        {/* Edit Mode Header */}
        {isEditMode && editingPatient && (
          <div className='mb-6 p-4 bg-muted rounded-lg'>
            <h3 className='text-lg font-semibold mb-2'>Mode Edit Pasien</h3>
            <div className='grid grid-cols-2 gap-2 text-sm'>
              <div>
                <span className='text-muted-foreground'>No. RM:</span>{' '}
                <span className='font-medium'>{editingPatient.noRM}</span>
              </div>
              <div>
                <span className='text-muted-foreground'>Nomor Registrasi:</span>{' '}
                <span className='font-medium'>{editingPatient.nomorRegistrasi}</span>
              </div>
            </div>
            <p className='text-xs text-muted-foreground mt-2'>
              No. RM dan Nomor Registrasi tidak dapat diubah
            </p>
          </div>
        )}
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            {/* Identity Section (Requirement 1.1) */}
            <FormSection
              title='Data Identitas Pasien'
              required
            >
              <IdentitySection isEditMode={isEditMode} />
            </FormSection>

            <FormSection
              title='Data Registrasi Kunjungan'
              required
            >
              <VisitSection isEditMode={isEditMode} />
            </FormSection>

            {showReferralSection && (
              <FormSection
                title='Data Rujukan'
                required
              >
                <ReferralSection />
              </FormSection>
            )}

            <FormSection
              title='Penempatan Kamar'
              required
            >
              <RoomPlacementSection />
            </FormSection>

            <FormSection
              title='Penanggung Jawab Pasien'
              required
            >
              <GuarantorSection />
            </FormSection>

            <FormSection
              title='Penjaminan Biaya'
              required
            >
              <PaymentSection />
            </FormSection>

            {/* Form Actions */}
            <div className='flex flex-col sm:flex-row gap-3 pt-4'>
              {!isEditMode && (
                <>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={handleSaveDraft}
                    className='flex-1 sm:flex-none'
                  >
                    <Save className='mr-2 h-4 w-4' />
                    Simpan Draft
                  </Button>
                  
                  {isDraft && (
                    <Button
                      type='button'
                      variant='ghost'
                      onClick={handleClearDraft}
                      className='flex-1 sm:flex-none'
                    >
                      Hapus Draft
                    </Button>
                  )}
                </>
              )}
              
              <div className='flex-1' />
              
              <Button
                type='submit'
                className='flex-1 sm:flex-none sm:min-w-[200px]'
              >
                {isEditMode ? (
                  <>
                    <Edit className='mr-2 h-4 w-4' />
                    Simpan Perubahan
                  </>
                ) : (
                  <>
                    <UserPlus className='mr-2 h-4 w-4' />
                    Daftar Pasien
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>

      {/* Progress Sidebar */}
      <div className='lg:w-80'>
        <div className='sticky top-6'>
          <FormProgress sections={sections} />
        </div>
      </div>
    </div>
  )
}
