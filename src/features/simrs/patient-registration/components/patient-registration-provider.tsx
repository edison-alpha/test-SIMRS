import {
  createContext,
  useContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react'
import { type Patient } from '@/features/simrs/data'

type DialogType = 'create' | 'edit' | 'delete' | 'view'

type PatientRegistrationContextType = {
  open: DialogType | null
  setOpen: (open: DialogType | null) => void
  currentRow: Patient | null
  setCurrentRow: Dispatch<SetStateAction<Patient | null>>
}

const PatientRegistrationContext = createContext<
  PatientRegistrationContextType | undefined
>(undefined)

/**
 * Patient Registration Provider
 * Manages dialog state for create, edit, delete, and view operations
 */
export function PatientRegistrationProvider({
  children,
}: {
  children: ReactNode
}) {
  const [open, setOpen] = useState<DialogType | null>(null)
  const [currentRow, setCurrentRow] = useState<Patient | null>(null)

  return (
    <PatientRegistrationContext.Provider
      value={{
        open,
        setOpen,
        currentRow,
        setCurrentRow,
      }}
    >
      {children}
    </PatientRegistrationContext.Provider>
  )
}

/**
 * Hook to access patient registration context
 */
export function usePatientRegistration() {
  const context = useContext(PatientRegistrationContext)
  if (!context) {
    throw new Error(
      'usePatientRegistration must be used within PatientRegistrationProvider'
    )
  }
  return context
}
