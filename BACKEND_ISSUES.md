# Backend API Notları

## ⚠️ Önemli: API Endpoint Düzeltmeleri

### 1. Profil Güncelleme (DÜZELTILDI ✅)

**Backend Endpoint:** `PUT /api/Admins/{id}`

**Request Body:**

```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "user@example.com",
  "name": "User Name"
}
```

**Frontend'de yapılan değişiklikler:**

- Login başarılı olduğunda admin ID localStorage'a kaydediliyor
- `/api/auth/update-profile` yerine `/api/Admins/{id}` kullanılıyor
- Her üç alan da (id, email, name) body'de gönderiliyor

---

### 2. Şifre Değiştirme (KONTROL EDİLMELİ ⚠️)

**Frontend'de kullanılan:** `POST /api/Auth/change-password`

**Request Body:**

```json
{
  "currentPassword": "current123",
  "newPassword": "new123"
}
```

**Problem:** Şifre değiştirildiğinde başarılı mesajı geliyor ama yeni şifre ile giriş yapılamıyor. Eski şifre hala çalışıyor.

**Backend'de kontrol edilmesi gerekenler:**

1. `/api/Auth/change-password` endpoint'i gerçekten şifreyi güncelliyor mu?
2. Veritabanında şifre hash'i güncellenmiş mi?
3. Endpoint doğru validation yapıyor mu? (currentPassword kontrolü)

---

### 3. Dashboard Access (403 Forbidden ⚠️)

**Endpoint:** `GET /api/Dashboard/overview`

**Problem:** Yeni oluşturulan kullanıcı ile giriş yapıldığında 403 Forbidden hatası alınıyor.

**Backend'de kontrol edilmesi gerekenler:**

1. Yeni kullanıcının doğru roller/permissions atanmış mı?
2. Dashboard endpoint'i hangi roller için erişilebilir?
3. JWT token'da doğru claims/roles var mı?

---

## ✅ Frontend'de Tamamlanan Düzeltmeler

1. **Admin ID Yönetimi:**
   - Login başarısında `adminId` localStorage'a kaydediliyor
   - Logout'ta `adminId` temizleniyor
2. **Profil Güncelleme API Entegrasyonu:**
   - `PUT /api/Admins/{id}` endpoint'i kullanılıyor
   - Body format backend spesifikasyonuna uygun

3. **Error Handling:**
   - Admin ID yoksa açıklayıcı hata mesajı gösteriliyor
   - Kullanıcıdan tekrar giriş yapması isteniyor

---

## 🔍 Backend'de Yapılması Gerekenler

### Yüksek Öncelikli:

1. ✅ **Profil Güncelleme** - Frontend düzeltildi, backend'de zaten çalışıyor olmalı
2. ⚠️ **Şifre Değiştirme** - `/api/Auth/change-password` endpoint'inin düzgün çalıştığından emin olun
3. ⚠️ **Dashboard Yetkilendirme** - Yeni kullanıcılar için doğru permissions/roles ayarlayın

### Şifre Değiştirme Endpoint'i için Kontrol Listesi:

- [ ] Endpoint mevcut mu?: `POST /api/Auth/change-password`
- [ ] CurrentPassword doğrulanıyor mu?
- [ ] NewPassword hash'leniyor mu?
- [ ] Veritabanında güncelleme yapılıyor mu?
- [ ] Başarı/hata durumları doğru dönüyor mu?
- [ ] Unit test var mı?

### Dashboard Access için Kontrol Listesi:

- [ ] Yeni kullanıcı için default roller atanıyor mu?
- [ ] Dashboard endpoint hangi policy/role gerektiriyor?
- [ ] JWT token doğru claims içeriyor mu?
- [ ] Authorization middleware doğru çalışıyor mu?
