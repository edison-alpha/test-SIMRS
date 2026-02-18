# SIMRS - Sistem Informasi Rumah Sakit

[![React](https://img.shields.io/badge/React-19.2.3-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.3.0-purple.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.18-cyan.svg)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-5.0.9-orange.svg)](https://github.com/pmndrs/zustand)
[![Bun](https://img.shields.io/badge/Bun-1.1.0-black.svg)](https://bun.sh/)

Aplikasi Sistem Informasi Rumah Sakit (SIMRS) berbasis web untuk manajemen pasien rawat inap, pendaftaran pasien, dan manajemen kamar. Dibangun dengan teknologi modern React, TypeScript, dan TailwindCSS.

![SIMRS Dashboard Preview](./public/preview.png)

## 📋 Daftar Isi

- [Fitur](#-fitur)
- [Teknologi](#-teknologi)
- [Instalasi](#-instalasi)
- [Penggunaan](#-penggunaan)
- [Struktur Project](#-struktur-project)
- [API & Data](#-api--data)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Kontribusi](#-kontribusi)
- [Lisensi](#-lisensi)

## ✨ Fitur

### 🏥 Modul Rawat Inap
- **Pendaftaran Pasien Baru**
  - Formulir komprehensif dengan validasi Zod
  - Auto-generate No. RM dan Nomor Registrasi
  - Validasi NIK 16 digit
  - Draft functionality (auto-save ke localStorage)
  
- **Daftar Pasien Rawat Inap**
  - Tabel dengan sorting dan pagination
  - Pencarian by nama, NIK, No. RM
  - Filter by status, kelas perawatan, cara bayar
  - Export dan Print functionality

- **Manajemen Kamar**
  - Monitoring ketersediaan bed real-time
  - Penempatan kamar otomatis
  - Status kamar: Tersedia, Terisi, Maintenance, Reservasi

### 📊 Dashboard Analytics
- Statistik pasien harian
- Trend pasien masuk (7/30/90 hari)
- Top 10 diagnosa
- Okupansi kamar by kelas

### 🎨 UI/UX
- Responsive design (Desktop, Tablet, Mobile)
- Dark/Light mode toggle
- Loading skeleton states
- Empty states yang informatif
- Toast notifications
- Print-friendly styles

## 🛠 Teknologi

### Core
- **React 19** - Library UI modern dengan hooks
- **TypeScript 5.9** - Type-safe development (strict mode)
- **Vite 7** - Build tool cepat dengan HMR

### Styling
- **TailwindCSS 4** - Utility-first CSS framework
- **shadcn/ui** - Component library berbasis Radix UI
- **Framer Motion** - Animasi smooth

### State Management
- **Zustand** - State management minimalis dengan persist middleware
- **React Hook Form** - Form handling dengan validasi
- **Zod** - Schema validation dengan TypeScript

### Package Manager & Runtime
- **Bun** - JavaScript runtime & package manager (alternatif Node.js)
- **npm/yarn** - Compatible dengan npm sebagai fallback

### Data & API
- **TanStack Query** - Data fetching dan caching
- **TanStack Table** - Tabel advanced dengan sorting, filtering, pagination
- **Mock Data** - Simulasi API dengan delay 500ms

## 🚀 Instalasi

### Prasyarat (Pilih Salah Satu)

#### Opsi 1: Node.js + npm/yarn
- Node.js 18+ 
- npm 9+ atau yarn 1.22+

#### Opsi 2: Bun (Recommended - Lebih Cepat)
- Bun 1.1.0+ 
- Install Bun: `curl -fsSL https://bun.sh/install | bash`

---

### ⚡ Quick Start dengan Bun (Recommended)

```bash
# Clone repository
git clone https://github.com/yourusername/simrs.git
cd simrs/shadcn-admin

# Install dependencies dengan Bun
bun install

# Jalankan development server
bun run bun:dev

# Build untuk production
bun run bun:build
```

---

### 🟢 Quick Start dengan npm/yarn

```bash
# Clone repository
git clone https://github.com/yourusername/simrs.git
cd simrs/shadcn-admin

# Install dependencies
npm install
# atau
yarn install

# Jalankan development server
npm run dev
# atau
yarn dev
```

Aplikasi akan berjalan di `http://localhost:5173`

---

### 📋 Perbandingan Commands

| Task | Bun | npm/yarn |
|------|-----|----------|
| Install | `bun install` | `npm install` |
| Dev Server | `bun run bun:dev` | `npm run dev` |
| Build | `bun run bun:build` | `npm run build` |
| Test | `bun test` | `npm run test` |
| Preview | `bun run preview` | `npm run preview` |

## 📖 Penggunaan

### Akses Menu

| Menu | URL | Deskripsi |
|------|-----|-----------|
| Dashboard | `/simrs/dashboard` | Ringkasan statistik rumah sakit |
| Pendaftaran Pasien | `/simrs/pendaftaran-pasien-baru` | Formulir pendaftaran pasien rawat inap |
| Daftar Pasien | `/simrs/daftar-pasien` | Kelola data pasien rawat inap |
| Manajemen Kamar | `/simrs/manajemen-kamar` | Kelola ketersediaan kamar |

### Alur Pendaftaran Pasien

1. Klik menu **"Pendaftaran Pasien Baru"**
2. Isi form dengan lengkap:
   - **Data Identitas**: NIK (16 digit), Nama, Tanggal Lahir, Jenis Kelamin, No. HP, Alamat
   - **Data Kunjungan**: Tanggal Masuk, Cara Masuk, DPJP, Diagnosa
   - **Data Rujukan** (jika Cara Masuk = Rujukan Luar)
   - **Penempatan Kamar**: Kelas, Ruangan, Bed
   - **Penanggung Jawab**: Nama, Hubungan, No. HP
   - **Pembayaran**: Cara Bayar, Nomor Kartu (jika BPJS/Asuransi)
3. Klik **"Daftar Pasien"**
4. No. RM dan Nomor Registrasi akan generate otomatis

### Mengelola Pasien

- **Edit**: Klik icon edit pada tabel pasien
- **Hapus**: Klik icon delete (hanya pasien dengan status "Keluar")
- **Pulangkan**: Update status pasien menjadi "Keluar" dengan tanggal keluar
- **Cetak**: Cetak detail pasien atau daftar pasien
- **Export**: Export data ke format yang diinginkan

## 📁 Struktur Project

```
shadcn-admin/
├── public/                    # Static assets
│   └── mock-data/            # JSON mock data
│       ├── patients.json
│       └── rooms.json
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── layout/          # Layout components
│   │   └── data-table/      # Table components
│   ├── features/            # Feature modules
│   │   └── simrs/           # SIMRS module
│   │       ├── dashboard/   # Dashboard feature
│   │       ├── patient-admission/   # Pendaftaran pasien
│   │       ├── patient-list/        # Daftar pasien
│   │       ├── patient-registration/# Registrasi pasien
│   │       ├── room-management/     # Manajemen kamar
│   │       ├── data/        # Types, schemas, mock data
│   │       └── hooks/       # Custom hooks & stores
│   ├── hooks/               # Global hooks
│   ├── lib/                 # Utilities
│   ├── pages/               # Route pages
│   ├── styles/              # Global styles
│   ├── App.tsx              # Root component
│   ├── router.tsx           # Route configuration
│   └── main.tsx             # Entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 🔌 API & Data

### Mock Data
Aplikasi menggunakan mock data dari file JSON dengan simulasi delay 500ms:

- **Pasien**: 1000 records mock + user-added patients
- **Kamar**: 500 records mock + user-added rooms

### Data Persistence
- **localStorage**: Menyimpan data pasien dan kamar yang ditambahkan user
- **Zustand Persist**: State management dengan auto-sync ke localStorage

### Type Safety
Semua data menggunakan TypeScript strict mode dengan:
- Interface untuk semua data models
- Zod schemas untuk validasi runtime
- No `any` types

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests with UI
npm run test:ui

# Run tests once
npm run test:run
```

## 🥯 Bun Guide

### Apa itu Bun?

[Bun](https://bun.sh) adalah JavaScript runtime dan package manager yang lebih cepat dari Node.js. Keuntungan menggunakan Bun:

- ⚡ **Lebih Cepat**: Install dependencies ~10x lebih cepat
- 🚀 **Dev Server**: Hot reload lebih responsif  
- 📦 **All-in-one**: Runtime + bundler + test runner + package manager
- 🔋 **Compatible**: 100% compatible dengan Node.js APIs

### Install Bun

**Linux/macOS:**
```bash
curl -fsSL https://bun.sh/install | bash
```

**Windows:**
```powershell
powershell -c "irm bun.sh/install.ps1|iex"
```

### Setup dengan Bun

**Automated Setup:**
```bash
# Linux/macOS
chmod +x scripts/setup-bun.sh
./scripts/setup-bun.sh

# Windows
scripts\setup-bun.bat
```

**Manual Setup:**
```bash
# 1. Install dependencies
bun install

# 2. Jalankan development server
bun run bun:dev

# 3. Build untuk production
bun run bun:build
```

### Bun Commands Reference

| Command | Deskripsi |
|---------|-----------|
| `bun install` | Install dependencies (lebih cepat dari npm) |
| `bun run bun:dev` | Jalankan dev server dengan Bun |
| `bun run bun:build` | Build production dengan Bun |
| `bun test` | Jalankan unit tests |
| `bun run preview` | Preview production build |
| `bunx --bun vite` | Jalankan Vite dengan Bun runtime |

### Troubleshooting Bun

**Issue: `bun: command not found`**
```bash
# Tambahkan ke PATH
export PATH="$HOME/.bun/bin:$PATH"

# Atau reload shell
source ~/.bashrc  # atau ~/.zshrc
```

**Issue: Module not found**
```bash
# Hapus cache dan reinstall
rm -rf node_modules bun.lockb
bun install
```

**Issue: Port already in use**
```bash
# Bun akan otomatis mencari port lain, atau
bun run bun:dev -- --port 3000
```

---

## 📦 Deployment

### Build Production

```bash
npm run build
```

Output akan ada di folder `dist/`.

### Deploy ke Static Hosting

#### Vercel
```bash
npm i -g vercel
vercel
```

#### Netlify
```bash
npm i -g netlify-cli
netlify deploy
```

#### GitHub Pages
```bash
npm run build
# Copy dist folder ke branch gh-pages
```

## 🤝 Kontribusi

1. Fork repository
2. Buat branch baru (`git checkout -b feature/amazing-feature`)
3. Commit perubahan (`git commit -m 'Add amazing feature'`)
4. Push ke branch (`git push origin feature/amazing-feature`)
5. Buat Pull Request

### Development Guidelines

- Gunakan TypeScript strict mode (no `any`)
- Ikuti conventional commits
- Tambahkan tests untuk fitur baru
- Pastikan build berhasil sebelum commit

## 📝 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).

## 👥 Tim Pengembang

**PT Data Integrasi Inovasi**

- 📍 Grand Duta Dolomite D8 No. 8-9, Jl. Prabu Kian Santang, Gebang Raya, Periuk, Kota Tangerang
- 📧 Email: admin@dataintegrasiinovasi.net
- 🌐 Website: https://nuha.care
- 📞 Call Center: 081929599888

---

<p align="center">
  Dibuat dengan ❤️ untuk meningkatkan layanan kesehatan Indonesia
</p>
