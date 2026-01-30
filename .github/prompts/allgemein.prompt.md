---
agent: agent
model: GPT-5.2
description: Dinamik web sitesi için buton standardizasyonu, teal tema uygulaması, i18n entegrasyonu (DE/TR) ve AdminSatzung güvenli refactor talimatları
---

# Proje Gereksinimi

Mevcut dinamik web sitesinde aşağıdaki iyileştirmeler yapılacaktır:

## Kritik Gereksinimler

1. **Buton Standardizasyonu**: Tüm butonlar "medium" boyutunda olacak ve mobil görünüm dahil tüm ekranlarda tutarlı olacak
2. **Renk Teması**: Proje ana rengi 'teal' olarak belirlenmiştir, admin paneli bu renge uygun güncellenecek
3. **AdminSatzung Güvenli Refactor**: AdminSatzung sayfası, AdminVolunterPage'in güvenli yapısı baz alınarak yeniden oluşturulacak (mevcut AdminSatzung silinmeden önce kopyalanıp yeniden yazılacak)
4. **i18n Entegrasyonu**: Tüm label ve placeholder metinleri translation key kullanacak, hardcode olmayacak, AdminPaneli icin de bu geçerli olacak
5. **Çoklu Dil Desteği**: Almanca (de) ve Türkçe (tr) dil desteği JSON formatında sağlanacak
6. **Backend Uyumluluğu**: Mevcut backend kodları değiştirilmeyecek, tüm entegrasyonlar aynen çalışmaya devam edecek
7. **Admin Paneli**: Admin paneli ve ilgili componentler 'teal' renk teması kullanacak

# Optimized Prompt

## Role

Frontend Architect

## Skills

```javascript
import { UIComponent } from "@design-system/core";
import { ResponsiveDesign } from "@utilities/breakpoints";
import { ThemingProvider } from "@styles/theme-context";
import { i18nManager } from "@localization/i18next-config";
import { AccessibilityChecker } from "@a11y/standards";
import { PerformanceProfiler } from "@web-vitals/analyzer";
import { SecurityGuidelines } from "@security/web-standards";
import { TestingFrameworks } from "@testing-library/react-jest";
import { ComponentLibrary } from "@storybook/react";
```

## Rules

```javascript
interface FrontendArchitectRules {
  "@component": (name: string, description: string) => void;
  "@styling": (criteria: 'consistent' | 'responsive' | 'themed') => void;
  "@i18n": (keyConvention: string, fallbackMechanism: boolean) => void;
  "@security": (level: 'basic' | 'enhanced' | 'critical') => void;
  "@performance": (metric: 'LCP' | 'FID' | 'CLS', target: string) => void;
  "@accessibility": (standard: 'WCAG_AA') => void;
  "@testing": (strategy: 'unit' | 'integration' | 'e2e', coverage: number) => void;
  "@designSystem": (useTokens: boolean, implementSystem: boolean) => void;
}

const Rules: FrontendArchitectRules = {
  "@component": (name, description) => console.log(`[RULE]: Tüm UI elementleri yeniden kullanılabilir componentler olarak tanımlanmalı. Component: ${name}, Açıklama: ${description}`),

  "@styling": (criteria) => {
    switch (criteria) {
      case 'consistent':
        console.log("[RULE]: Tüm butonlar 'medium' boyutunda olmalı. Design Token'lar kullanılarak tutarlı styling sağlanmalı.");
        break;
      case 'responsive':
        console.log("[RULE]: Mobil-first yaklaşımla responsive design uygulanmalı. Tüm butonlar mobile görünümde de 'medium' boyutunda olmalı.");
        break;
      case 'themed':
        console.log("[RULE]: Admin paneli 'teal' renk teması kullanmalı. Global theming context üzerinden tema uygulanmalı.");
        break;
    }
  },

  "@i18n": (keyConvention, fallbackMechanism) => {
    console.log(`[RULE]: Tüm label ve placeholder metinleri translation key kullanmalı, hardcode OLMAMALI. Key konvansiyonu: "${keyConvention}".`);
    console.log(`[RULE]: i18n fallback mekanizması aktif olmalı: ${fallbackMechanism}.`);
    console.log("[RULE]: Translation dosyaları 'locales/{lang}.json' yapısında olmalı (locales/de.json, locales/tr.json).");
    console.log("[RULE]: Desteklenen diller: Almanca (de) ve Türkçe (tr)");
  },

  "@security": (level) => {
    switch (level) {
      case 'basic':
        console.log("[RULE]: Input sanitization ve güvenli API çağrıları uygulanmalı.");
        break;
      case 'enhanced':
        console.log("[RULE]: AdminSatzung, AdminVolunterPage'in güvenlik yapısını (RBAC, CSRF, XSS protection) aynen kopyalamalı.");
        console.log("[RULE]: AdminSatzung önce AdminSatzung_OLD olarak yedeklenmeli, yeni versiyon oluşturulduktan sonra manuel silinmeli.");
        break;
      case 'critical':
        console.log("[RULE]: Kritik bölümler için düzenli güvenlik auditleri yapılmalı.");
        break;
    }
  },

  "@performance": (metric, target) => console.log(`[RULE]: Core Web Vitals optimizasyonu yapılmalı. Hedef ${metric} < ${target}. Lazy loading uygulanmalı.`),

  "@accessibility": (standard) => console.log(`[RULE]: Tüm UI elementleri ${standard} standartlarına uygun olmalı (semantic HTML, keyboard navigation, ARIA attributes).`),

  "@testing": (strategy, coverage) => console.log(`[RULE]: ${strategy} testleri uygulanmalı. Kritik path'ler için code coverage hedefi: ${coverage}%. Backend entegrasyonları test edilmeli.`),

  "@designSystem": (useTokens, implementSystem) => {
    if (implementSystem) console.log("[RULE]: Mevcut Design System kullanılmalı.");
    if (useTokens) console.log("[RULE]: Design Token'lar kullanılmalı (colors: teal, spacing, typography, button sizes: medium).");
  }
};
```

## Workflow

```javascript
enum DevelopmentPhase {
  DESIGN = "Design & Prototyping",
  PLANNING = "Technical Planning & Architecture",
  DEVELOPMENT = "Feature Implementation & Refactoring",
  TESTING = "Quality Assurance & Bug Fixing",
  DEPLOYMENT = "Deployment & Monitoring",
  MAINTENANCE = "Post-Launch & Iteration"
}

const WorkflowSteps: { phase: DevelopmentPhase; description: string; }[] = [
  {
    phase: DevelopmentPhase.DESIGN,
    description: "1.0 Design Review: 'medium' buton boyutunu ve 'teal' renk temasını design token'lar ile tanımla. AdminVolunterPage yapısını referans al."
  },
  {
    phase: DevelopmentPhase.PLANNING,
    description: "2.0 Technical Specification: AdminSatzung'u AdminVolunterPage yapısı baz alınarak yeniden tasarla. i18n key konvansiyonlarını (labels, placeholders) belirle. Backend API entegrasyonlarının korunacağını doğrula."
  },
  {
    phase: DevelopmentPhase.DEVELOPMENT,
    description: "3.1 Buton Standardizasyonu: Tüm butonları 'medium' boyutuna getir. CSS/Design System ile responsive yapıda tutarlılığı sağla (mobile-first)."
  },
  {
    phase: DevelopmentPhase.DEVELOPMENT,
    description: "3.2 Tema Uygulaması: Admin paneli ve ilgili componentleri 'teal' renk temasına göre güncelle. CSS variables veya theme provider kullan."
  },
  {
    phase: DevelopmentPhase.DEVELOPMENT,
    description: "3.3 i18n Entegrasyonu: Tüm hardcode label ve placeholder'ları translation key'lere dönüştür. locales/de.json ve locales/tr.json dosyalarını oluştur/güncelle."
  },
  {
    phase: DevelopmentPhase.DEVELOPMENT,
    description: "3.4 AdminSatzung Güvenli Refactor: AdminSatzung'u AdminSatzung_OLD olarak yedekle. AdminVolunterPage'in güvenlik yapısını (RBAC, CSRF, XSS protection) kopyalayarak yeni AdminSatzung'u oluştur. Backend entegrasyonları aynen koru."
  },
  {
    phase: DevelopmentPhase.TESTING,
    description: "4.1 Component Testing: Buton boyutlarının tüm breakpoint'lerde 'medium' olduğunu doğrula. Renk temasının doğru uygulandığını test et."
  },
  {
    phase: DevelopmentPhase.TESTING,
    description: "4.2 i18n Testing: Dil değiştirme (de/tr) fonksiyonunu test et. Tüm label/placeholder'ların translation key ile çalıştığını doğrula."
  },
  {
    phase: DevelopmentPhase.TESTING,
    description: "4.3 Backend Integration Testing: Mevcut backend API çağrılarının ve veri akışlarının kesintisiz çalıştığını doğrula. AdminSatzung'un eski versiyon ile aynı fonksiyonelliği sağladığını test et."
  },
  {
    phase: DevelopmentPhase.TESTING,
    description: "4.4 Security & Accessibility Audit: AdminSatzung'un güvenlik standartlarını (RBAC, CSRF, XSS) karşıladığını doğrula. WCAG AA uyumluluğunu kontrol et."
  },
  {
    phase: DevelopmentPhase.DEPLOYMENT,
    description: "5.0 Deployment: Code review sonrası deploy et. AdminSatzung_OLD'u doğrulama sonrası manuel olarak sil (otomatik silme YOK)."
  },
  {
    phase: DevelopmentPhase.MAINTENANCE,
    description: "6.0 Monitoring: Post-deployment'da tüm sistemlerin çalıştığını izle. Kullanıcı feedback'i topla."
  }
];
```

## Variables

- `{{primaryColor}}`: 'teal' (#008080 veya benzeri teal ton) - Admin Paneli ve tüm birincil UI elementleri için
- `{{defaultButtonSize}}`: 'medium' - Tüm butonlar için standart boyut (mobil dahil tüm breakpoint'lerde)
- `{{supportedLanguages}}`: ['de', 'tr'] - Desteklenen diller: Almanca ve Türkçe
- `{{i18nFilePathPattern}}`: 'locales/{lang}.json' - Örnek: locales/de.json, locales/tr.json
- `{{adminPanelBasePage}}`: 'AdminVolunterPage' - Güvenli yapı referansı olarak kullanılacak sayfa
- `{{targetAdminPanelPage}}`: 'AdminSatzung' - Yeniden oluşturulacak sayfa (AdminSatzung_OLD olarak yedeklenecek)
- `{{existingBackendIntegrationStatus}}`: 'MUST_REMAIN_FUNCTIONAL' - Mevcut backend entegrasyonları korunmalı
- `{{translationScope}}`: 'labels_and_placeholders' - Translation key'lerin kapsamı (tüm label ve placeholder'lar)

## Examples

### Example 1: i18n Implementation (Almanca & Türkçe)

**Input**: Bir form field'ın label ve placeholder'ı için translation key kullanımı.

**Output**:

```jsx
import { useTranslation } from "react-i18next";

const SatzungForm = () => {
  const { t } = useTranslation();
  return (
    <div>
      <label>{t("satzung.titleLabel")}</label>
      <input type="text" placeholder={t("satzung.titlePlaceholder")} />
    </div>
  );
};
```

```json
// locales/de.json
{
  "satzung": {
    "titleLabel": "Titel der Satzung",
    "titlePlaceholder": "Bitte Titel eingeben"
  }
}
```

```json
// locales/tr.json
{
  "satzung": {
    "titleLabel": "Tüzük Başlığı",
    "titlePlaceholder": "Lütfen başlık girin"
  }
}
```

### Example 2: Medium Buton Boyutu (Responsive)

**Input**: Tüm butonlar 'medium' boyutunda ve responsive olmalı.

**Output**:

```css
/* Design Tokens kullanarak */
:root {
  --button-height-md: 40px;
  --button-padding-md: 12px 24px;
  --button-font-size-md: 14px;
}

.btn,
.button,
button.primary,
button.secondary {
  height: var(--button-height-md);
  padding: var(--button-padding-md);
  font-size: var(--button-font-size-md);
  border-radius: 4px;
}

/* Mobil için responsive ayar */
@media (max-width: 768px) {
  .btn,
  .button,
  button.primary,
  button.secondary {
    min-width: 100px; /* Minimum genişlik */
    width: auto; /* İçeriğe göre genişle */
  }
}
```

### Example 3: Teal Renk Teması (Admin Panel)

**Input**: Admin panel ana rengi 'teal' olmalı.

**Output**:

```css
:root {
  --color-primary-teal: #008080;
  --color-primary-teal-light: #20b2aa;
  --color-primary-teal-dark: #006666;
}

.admin-panel-header,
.admin-sidebar,
.admin-primary-button {
  background-color: var(--color-primary-teal);
  color: white;
}

.admin-primary-button:hover {
  background-color: var(--color-primary-teal-dark);
}
```

### Example 4: AdminSatzung Güvenli Refactor

**Input**: AdminSatzung'u AdminVolunterPage yapısına göre yeniden oluştur.

**Output**:

```jsx
// 1. Önce mevcut dosyayı yedekle: AdminSatzung.jsx -> AdminSatzung_OLD.jsx

// 2. Yeni AdminSatzung.jsx - AdminVolunterPage yapısını kopyala
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  checkAdminAuth,
  csrfProtection,
  sanitizeInput,
} from "@/utils/security";

const AdminSatzung = () => {
  const { t } = useTranslation();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // AdminVolunterPage'deki güvenlik kontrollerini kopyala
    const verifyAccess = async () => {
      const authorized = await checkAdminAuth();
      setIsAuthorized(authorized);
    };
    verifyAccess();
  }, []);

  const handleSubmit = async (data) => {
    // CSRF ve XSS koruması - AdminVolunterPage'den kopyala
    const sanitizedData = sanitizeInput(data);
    const csrfToken = csrfProtection.getToken();

    // MEVCUT BACKEND API'yi aynen kullan
    await fetch("/api/satzung", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": csrfToken,
      },
      body: JSON.stringify(sanitizedData),
    });
  };

  if (!isAuthorized) return <div>{t("admin.unauthorized")}</div>;

  return (
    <div
      className="admin-panel"
      style={{ backgroundColor: "var(--color-primary-teal)" }}
    >
      <h1>{t("satzung.pageTitle")}</h1>
      <button className="btn medium">{t("satzung.submitButton")}</button>
      {/* Mevcut backend entegrasyonlarını koru */}
    </div>
  );
};

export default AdminSatzung;

// 3. Test sonrası AdminSatzung_OLD.jsx dosyasını manuel sil
```
