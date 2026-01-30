import React, { useState, useEffect } from "react";
import {
  Save,
  Building2,
  Mail,
  MapPin,
  User,
  Shield,
  CheckCircle,
} from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { TEXTS } from "../../constants";

interface ImprintContent {
  id?: string;
  // Organization Info
  organizationName: string;
  organizationType: string;

  // Address (Location Value Object)
  address: {
    street: string;
    houseNo: string;
    zipCode: string;
    city: string;
    state: string;
    country: string;
  };

  // Contact (Value Objects)
  email: string;
  phone: string;

  // Responsible Persons (Name Value Objects)
  president: {
    firstName: string;
    lastName: string;
  };
  vicePresident: {
    firstName: string;
    lastName: string;
  };

  // Legal Structure
  legalStructureTurkish: string;
  legalStructureGerman: string;
  purposeTurkish: string;
  purposeGerman: string;
  taxExemptionTurkish: string;
  taxExemptionGerman: string;

  // Content Responsibility
  contentResponsibilityTurkish: string;
  contentResponsibilityGerman: string;

  // Links Responsibility
  linksResponsibilityTurkish: string;
  linksResponsibilityGerman: string;

  // Copyright
  copyrightTurkish: string;
  copyrightGerman: string;
}

const EMPTY_STATE: ImprintContent = {
  id: "",

  organizationName: "",
  organizationType: "",

  address: {
    street: "",
    houseNo: "",
    zipCode: "",
    city: "",
    state: "",
    country: "",
  },

  email: "",
  phone: "",

  president: { firstName: "", lastName: "" },
  vicePresident: { firstName: "", lastName: "" },

  legalStructureTurkish: "",
  legalStructureGerman: "",
  purposeTurkish: "",
  purposeGerman: "",
  taxExemptionTurkish: "",
  taxExemptionGerman: "",
  contentResponsibilityTurkish: "",
  contentResponsibilityGerman: "",
  linksResponsibilityTurkish: "",
  linksResponsibilityGerman: "",
  copyrightTurkish: "",
  copyrightGerman: "",
};

const AdminImprint: React.FC = () => {
  const [content, setContent] = useState<ImprintContent>(EMPTY_STATE);
  const [loading, setLoading] = useState(false);
  const { language } = useLanguage();
  const t = (key: string) => TEXTS[key]?.[language] || key;

  useEffect(() => {
    loadImprint();
  }, []);

  const loadImprint = async () => {
    try {
      const res = await fetch("https://localhost:7189/api/Imprint");
      if (!res.ok) return;

      const data = await res.json();

      // Backend'den gelen president/vicePresident string - "FirstName LastName" formatında
      const parseFullName = (fullName: string) => {
        const parts = (fullName || "").trim().split(" ");
        return {
          firstName: parts[0] || "",
          lastName: parts.slice(1).join(" ") || "",
        };
      };

      setContent({
        ...EMPTY_STATE, // Önce default değerleri al
        ...data,
        // Null alanlar için fallback
        address: data.address || EMPTY_STATE.address,
        president: parseFullName(data.president),
        vicePresident: parseFullName(data.vicePresident),
        organizationName: data.organizationName || "",
        organizationType: data.organizationType || "",
        email: data.email || "",
        phone: data.phone || "",
      });
    } catch (err) {
      console.warn("Imprint yüklenemedi, boş state kullanılıyor", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        alert("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
        return;
      }

      // Eğer ID yoksa POST, varsa PUT yap
      const isNewRecord = !content.id;
      const url = isNewRecord
        ? "https://localhost:7189/api/Imprint"
        : `https://localhost:7189/api/Imprint/${content.id}`;

      const method = isNewRecord ? "POST" : "PUT";

      // Backend'de President ve VicePresident STRING - "FirstName LastName" formatında
      const presidentFullName =
        `${content.president.firstName} ${content.president.lastName}`.trim();
      const vicePresidentFullName =
        `${content.vicePresident.firstName} ${content.vicePresident.lastName}`.trim();

      // Backend DTO formatı - Direkt command/dto objesi
      const payload = isNewRecord
        ? {
            // POST: CreateImprintCommand { Dto: {...} }
            dto: {
              organizationName: content.organizationName,
              organizationType: content.organizationType,
              address: content.address,
              email: content.email,
              phone: content.phone,
              president: presidentFullName,
              vicePresident: vicePresidentFullName,
              legalStructureTurkish: content.legalStructureTurkish,
              legalStructureGerman: content.legalStructureGerman,
              purposeTurkish: content.purposeTurkish,
              purposeGerman: content.purposeGerman,
              taxExemptionTurkish: content.taxExemptionTurkish,
              taxExemptionGerman: content.taxExemptionGerman,
              contentResponsibilityTurkish:
                content.contentResponsibilityTurkish,
              contentResponsibilityGerman: content.contentResponsibilityGerman,
              linksResponsibilityTurkish: content.linksResponsibilityTurkish,
              linksResponsibilityGerman: content.linksResponsibilityGerman,
              copyrightTurkish: content.copyrightTurkish,
              copyrightGerman: content.copyrightGerman,
            },
          }
        : {
            // PUT: UpdateImprintDto (direkt)
            organizationName: content.organizationName,
            organizationType: content.organizationType,
            address: content.address,
            email: content.email,
            phone: content.phone,
            president: presidentFullName,
            vicePresident: vicePresidentFullName,
            legalStructureTurkish: content.legalStructureTurkish,
            legalStructureGerman: content.legalStructureGerman,
            purposeTurkish: content.purposeTurkish,
            purposeGerman: content.purposeGerman,
            taxExemptionTurkish: content.taxExemptionTurkish,
            taxExemptionGerman: content.taxExemptionGerman,
            contentResponsibilityTurkish: content.contentResponsibilityTurkish,
            contentResponsibilityGerman: content.contentResponsibilityGerman,
            linksResponsibilityTurkish: content.linksResponsibilityTurkish,
            linksResponsibilityGerman: content.linksResponsibilityGerman,
            copyrightTurkish: content.copyrightTurkish,
            copyrightGerman: content.copyrightGerman,
          };

      console.log("📤 Gönderilen payload:", JSON.stringify(payload, null, 2));

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      // POST ise dönen ID'yi kaydet ve veriyi yeniden yükle
      if (isNewRecord) {
        await res.json();
        alert(t("admin_imprint_created"));
        // Backend'den tam veriyi yükle
        await loadImprint();
      } else {
        alert(t("admin_imprint_updated"));
        // Güncel veriyi yükle
        await loadImprint();
      }
    } catch (err) {
      console.error("Imprint işlem hatası:", err);
      alert(
        t("admin_imprint_failed") +
          ": " +
          (err instanceof Error ? err.message : t("admin_unknown_error")),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-20 px-4">
      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Sticky Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-slate-100 sticky top-4 z-50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-kpf-teal/10 rounded-2xl">
              <Shield className="text-kpf-teal" size={28} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800">
                {t("admin_imprint_title")}
              </h1>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <CheckCircle size={10} className="text-green-500" />
                {t("admin_imprint_subtitle")}
              </p>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 px-10 py-3 bg-kpf-teal text-white rounded-2xl hover:bg-kpf-teal/90 transition-all disabled:opacity-50 shadow-xl shadow-kpf-teal/20 font-bold"
          >
            <Save size={18} />
            {loading ? t("admin_saving") : t("admin_publish")}
          </button>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 lg:p-12 space-y-8">
            {/* Kuruluş Bilgileri */}
            <div className="pb-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Building2 size={24} className="text-kpf-teal" />
                Kuruluş Bilgileri / Organisation
              </h2>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="imprint-organization-name"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Kuruluş Adı / Name der Organisation
                  </label>
                  <input
                    id="imprint-organization-name"
                    type="text"
                    value={content.organizationName}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        organizationName: e.target.value,
                      })
                    }
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="imprint-organization-type"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Kuruluş Tipi / Organisationstyp
                  </label>
                  <input
                    id="imprint-organization-type"
                    type="text"
                    value={content.organizationType}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        organizationType: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Adres */}
            <div className="pb-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <MapPin size={24} className="text-kpf-teal" />
                Adres / Adresse
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-3">
                  <label
                    htmlFor="imprint-address-street"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Sokak / Straße
                  </label>
                  <input
                    id="imprint-address-street"
                    type="text"
                    value={content.address.street}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        address: { ...content.address, street: e.target.value },
                      })
                    }
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all"
                  />
                </div>
                <div>
                  <label
                    htmlFor="imprint-address-houseNo"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Bina No / Hausnr.
                  </label>
                  <input
                    id="imprint-address-houseNo"
                    type="text"
                    value={content.address.houseNo}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        address: {
                          ...content.address,
                          houseNo: e.target.value,
                        },
                      })
                    }
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="imprint-address-zipCode"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Posta Kodu / PLZ
                  </label>
                  <input
                    id="imprint-address-zipCode"
                    type="text"
                    value={content.address.zipCode}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        address: {
                          ...content.address,
                          zipCode: e.target.value,
                        },
                      })
                    }
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="imprint-address-city"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Şehir / Stadt
                  </label>
                  <input
                    id="imprint-address-city"
                    type="text"
                    value={content.address.city}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        address: { ...content.address, city: e.target.value },
                      })
                    }
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all"
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="imprint-address-country"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Ülke / Land
                  </label>
                  <input
                    id="imprint-address-country"
                    type="text"
                    value={content.address.country}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        address: {
                          ...content.address,
                          country: e.target.value,
                        },
                      })
                    }
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all"
                  />
                </div>
              </div>
            </div>

            {/* İletişim */}
            <div className="pb-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Mail size={24} className="text-blue-600" />
                İletişim / Kontakt
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="imprint-email"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    E-Mail
                  </label>
                  <input
                    id="imprint-email"
                    type="email"
                    value={content.email}
                    onChange={(e) =>
                      setContent({ ...content, email: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="imprint-phone"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Telefon
                  </label>
                  <input
                    id="imprint-phone"
                    type="tel"
                    value={content.phone}
                    onChange={(e) =>
                      setContent({ ...content, phone: e.target.value })
                    }
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Sorumlu Kişiler */}
            <div className="pb-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <User size={24} className="text-green-600" />
                Sorumlu Kişiler / Verantwortliche Personen
              </h2>

              <div className="space-y-6">
                {/* Başkan */}
                <div>
                  <h3 className="font-semibold text-slate-700 mb-3">
                    Başkan / Vorsitzender
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="imprint-president-firstName"
                        className="block text-sm font-semibold text-slate-700 mb-2"
                      >
                        Ad / Vorname
                      </label>
                      <input
                        id="imprint-president-firstName"
                        type="text"
                        value={content.president.firstName}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            president: {
                              ...content.president,
                              firstName: e.target.value,
                            },
                          })
                        }
                        required
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="imprint-president-lastName"
                        className="block text-sm font-semibold text-slate-700 mb-2"
                      >
                        Soyad / Nachname
                      </label>
                      <input
                        id="imprint-president-lastName"
                        type="text"
                        value={content.president.lastName}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            president: {
                              ...content.president,
                              lastName: e.target.value,
                            },
                          })
                        }
                        required
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Ko-Başkan */}
                <div>
                  <h3 className="font-semibold text-slate-700 mb-3">
                    Ko-Başkan / Ko-Vorsitzender
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="imprint-vicePresident-firstName"
                        className="block text-sm font-semibold text-slate-700 mb-2"
                      >
                        Ad / Vorname
                      </label>
                      <input
                        id="imprint-vicePresident-firstName"
                        type="text"
                        value={content.vicePresident.firstName}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            vicePresident: {
                              ...content.vicePresident,
                              firstName: e.target.value,
                            },
                          })
                        }
                        required
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="imprint-vicePresident-lastName"
                        className="block text-sm font-semibold text-slate-700 mb-2"
                      >
                        Soyad / Nachname
                      </label>
                      <input
                        id="imprint-vicePresident-lastName"
                        type="text"
                        value={content.vicePresident.lastName}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            vicePresident: {
                              ...content.vicePresident,
                              lastName: e.target.value,
                            },
                          })
                        }
                        required
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Yasal Yapı */}
            <div className="pb-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 mb-4">
                Yasal Yapı ve Amaç / Rechtliche Struktur und Zweck
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="imprint-legalStructure-tr"
                      className="block text-sm font-semibold text-slate-700 mb-2"
                    >
                      Yasal Yapı (Türkçe) / Rechtsstruktur (TR)
                    </label>
                    <input
                      id="imprint-legalStructure-tr"
                      type="text"
                      value={content.legalStructureTurkish}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          legalStructureTurkish: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="imprint-legalStructure-de"
                      className="block text-sm font-semibold text-slate-700 mb-2"
                    >
                      Yasal Yapı (Almanca) / Rechtsstruktur (DE)
                    </label>
                    <input
                      id="imprint-legalStructure-de"
                      type="text"
                      value={content.legalStructureGerman}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          legalStructureGerman: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="imprint-purpose-tr"
                      className="block text-sm font-semibold text-slate-700 mb-2"
                    >
                      Amaç (Türkçe) / Zweck (TR)
                    </label>
                    <textarea
                      id="imprint-purpose-tr"
                      value={content.purposeTurkish}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          purposeTurkish: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all resize-none"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="imprint-purpose-de"
                      className="block text-sm font-semibold text-slate-700 mb-2"
                    >
                      Amaç (Almanca) / Zweck (DE)
                    </label>
                    <textarea
                      id="imprint-purpose-de"
                      value={content.purposeGerman}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          purposeGerman: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all resize-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="imprint-taxExemption-tr"
                      className="block text-sm font-semibold text-slate-700 mb-2"
                    >
                      Vergi Muafiyeti (Türkçe) / Steuerbefreiung (TR)
                    </label>
                    <input
                      id="imprint-taxExemption-tr"
                      type="text"
                      value={content.taxExemptionTurkish}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          taxExemptionTurkish: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="imprint-taxExemption-de"
                      className="block text-sm font-semibold text-slate-700 mb-2"
                    >
                      Vergi Muafiyeti (Almanca) / Steuerbefreiung (DE)
                    </label>
                    <input
                      id="imprint-taxExemption-de"
                      type="text"
                      value={content.taxExemptionGerman}
                      onChange={(e) =>
                        setContent({
                          ...content,
                          taxExemptionGerman: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* İçerik Sorumluluğu */}
            <div className="pb-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 mb-4">
                İçerik Sorumluluğu / Haftung für Inhalte
              </h2>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="imprint-contentResponsibility-tr"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Türkçe
                  </label>
                  <textarea
                    id="imprint-contentResponsibility-tr"
                    value={content.contentResponsibilityTurkish}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contentResponsibilityTurkish: e.target.value,
                      })
                    }
                    rows={6}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all resize-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="imprint-contentResponsibility-de"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Deutsch
                  </label>
                  <textarea
                    id="imprint-contentResponsibility-de"
                    value={content.contentResponsibilityGerman}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        contentResponsibilityGerman: e.target.value,
                      })
                    }
                    rows={6}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Bağlantılar Sorumluluğu */}
            <div className="pb-6 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-800 mb-4">
                Bağlantılar İçin Sorumluluk / Haftung für Links
              </h2>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="imprint-linksResponsibility-tr"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Türkçe
                  </label>
                  <textarea
                    id="imprint-linksResponsibility-tr"
                    value={content.linksResponsibilityTurkish}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        linksResponsibilityTurkish: e.target.value,
                      })
                    }
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all resize-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="imprint-linksResponsibility-de"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Deutsch
                  </label>
                  <textarea
                    id="imprint-linksResponsibility-de"
                    value={content.linksResponsibilityGerman}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        linksResponsibilityGerman: e.target.value,
                      })
                    }
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Telif Hakkı */}
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-4">
                Telif Hakkı / Urheberrecht
              </h2>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="imprint-copyright-tr"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Türkçe
                  </label>
                  <textarea
                    id="imprint-copyright-tr"
                    value={content.copyrightTurkish}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        copyrightTurkish: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all resize-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="imprint-copyright-de"
                    className="block text-sm font-semibold text-slate-700 mb-2"
                  >
                    Deutsch
                  </label>
                  <textarea
                    id="imprint-copyright-de"
                    value={content.copyrightGerman}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        copyrightGerman: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminImprint;
