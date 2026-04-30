# Forum API

Forum API adalah RESTful API untuk platform diskusi yang dibangun dengan Node.js dan Express.js, menggunakan arsitektur Clean Architecture.

## Teknologi yang Digunakan

- **Runtime**: Node.js v22 LTS
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (jsonwebtoken)
- **Testing**: Jest + Supertest
- **Process Manager**: PM2
- **Web Server**: NGINX (reverse proxy + rate limiting)
- **SSL**: Let's Encrypt (Certbot)
- **CI/CD**: GitHub Actions
- **Cloud**: AWS EC2

## Fitur

- Registrasi dan autentikasi pengguna (JWT)
- CRUD Thread
- CRUD Komentar
- CRUD Balasan Komentar
- Like/Unlike Komentar
- Rate limiting 90 req/menit pada endpoint `/threads`
- HTTPS

## Arsitektur

Proyek ini menggunakan Clean Architecture dengan layer:

- **Domains** — entity dan interface repository
- **Applications** — use cases / business logic
- **Infrastructure** — implementasi repository, database, security
- **Interfaces** — HTTP handler dan routing

## Instalasi

```bash
# Clone repository
git clone https://github.com/rahmathr/forum-api.git
cd forum-api

# Install dependencies
npm install

# Setup environment variables
# Buat file .env sesuai contoh di bawah

# Jalankan migrasi database
npm run migrate

# Jalankan aplikasi
npm start
```

## Environment Variables

```env
HOST=localhost
PORT=5000
NODE_ENV=production

PGHOST=localhost
PGPORT=5432
PGDATABASE=forum_api
PGUSER=forum_user
PGPASSWORD=your_password

PGHOST_TEST=localhost
PGPORT_TEST=5432
PGDATABASE_TEST=forum_api_test
PGUSER_TEST=forum_user
PGPASSWORD_TEST=your_password

ACCESS_TOKEN_KEY=your_access_token_key
REFRESH_TOKEN_KEY=your_refresh_token_key
ACCESS_TOKEN_AGE=1800
```

## Testing

```bash
# Jalankan semua test
npm test
```

Test Coverage: ~99.63% (150 tests, 34 test suites)

## API Endpoints

| Method | Endpoint | Deskripsi | Auth |
|--------|----------|-----------|------|
| POST | `/users` | Registrasi user | ❌ |
| POST | `/authentications` | Login | ❌ |
| PUT | `/authentications` | Refresh token | ❌ |
| DELETE | `/authentications` | Logout | ✅ |
| POST | `/threads` | Buat thread | ✅ |
| GET | `/threads/:threadId` | Detail thread | ❌ |
| POST | `/threads/:threadId/comments` | Buat komentar | ✅ |
| DELETE | `/threads/:threadId/comments/:commentId` | Hapus komentar | ✅ |
| POST | `/threads/:threadId/comments/:commentId/replies` | Buat balasan | ✅ |
| DELETE | `/threads/:threadId/comments/:commentId/replies/:replyId` | Hapus balasan | ✅ |
| PUT | `/threads/:threadId/comments/:commentId/likes` | Like/Unlike komentar | ✅ |

## URL Production

**https://forumapi.ddns.net**

## CI/CD

- **CI**: GitHub Actions — testing otomatis saat pull request ke branch `main`
- **CD**: GitHub Actions — auto deploy ke AWS EC2 saat push ke branch `main`

## NGINX Rate Limiting

Resource `/threads` dibatasi 90 request per menit per IP untuk mencegah serangan DDoS.

## Lisensi

ISC
