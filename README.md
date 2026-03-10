# Kültür Platformu Freiburg (KPF)

İki dilli (Türkçe/Almanca) kültür platformu web uygulaması ve admin paneli.

## 🚀 Hızlı Başlangıç

### Backend (Visual Studio'da Ayrı Proje)

Backend projeniz Visual Studio'da hazır olmalıdır. Backend klasörü bu frontend reposunda bulunmamaktadır.

1. Visual Studio'da backend projesini açın
2. Package Manager Console'dan:
   ```powershell
   Add-Migration InitialCreate
   Update-Database
   ```
3. F5 ile backend'i başlatın
   - API: `http://localhost:5000/api`
   - Swagger: `https://localhost:5001/swagger`

### Frontend Kurulum

1. **Bağımlılıkları yükleyin:**

   ```bash
   npm install
   ```

2. **API URL'ini kontrol edin (`.env` dosyası):**

   ```
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Frontend'i başlatın:**
   ```bash
   npm run dev
   ```

   - Uygulama: `http://localhost:5173`

## 🔐 Admin Paneli

### Erişim:

- **URL:** `http://localhost:5173/#admin`

### Özellikler:

- ✅ Dashboard (İstatistikler)
- ✅ Etkinlik Yönetimi (CRUD, Resim/Video Upload)
- ✅ Kurs Yönetimi
- ✅ Ekip Yönetimi
- ✅ Partner Yönetimi
- ✅ Sayfa İçerikleri
- ✅ Gönüllü Başvuruları

## 📚 Detaylı Dokümantasyon

Backend API dokümantasyonu için: [ADMIN_SETUP.md](ADMIN_SETUP.md)

**Not:** Backend projesi bu frontend repo'sundan ayrıdır ve Visual Studio'da yönetilir.

## 🛠️ Teknolojiler

- **Backend:** ASP.NET Core (Visual Studio'da ayrı proje)
- **Frontend:** React 19, TypeScript, Vite, TailwindCSS
- **Frontend:** React 19, TypeScript, Vite, TailwindCSS
- **Database:** SQL Server

## 📝 Lisans

© 2024 Kültür Platformu Freiburg
