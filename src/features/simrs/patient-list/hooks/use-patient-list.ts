/**
 * Hook for managing inpatient list data
 * Handles filtering, sorting, and pagination
 * Uses patient store for data management
 */

import { useState, useEffect, useMemo } from 'react'
import type { Patient } from '../../data/types'
import { usePatientStore } from '../../hooks/use-patient-store'

export type SortField = 'namaLengkap' | 'tanggalJamMasuk'
export type SortOrder = 'asc' | 'desc'

interface UseInpatientListReturn {
  patients: Patient[]
  isLoading: boolean
  error: string | null
  
  // Filtering
  searchQuery: string
  setSearchQuery: (query: string) => void
  
  // Sorting
  sortField: SortField
  sortOrder: SortOrder
  setSorting: (field: SortField, order: SortOrder) => void
  
  // Pagination
  currentPage: number
  pageSize: number
  totalPages: number
  totalRecords: number
  setCurrentPage: (page: number) => void
  setPageSize: (size: number) => void
  
  // Actions
  refetch: () => Promise<void>
}

export function useInpatientList(): UseInpatientListReturn {
  // Use patient store directly
  const allPatients = usePatientStore((state) => state.patients)
  const isLoading = usePatientStore((state) => state.isLoading)
  const isLoaded = usePatientStore((state) => state.isLoaded)
  const loadMockData = usePatientStore((state) => state.loadMockData)
  
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortField, setSortField] = useState<SortField>('tanggalJamMasuk')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)

  // Load data on mount if not loaded
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('🔄 Loading patient data from useInpatientList...')
        await loadMockData()
        console.log('✅ Patient data loaded')
      } catch (err) {
        console.error('❌ Error loading patients:', err)
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data')
      }
    }

    // Load if not loaded yet and not currently loading
    if (!isLoaded && !isLoading) {
      console.log('📥 Data not loaded, triggering load...')
      loadData()
    } else {
      console.log('ℹ️ Data already loaded or loading:', { isLoaded, isLoading, patientsCount: allPatients.length })
    }
  }, [isLoaded, isLoading, loadMockData, allPatients.length])

  // Filter patients by search query
  const filteredPatients = useMemo(() => {
    if (!searchQuery.trim()) return allPatients

    const query = searchQuery.toLowerCase()
    return allPatients.filter(patient => 
      patient.namaLengkap.toLowerCase().includes(query) ||
      patient.nik.includes(query) ||
      patient.noRM.toLowerCase().includes(query)
    )
  }, [allPatients, searchQuery])

  // Sort patients
  const sortedPatients = useMemo(() => {
    const sorted = [...filteredPatients]
    
    sorted.sort((a, b) => {
      let comparison = 0
      
      if (sortField === 'namaLengkap') {
        comparison = a.namaLengkap.localeCompare(b.namaLengkap, 'id')
      } else if (sortField === 'tanggalJamMasuk') {
        const dateA = new Date(a.tanggalJamMasuk).getTime()
        const dateB = new Date(b.tanggalJamMasuk).getTime()
        comparison = dateA - dateB
      }
      
      return sortOrder === 'asc' ? comparison : -comparison
    })
    
    return sorted
  }, [filteredPatients, sortField, sortOrder])

  // Paginate patients
  const paginatedPatients = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    return sortedPatients.slice(startIndex, endIndex)
  }, [sortedPatients, currentPage, pageSize])

  // Calculate pagination
  const totalRecords = sortedPatients.length
  const totalPages = Math.ceil(totalRecords / pageSize)

  // Reset to page 1 when search or sort changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, sortField, sortOrder])

  const setSorting = (field: SortField, order: SortOrder) => {
    setSortField(field)
    setSortOrder(order)
  }

  const handleSetPageSize = (size: number) => {
    setPageSize(size)
    setCurrentPage(1)
  }

  const refetch = async () => {
    try {
      setError(null)
      await loadMockData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data')
    }
  }

  return {
    patients: paginatedPatients,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    sortField,
    sortOrder,
    setSorting,
    currentPage,
    pageSize,
    totalPages,
    totalRecords,
    setCurrentPage,
    setPageSize: handleSetPageSize,
    refetch,
  }
}
