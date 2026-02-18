# Manajemen Kamar

Modul untuk mengelola data kamar dan bed rumah sakit.

## Fitur

- ✅ 300 mock data kamar (berbagai kelas dan tipe)
- ✅ Loading state dengan skeleton (delay 500ms)
- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ Search by nomor kamar, tipe, atau lantai
- ✅ Filter by status (Tersedia, Terisi, Maintenance, Reservasi)
- ✅ Sorting dan pagination
- ✅ TypeScript strict mode (no any)
- ✅ Komponen reusable dan modular

## Distribusi Kamar

Mock data mencakup 300 kamar dengan distribusi:
- VVIP: 10 kamar (Suite VVIP, Presidential Suite)
- VIP: 30 kamar (Suite VIP, Deluxe VIP)
- Kelas 1: 60 kamar (Standard, Superior)
- Kelas 2: 80 kamar (Standard, Economy)
- Kelas 3: 100 kamar (Standard, Shared)
- ICU: 20 kamar (ICU Umum, ICU Khusus, ICCU, NICU, PICU)

## Status Kamar

Distribusi status:
- 40% Tersedia
- 45% Terisi
- 10% Maintenance
- 5% Reservasi

## Struktur File

```
room-management/
├── index.tsx                          # Main page component
├── components/
│   ├── room-table.tsx                # Table dengan filter dan search
│   ├── room-columns.tsx              # Column definitions
│   ├── room-dialogs.tsx              # Create/Edit/Delete dialogs
│   ├── room-status-badge.tsx         # Status badge component
│   ├── room-primary-buttons.tsx      # Action buttons
│   ├── room-management-provider.tsx  # Context provider
│   └── data-table-row-actions.tsx    # Row action menu
└── README.md
```

## Penggunaan

### Route
- URL: `/simrs/manajemen-kamar`
- Menu: Sidebar > Manajemen Kamar

### Store Hook

```typescript
const {
  rooms,              // All rooms
  isLoaded,           // Data loaded flag
  isLoading,          // Loading state
  addRoom,            // Add new room
  updateRoom,         // Update room
  deleteRoom,         // Delete room
  getRoomById,        // Get room by ID
  searchRooms,        // Search rooms
  filterByStatus,     // Filter by status
  isRoomNumberUnique, // Validate room number
  canDeleteRoom,      // Check if deletable
  loadMockData,       // Load mock data
} = useRoomStore()
```

## Mock Data

Data di-generate dengan karakteristik:
- 300 kamar dengan nomor unik per kelas
- Lantai 1-5
- Kapasitas sesuai kelas (1-4 bed)
- Status random dengan distribusi realistis
- Delay 500ms untuk testing loading state

## Teknologi

- React 19
- TypeScript (strict mode)
- Zustand untuk state management
- TanStack Table untuk data table
- shadcn/ui components
- Form validation dengan Zod
