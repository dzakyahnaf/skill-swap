# 🌟 SkillSwap: Dokumentasi Teknis & Panduan Pengguna

Selamat datang di **SkillSwap**, platform inovatif yang dirancang untuk memfasilitasi pertukaran keahlian antar pengguna secara langsung dan terstruktur. Dokumen ini disusun sebagai panduan komprehensif bagi Anda (Client) untuk memahami, menjalankan, dan mengelola ekosistem aplikasi SkillSwap.

---

## 📖 1. Tentang Proyek
**SkillSwap** adalah aplikasi berbasis komunitas di mana setiap orang bisa menjadi "guru" sekaligus "murid". Platform ini memungkinkan pengguna untuk menawarkan keahlian yang mereka miliki (misal: Pemrograman Python) untuk ditukarkan dengan keahlian yang ingin mereka pelajari (misal: Desain Grafis).

### Tujuan Utama:
- **Demokratisasi Belajar**: Memberikan akses belajar tanpa biaya finansial.
- **Koneksi Sosial**: Membangun jejaring antar profesional dan pehobi.
- **Efisiensi**: Sistem kuota "3 Partner Aktif" memastikan pengguna fokus pada sesi pertukaran yang sedang berjalan.

---

## 🛠️ 2. Detail Fitur & Arsitektur

### A. Aplikasi Mobile (Untuk Pengguna)
- **Autentikasi Aman**: Pendaftaran dan masuk menggunakan sistem JWT (JSON Web Token).
- **Manajemen Skill**: Pengguna dapat menambahkan daftar keahlian yang mereka kuasai dan yang ingin dipelajari.
- **Pencarian Cerdas**: Menemukan partner berdasarkan kategori skill atau nama.
- **Sistem Pertukaran (Swap)**:
  - Kirim & Terima Permintaan Swap.
  - Sesi Aktif (Maksimal 3 partner sekaligus untuk menjaga fokus).
- **Chat Real-time**: Komunikasi langsung dengan partner menggunakan Firebase Firestore.
- **Profil Interaktif**: Menampilkan bio, rating, dan riwayat pertukaran.

### B. Admin Dashboard (Untuk Pengelola)
- **Dashboard Statistik**: Pantau jumlah user, sesi aktif, dan laporan secara *real-time*.
- **Manajemen Pengguna**: Fitur untuk melihat detail user dan melakukan **Ban/Unban** bagi pengguna yang melanggar aturan.
- **Moderasi Konten**: Melihat laporan komunitas untuk menjaga kualitas platform.

### C. Backend & Database
- **API Server**: Node.js & Express yang tangguh.
- **Database**: PostgreSQL (via Supabase) untuk performa data yang stabil.
- **Firebase Admin**: Integrasi untuk pengelolaan chat dan notifikasi tingkat lanjut.

---

## 🚀 3. Panduan Menjalankan Aplikasi (Lokal)

### Prasyarat:
- Node.js (v18+)
- Flutter SDK (Versi terbaru)
- PostgreSQL / Akun Supabase
- Akun Firebase (untuk Chat)

### Langkah-langkah:

#### 1. Backend
```bash
cd backend
npm install
# Buat file .env dan masukkan kredensial Database & Firebase
npm start
```
*Backend akan berjalan di `http://localhost:5000`*

#### 2. Admin Dashboard
```bash
cd admin-dashboard
npm install
npm run dev
```
*Akses dashboard di `http://localhost:5173`*

#### 3. Aplikasi Mobile
```bash
cd mobile
flutter pub get
flutter run
```

---

## 🌍 4. Panduan Deployment (Produksi)

### Backend (via Docker/Railway/Render)
Proyek ini sudah dilengkapi dengan `Dockerfile`.
1. Hubungkan repository ke platform cloud (misal: Railway).
2. Set Environment Variables di platform tersebut (DB_URL, JWT_SECRET, dll).
3. Platform akan otomatis mendeteksi Dockerfile dan men-deploy API.

### Web Admin (via Vercel/Netlify)
1. Jalankan `npm run build` di folder `admin-dashboard`.
2. Deploy folder `dist` ke Vercel.
3. Gunakan file `vercel.json` yang sudah disediakan untuk menangani routing.

### Mobile App
1. Jalankan `flutter build apk --release` untuk Android.
2. File APK dapat ditemukan di `build/app/outputs/flutter-apk/app-release.apk`.

---

## 🔑 5. Akun Pengujian Default
Gunakan akun berikut untuk mencoba fitur yang sudah terintegrasi:

**Admin Dashboard:**
- Email: `admin@skillswap.id`
- Password: `password`

**User Mobile (Dummy):**
- Email: `dzaky@skillswap.id`
- Password: `password`

---

## 📞 6. Dukungan Sistem
Aplikasi ini dirancang dengan arsitektur modular sehingga mudah untuk ditambahkan fitur baru di masa depan seperti *Push Notifications* atau *Video Call* di dalam chat.

---
*Dokumen ini dibuat otomatis oleh Antigravity AI Assistant untuk penyerahan proyek SkillSwap.*
