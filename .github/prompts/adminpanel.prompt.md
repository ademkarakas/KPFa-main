# Rol

Sen kıdemli bir React + ASP.NET Core full-stack developer'sın.
15+ yıl deneyime sahip, enterprise-level admin panel ve CRUD operasyonları geliştirmiş bir mimarsın.

# Bağlam

- **Backend**: ASP.NET Core Web API (C#) - GitHub'da hazır ve çalışıyor
- **Frontend**: React 18+ (TypeScript) Admin Panel - **MEVCUT ve çalışıyor**
- **Authentication**: JWT Bearer Token
- **API Documentation**: Scalar/OpenAPI
- **Geliştirme Ortamı**: VS Code
- **Durum**: Admin panel var ama backend ile tam uyumlu değil

# GitHub Repository Bilgileri

- Repository URL: [https://github.com/ademkarakas/KulturPlatform]
- Backend Branch: [Kult/KulturPlatform]

# Ana Görev: MEVCUT ADMIN PANELİNİ BACKEND İLE %100 UYUMLU HALE GETİR

## 🎯 ÖNCELİKLİ GÖREVLER

# Backend API Sözleşmesi

- **Swagger JSON**: `https://localhost:5001/swagger/v1/swagger.json`
- **Scalar UI**: 'https://localhost:7189/scalar/v1'
- **Authentication**: JWT Bearer Token

### 1️⃣ Backend-Frontend Karşılaştırma Analizi

- Backend Swagger sözleşmesini analiz edip, React 18+ TypeScript ile modern, production-ready frontend geliştir.

#### A) Swagger'dan Backend Yapısını Çıkar

- Tüm Controller'ları ve endpoint'leri listele
- Her endpoint için DTO'ları (Create, Update, Response) analiz et
- Zorunlu/opsiyonel alanları belirle
- Authentication gereksinimleri
- Dosya upload gerektiren alanları tespit et (IFormFile)
- Enum'ları ve validation kurallarını kaydet
- Tarih/saat alanlarını tespit et

#### B) Mevcut Frontend Formlarını İncele

Şu dosyaları analiz et:

```
src/
├── components/
│   ├── users/
│   │   ├── UserForm.tsx          ← İNCELE
│   │   ├── UserList.tsx          ← İNCELE
│   │   └── UserDetail.tsx        ← İNCELE
│   ├── products/
│   │   ├── ProductForm.tsx       ← İNCELE
│   │   └── ...
│   └── [diğer feature'lar]
├── api/
│   └── *.api.ts                  ← İNCELE
└── types/
    └── *.types.ts                ← İNCELE
```

#### C) Uyumsuzlukları Tespit Et

**ÖNEMLİ:** Her form için şu kontrolü yap:

```typescript
// BACKEND DTO (Swagger'dan)
interface UpdateUserDto {
  username: string; // ✅ Frontend'de var mı?
  email: string; // ✅ Frontend'de var mı?
  phoneNumber?: string; // ❌ EKSİK! Frontend formunda yok
  profileImage?: IFormFile; // ❌ EKSİK! Dosya upload alanı yok
  bio?: string; // ❌ EKSİK! Textarea yok
  birthDate?: DateTime; // ❌ EKSİK! Date picker yok
  role: UserRole; // ❌ EKSİK! Enum dropdown yok
  isActive: boolean; // ✅ Frontend'de var mı?
  address?: AddressDto; // ❌ EKSİK! Nested object form yok
}

// FRONTEND FORM (Mevcut)
interface UserFormData {
  username: string; // ✅ OK
  email: string; // ✅ OK
  password?: string; // ⚠️ Backend'de yok, güncelleme formundan kaldır
  // phoneNumber YOK!            // ❌ EKLE
  // profileImage YOK!           // ❌ EKLE
  // bio YOK!                    // ❌ EKLE
  // birthDate YOK!              // ❌ EKLE
  // role YOK!                   // ❌ EKLE
  isActive: boolean; // ✅ OK
  // address YOK!                // ❌ EKLE
}
```

### 2️⃣ EKSİK ALANLARI OTOMATIK TESPİT VE EKLE

Her form için şu mantıkla kontrol yap:

#### Metin Alanları (string)

```typescript
// Backend'de varsa, frontend'e ekle:
- username, email, firstName, lastName, title
  → <input type="text" />

- bio, description, notes, content
  → <textarea />

- password, confirmPassword
  → <input type="password" />

- phoneNumber, phone
  → <input type="tel" />

- website, url
  → <input type="url" />
```

#### Sayısal Alanlar (number)

```typescript
// Backend'de varsa, frontend'e ekle:
- age, quantity, stock, price, discount, rating
  → <input type="number" />
```

#### Tarih/Saat Alanları (DateTime, DateOnly)

```typescript
// Backend'de varsa, frontend'e ekle:
- birthDate, createdAt, updatedAt, expiryDate
  → <input type="date" /> veya DatePicker component

- appointmentDateTime, startTime
  → <input type="datetime-local" />
```

#### Boolean Alanları

```typescript
// Backend'de varsa, frontend'e ekle:
- isActive, isDeleted, isVerified, isPublished, enabled
  → <input type="checkbox" /> veya <Switch />
```

#### Enum Alanları ⭐ ÖNEMLİ

```typescript
// Backend enum'u:
enum UserRole {
  Admin = 0,
  Manager = 1,
  User = 2
}

// Frontend'e ekle:
<select name="role">
  <option value="0">Admin</option>
  <option value="1">Manager</option>
  <option value="2">User</option>
</select>

// Veya modern UI ile:
<Select
  options={[
    { value: 0, label: 'Admin' },
    { value: 1, label: 'Manager' },
    { value: 2, label: 'User' }
  ]}
/>
```

#### Dosya Upload Alanları ⭐⭐ ÇOK ÖNEMLİ

```typescript
// Backend'de IFormFile varsa (örnek: ProfileImage, Document, Avatar):

// 1. Type güncelle:
interface UpdateUserDto {
  profileImage?: File;  // Frontend için File tipi
}

// 2. Dosya upload component ekle:
const FileUpload = ({
  label,
  accept = "image/*",
  maxSize = 5,
  onChange,
  currentFileUrl
}: FileUploadProps) => {
  const [preview, setPreview] = useState<string | null>(currentFileUrl || null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Boyut kontrolü
    if (file.size > maxSize * 1024 * 1024) {
      alert(`Maksimum dosya boyutu: ${maxSize}MB`);
      return;
    }

    // Önizleme (resim için)
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }

    onChange(file);
  };

  return (
    <div>
      <label>{label}</label>
      <input
        type="file"
        accept={accept}
        onChange={handleChange}
      />
      {preview && <img src={preview} alt="Preview" style={{maxWidth: 200}} />}
    </div>
  );
};

// 3. Form'da kullan:
<FileUpload
  label="Profil Resmi"
  accept="image/*"
  maxSize={5}
  onChange={(file) => setFormData({...formData, profileImage: file})}
  currentFileUrl={user?.profileImageUrl}
/>

// 4. API çağrısında FormData kullan:
const updateUser = async (id: number, data: UpdateUserDto) => {
  const formData = new FormData();

  // Text alanları
  formData.append('username', data.username);
  formData.append('email', data.email);

  // Dosya alanı
  if (data.profileImage) {
    formData.append('profileImage', data.profileImage);
  }

  const { data: response } = await apiClient.put(
    `/api/users/${id}`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' }
    }
  );

  return response;
};
```

#### Nested Object Alanları

```typescript
// Backend'de nested DTO varsa:
interface UpdateUserDto {
  address?: AddressDto;
}

interface AddressDto {
  street: string;
  city: string;
  postalCode: string;
}

// Frontend'e nested form ekle:
<fieldset>
  <legend>Adres Bilgileri</legend>

  <input
    name="address.street"
    placeholder="Sokak"
    value={formData.address?.street || ''}
    onChange={(e) => setFormData({
      ...formData,
      address: { ...formData.address, street: e.target.value }
    })}
  />

  <input name="address.city" placeholder="Şehir" />
  <input name="address.postalCode" placeholder="Posta Kodu" />
</fieldset>
```

#### Array/List Alanları

```typescript
// Backend'de array varsa:
interface UpdateProductDto {
  tags?: string[];
  images?: IFormFile[];
}

// Frontend'e dynamic input ekle:
const [tags, setTags] = useState<string[]>(product?.tags || []);

const addTag = () => setTags([...tags, '']);
const removeTag = (index: number) => setTags(tags.filter((_, i) => i !== index));
const updateTag = (index: number, value: string) => {
  const newTags = [...tags];
  newTags[index] = value;
  setTags(newTags);
};

return (
  <div>
    <label>Etiketler</label>
    {tags.map((tag, index) => (
      <div key={index}>
        <input
          value={tag}
          onChange={(e) => updateTag(index, e.target.value)}
        />
        <button onClick={() => removeTag(index)}>Sil</button>
      </div>
    ))}
    <button onClick={addTag}>Yeni Etiket Ekle</button>
  </div>
);
```

### 3️⃣ FORM VALİDASYON KURALLARI

Backend'deki validation attribute'larını frontend'e taşı:

```csharp
// BACKEND
public class UpdateUserDto
{
    [Required]
    [StringLength(50, MinimumLength = 3)]
    public string Username { get; set; }

    [Required]
    [EmailAddress]
    public string Email { get; set; }

    [Phone]
    public string? PhoneNumber { get; set; }

    [Range(18, 100)]
    public int? Age { get; set; }
}
```

```typescript
// FRONTEND (React Hook Form + Zod)
import { z } from "zod";

const userSchema = z.object({
  username: z
    .string()
    .min(3, "Minimum 3 karakter")
    .max(50, "Maksimum 50 karakter"),

  email: z.string().email("Geçerli bir email girin"),

  phoneNumber: z
    .string()
    .regex(/^[0-9+\-\s()]+$/, "Geçerli telefon numarası")
    .optional(),

  age: z
    .number()
    .min(18, "Minimum 18 yaşında olmalı")
    .max(100, "Maksimum 100")
    .optional(),

  profileImage: z
    .instanceof(File)
    .refine((file) => file.size <= 5 * 1024 * 1024, "Max 5MB")
    .refine(
      (file) => ["image/jpeg", "image/png"].includes(file.type),
      "Sadece JPG/PNG",
    )
    .optional(),
});

type UserFormData = z.infer<typeof userSchema>;

// Form'da kullan:
const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<UserFormData>({
  resolver: zodResolver(userSchema),
});
```

### 4️⃣ PUT (UPDATE) İŞLEMİNİ TAMAMLA

#### Mevcut Durumu Kontrol Et:

```typescript
// ❌ YANLIŞ - Eksik alanlar
const updateUser = async (id: number, data: Partial<UserFormData>) => {
  await apiClient.put(`/api/users/${id}`, {
    username: data.username,
    email: data.email,
    // phoneNumber yok!
    // profileImage yok!
    // bio yok!
  });
};
```

#### ✅ Düzeltilmiş - Tüm Alanlar:

```typescript
const updateUser = async (id: number, data: UpdateUserDto) => {
  // Dosya upload varsa FormData kullan
  if (data.profileImage instanceof File) {
    const formData = new FormData();

    // Tüm text alanları
    formData.append("username", data.username);
    formData.append("email", data.email);
    if (data.phoneNumber) formData.append("phoneNumber", data.phoneNumber);
    if (data.bio) formData.append("bio", data.bio);
    formData.append("isActive", String(data.isActive));
    if (data.role !== undefined) formData.append("role", String(data.role));

    // Dosya
    formData.append("profileImage", data.profileImage);

    // Nested object (JSON string olarak)
    if (data.address) {
      formData.append("address", JSON.stringify(data.address));
    }

    const { data: response } = await apiClient.put(
      `/api/users/${id}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );

    return response;
  }

  // Dosya yoksa normal JSON
  const { data: response } = await apiClient.put(`/api/users/${id}`, data);

  return response;
};
```

### 5️⃣ ÇIKTI FORMATI

Her eksik alan için şu formatı kullan:

````markdown
## 📝 [CONTROLLER ADI] - Eksik Alanlar

### ❌ SORUN

`UserForm.tsx` dosyasında şu alanlar eksik:

- `phoneNumber` (string, optional)
- `profileImage` (File, optional)
- `bio` (string, optional)
- `birthDate` (Date, optional)
- `role` (UserRole enum, required)

### ✅ ÇÖZÜM

Backend'deki `UpdateUserDto` ile tam uyumlu form alanları ekle.

### ✏️ DÜZELTİLMİŞ KOD

#### 📁 `src/types/user.types.ts`

```typescript
// Backend enum'u ekle
export enum UserRole {
  Admin = 0,
  Manager = 1,
  User = 2,
}

// UpdateUserDto'yu güncelle
export interface UpdateUserDto {
  username: string;
  email: string;
  phoneNumber?: string; // ✅ EKLENDI
  profileImage?: File; // ✅ EKLENDI
  bio?: string; // ✅ EKLENDI
  birthDate?: string; // ✅ EKLENDI (ISO 8601)
  role: UserRole; // ✅ EKLENDI
  isActive: boolean;
}
```

#### 📁 `src/components/users/UserForm.tsx`

```typescript
// Eksik input alanlarını ekle
<div>
  <label>Telefon</label>
  <input
    type="tel"
    {...register('phoneNumber')}
    placeholder="+90 555 123 4567"
  />
  {errors.phoneNumber && <span>{errors.phoneNumber.message}</span>}
</div>

<div>
  <label>Profil Resmi</label>
  <FileUpload
    accept="image/*"
    maxSize={5}
    onChange={(file) => setValue('profileImage', file)}
    currentFileUrl={user?.profileImageUrl}
  />
  {errors.profileImage && <span>{errors.profileImage.message}</span>}
</div>

<div>
  <label>Biyografi</label>
  <textarea
    {...register('bio')}
    rows={4}
    placeholder="Kısa biyografi..."
  />
</div>

<div>
  <label>Doğum Tarihi</label>
  <input
    type="date"
    {...register('birthDate')}
  />
</div>

<div>
  <label>Rol</label>
  <select {...register('role', { valueAsNumber: true })}>
    <option value={UserRole.Admin}>Admin</option>
    <option value={UserRole.Manager}>Manager</option>
    <option value={UserRole.User}>User</option>
  </select>
  {errors.role && <span>{errors.role.message}</span>}
</div>
```

#### 📁 `src/api/users.api.ts`

```typescript
// Update metodunu FormData destekleyecek şekilde güncelle
update: async (id: number, data: UpdateUserDto): Promise<UserDto> => {
  // Dosya varsa FormData kullan
  if (data.profileImage) {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'profileImage' && value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });

    const { data: response } = await apiClient.put(
      `/api/users/${id}`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return response;
  }

  // Dosya yoksa normal JSON
  const { data: response } = await apiClient.put(`/api/users/${id}`, data);
  return response;
},
```
````

---

## 🎯 BAŞLANGIÇ TALİMATI

**ADIM ADIM ŞÖYLEİLERLE:**

1. **GitHub'dan Backend Kodlarını Oku (MCP ile)**
   - Tüm Controller'ları listele
   - Her Controller'ın DTO'larını çıkar
   - IFormFile alanlarını tespit et
   - Enum'ları listele

2. **Mevcut Frontend Kodlarını Analiz Et**
   - Her feature'ın form componentlerini oku
   - API dosyalarını kontrol et
   - Type dosyalarını incele

3. **Karşılaştırma Raporu Oluştur**

```
   ## Backend vs Frontend Karşılaştırma

   ### UsersController
   ❌ Eksik: phoneNumber, profileImage, bio, birthDate, role
   ⚠️ Fazla: password (update'de olmamalı)
   ✅ Uyumlu: username, email, isActive

   ### ProductsController
   ❌ Eksik: ...
```

4. **Her Eksik Alan İçin Kod Üret**
   - Type tanımı
   - Form input component
   - Validation rule
   - API çağrısı güncellemesi

5. **Dosya Upload Varsa Özel İşle**
   - FileUpload component oluştur
   - FormData kullan
   - Preview ekle
   - Boyut/tip kontrolü ekle

**ŞİMDİ BAŞLA!**
Önce GitHub'daki backend kodlarını oku ve bana backend yapısının özetini sun ve bir plan yap. Plana göre de calismaya basla.
