# 📱 PLAN.MD — SkillSwap Application
> Dokumen perencanaan lengkap untuk pengembangan aplikasi SkillSwap  
> Versi: 1.0 | Status: Ready for Development

---

## 📋 Daftar Isi
1. [Gambaran Umum Proyek](#1-gambaran-umum-proyek)
2. [Tech Stack](#2-tech-stack)
3. [Arsitektur Sistem](#3-arsitektur-sistem)
4. [Struktur Database](#4-struktur-database)
5. [Struktur Direktori Proyek](#5-struktur-direktori-proyek)
6. [API Endpoints (Backend)](#6-api-endpoints-backend)
7. [Fitur & Task Breakdown](#7-fitur--task-breakdown)
8. [Alur Bisnis (Business Logic)](#8-alur-bisnis-business-logic)
9. [UI/UX Screens (Mobile)](#9-uiux-screens-mobile)
10. [Admin Dashboard (Web)](#10-admin-dashboard-web)
11. [Error Handling & Keamanan](#11-error-handling--keamanan)
12. [Rubrik Penilaian & Checklist](#12-rubrik-penilaian--checklist)
13. [Urutan Pengerjaan (Development Order)](#13-urutan-pengerjaan-development-order)

---

## 1. Gambaran Umum Proyek

### Deskripsi
**SkillSwap** adalah aplikasi mobile platform pertukaran keterampilan (*skill exchange*) berbasis komunitas. Pengguna bisa menawarkan keterampilan yang mereka miliki dan mencari keterampilan yang ingin mereka pelajari dari pengguna lain secara **mutual (timbal balik)**.

### Konsep Inti
- **Mutual Matching**: Pertukaran hanya terjadi jika kedua pihak saling menyetujui
- **Maksimal 3 Partner Aktif**: Setiap pengguna hanya boleh punya 3 sesi aktif bersamaan
- **Konfirmasi Dua Arah**: Sesi selesai hanya jika kedua pengguna mengkonfirmasi

### Target Pengguna
- Mahasiswa dan pelajar
- Freelancer
- Masyarakat umum yang ingin belajar skill baru
- Individu yang ingin berbagi keahlian

---

## 2. Tech Stack

| Layer | Teknologi | Alasan |
|-------|-----------|--------|
| **Mobile App** | Flutter (Dart) | Cross-platform Android, UI kaya, performa baik |
| **Backend** | Node.js + Express.js | Ringan, cocok REST API, ekosistem luas |
| **Database** | MySQL | Relasional, cocok untuk data terstruktur kompleks |
| **Real-time Chat** | Firebase Firestore | Real-time listener, mudah diintegrasikan |
| **File Storage** | Firebase Storage | Upload foto/video keterampilan |
| **Autentikasi** | JWT (JSON Web Token) | Stateless, aman, scalable |
| **Admin Dashboard** | React.js | Component-based, SPA yang cepat |
| **Styling Dashboard** | Tailwind CSS | Utility-first, cepat styling |

### Versi yang Digunakan
```
Flutter SDK: >=3.0.0
Node.js: >=18.x
MySQL: >=8.0
React: >=18.x
```

---

## 3. Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                         │
│                                                             │
│  ┌──────────────────┐          ┌──────────────────────┐    │
│  │  Flutter Mobile  │          │  React Admin Dashboard│    │
│  │    (Android)     │          │       (Web)           │    │
│  └────────┬─────────┘          └──────────┬───────────┘    │
└───────────┼──────────────────────────────┼─────────────────┘
            │ HTTP/REST                    │ HTTP/REST
            ▼                             ▼
┌─────────────────────────────────────────────────────────────┐
│                       BACKEND LAYER                         │
│                                                             │
│              Node.js + Express.js REST API                  │
│           (Autentikasi JWT, Business Logic, Validasi)       │
│                                                             │
└──────────────┬──────────────────────────┬──────────────────┘
               │                          │
               ▼                          ▼
┌──────────────────────┐    ┌─────────────────────────────┐
│      MySQL DB        │    │         Firebase            │
│  (Data Utama)        │    │  Firestore (Chat Real-time) │
│  - Users             │    │  Storage (Foto/Video)       │
│  - Skills            │    └─────────────────────────────┘
│  - Swap Requests     │
│  - Sessions          │
│  - Reviews           │
└──────────────────────┘
```

---

## 4. Struktur Database

### Tabel: `users`
```sql
CREATE TABLE users (
  id            INT PRIMARY KEY AUTO_INCREMENT,
  username      VARCHAR(50) UNIQUE NOT NULL,
  email         VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name     VARCHAR(100),
  bio           TEXT,
  profile_photo VARCHAR(255),       -- URL Firebase Storage
  is_active     BOOLEAN DEFAULT TRUE,
  is_banned     BOOLEAN DEFAULT FALSE,
  ban_reason    TEXT,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Tabel: `skills`
```sql
CREATE TABLE skills (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  user_id     INT NOT NULL,
  name        VARCHAR(100) NOT NULL,
  category    VARCHAR(50),            -- e.g., "Teknologi", "Seni", "Bahasa"
  description TEXT,
  skill_type  ENUM('offered', 'wanted') NOT NULL,  -- ditawarkan / dicari
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Tabel: `skill_media`
```sql
CREATE TABLE skill_media (
  id         INT PRIMARY KEY AUTO_INCREMENT,
  skill_id   INT NOT NULL,
  media_url  VARCHAR(255) NOT NULL,   -- URL Firebase Storage
  media_type ENUM('photo', 'video') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE
);
```

### Tabel: `swap_requests`
```sql
CREATE TABLE swap_requests (
  id                 INT PRIMARY KEY AUTO_INCREMENT,
  sender_id          INT NOT NULL,
  receiver_id        INT NOT NULL,
  sender_skill_id    INT NOT NULL,    -- skill yang ditawarkan sender
  receiver_skill_id  INT NOT NULL,    -- skill yang diminta dari receiver
  status             ENUM('pending', 'accepted', 'rejected', 'cancelled') DEFAULT 'pending',
  message            TEXT,            -- pesan opsional dari sender
  created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id),
  FOREIGN KEY (receiver_id) REFERENCES users(id),
  FOREIGN KEY (sender_skill_id) REFERENCES skills(id),
  FOREIGN KEY (receiver_skill_id) REFERENCES skills(id)
);
```

### Tabel: `active_sessions`
```sql
CREATE TABLE active_sessions (
  id              INT PRIMARY KEY AUTO_INCREMENT,
  swap_request_id INT NOT NULL UNIQUE,
  user1_id        INT NOT NULL,
  user2_id        INT NOT NULL,
  user1_confirmed BOOLEAN DEFAULT FALSE,
  user2_confirmed BOOLEAN DEFAULT FALSE,
  status          ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
  started_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at    TIMESTAMP NULL,
  FOREIGN KEY (swap_request_id) REFERENCES swap_requests(id),
  FOREIGN KEY (user1_id) REFERENCES users(id),
  FOREIGN KEY (user2_id) REFERENCES users(id)
);
```

### Tabel: `reviews`
```sql
CREATE TABLE reviews (
  id          INT PRIMARY KEY AUTO_INCREMENT,
  session_id  INT NOT NULL,
  reviewer_id INT NOT NULL,
  reviewee_id INT NOT NULL,
  rating      TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (session_id) REFERENCES active_sessions(id),
  FOREIGN KEY (reviewer_id) REFERENCES users(id),
  FOREIGN KEY (reviewee_id) REFERENCES users(id)
);
```

### Tabel: `reports`
```sql
CREATE TABLE reports (
  id             INT PRIMARY KEY AUTO_INCREMENT,
  reporter_id    INT NOT NULL,
  reported_id    INT NOT NULL,
  reason         VARCHAR(255) NOT NULL,
  description    TEXT,
  status         ENUM('pending', 'reviewed', 'resolved') DEFAULT 'pending',
  admin_note     TEXT,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (reporter_id) REFERENCES users(id),
  FOREIGN KEY (reported_id) REFERENCES users(id)
);
```

### Tabel: `admins`
```sql
CREATE TABLE admins (
  id            INT PRIMARY KEY AUTO_INCREMENT,
  username      VARCHAR(50) UNIQUE NOT NULL,
  email         VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 5. Struktur Direktori Proyek

```
skillswap/
├── backend/                        # Node.js + Express
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js         # Koneksi MySQL
│   │   │   └── firebase.js         # Inisialisasi Firebase Admin SDK
│   │   ├── middleware/
│   │   │   ├── auth.js             # Verifikasi JWT middleware
│   │   │   ├── adminAuth.js        # Middleware khusus admin
│   │   │   ├── errorHandler.js     # Global error handler
│   │   │   └── upload.js           # Multer config untuk upload file
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── user.routes.js
│   │   │   ├── skill.routes.js
│   │   │   ├── swap.routes.js
│   │   │   ├── session.routes.js
│   │   │   ├── chat.routes.js
│   │   │   ├── review.routes.js
│   │   │   ├── report.routes.js
│   │   │   └── admin.routes.js
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── user.controller.js
│   │   │   ├── skill.controller.js
│   │   │   ├── swap.controller.js
│   │   │   ├── session.controller.js
│   │   │   ├── chat.controller.js
│   │   │   ├── review.controller.js
│   │   │   ├── report.controller.js
│   │   │   └── admin.controller.js
│   │   ├── models/                 # Query helper functions
│   │   │   ├── user.model.js
│   │   │   ├── skill.model.js
│   │   │   ├── swap.model.js
│   │   │   ├── session.model.js
│   │   │   └── review.model.js
│   │   └── utils/
│   │       ├── jwt.js              # Generate & verify JWT
│   │       ├── bcrypt.js           # Hash password
│   │       └── response.js         # Standar format response API
│   ├── .env                        # Environment variables (JANGAN dicommit)
│   ├── .env.example
│   ├── package.json
│   └── server.js                   # Entry point
│
├── mobile/                         # Flutter App
│   ├── lib/
│   │   ├── main.dart
│   │   ├── config/
│   │   │   ├── app_config.dart     # URL API, Firebase config
│   │   │   └── theme.dart          # Warna & font global
│   │   ├── models/
│   │   │   ├── user_model.dart
│   │   │   ├── skill_model.dart
│   │   │   ├── swap_request_model.dart
│   │   │   ├── session_model.dart
│   │   │   └── message_model.dart
│   │   ├── services/
│   │   │   ├── api_service.dart    # HTTP calls ke backend
│   │   │   ├── auth_service.dart
│   │   │   ├── storage_service.dart
│   │   │   └── chat_service.dart   # Firebase Firestore
│   │   ├── providers/              # State Management (Provider/Riverpod)
│   │   │   ├── auth_provider.dart
│   │   │   ├── skill_provider.dart
│   │   │   └── swap_provider.dart
│   │   ├── screens/
│   │   │   ├── auth/
│   │   │   │   ├── login_screen.dart
│   │   │   │   └── register_screen.dart
│   │   │   ├── home/
│   │   │   │   └── home_screen.dart
│   │   │   ├── profile/
│   │   │   │   ├── profile_screen.dart
│   │   │   │   └── edit_profile_screen.dart
│   │   │   ├── skills/
│   │   │   │   ├── skill_list_screen.dart
│   │   │   │   ├── add_skill_screen.dart
│   │   │   │   └── skill_detail_screen.dart
│   │   │   ├── search/
│   │   │   │   └── search_screen.dart
│   │   │   ├── swap/
│   │   │   │   ├── swap_request_screen.dart
│   │   │   │   ├── incoming_requests_screen.dart
│   │   │   │   └── active_partners_screen.dart
│   │   │   ├── chat/
│   │   │   │   ├── chat_list_screen.dart
│   │   │   │   └── chat_room_screen.dart
│   │   │   └── session/
│   │   │       └── session_confirm_screen.dart
│   │   └── widgets/                # Reusable UI components
│   │       ├── custom_button.dart
│   │       ├── custom_text_field.dart
│   │       ├── skill_card.dart
│   │       ├── user_card.dart
│   │       └── loading_widget.dart
│   ├── pubspec.yaml
│   └── android/
│
└── admin-dashboard/                # React.js
    ├── src/
    │   ├── api/
    │   │   └── axios.js            # Axios instance + interceptors
    │   ├── components/
    │   │   ├── Sidebar.jsx
    │   │   ├── Navbar.jsx
    │   │   ├── Table.jsx
    │   │   └── Modal.jsx
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── Users.jsx
    │   │   ├── Activities.jsx
    │   │   └── Reports.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   └── App.jsx
    ├── package.json
    └── tailwind.config.js
```

---

## 6. API Endpoints (Backend)

### Konvensi Response
Semua response mengikuti format:
```json
{
  "success": true,
  "message": "Deskripsi singkat",
  "data": { ... }
}
```
Untuk error:
```json
{
  "success": false,
  "message": "Deskripsi error",
  "error": "KODE_ERROR"
}
```

---

### 🔐 Auth Routes — `/api/auth`

| Method | Endpoint | Body | Deskripsi | Auth |
|--------|----------|------|-----------|------|
| POST | `/register` | `{username, email, password, full_name}` | Daftar akun baru | ❌ |
| POST | `/login` | `{email, password}` | Login, dapat JWT | ❌ |
| POST | `/admin/login` | `{email, password}` | Login admin | ❌ |
| POST | `/logout` | — | Logout (invalidate token sisi client) | ✅ |

---

### 👤 User Routes — `/api/users`

| Method | Endpoint | Body/Params | Deskripsi | Auth |
|--------|----------|-------------|-----------|------|
| GET | `/me` | — | Ambil data profil sendiri | ✅ |
| PUT | `/me` | `{full_name, bio}` | Update profil | ✅ |
| PUT | `/me/photo` | `form-data: photo` | Upload/update foto profil | ✅ |
| GET | `/:id` | — | Lihat profil user lain | ✅ |

---

### 🎯 Skill Routes — `/api/skills`

| Method | Endpoint | Body/Params | Deskripsi | Auth |
|--------|----------|-------------|-----------|------|
| GET | `/` | query: `?type=offered&user_id=x` | List skill (filter) | ✅ |
| POST | `/` | `{name, category, description, skill_type}` | Tambah skill | ✅ |
| PUT | `/:id` | `{name, category, description}` | Update skill | ✅ |
| DELETE | `/:id` | — | Hapus skill | ✅ |
| POST | `/:id/media` | `form-data: file` | Upload foto/video skill | ✅ |
| DELETE | `/:id/media/:media_id` | — | Hapus media skill | ✅ |

---

### 🔍 Search Routes — `/api/search`

| Method | Endpoint | Query Params | Deskripsi | Auth |
|--------|----------|-------------|-----------|------|
| GET | `/users` | `?skill=nama_skill&category=x` | Cari user berdasarkan skill | ✅ |

---

### 🔄 Swap Request Routes — `/api/swaps`

| Method | Endpoint | Body/Params | Deskripsi | Auth |
|--------|----------|-------------|-----------|------|
| POST | `/` | `{receiver_id, sender_skill_id, receiver_skill_id, message}` | Kirim permintaan swap | ✅ |
| GET | `/incoming` | — | Daftar permintaan masuk (status: pending) | ✅ |
| GET | `/outgoing` | — | Daftar permintaan yang dikirim | ✅ |
| PUT | `/:id/accept` | — | Terima permintaan swap | ✅ |
| PUT | `/:id/reject` | — | Tolak permintaan swap | ✅ |
| PUT | `/:id/cancel` | — | Batalkan permintaan (hanya sender) | ✅ |

> ⚠️ **Business Rule**: Saat `accept` dipanggil, backend harus cek apakah kedua user masih punya slot partner aktif (< 3). Jika salah satu sudah penuh → return error `MAX_PARTNERS_REACHED`.

---

### 📅 Session Routes — `/api/sessions`

| Method | Endpoint | Body/Params | Deskripsi | Auth |
|--------|----------|-------------|-----------|------|
| GET | `/active` | — | Daftar partner/sesi aktif saat ini | ✅ |
| GET | `/history` | — | Riwayat sesi yang sudah selesai | ✅ |
| PUT | `/:id/confirm` | — | Konfirmasi sesi selesai | ✅ |

> ⚠️ **Business Rule**: Sesi status berubah ke `completed` **hanya** jika `user1_confirmed = TRUE` DAN `user2_confirmed = TRUE`.

---

### 💬 Chat Routes — `/api/chat`

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| GET | `/rooms` | Daftar chat room yang dimiliki user | ✅ |
| GET | `/rooms/:session_id/token` | Ambil token/akses Firestore untuk room ini | ✅ |

> 💡 Chat aktual (kirim/terima pesan) dilakukan **langsung ke Firebase Firestore** dari Flutter, bukan melalui backend Node.js. Endpoint ini hanya untuk otorisasi.

**Struktur Firestore:**
```
chats/
  {session_id}/
    messages/
      {message_id}/
        sender_id: string
        text: string
        timestamp: Timestamp
        is_read: boolean
```

---

### ⭐ Review Routes — `/api/reviews`

| Method | Endpoint | Body | Deskripsi | Auth |
|--------|----------|------|-----------|------|
| POST | `/` | `{session_id, reviewee_id, rating, comment}` | Beri ulasan setelah sesi selesai | ✅ |
| GET | `/user/:id` | — | Lihat semua ulasan untuk user tertentu | ✅ |

---

### 🚩 Report Routes — `/api/reports`

| Method | Endpoint | Body | Deskripsi | Auth |
|--------|----------|------|-----------|------|
| POST | `/` | `{reported_id, reason, description}` | Laporkan pengguna | ✅ |

---

### 🛡️ Admin Routes — `/api/admin`

| Method | Endpoint | Body/Params | Deskripsi | Auth |
|--------|----------|-------------|-----------|------|
| GET | `/users` | query: `?page=1&limit=20&search=x` | Daftar semua pengguna | Admin |
| GET | `/users/:id` | — | Detail pengguna | Admin |
| PUT | `/users/:id/ban` | `{reason}` | Ban pengguna | Admin |
| PUT | `/users/:id/unban` | — | Unban pengguna | Admin |
| DELETE | `/users/:id` | — | Hapus akun pengguna | Admin |
| GET | `/activities` | query: `?page=1&limit=20` | Pantau semua aktivitas swap | Admin |
| GET | `/reports` | query: `?status=pending` | Daftar laporan | Admin |
| PUT | `/reports/:id` | `{status, admin_note}` | Update status laporan | Admin |
| GET | `/stats` | — | Statistik dashboard (total user, sesi, dll) | Admin |

---

## 7. Fitur & Task Breakdown

### FASE 1: Foundation (Setup & Auth)

#### Task 1.1 — Setup Backend
- [ ] Init project Node.js, install dependencies (`express`, `mysql2`, `jsonwebtoken`, `bcryptjs`, `cors`, `dotenv`, `multer`, `firebase-admin`)
- [ ] Buat koneksi database MySQL di `config/database.js`
- [ ] Buat `server.js` dengan Express app dan middleware dasar (cors, json parser)
- [ ] Setup environment variables (`.env`)
- [ ] Jalankan migration SQL untuk semua tabel

#### Task 1.2 — Setup Flutter
- [ ] Init Flutter project baru
- [ ] Tambah dependencies di `pubspec.yaml`:
  ```yaml
  dependencies:
    http: ^1.0.0
    firebase_core: ^2.0.0
    cloud_firestore: ^4.0.0
    firebase_storage: ^11.0.0
    provider: ^6.0.0         # atau riverpod
    shared_preferences: ^2.0.0
    image_picker: ^1.0.0
    cached_network_image: ^3.0.0
  ```
- [ ] Konfigurasi `google-services.json` dari Firebase Console
- [ ] Buat `AppConfig` untuk base URL API

#### Task 1.3 — Autentikasi
**Backend:**
- [ ] `POST /api/auth/register` — validasi input, hash password (bcrypt), simpan ke DB, return JWT
- [ ] `POST /api/auth/login` — verifikasi password, return JWT (expire 7 hari)
- [ ] Buat `auth.middleware.js` — verifikasi JWT dari header `Authorization: Bearer <token>`

**Mobile:**
- [ ] Buat `login_screen.dart` dengan form email + password
- [ ] Buat `register_screen.dart` dengan form registrasi
- [ ] Simpan JWT ke `SharedPreferences` setelah login berhasil
- [ ] Buat `AuthProvider` yang menyimpan state login
- [ ] Redirect ke HomeScreen jika sudah login, LoginScreen jika belum
- [ ] Tambah input validation (email format, password min 8 karakter)

---

### FASE 2: Profil & Manajemen Skill

#### Task 2.1 — Profil Pengguna
**Backend:**
- [ ] `GET /api/users/me` — return data profil dari JWT
- [ ] `PUT /api/users/me` — update full_name dan bio
- [ ] `PUT /api/users/me/photo` — upload foto ke Firebase Storage, simpan URL ke DB
- [ ] `GET /api/users/:id` — profil publik user lain (dengan skill dan rating rata-rata)

**Mobile:**
- [ ] `profile_screen.dart` — tampilkan nama, foto, bio, skill yang dimiliki, rating
- [ ] `edit_profile_screen.dart` — form edit nama dan bio
- [ ] Fitur ambil foto dari galeri/kamera dengan `image_picker`, upload ke backend

#### Task 2.2 — Manajemen Skill
**Backend:**
- [ ] `POST /api/skills` — tambah skill baru (validasi: user hanya bisa punya maks. 10 skill per tipe)
- [ ] `GET /api/skills?user_id=x` — ambil semua skill milik user tertentu
- [ ] `PUT /api/skills/:id` — update skill (hanya pemilik)
- [ ] `DELETE /api/skills/:id` — hapus skill (hanya pemilik, pastikan tidak ada sesi aktif)
- [ ] `POST /api/skills/:id/media` — upload foto/video ke Firebase Storage

**Mobile:**
- [ ] `skill_list_screen.dart` — tab "Skill Ditawarkan" dan "Skill Dicari"
- [ ] `add_skill_screen.dart` — form tambah skill (nama, kategori, deskripsi, tipe)
- [ ] Opsi upload foto/video dari skill detail
- [ ] `skill_detail_screen.dart` — tampilkan media gallery skill

---

### FASE 3: Pencarian & Sistem Swap

#### Task 3.1 — Pencarian Pengguna
**Backend:**
- [ ] `GET /api/search/users?skill=x&category=y` — cari user berdasarkan skill yang ditawarkan (query dengan LIKE atau FULLTEXT)
- [ ] Response include: profil singkat user + skill yang relevan + rating rata-rata
- [ ] Exclude user yang sudah jadi partner aktif dan diri sendiri

**Mobile:**
- [ ] `search_screen.dart` — search bar dengan filter kategori
- [ ] Tampilkan hasil sebagai list `UserCard`
- [ ] Tap pada user card → buka profil user tersebut
- [ ] Dari profil user lain, ada tombol "Ajukan Pertukaran"

#### Task 3.2 — Sistem Permintaan Swap
**Backend:**
- [ ] `POST /api/swaps` — kirim permintaan
  - Validasi: sender dan receiver berbeda
  - Validasi: tidak ada request pending/active yang sama antara dua user
  - Validasi: kedua user masih punya slot (active partners < 3) — cek saat ACCEPT, bukan saat kirim
- [ ] `GET /api/swaps/incoming` — permintaan masuk berstatus pending
- [ ] `GET /api/swaps/outgoing` — permintaan yang dikirim
- [ ] `PUT /api/swaps/:id/accept` — terima (cek slot aktif kedua user!)
  - Jika diterima: buat record baru di tabel `active_sessions`
- [ ] `PUT /api/swaps/:id/reject` — tolak
- [ ] `PUT /api/swaps/:id/cancel` — batalkan (hanya sender, status masih pending)

**Mobile:**
- [ ] `swap_request_screen.dart` — form pilih skill sendiri + skill yang diminta, isi pesan opsional
- [ ] `incoming_requests_screen.dart` — list request masuk dengan tombol Terima/Tolak
- [ ] `active_partners_screen.dart` — list 3 partner aktif dengan indikator slot (misal: "2/3 slot terpakai")
- [ ] Notifikasi sederhana (tampilkan badge count) jika ada request baru

---

### FASE 4: Sesi & Chat

#### Task 4.1 — Manajemen Sesi
**Backend:**
- [ ] `GET /api/sessions/active` — daftar sesi aktif (join dengan user dan skill data)
- [ ] `GET /api/sessions/history` — riwayat sesi selesai
- [ ] `PUT /api/sessions/:id/confirm` — konfirmasi selesai oleh satu user
  - Update `user1_confirmed` atau `user2_confirmed` sesuai siapa yang request
  - Jika keduanya sudah `TRUE`, update `status = 'completed'`, isi `completed_at`
  - Kurangi active partner count (slot kembali tersedia)

**Mobile:**
- [ ] `session_confirm_screen.dart` — tampilkan info sesi + tombol "Konfirmasi Selesai"
- [ ] Tampilkan status: "Menunggu konfirmasi partner" jika user sudah konfirmasi tapi partner belum
- [ ] Setelah sesi selesai → redirect ke form review

#### Task 4.2 — Fitur Chat
**Setup Firebase Firestore:**
- [ ] Buat koleksi `chats` di Firestore Console
- [ ] Set Security Rules Firestore:
  ```
  match /chats/{sessionId}/messages/{messageId} {
    allow read, write: if request.auth != null 
      && (request.auth.uid == resource.data.sender_id 
          || isSessionParticipant(sessionId));
  }
  ```

**Backend:**
- [ ] `GET /api/chat/rooms` — return list session aktif yang punya chat

**Mobile:**
- [ ] `chat_list_screen.dart` — daftar chat aktif (dari sesi aktif)
- [ ] `chat_room_screen.dart`:
  - Stream messages dari Firestore (real-time)
  - Input field kirim pesan
  - Tampilkan timestamp dan status baca
  - Auto-scroll ke pesan terbaru

---

### FASE 5: Review & Report

#### Task 5.1 — Sistem Review
**Backend:**
- [ ] `POST /api/reviews` — beri ulasan (validasi: sesi harus `completed`, setiap user hanya boleh review sekali per sesi)
- [ ] `GET /api/reviews/user/:id` — ambil semua review untuk user (include reviewer name, rating, comment)
- [ ] Hitung rata-rata rating secara dinamis (AVG query)

**Mobile:**
- [ ] Setelah sesi selesai, tampilkan form rating bintang 1-5 + komentar opsional
- [ ] Tampilkan rating rata-rata di profil user (bintang + angka)
- [ ] Tampilkan semua review di bawah profil

#### Task 5.2 — Sistem Report
**Backend:**
- [ ] `POST /api/reports` — simpan laporan (user tidak bisa laporkan diri sendiri)

**Mobile:**
- [ ] Tombol "Laporkan" di profil user lain
- [ ] Form pilih alasan laporan + deskripsi

---

### FASE 6: Admin Dashboard

#### Task 6.1 — Setup Admin Dashboard
- [ ] Init React project (`create-react-app` atau Vite)
- [ ] Install: `axios`, `react-router-dom`, `tailwindcss`, `recharts` (untuk grafik)
- [ ] Setup Axios instance dengan base URL dan interceptor token
- [ ] Setup routing: `/login`, `/dashboard`, `/users`, `/activities`, `/reports`
- [ ] Buat `AuthContext` untuk state login admin

#### Task 6.2 — Halaman Dashboard (Statistik)
**Backend:** `GET /api/admin/stats`  
Return: total_users, total_sessions, total_completed, total_pending_reports

**Dashboard:**
- [ ] Kartu statistik (total pengguna, sesi aktif, laporan pending)
- [ ] Grafik pertumbuhan pengguna per bulan (opsional/bonus)

#### Task 6.3 — Manajemen Pengguna
- [ ] Tabel user dengan search, pagination
- [ ] Kolom: nama, email, tanggal daftar, status (aktif/banned)
- [ ] Tombol "Ban" / "Unban" dengan modal konfirmasi + alasan
- [ ] Tombol "Hapus Akun" dengan modal konfirmasi

#### Task 6.4 — Pemantauan Aktivitas
- [ ] Tabel semua swap request dan sesi dengan filter status
- [ ] Kolom: user A, user B, skill yang ditukar, status, tanggal

#### Task 6.5 — Penanganan Laporan
- [ ] Tabel laporan dengan filter status (pending/reviewed/resolved)
- [ ] Detail laporan (siapa yang melapor, siapa yang dilaporkan, alasan)
- [ ] Tombol update status + isi admin note

---

## 8. Alur Bisnis (Business Logic)

### Alur Pertukaran Skill (Lengkap)

```
User A (mencari skill X)  ──┐
                             │
User A temukan User B       │ → GET /api/search/users?skill=X
(User B punya skill X,       │
 User A punya skill Y)       │
                             ▼
User A kirim request ────────→ POST /api/swaps
                               (status: PENDING)
                             │
User B dapat notifikasi      │ → GET /api/swaps/incoming
                             │
User B TERIMA ───────────────→ PUT /api/swaps/:id/accept
                               Backend cek:
                               - User A active_partners < 3 ✓
                               - User B active_partners < 3 ✓
                               Buat active_session
                               (status: ACTIVE)
                             │
Keduanya bisa chat ──────────→ Firebase Firestore (real-time)
                             │
Sesi selesai, User A konfirmasi → PUT /api/sessions/:id/confirm
                               user1_confirmed = TRUE
                             │
User B konfirmasi ───────────→ PUT /api/sessions/:id/confirm
                               user2_confirmed = TRUE
                               status = COMPLETED
                               Slot partner kembali tersedia
                             │
Keduanya bisa review ────────→ POST /api/reviews
```

### Aturan Slot Partner Aktif
```
Saat user coba ACCEPT request:
1. Hitung active_sessions WHERE user1_id = user_id OR user2_id = user_id AND status = 'active'
2. Jika count >= 3 → tolak dengan error MAX_PARTNERS_REACHED
3. Cek juga pihak lain (sender) → sama
4. Jika keduanya masih ada slot → lanjutkan
```

---

## 9. UI/UX Screens (Mobile)

### Navigasi Utama (Bottom Navigation Bar)
```
[🏠 Beranda] [🔍 Cari] [🔄 Swap] [💬 Chat] [👤 Profil]
```

### Screen List & Spesifikasi UI

| Screen | Komponen Utama | Catatan |
|--------|---------------|---------|
| **Splash Screen** | Logo, loading indicator | Auto-navigate ke Home/Login |
| **Login** | Email field, password field, login button, link ke register | Validasi realtime |
| **Register** | Username, email, password, full name, tombol register | Cek duplikasi email/username |
| **Home** | Greeting, stats (slot aktif), shortcut ke fitur utama | |
| **Search** | SearchBar, filter dropdown kategori, list UserCard | Debounce 500ms |
| **Profil Orang Lain** | Foto, nama, bio, list skill ditawarkan, rating, tombol "Ajukan Swap" | |
| **Swap Requests** | Tab Incoming / Outgoing, list request dengan status | Badge notifikasi |
| **Active Partners** | List 3 partner max, indikator slot, tombol Chat & Konfirmasi | Warna berbeda jika slot penuh |
| **Chat List** | List chat per partner, preview pesan terakhir, timestamp | |
| **Chat Room** | Bubble chat, input field, timestamp, status baca | Real-time Firestore |
| **Konfirmasi Sesi** | Info partner, tombol konfirmasi, status menunggu | |
| **Profil Sendiri** | Edit profil, list skill, riwayat, rating | |
| **Tambah Skill** | Form nama, kategori (dropdown), deskripsi, tipe, upload media | |

### Warna & Tema (Flutter)
```dart
// Gunakan di theme.dart
const Color primaryColor = Color(0xFF6C63FF);   // Ungu
const Color secondaryColor = Color(0xFF03DAC6); // Teal
const Color errorColor = Color(0xFFB00020);
const Color backgroundLight = Color(0xFFF5F5F5);
```

---

## 10. Admin Dashboard (Web)

### Layout
```
┌─────────────────────────────────────────────────────┐
│  NAVBAR  (Logo SkillSwap Admin | Nama Admin | Logout) │
├────────────┬────────────────────────────────────────┤
│            │                                        │
│  SIDEBAR   │           MAIN CONTENT                 │
│  - Dashboard│                                       │
│  - Pengguna│                                        │
│  - Aktivitas│                                       │
│  - Laporan │                                        │
│            │                                        │
└────────────┴────────────────────────────────────────┘
```

### Halaman Dashboard
- 4 kartu statistik: Total Pengguna, Sesi Aktif, Sesi Selesai, Laporan Pending
- Tabel 10 pengguna terbaru terdaftar

### Halaman Pengguna
- Tabel dengan kolom: No, Username, Email, Tgl Daftar, Status, Aksi
- Search input
- Tombol "Ban" (merah) / "Unban" (hijau) / "Hapus" (abu-abu)
- Modal konfirmasi sebelum aksi

### Halaman Laporan
- Filter dropdown: Semua / Pending / Reviewed / Resolved
- Tabel dengan detail laporan
- Tombol "Proses" → buka modal update status + isi catatan admin

---

## 11. Error Handling & Keamanan

### HTTP Status Codes yang Digunakan

| Code | Situasi |
|------|---------|
| 200 | Request berhasil |
| 201 | Data berhasil dibuat |
| 400 | Input tidak valid / bad request |
| 401 | Token tidak ada / expired |
| 403 | Tidak punya izin (misal: edit skill orang lain) |
| 404 | Data tidak ditemukan |
| 409 | Konflik (misal: email sudah terdaftar) |
| 429 | Rate limit (opsional) |
| 500 | Server error |

### Error Codes (Custom)
```
AUTH_REQUIRED         - Tidak ada token
INVALID_TOKEN         - Token expired atau tidak valid
EMAIL_TAKEN           - Email sudah dipakai
USERNAME_TAKEN        - Username sudah dipakai
USER_BANNED           - Akun di-ban
MAX_PARTNERS_REACHED  - Slot partner aktif penuh (>= 3)
ALREADY_PARTNERS      - Sudah jadi partner aktif
REQUEST_EXISTS        - Sudah ada request pending yang sama
NOT_OWNER             - Bukan pemilik resource
SESSION_NOT_COMPLETED - Sesi belum selesai (untuk review)
ALREADY_REVIEWED      - Sudah pernah review sesi ini
```

### Keamanan yang Harus Diimplementasi
- [ ] **Password hashing** — gunakan `bcryptjs` dengan salt rounds 10
- [ ] **JWT Expiry** — set expiry 7 hari, refresh token opsional
- [ ] **Input Validation** — validasi semua input di backend (gunakan `express-validator`)
- [ ] **SQL Injection Prevention** — gunakan prepared statements (parameterized queries), JANGAN string concatenation
- [ ] **Authorization Check** — setiap endpoint yang mengubah data, cek apakah user yang request adalah pemilik resource
- [ ] **CORS** — batasi origin yang boleh akses API
- [ ] **File Upload Validation** — batasi tipe file (hanya image/video) dan ukuran maksimal (foto: 5MB, video: 50MB)
- [ ] **Rate Limiting** — opsional, pasang `express-rate-limit` untuk endpoint auth

### Error Handling di Flutter
```dart
// Semua API call harus di-wrap try-catch
// Tampilkan SnackBar untuk error
// Gunakan loading state agar UI tidak freeze
try {
  final result = await apiService.sendSwapRequest(...);
  // handle success
} on ApiException catch (e) {
  ScaffoldMessenger.of(context).showSnackBar(
    SnackBar(content: Text(e.message)),
  );
}
```

---

## 12. Rubrik Penilaian & Checklist

### ✅ Frontend / Tampilan (Mobile)

#### Desain User Interface (UI)
- [ ] Semua screen memiliki tampilan yang konsisten (warna, font, spacing)
- [ ] Menggunakan komponen UI yang sesuai (card, button, form field dengan style Flutter)
- [ ] Tidak ada layout yang rusak atau overflow

#### Responsiveness dan Navigasi
- [ ] Bottom navigation bar berfungsi dengan benar
- [ ] Navigasi antar screen smooth (push/pop, replace)
- [ ] Back button berfungsi normal di semua screen
- [ ] Tidak ada screen yang buntu / dead end

#### Interaksi dan Fungsi UI
- [ ] Semua tombol memberikan feedback (loading state, disable saat proses)
- [ ] Form memiliki validasi dengan pesan error yang jelas
- [ ] Pull-to-refresh pada list screen
- [ ] Skeleton loading atau loading indicator saat fetch data

#### Integrasi dengan Backend
- [ ] Semua data yang ditampilkan berasal dari API (bukan hardcoded)
- [ ] Token JWT disimpan dan dikirim di setiap request
- [ ] Handle error dari API ditampilkan ke user (SnackBar / dialog)
- [ ] Handle kondisi empty state (list kosong)

---

### ✅ Backend (Fitur)

#### Implementasi Fungsionalitas Utama
- [ ] Register & Login dengan JWT berfungsi ✓
- [ ] CRUD Skill (tambah, lihat, edit, hapus) berfungsi ✓
- [ ] Pencarian user berdasarkan skill berfungsi ✓
- [ ] Kirim / terima / tolak swap request berfungsi ✓
- [ ] Sistem mutual matching (accept hanya jika kedua setuju) berfungsi ✓
- [ ] Pembatasan 3 partner aktif berfungsi ✓
- [ ] Konfirmasi sesi selesai dari kedua pihak berfungsi ✓
- [ ] Sistem review/rating setelah sesi selesai berfungsi ✓

#### Penggunaan Teknologi Backend
- [ ] Node.js + Express.js sebagai REST API server
- [ ] MySQL untuk penyimpanan data utama
- [ ] Firebase Firestore untuk chat real-time
- [ ] Firebase Storage untuk media (foto/video)
- [ ] JWT untuk autentikasi

#### Integrasi dengan Database
- [ ] Semua tabel terbuat dengan relasi yang benar (foreign key)
- [ ] Query menggunakan prepared statements (aman dari SQL injection)
- [ ] Data konsisten (tidak ada orphan records)

#### Handling Error dan Keamanan
- [ ] Semua endpoint menggunakan middleware auth (kecuali login/register)
- [ ] Authorization check (user hanya bisa ubah data miliknya)
- [ ] Validasi input di semua endpoint
- [ ] Response error yang informatif dengan kode yang tepat
- [ ] Password di-hash menggunakan bcrypt

#### Kualitas Dokumentasi
- [ ] File `README.md` berisi cara setup dan menjalankan project
- [ ] Semua endpoint API terdokumentasi (bisa gunakan file ini atau Postman Collection)
- [ ] Komentar pada business logic yang kompleks (terutama sistem slot partner)

---

### ✅ Bonus (Opsional — Tambah Nilai)

#### Penggunaan Teknologi Tambahan
- [ ] **CI/CD**: Setup GitHub Actions untuk auto-lint/test saat push
- [ ] **Deployment**: Backend di-deploy ke platform (Railway, Render, atau VPS)
- [ ] **Framework Frontend Modern**: Sudah menggunakan Flutter (modern)
- [ ] **Push Notification**: Firebase Cloud Messaging untuk notifikasi swap request

#### Fitur Tambahan yang Relevan (tidak diminta tapi bernilai)
- [ ] Sistem kategori skill yang terorganisir (filter lebih mudah)
- [ ] Fitur "Suka" / bookmark profil user
- [ ] Halaman onboarding untuk user baru
- [ ] Dark mode support
- [ ] Fitur jadwal sesi (schedule picker dalam chat atau sesi)

---

## 13. Urutan Pengerjaan (Development Order)

Ikuti urutan ini agar setiap fitur bisa ditest sebelum lanjut:

```
MINGGU 1:
  1. Setup semua project (backend + flutter + admin)
  2. Buat semua tabel database
  3. Implementasi Auth (register, login, JWT)
  4. Test auth dengan Postman

MINGGU 2:
  5. CRUD Profil User (backend + mobile)
  6. CRUD Skill + Upload Media (backend + mobile)
  7. Fitur Pencarian (backend + mobile)

MINGGU 3:
  8. Sistem Swap Request (backend + mobile)
  9. Sistem Sesi Aktif + Konfirmasi (backend + mobile)
  10. Integrasi Chat Firebase (mobile)

MINGGU 4:
  11. Sistem Review & Report (backend + mobile)
  12. Admin Dashboard (React - semua halaman)
  13. Polish UI, perbaiki bug, handle edge cases
  14. Testing menyeluruh, dokumentasi, README
```

---

## ⚠️ Catatan Penting untuk Developer

1. **JANGAN hardcode URL API** — gunakan `AppConfig` atau `.env`
2. **JANGAN commit file `.env`** — tambahkan ke `.gitignore`
3. **SELALU cek slot partner** sebelum membuat active session, bukan saat kirim request
4. **Sesi completed** hanya jika **keduanya** konfirmasi — jangan buat shortcut
5. **Chat via Firestore langsung** dari Flutter — jangan route pesan melalui backend Node.js (lambat)
6. **Upload media ke Firebase Storage** — bukan simpan binary di MySQL
7. **Test edge case slot penuh** — buat 3 sesi aktif lalu coba buat yang ke-4, harus gagal
8. **Konsisten format response** — semua endpoint harus return `{success, message, data}`

---

*PLAN.MD ini adalah dokumen hidup — update jika ada perubahan requirement atau keputusan teknis baru.*
