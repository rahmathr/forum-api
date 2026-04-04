# Forum API 🚀

RESTful API untuk platform diskusi **Garuda Game** — dibangun dengan **Node.js**, **Hapi.js**, **PostgreSQL**, dan menerapkan **Clean Architecture** serta **Automation Testing**.

---

## 📋 Deskripsi

Forum API adalah backend service untuk aplikasi forum diskusi game online. API ini memungkinkan pengguna untuk membuat thread diskusi, memberikan komentar, dan membalas komentar dalam sebuah forum yang terstruktur.

Project ini merupakan submission dari kursus **"Belajar Fundamental Aplikasi Back-End"** di [Dicoding Indonesia](https://www.dicoding.com).

---

## ✨ Fitur

- 🔐 **Autentikasi** — Registrasi, Login, Refresh Token, Logout
- 📝 **Thread** — Membuat dan melihat detail thread
- 💬 **Komentar** — Menambah dan menghapus komentar pada thread
- 💭 **Balasan** — Menambah dan menghapus balasan pada komentar
- 🗑️ **Soft Delete** — Komentar dan balasan yang dihapus tetap tersimpan di database
- ✅ **Automation Testing** — Unit, Integration, dan Functional test dengan 100% coverage

---

## 🏗️ Arsitektur

Project ini menerapkan **Clean Architecture** dengan 4 layer:

```
src/
├── Domains/              # Layer 1 - Entities & Repository Interfaces
│   ├── users/
│   ├── authentications/
│   ├── threads/
│   ├── comments/
│   └── replies/
├── Applications/         # Layer 2 - Use Cases (Business Logic)
│   └── use_case/
├── Interfaces/           # Layer 3 - Interface Adapters
│   └── http/api/
│       ├── users/
│       ├── authentications/
│       ├── threads/
│       ├── comments/
│       └── replies/
└── Infrastructure/       # Layer 4 - Frameworks & Drivers
    ├── database/
    ├── http/
    ├── repositories/
    └── security/
```

---

## 🛠️ Tech Stack

| Teknologi | Keterangan |
|---|---|
| **Node.js** | Runtime JavaScript |
| **Hapi.js** | HTTP Framework |
| **PostgreSQL** | Database |
| **JWT (@hapi/jwt)** | Autentikasi Token |
| **bcrypt** | Password Hashing |
| **Jest** | Testing Framework |
| **node-pg-migrate** | Database Migration |

---

## 🚀 Cara Menjalankan

### Prasyarat
- Node.js v18+ (direkomendasikan v22 LTS)
- PostgreSQL

### 1. Clone Repository
```bash
git clone https://github.com/USERNAME/forum-api.git
cd forum-api
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Konfigurasi Environment
Buat file `.env` di root project:
```env
HOST=localhost
PORT=5000
NODE_ENV=development

# Database utama
PGHOST=localhost
PGPORT=5432
PGDATABASE=forumapi
PGUSER=postgres
PGPASSWORD=your_password

# Database test
PGHOST_TEST=localhost
PGPORT_TEST=5432
PGDATABASE_TEST=forumapi_test
PGUSER_TEST=postgres
PGPASSWORD_TEST=your_password

# Token
ACCESS_TOKEN_KEY=your_access_token_secret_key_min_32_chars
REFRESH_TOKEN_KEY=your_refresh_token_secret_key_min_32_chars
ACCESS_TOKEN_AGE=900
```

### 4. Buat Database
```bash
psql -U postgres -c "CREATE DATABASE forumapi;"
psql -U postgres -c "CREATE DATABASE forumapi_test;"
```

### 5. Jalankan Migrasi
```bash
npm run migrate        # database utama
npm run migrate:test   # database test
```

### 6. Jalankan Server
```bash
npm start       # production
npm run dev     # development (auto-reload)
```

Server berjalan di: `http://localhost:5000`

---

## 🧪 Testing

```bash
npm test
```

| Metric | Coverage |
|---|---|
| Statements | 100% |
| Branches | 100% |
| Functions | 100% |
| Lines | 100% |

---

## 📡 Endpoint API

### Users
| Method | Endpoint | Keterangan |
|---|---|---|
| POST | `/users` | Registrasi pengguna |

### Authentications
| Method | Endpoint | Keterangan |
|---|---|---|
| POST | `/authentications` | Login |
| PUT | `/authentications` | Refresh access token |
| DELETE | `/authentications` | Logout |

### Threads
| Method | Endpoint | Auth | Keterangan |
|---|---|---|---|
| POST | `/threads` | ✅ | Buat thread baru |
| GET | `/threads/{threadId}` | ❌ | Lihat detail thread |

### Comments
| Method | Endpoint | Auth | Keterangan |
|---|---|---|---|
| POST | `/threads/{threadId}/comments` | ✅ | Tambah komentar |
| DELETE | `/threads/{threadId}/comments/{commentId}` | ✅ | Hapus komentar |

### Replies
| Method | Endpoint | Auth | Keterangan |
|---|---|---|---|
| POST | `/threads/{threadId}/comments/{commentId}/replies` | ✅ | Tambah balasan |
| DELETE | `/threads/{threadId}/comments/{commentId}/replies/{replyId}` | ✅ | Hapus balasan |

---

## 📄 Contoh Response

### GET /threads/{threadId}
```json
{
  "status": "success",
  "data": {
    "thread": {
      "id": "thread-123",
      "title": "sebuah thread",
      "body": "sebuah body thread",
      "date": "2021-08-08T07:19:09.775Z",
      "username": "dicoding",
      "comments": [
        {
          "id": "comment-123",
          "username": "johndoe",
          "date": "2021-08-08T07:22:33.555Z",
          "replies": [],
          "content": "sebuah komentar"
        },
        {
          "id": "comment-456",
          "username": "dicoding",
          "date": "2021-08-08T07:26:21.338Z",
          "replies": [],
          "content": "**komentar telah dihapus**"
        }
      ]
    }
  }
}
```

---

## 👤 Author

**Rahmat** — Dicoding Student

---

## 📝 Lisensi

Project ini dibuat untuk keperluan submission kursus Dicoding.