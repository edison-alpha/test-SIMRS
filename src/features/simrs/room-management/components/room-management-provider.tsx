import { createContext, useContext, useState, type ReactNode } from 'react'
import { type Room } from '@/features/simrs/data'

type DialogType = 'create' | 'edit' | 'delete' | null

interface RoomManagementContextType {
  open: DialogType
  setOpen: (type: DialogType) => void
  currentRow: Room | null
  setCurrentRow: (row: Room | null) => void
}

const RoomManagementContext = createContext<
  RoomManagementContextType | undefined
>(undefined)

/**
 * Room Management Provider
 * Provides context for managing room dialogs and current row state
 */
export function RoomManagementProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState<DialogType>(null)
  const [currentRow, setCurrentRow] = useState<Room | null>(null)

  return (
    <RoomManagementContext.Provider
      value={{ open, setOpen, currentRow, setCurrentRow }}
    >
      {children}
    </RoomManagementContext.Provider>
  )
}

export function useRoomManagement() {
  const context = useContext(RoomManagementContext)
  if (!context) {
    throw new Error(
      'useRoomManagement must be used within RoomManagementProvider'
    )
  }
  return context
}
