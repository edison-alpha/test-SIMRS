/**
 * Dashboard Statistics Hook
 * Computes dashboard statistics from patient and room stores
 */

import { useMemo } from 'react'
import { usePatientStore } from './use-patient-store'
import { useRoomStore } from './use-room-store'
import type { Patient } from '@/features/simrs/data/patient-schema'
import type { Room } from '@/features/simrs/data/room-schema'

/**
 * Dashboard Statistics Interface
 * Defines the shape of computed dashboard statistics
 */
export interface DashboardStats {
  totalPatients: number
  totalRooms: number
  occupiedRooms: number
  availableRooms: number
  occupancyRate: number // Percentage (0-100)
  recentPatients: Patient[]
  roomStatusDistribution: {
    available: number
    occupied: number
    maintenance: number
    reserved: number
  }
}

/**
 * Hook to compute dashboard statistics
 * Automatically recomputes when patient or room data changes
 * 
 * @param recentPatientsLimit - Number of recent patients to retrieve (default: 5)
 * @returns Computed dashboard statistics
 */
export function useDashboardStats(recentPatientsLimit: number = 5): DashboardStats {
  const patients = usePatientStore((state) => state.patients)
  const rooms = useRoomStore((state) => state.rooms)

  const stats = useMemo(() => {
    // Total counts
    const totalPatients = patients.length
    const totalRooms = rooms.length

    // Room status counts
    const occupiedRooms = rooms.filter((room) => room.status === 'Terisi').length
    const availableRooms = rooms.filter((room) => room.status === 'Tersedia').length
    const maintenanceRooms = rooms.filter((room) => room.status === 'Maintenance').length
    const reservedRooms = rooms.filter((room) => room.status === 'Reservasi').length

    // Occupancy rate calculation
    // If no rooms exist, occupancy rate is 0
    const occupancyRate = totalRooms > 0 
      ? Math.round((occupiedRooms / totalRooms) * 100) 
      : 0

    // Recent patients - sorted by registration date descending
    const recentPatients = [...patients]
      .sort((a, b) => {
        const dateA = new Date(a.registrationDate).getTime()
        const dateB = new Date(b.registrationDate).getTime()
        return dateB - dateA
      })
      .slice(0, recentPatientsLimit)

    // Room status distribution
    const roomStatusDistribution = {
      available: availableRooms,
      occupied: occupiedRooms,
      maintenance: maintenanceRooms,
      reserved: reservedRooms,
    }

    return {
      totalPatients,
      totalRooms,
      occupiedRooms,
      availableRooms,
      occupancyRate,
      recentPatients,
      roomStatusDistribution,
    }
  }, [patients, rooms, recentPatientsLimit])

  return stats
}

/**
 * Utility function to calculate occupancy rate
 * Can be used independently for testing
 * 
 * @param rooms - Array of rooms
 * @returns Occupancy rate as percentage (0-100)
 */
export function calculateOccupancyRate(rooms: Room[]): number {
  const totalRooms = rooms.length
  if (totalRooms === 0) {
    return 0
  }

  const occupiedRooms = rooms.filter((room) => room.status === 'Terisi').length
  return Math.round((occupiedRooms / totalRooms) * 100)
}

/**
 * Utility function to get recent patients
 * Can be used independently for testing
 * 
 * @param patients - Array of patients
 * @param limit - Number of recent patients to retrieve
 * @returns Array of recent patients sorted by registration date descending
 */
export function getRecentPatients(patients: Patient[], limit: number = 5): Patient[] {
  return [...patients]
    .sort((a, b) => {
      const dateA = new Date(a.registrationDate).getTime()
      const dateB = new Date(b.registrationDate).getTime()
      return dateB - dateA
    })
    .slice(0, limit)
}

/**
 * Utility function to get room status distribution
 * Can be used independently for testing
 * 
 * @param rooms - Array of rooms
 * @returns Object with counts for each room status
 */
export function getRoomStatusDistribution(rooms: Room[]): {
  available: number
  occupied: number
  maintenance: number
  reserved: number
} {
  return {
    available: rooms.filter((room) => room.status === 'Tersedia').length,
    occupied: rooms.filter((room) => room.status === 'Terisi').length,
    maintenance: rooms.filter((room) => room.status === 'Maintenance').length,
    reserved: rooms.filter((room) => room.status === 'Reservasi').length,
  }
}
