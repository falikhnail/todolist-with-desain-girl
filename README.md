# ✅ TaskMaster - Todo App PWA

Aplikasi manajemen tugas modern yang dapat diinstall sebagai Progressive Web App (PWA) dengan fitur reminder, statistik, dan notifikasi.

## 🚀 Fitur Utama

### 📝 Manajemen Tugas
- **CRUD Tugas** - Tambah, edit, hapus, dan tandai tugas selesai
- **Subtasks** - Pecah tugas besar menjadi subtask yang lebih kecil
- **Prioritas** - Atur prioritas tugas (Low, Medium, High)
- **Kategori** - Organisir tugas berdasarkan kategori (Work, Personal, Shopping, Health, Other)
- **Due Date** - Set deadline untuk setiap tugas

### 🔔 Sistem Reminder
- **Browser Notifications** - Notifikasi push langsung ke browser/device
- **In-App Toast** - Notifikasi dalam aplikasi
- **Sound Alert** - Suara pengingat
- **Multi-timing** - Reminder 1 hari, 1 jam, 30 menit sebelum, dan saat deadline

### 📊 Statistik & Dashboard
- **Progress Tracking** - Lihat progress penyelesaian tugas
- **Kategori Stats** - Statistik per kategori
- **Completion Rate** - Persentase tugas selesai

### 📱 Progressive Web App (PWA)
- **Installable** - Install langsung dari browser ke home screen
- **Offline Support** - Tetap bisa diakses saat offline
- **Native-like Experience** - Pengalaman seperti aplikasi native

### 🎨 UI/UX
- **Responsive Design** - Optimal di desktop dan mobile
- **Filter & Search** - Filter berdasarkan status dan kategori
- **Quote Harian** - Motivasi harian untuk produktivitas

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Backend**: Supabase (Database & Auth)
- **State Management**: TanStack Query
- **PWA**: vite-plugin-pwa

## 📦 Instalasi Development

```bash
# Clone repository
git clone <YOUR_GIT_URL>

# Masuk ke direktori project
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

## 📲 Cara Install PWA

### Android (Chrome)
1. Buka aplikasi di browser Chrome
2. Tap menu (⋮) di pojok kanan atas
3. Pilih "Add to Home screen" atau "Install app"
4. Konfirmasi instalasi

### iOS (Safari)
1. Buka aplikasi di Safari
2. Tap tombol Share (□↑)
3. Scroll dan pilih "Add to Home Screen"
4. Tap "Add" untuk konfirmasi

### Desktop (Chrome/Edge)
1. Buka aplikasi di browser
2. Klik icon install (⊕) di address bar
3. Atau klik menu → "Install TaskMaster"

## 📁 Struktur Project

```
src/
├── components/
│   ├── todo/           # Komponen todo (TodoItem, TodoList, etc.)
│   └── ui/             # shadcn/ui components
├── hooks/
│   ├── useTodos.ts     # Hook untuk CRUD todos
│   ├── useReminders.ts # Hook untuk sistem reminder
│   └── useCompletionEffects.ts # Efek saat task selesai
├── pages/
│   ├── Index.tsx       # Halaman utama
│   ├── Install.tsx     # Panduan instalasi PWA
│   └── NotFound.tsx    # 404 page
├── types/
│   └── todo.ts         # TypeScript types
└── integrations/
    └── supabase/       # Supabase client & types
```

## 🔧 Environment Variables

Project ini menggunakan Lovable Cloud (Supabase) yang sudah terkonfigurasi otomatis:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

## 🗄️ Database Schema

### Tabel: `todos`
| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| title | TEXT | Judul tugas |
| completed | BOOLEAN | Status selesai |
| priority | TEXT | Prioritas (low/medium/high) |
| category | TEXT | Kategori tugas |
| due_date | TIMESTAMP | Deadline tugas |
| subtasks | JSON | Array subtasks |
| created_at | TIMESTAMP | Waktu dibuat |

## 🚀 Deployment

Aplikasi dapat di-deploy melalui Lovable:
1. Buka project di Lovable
2. Klik tombol "Publish" di pojok kanan atas
3. Pilih domain atau gunakan subdomain Lovable

## 📄 License

MIT License - Bebas digunakan untuk keperluan pribadi maupun komersial.

---

**Made with ❤️ using [Lovable](https://lovable.dev)**
