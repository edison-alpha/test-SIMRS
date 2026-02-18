/**
 * SIMRS Sidebar Navigation Configuration
 * Defines the main navigation structure for the SIMRS application
 */

import {
  LayoutGrid,
  BedDouble,
  ClipboardPlus,
  Users
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'Admin SIMRS',
    email: 'admin@simrs-hospital.com',
    avatar: '/avatars/admin.jpg',
  },
  navGroups: [
    {
      title: 'Sistem Informasi Rumah Sakit',
      items: [
        {
          title: 'Dashboard',
          url: '/simrs/dashboard',
          icon: LayoutGrid,
          description: 'Ringkasan dan statistik rumah sakit',
        },
        {
          title: 'Pendaftaran Pasien Baru',
          url: '/simrs/pendaftaran-pasien-baru',
          icon: ClipboardPlus,
          description: 'Formulir pendaftaran pasien rawat inap',
        },
        {
          title: 'Daftar Pasien Rawat Inap',
          url: '/simrs/daftar-pasien',
          icon: Users,
          description: 'Kelola data pasien rawat inap',
        },
        {
          title: 'Manajemen Kamar',
          url: '/simrs/manajemen-kamar',
          icon: BedDouble,
          description: 'Kelola ketersediaan kamar dan bed',
        },
      ],
    },
  ],
}
