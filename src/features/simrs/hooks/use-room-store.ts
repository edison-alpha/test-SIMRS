/**
 * Room Store - Zustand State Management
 * Manages room data with CRUD operations and mock data
 * Enhanced with localStorage persistence for user-added rooms
 * Uses consistent date serialization (ISO strings) for production compatibility
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Room, RoomFormData } from '@/features/simrs/data/room-schema'
import { generateId } from '@/lib/simrs-utils'
import { fetchMockRooms } from '@/features/simrs/data/mock-data'

/**
 * Helper type for serializing Date to ISO string
 */
type SerializableDate = string & { __brand: 'SerializableDate' }

/**
 * Custom storage that ensures dates are stored as ISO strings
 */
const customStorage = createJSONStorage<{ userAddedRooms: Room[] }>(() => ({
  getItem: (name) => {
    const str = localStorage.getItem(name)
    if (!str) return null
    
    try {
      const data = JSON.parse(str)
      return data
    } catch {
      return null
    }
  },
  setItem: (name, value) => {
    localStorage.setItem(name, JSON.stringify(value))
  },
  removeItem: (name) => {
    localStorage.removeItem(name)
  },
}))

/**
 * Room Store Interface
 * Defines the shape of the room store state and actions
 */
interface RoomStore {
  // State
  rooms: Room[]
  isLoaded: boolean
  isLoading: boolean
  userAddedRooms: Room[] // Track user-added rooms separately

  // Actions
  addRoom: (roomData: RoomFormData) => Room
  updateRoom: (id: string, updates: Partial<RoomFormData>) => Room | null
  deleteRoom: (id: string) => boolean
  getRoomById: (id: string) => Room | undefined
  searchRooms: (query: string) => Room[]
  filterByStatus: (status: Room['status']) => Room[]
  
  // Validation
  isRoomNumberUnique: (roomNumber: string, excludeId?: string) => boolean
  canDeleteRoom: (id: string) => boolean
  
  // Data loading
  loadMockData: () => Promise<void>
}

/**
 * Room Store Implementation
 * Uses Zustand for state management with localStorage persistence
 */
export const useRoomStore = create<RoomStore>()(
  persist(
    (set, get) => ({
  // Initial state
  rooms: [],
  isLoaded: false,
  isLoading: false,
  userAddedRooms: [],

  /**
   * Adds a new room to the store
   * Generates ID and timestamps automatically
   * Sets initial status to "Tersedia" if not provided
   * Saves to localStorage
   * 
   * @param roomData - Room form data without auto-generated fields
   * @returns The newly created room
   */
  addRoom: (roomData: RoomFormData): Room => {
    const now = new Date()
    const newRoom = {
      ...roomData,
      id: generateId(),
      status: roomData.status || 'Tersedia',
      createdAt: now.toISOString() as SerializableDate,
      updatedAt: now.toISOString() as SerializableDate,
    } as unknown as Room

    set((state) => ({
      rooms: [...state.rooms, newRoom],
      userAddedRooms: [...state.userAddedRooms, newRoom],
    }))

    return newRoom
  },

  /**
   * Updates an existing room
   * Preserves ID as per requirements
   * Updates in localStorage if it's a user-added room
   * 
   * @param id - Room ID to update
   * @param updates - Partial room data to update
   * @returns The updated room, or null if not found
   */
  updateRoom: (id: string, updates: Partial<RoomFormData>): Room | null => {
    let updatedRoom: Room | null = null

    set((state) => ({
      rooms: state.rooms.map((room) => {
        if (room.id === id) {
          // Preserve ID
          updatedRoom = {
            ...room,
            ...updates,
            id: room.id, // Preserve original ID
            updatedAt: new Date().toISOString() as SerializableDate,
          } as unknown as Room
          return updatedRoom
        }
        return room
      }),
      userAddedRooms: state.userAddedRooms.map((room) => {
        if (room.id === id && updatedRoom) {
          return updatedRoom
        }
        return room
      }),
    }))

    return updatedRoom
  },

  /**
   * Deletes a room from the store
   * Prevents deletion if room is occupied
   * Removes from localStorage if it's a user-added room
   * 
   * @param id - Room ID to delete
   * @returns True if room was deleted, false if not found or occupied
   */
  deleteRoom: (id: string): boolean => {
    const { rooms, canDeleteRoom } = get()
    const room = rooms.find((r) => r.id === id)

    if (!room) {
      return false
    }

    // Check if room can be deleted (not occupied)
    if (!canDeleteRoom(id)) {
      return false
    }

    set((state) => ({
      rooms: state.rooms.filter((room) => room.id !== id),
      userAddedRooms: state.userAddedRooms.filter((room) => room.id !== id),
    }))

    return true
  },

  /**
   * Retrieves a room by ID
   * 
   * @param id - Room ID to find
   * @returns The room if found, undefined otherwise
   */
  getRoomById: (id: string): Room | undefined => {
    return get().rooms.find((room) => room.id === id)
  },

  /**
   * Searches rooms by room number, type, or floor
   * Case-insensitive search across multiple fields
   * 
   * @param query - Search query string
   * @returns Array of matching rooms
   */
  searchRooms: (query: string): Room[] => {
    if (!query.trim()) {
      return get().rooms
    }

    const lowerQuery = query.toLowerCase().trim()

    return get().rooms.filter((room) => {
      return (
        room.roomNumber.toLowerCase().includes(lowerQuery) ||
        room.roomType.toLowerCase().includes(lowerQuery) ||
        room.floor.toString().includes(lowerQuery)
      )
    })
  },

  /**
   * Filters rooms by status
   * 
   * @param status - Room status to filter by
   * @returns Array of rooms with matching status
   */
  filterByStatus: (status: Room['status']): Room[] => {
    return get().rooms.filter((room) => room.status === status)
  },

  /**
   * Checks if a room number is unique
   * 
   * @param roomNumber - Room number to check
   * @param excludeId - Optional room ID to exclude from check (for updates)
   * @returns True if room number is unique, false otherwise
   */
  isRoomNumberUnique: (roomNumber: string, excludeId?: string): boolean => {
    const { rooms } = get()
    return !rooms.some(
      (room) => room.roomNumber === roomNumber && room.id !== excludeId
    )
  },

  /**
   * Checks if a room can be deleted
   * Rooms with status "Terisi" (occupied) cannot be deleted
   * 
   * @param id - Room ID to check
   * @returns True if room can be deleted, false otherwise
   */
  canDeleteRoom: (id: string): boolean => {
    const room = get().getRoomById(id)
    if (!room) {
      return false
    }
    return room.status !== 'Terisi'
  },

  /**
   * Loads mock data from generator
   * Merges with user-added rooms from localStorage
   * Called on store initialization
   */
  loadMockData: async (): Promise<void> => {
    const state = get()
    
    // Prevent multiple simultaneous loads
    if (state.isLoading) {
      return
    }
    
    // If already loaded, skip
    if (state.isLoaded && state.rooms.length > 0) {
      return
    }
    
    try {
      set({ isLoading: true })
      const mockRooms = await fetchMockRooms()
      
      // Merge mock data with user-added rooms
      const { userAddedRooms } = get()
      const allRooms = [...mockRooms, ...userAddedRooms]
      
      set({
        rooms: allRooms,
        isLoaded: true,
        isLoading: false,
      })
    } catch (error) {
      // Still load user-added rooms even if mock data fails
      const { userAddedRooms } = get()
      set({
        rooms: userAddedRooms,
        isLoaded: true,
        isLoading: false,
      })
    }
  },
}),
    {
      name: 'simrs-room-storage',
      storage: customStorage,
      partialize: (state) => ({
        userAddedRooms: state.userAddedRooms,
      }),
    }
  )
)

/**
 * Initialize store by loading mock data
 * This should be called once when the app starts
 */
export function initializeRoomStore(): void {
  useRoomStore.getState().loadMockData()
}
