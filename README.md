# Forum API — Garuda Game

RESTful API forum diskusi menggunakan **Hapi.js**, **PostgreSQL**, **Clean Architecture**, dan **Automation Testing**.

---

## Fitur

- ✅ Registrasi & Login Pengguna
- ✅ Refresh Token & Logout
- ✅ Menambahkan Thread
- ✅ Melihat Detail Thread
- ✅ Menambahkan & Menghapus Komentar
- ✅ Menambahkan & Menghapus Balasan Komentar *(opsional)*
- ✅ Soft Delete pada Komentar & Balasan
- ✅ Unit Testing (Entities & Use Cases)
- ✅ Integration Testing (Repositories)
- ✅ Functional Testing (HTTP Server)
- ✅ Clean Architecture (4 layer)

---

## Struktur Proyek

```
forum-api/
├── migrations/                  # Database migrations
├── src/
│   ├── app.js                   # Entry point
│   ├── Commons/exceptions/      # Custom error classes
│   ├── Domains/                 # Entities & Repository interfaces
│   │   ├── threads/
│   │   ├── comments/
│   │   ├── replies/
│   │   └── users/
│   ├── Applications/use_case/   # Business logic (Use Cases)
│   ├── Infrastructure/          # Frameworks & Drivers
│   │   ├── database/postgres/
│   │   ├── http/                # Hapi server + DI container
│   │   ├── repositories/        # PostgreSQL implementations
│   │   └── security/            # JWT & Bcrypt
│   └── Interfaces/http/api/     # Route handlers (Interface Adapters)
│       ├── users/
│       ├── authentications/
│       ├── threads/
│       ├── comments/
│       └── replies/
└── tests/                       # Test helpers & DB pool
```

---

## Setup & Menjalankan

### 1. Prasyarat

- Node.js v22 (LTS)
- PostgreSQL

### 2. Install Dependencies

```bash
npm install
```

### 3. Buat Database

```sql
-- Di psql
CREATE DATABASE forumapi;
CREATE DATABASE forumapi_test;
```

### 4. Konfigurasi Environment

Salin dan sesuaikan `.env`:

```bash
cp .env .env.local
```

Isi nilai berikut di `.env`:

```
HOST=localhost
PORT=5000
NODE_ENV=development

PGHOST=localhost
PGPORT=5432
PGDATABASE=forumapi
PGUSER=postgres
PGPASSWORD=<password_anda>

PGHOST_TEST=localhost
PGPORT_TEST=5432
PGDATABASE_TEST=forumapi_test
PGUSER_TEST=postgres
PGPASSWORD_TEST=<password_anda>

ACCESS_TOKEN_KEY=<random_string_min_32_karakter>
REFRESH_TOKEN_KEY=<random_string_min_32_karakter>
ACCESS_TOKEN_AGE=900
```

### 5. Jalankan Migrasi

```bash
# Database utama
npm run migrate

# Database test
npm run migrate:test
```

### 6. Jalankan Server

```bash
npm start
# atau untuk development dengan auto-reload:
npm run dev
```

### 7. Jalankan Tests

```bash
npm test
```

---

## Endpoint API

| Method | Path | Auth | Keterangan |
|--------|------|------|------------|
| POST | `/users` | - | Registrasi pengguna |
| POST | `/authentications` | - | Login |
| PUT | `/authentications` | - | Refresh access token |
| DELETE | `/authentications` | - | Logout |
| POST | `/threads` | ✅ | Tambah thread |
| GET | `/threads/{threadId}` | - | Detail thread |
| POST | `/threads/{threadId}/comments` | ✅ | Tambah komentar |
| DELETE | `/threads/{threadId}/comments/{commentId}` | ✅ | Hapus komentar |
| POST | `/threads/{threadId}/comments/{commentId}/replies` | ✅ | Tambah balasan |
| DELETE | `/threads/{threadId}/comments/{commentId}/replies/{replyId}` | ✅ | Hapus balasan |

---

## Clean Architecture

```
Entities       →  Domain objects dengan validasi (Thread, Comment, Reply, dll.)
Use Cases      →  Alur bisnis (AddThreadUseCase, DeleteCommentUseCase, dll.)
Repositories   →  Interface adapter antara Use Case dan database
HTTP Handlers  →  Interface adapter antara HTTP request dan Use Case
Frameworks     →  Hapi.js (HTTP) + PostgreSQL (database)
```

---

## Catatan Teknis

- Komentar & balasan dihapus secara **soft delete** (kolom `is_delete`)
- Komentar dihapus ditampilkan sebagai `**komentar telah dihapus**`
- Balasan dihapus ditampilkan sebagai `**balasan telah dihapus**`
- Komentar & balasan diurutkan **ascending** berdasarkan tanggal
- Autentikasi dilakukan di level **handler** (Interface), bukan Use Case
