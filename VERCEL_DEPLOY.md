# Deploy ke Vercel dengan Bun

Panduan deployment aplikasi SIMRS ke Vercel menggunakan Bun.

## Prasyarat

- Akun Vercel (https://vercel.com)
- Bun 1.1.0+ (https://bun.sh)
- Project sudah di-push ke GitHub/GitLab/Bitbucket

## Cara Deploy

### Opsi 1: Deploy via Vercel Dashboard (Direkomendasikan)

1. Login ke [Vercel Dashboard](https://vercel.com/dashboard)
2. Klik "Add New Project"
3. Import repository GitHub/GitLab/Bitbucket Anda
4. Konfigurasi Project:
   - **Framework Preset**: `Other`
   - **Build Command**: `bun run build`
   - **Output Directory**: `dist`
   - **Install Command**: `bun install`
5. Klik "Deploy"

### Opsi 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI dengan Bun
bun add -g vercel

# Login ke Vercel
vercel login

# Deploy (dari root project)
vercel --prod
```

### Opsi 3: Deploy dengan Bun (Local Build)

```bash
# Install dependencies dengan Bun
bun install

# Build dengan Bun
bun run build

# Deploy ke Vercel
vercel --prod
```

## Konfigurasi Environment Variables (jika diperlukan)

Jika aplikasi membutuhkan environment variables, tambahkan di Vercel Dashboard:

1. Buka Project Settings > Environment Variables
2. Tambahkan variable yang diperlukan
3. Redeploy project

## Struktur URL

Setelah deploy, aplikasi akan tersedia di URL yang diberikan Vercel, misalnya:
`https://simrs-yourname.vercel.app`

### Routes yang Tersedia

- `/` - Home Page
- `/simrs/dashboard` - Dashboard SIMRS
- `/simrs/daftar-pasien` - Daftar Pasien Rawat Inap
- `/simrs/pendaftaran-pasien-baru` - Pendaftaran Pasien Baru
- `/simrs/manajemen-kamar` - Manajemen Kamar
- `/401`, `/403`, `/404`, `/500`, `/503` - Error Pages

## Scripts Bun yang Tersedia

```bash
# Development
bun run dev          # atau: bunx --bun vite

# Build
bun run build        # TypeScript check + vite build
bun run bun:build    # Build dengan Bun runtime

# Testing
bun run test         # Vitest
bun run bun:test     # Bun test runner

# Linting & Formatting
bun run lint
bun run format
bun run format:check

# Mock Data
bun run generate:mock
```

## Troubleshooting

### Halaman 404 saat refresh

Jika mengalami 404 saat refresh pada route selain home, pastikan file `vercel.json` sudah ada di root project dengan konfigurasi:

```json
{
  "routes": [
    {
      "src": "/[^.]+",
      "dest": "/",
      "status": 200
    }
  ]
}
```

### Asset tidak loading

Pastikan `vite.config.ts` memiliki konfigurasi `base: '/'`.

### Build gagal

1. Periksa Bun version (minimal 1.1.0):
   ```bash
   bun --version
   ```
2. Hapus folder `node_modules` dan `bun.lockb`, lalu install ulang:
   ```bash
   rm -rf node_modules bun.lockb
   bun install
   ```

### Vercel menggunakan npm bukan Bun

Jika Vercel otomatis menggunakan npm, tambahkan file `.vercelignore`:
```
package-lock.json
```

Atau set environment variable di Vercel:
- `ENABLE_BUN`: `1`

## Custom Domain

Untuk menggunakan custom domain:

1. Buka Project Settings > Domains
2. Tambahkan domain Anda
3. Ikuti instruksi konfigurasi DNS dari Vercel

## Perubahan yang Sudah Dilakukan

1. ✅ Membuat `vercel.json` - Konfigurasi routing SPA untuk Vercel menggunakan Bun
2. ✅ Update `vite.config.ts` - Menambahkan `base: '/'` dan konfigurasi build
3. ✅ Semua link menggunakan `react-router-dom` (Link & useNavigate) - Sudah compatible dengan Vercel
4. ✅ `package.json` sudah menggunakan Bun sebagai package manager (`packageManager: "bun@1.1.0"`)
