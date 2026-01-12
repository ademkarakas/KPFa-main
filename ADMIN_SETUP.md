# KPF Admin Panel Kurulum Kılavuzu

## Backend Kurulum (Visual Studio)

### 1. Veritabanı Migration

Visual Studio'da Package Manager Console'u açın:

```
Tools > NuGet Package Manager > Package Manager Console
```

Aşağıdaki komutları sırasıyla çalıştırın:

```powershell
Add-Migration InitialCreate
Update-Database
```

### 2. Backend'i Çalıştırma

- Visual Studio'da `KPF.API` projesini başlatın (F5 veya Ctrl+F5)
- Backend `https://localhost:5001` veya `http://localhost:5000` adresinde çalışacak
- Swagger UI: `https://localhost:5001/swagger`

### 3. Varsayılan Admin Hesabı

Veritabanı oluşturulduğunda otomatik olarak admin hesabı eklenir:

- **Email:** admin@kpf.de
- **Şifre:** Admin123!

## Frontend Kurulum

### 1. Bağımlılıkları Yükle

```bash
npm install
```

### 2. Frontend'i Başlat

```bash
npm run dev
```

Frontend `http://localhost:5173` adresinde çalışacak.

## Admin Paneline Erişim

### URL Yöntemleri:

1. **Hash Route:** `http://localhost:5173/#admin`
2. **Path Route:** `http://localhost:5173/admin` (dev server ile)

### Giriş:

- Email: `admin@kpf.de`
- Şifre: `Admin123!`

## API Endpoints

### Authentication

- `POST /api/auth/login` - Admin girişi

### Activities

- `GET /api/activities` - Tüm etkinlikler
- `GET /api/activities/{id}` - Tekil etkinlik
- `POST /api/activities` - Yeni etkinlik (Auth gerekli)
- `PUT /api/activities/{id}` - Etkinlik güncelle (Auth gerekli)
- `DELETE /api/activities/{id}` - Etkinlik sil (Auth gerekli)

### Courses

- `GET /api/courses` - Tüm kurslar
- `POST /api/courses` - Yeni kurs (Auth gerekli)
- `PUT /api/courses/{id}` - Kurs güncelle (Auth gerekli)
- `DELETE /api/courses/{id}` - Kurs sil (Auth gerekli)

### Team Members

- `GET /api/teammembers` - Tüm ekip üyeleri
- `POST /api/teammembers` - Yeni üye (Auth gerekli)
- `PUT /api/teammembers/{id}` - Üye güncelle (Auth gerekli)
- `DELETE /api/teammembers/{id}` - Üye sil (Auth gerekli)

### Partners

- `GET /api/partners` - Tüm partnerler
- `POST /api/partners` - Yeni partner (Auth gerekli)
- `PUT /api/partners/{id}` - Partner güncelle (Auth gerekli)
- `DELETE /api/partners/{id}` - Partner sil (Auth gerekli)

### Page Contents

- `GET /api/pagecontents` - Tüm sayfa içerikleri
- `GET /api/pagecontents/{pageKey}` - Belirli sayfa
- `POST /api/pagecontents` - Yeni içerik (Auth gerekli)
- `PUT /api/pagecontents/{id}` - İçerik güncelle (Auth gerekli)

### Volunteers

- `GET /api/volunteers` - Tüm başvurular (Auth gerekli)
- `POST /api/volunteers` - Yeni başvuru

### Upload

- `POST /api/upload` - Resim yükle (Auth gerekli)

## Admin Panel Özellikleri

### ✅ Tamamlanan Özellikler:

1. **Admin Login** - JWT token ile güvenli giriş
2. **Dashboard** - İstatistikler ve genel bakış
3. **Activities Yönetimi** - CRUD işlemleri, resim/video yükleme, galeri
4. **Responsive Sidebar** - Kolay navigasyon

### 🚧 Devam Eden Özellikler:

- Courses yönetim sayfası
- Team Members yönetim sayfası
- Partners yönetim sayfası
- Page Contents editörü
- Volunteer Submissions görüntüleme

## Proje Yapısı

```
KPF/
├── backend/
│   └── KPF.API/
│       ├── Controllers/       # API endpoints
│       ├── Models/           # Entity modelleri
│       ├── DTOs/             # Data Transfer Objects
│       ├── Data/             # DbContext, Repository, UnitOfWork
│       ├── Services/         # JWT token service
│       └── Program.cs        # Configuration
├── pages/
│   ├── admin/
│   │   ├── Admin.tsx         # Ana admin container
│   │   ├── AdminLogin.tsx    # Login sayfası
│   │   ├── AdminLayout.tsx   # Layout ve sidebar
│   │   ├── AdminDashboard.tsx # Dashboard
│   │   └── AdminActivities.tsx # Etkinlik yönetimi
│   └── [diğer sayfalar]
├── services/
│   └── api.ts                # API client fonksiyonları
└── App.tsx                   # Ana uygulama
```

## Teknolojiler

### Backend:

- ASP.NET Core 9.0 Web API
- Entity Framework Core 9.0
- SQL Server
- JWT Bearer Authentication
- BCrypt (Password hashing)
- AutoMapper
- Swagger/OpenAPI

### Frontend:

- React 19
- TypeScript
- Vite
- TailwindCSS
- Lucide Icons

## Güvenlik

- Tüm admin endpoints JWT token ile korunur
- Şifreler BCrypt ile hash'lenir
- CORS politikaları yapılandırılmıştır
- File upload validasyonu (sadece resim, max 5MB)

## Notlar

- Backend ve Frontend'in aynı anda çalışması gerekir
- Admin paneli sadece `/admin` veya `/#admin` üzerinden erişilebilir
- Token localStorage'da saklanır (24 saat geçerli)
- Resimler `wwwroot/uploads` klasörüne yüklenir
