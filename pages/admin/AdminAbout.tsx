import React, { useState, useEffect } from "react";
import { useLanguage } from "../../contexts/LanguageContext";

// API'den gelen veri tipleri (Backend formatı)
interface ApiQuote {
  id?: string;
  quoteTr: string;
  quoteDe: string;
  quoteAuthor: string;
}

interface ApiWhoWeAre {
  id?: string;
  whoWeAreTr: string;
  whoWeAreDe: string;
}

interface ApiGoals {
  id?: string;
  goalsTr: string;
  goalsDe: string;
}

interface ApiVision {
  id?: string;
  visionTr: string;
  visionDe: string;
}

interface ApiMission {
  id?: string;
  missionTr: string;
  missionDe: string;
}

interface ApiCoreValue {
  id?: string;
  titleTr: string;
  titleDe: string;
  descriptionTr: string;
  descriptionDe: string;
  order: number;
}

interface ApiFocusArea {
  id?: string;
  titleTr: string;
  titleDe: string;
  descriptionTr: string;
  descriptionDe: string;
  order: number;
}

interface ApiActivityArea {
  id?: string;
  titleTr: string;
  titleDe: string;
  descriptionTr: string;
  descriptionDe: string;
  order: number;
}

interface ApiTeamMember {
  id?: string;
  name: { value: string };
  titleTr: { value: string };
  titleDe: { value: string };
  descriptionTr: { value: string } | null;
  descriptionDe: { value: string } | null;
  imageUrl: string;
  order: number;
}

// Human Rights / Tenkil Section
interface ApiHumanRights {
  id?: string;
  titleTr: string;
  titleDe: string;
  descriptionTr: string;
  descriptionDe: string;
  tenkilMuseumUrl: string;
  instagramUrl: string;
}

// Partner
interface ApiPartner {
  id?: string;
  name: string;
  descriptionTr: string;
  descriptionDe: string;
  logoUrl: string | null;
  websiteUrl: string | null;
  displayOrder: number;
  isActive: boolean;
}

interface ApiAboutUsResponse {
  quote: ApiQuote | null;
  whoWeAre: ApiWhoWeAre | null;
  goals: ApiGoals | null;
  vision: ApiVision | null;
  mission: ApiMission | null;
  coreValues: ApiCoreValue[];
  focusAreas: ApiFocusArea[];
  activityAreas: ApiActivityArea[];
  teamMembers: ApiTeamMember[];
}

// Form state tipleri
interface AboutForm {
  quote: ApiQuote;
  whoWeAre: ApiWhoWeAre;
  goals: ApiGoals;
  vision: ApiVision;
  mission: ApiMission;
  coreValues: ApiCoreValue[];
  focusAreas: ApiFocusArea[];
  activityAreas: ApiActivityArea[];
  teamMembers: ApiTeamMember[];
  humanRights: ApiHumanRights;
  partners: ApiPartner[];
}

const initialForm: AboutForm = {
  quote: {
    quoteTr: "",
    quoteDe: "",
    quoteAuthor: "",
  },
  whoWeAre: {
    whoWeAreTr: "",
    whoWeAreDe: "",
  },
  goals: {
    goalsTr: "",
    goalsDe: "",
  },
  vision: {
    visionTr: "",
    visionDe: "",
  },
  mission: {
    missionTr: "",
    missionDe: "",
  },
  coreValues: [],
  focusAreas: [],
  activityAreas: [],
  teamMembers: [],
  humanRights: {
    titleTr: "",
    titleDe: "",
    descriptionTr: "",
    descriptionDe: "",
    tenkilMuseumUrl: "",
    instagramUrl: "",
  },
  partners: [],
};

const AdminAbout: React.FC = () => {
  const { language } = useLanguage();
  const [form, setForm] = useState<AboutForm>(initialForm);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "quote"
    | "coreValues"
    | "focusAreas"
    | "activityAreas"
    | "team"
    | "humanRights"
    | "partners"
  >("overview");
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "";
  }>({ message: "", type: "" });

  const fetchAbout = async () => {
    try {
      setIsLoading(true);

      // Fetch all data in parallel
      const [aboutRes, humanRightsRes, partnersRes] = await Promise.all([
        fetch("https://localhost:7189/api/AboutUs"),
        fetch("https://localhost:7189/api/AboutUs/human-rights"),
        fetch("https://localhost:7189/api/Partners"),
      ]);

      if (!aboutRes.ok) {
        console.error("HTTP hata:", aboutRes.status);
        return;
      }
      const data: ApiAboutUsResponse = await aboutRes.json();

      let humanRightsData: ApiHumanRights | null = null;
      if (humanRightsRes.ok) {
        humanRightsData = await humanRightsRes.json();
      }

      let partnersData: ApiPartner[] = [];
      if (partnersRes.ok) {
        partnersData = await partnersRes.json();
      }

      // API verisini form state'ine dönüştür
      setForm({
        quote: data.quote || { quoteTr: "", quoteDe: "", quoteAuthor: "" },
        whoWeAre: data.whoWeAre || { whoWeAreTr: "", whoWeAreDe: "" },
        goals: data.goals || { goalsTr: "", goalsDe: "" },
        vision: data.vision || { visionTr: "", visionDe: "" },
        mission: data.mission || { missionTr: "", missionDe: "" },
        coreValues: data.coreValues || [],
        focusAreas: data.focusAreas || [],
        activityAreas: data.activityAreas || [],
        teamMembers: data.teamMembers || [],
        humanRights: humanRightsData || {
          titleTr: "",
          titleDe: "",
          descriptionTr: "",
          descriptionDe: "",
          tenkilMuseumUrl: "",
          instagramUrl: "",
        },
        partners: partnersData || [],
      });
    } catch (error) {
      console.error("AboutUs verisi alınamadı", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  const texts = {
    tr: {
      pageTitle: "Hakkımızda Sayfası Yönetimi",
      quote: "Alıntı",
      quoteText: "Alıntı metni",
      quoteAuthor: "Alıntı sahibi",
      whoWeAre: "Biz Kimiz?",
      goals: "Hedeflerimiz",
      vision: "Vizyon",
      mission: "Misyon",
      coreValues: "Temel Değerler",
      focusAreas: "Odak Alanlar",
      activityAreas: "Faaliyet Alanlar",
      teamMembers: "Ekip Üyeleri",
      name: "İsim",
      title: "Ünvan",
      titleTR: "Ünvan (TR)",
      titleDE: "Ünvan (DE)",
      description: "Açıklama",
      descriptionTR: "Açıklama (TR)",
      descriptionDE: "Açıklama (DE)",
      imageUrl: "Fotoğraf URL",
      add: "Ekle",
      delete: "Sil",
      moveUp: "Yukarı Taşı",
      moveDown: "Aşağı Taşı",
      save: "Kaydet",
      saving: "Kaydediliyor...",
      cancel: "İptal",
      confirmDelete: "Silmek istediğinize emin misiniz?",
      photoPreview: "Fotoğraf Önizleme",
      loading: "Yükleniyor...",
      overview: "Genel Bakış",
      humanRights: "İnsan Hakları (Tenkil)",
      partners: "Ortaklar",
      tenkilMuseumUrl: "Tenkil Müzesi URL",
      instagramUrl: "Instagram URL",
      partnerName: "Ortak Adı",
      logoUrl: "Logo URL",
      websiteUrl: "Website URL",
      displayOrder: "Sıralama",
      isActive: "Aktif",
    },
    de: {
      pageTitle: "Über Uns Seitenverwaltung",
      quote: "Zitat",
      quoteText: "Zitattext",
      quoteAuthor: "Zitat Autor",
      whoWeAre: "Wer sind wir?",
      goals: "Unsere Ziele",
      vision: "Vision",
      mission: "Mission",
      coreValues: "Grundwerte",
      focusAreas: "Schwerpunkte",
      activityAreas: "Aktivitätsbereiche",
      teamMembers: "Teammitglieder",
      name: "Name",
      title: "Titel",
      titleTR: "Titel (TR)",
      titleDE: "Titel (DE)",
      description: "Beschreibung",
      descriptionTR: "Beschreibung (TR)",
      descriptionDE: "Beschreibung (DE)",
      imageUrl: "Foto URL",
      add: "Hinzufügen",
      delete: "Löschen",
      moveUp: "Nach oben",
      moveDown: "Nach unten",
      save: "Speichern",
      saving: "Wird gespeichert...",
      cancel: "Abbrechen",
      confirmDelete: "Sind Sie sicher, dass Sie löschen möchten?",
      photoPreview: "Foto Vorschau",
      loading: "Lädt...",
      overview: "Übersicht",
      humanRights: "Menschenrechte (Tenkil)",
      partners: "Partner",
      tenkilMuseumUrl: "Tenkil Museum URL",
      instagramUrl: "Instagram URL",
      partnerName: "Partnername",
      logoUrl: "Logo URL",
      websiteUrl: "Website URL",
      displayOrder: "Reihenfolge",
      isActive: "Aktiv",
    },
  };

  const t = texts[language];

  const getAuthHeaders = () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      console.warn("Token bulunamadı!");
    }
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token || ""}`,
    };
  };

  // 401 hatası alındığında login'e yönlendir
  const handleUnauthorized = () => {
    localStorage.removeItem("adminToken");
    alert("Oturum süreniz doldu. Lütfen tekrar giriş yapın.");
    window.location.href = "/admin/login";
  };

  // API çağrısı sonucu kontrol
  const checkResponse = async (response: Response) => {
    if (response.status === 401) {
      handleUnauthorized();
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      setNotification({
        message: "Oturum süresi dolmuş. Lütfen tekrar giriş yapın.",
        type: "error",
      });
      return;
    }
    setIsSaving(true);

    const headers = getAuthHeaders();

    try {
      switch (activeTab) {
        case "quote": {
          const res = await fetch("https://localhost:7189/api/AboutUs/quote", {
            method: "PUT",
            headers,
            body: JSON.stringify({
              id: form.quote.id,
              quoteTr: form.quote.quoteTr,
              quoteDe: form.quote.quoteDe,
              quoteAuthor: form.quote.quoteAuthor,
            }),
          });
          if (res.status === 401) {
            handleUnauthorized();
            return;
          }
          if (!res.ok) {
            const errorText = await res.text();
            throw new Error(errorText || "Quote güncelleme başarısız!");
          }
          break;
        }

        case "overview": {
          // Her bileşen artık bağımsız aggregate, sırayla güncelle
          if (form.whoWeAre.whoWeAreTr || form.whoWeAre.whoWeAreDe) {
            const whoWeAreRes = await fetch(
              "https://localhost:7189/api/AboutUs/who-we-are",
              {
                method: "PUT",
                headers,
                body: JSON.stringify({
                  id: form.whoWeAre.id,
                  whoWeAreTr: form.whoWeAre.whoWeAreTr,
                  whoWeAreDe: form.whoWeAre.whoWeAreDe,
                }),
              }
            );
            if (whoWeAreRes.status === 401) {
              handleUnauthorized();
              return;
            }
            if (!whoWeAreRes.ok) {
              const errorText = await whoWeAreRes.text();
              throw new Error(errorText || "Who We Are güncelleme başarısız!");
            }
          }

          if (form.goals.goalsTr || form.goals.goalsDe) {
            const goalsRes = await fetch(
              "https://localhost:7189/api/AboutUs/goals",
              {
                method: "PUT",
                headers,
                body: JSON.stringify({
                  id: form.goals.id,
                  goalsTr: form.goals.goalsTr,
                  goalsDe: form.goals.goalsDe,
                }),
              }
            );
            if (goalsRes.status === 401) {
              handleUnauthorized();
              return;
            }
            if (!goalsRes.ok) {
              const errorText = await goalsRes.text();
              throw new Error(errorText || "Goals güncelleme başarısız!");
            }
          }

          if (form.vision.visionTr || form.vision.visionDe) {
            const visionRes = await fetch(
              "https://localhost:7189/api/AboutUs/vision",
              {
                method: "PUT",
                headers,
                body: JSON.stringify({
                  id: form.vision.id,
                  visionTr: form.vision.visionTr,
                  visionDe: form.vision.visionDe,
                }),
              }
            );
            if (visionRes.status === 401) {
              handleUnauthorized();
              return;
            }
            if (!visionRes.ok) {
              const errorText = await visionRes.text();
              throw new Error(errorText || "Vision güncelleme başarısız!");
            }
          }

          if (form.mission.missionTr || form.mission.missionDe) {
            const missionRes = await fetch(
              "https://localhost:7189/api/AboutUs/mission",
              {
                method: "PUT",
                headers,
                body: JSON.stringify({
                  id: form.mission.id,
                  missionTr: form.mission.missionTr,
                  missionDe: form.mission.missionDe,
                }),
              }
            );
            if (missionRes.status === 401) {
              handleUnauthorized();
              return;
            }
            if (!missionRes.ok) {
              const errorText = await missionRes.text();
              throw new Error(errorText || "Mission güncelleme başarısız!");
            }
          }
          break;
        }

        case "coreValues": {
          // Her bir CoreValue için ayrı ayrı kaydet
          for (const cv of form.coreValues) {
            const endpoint = cv.id
              ? `https://localhost:7189/api/AboutUs/core-values/${cv.id}`
              : "https://localhost:7189/api/AboutUs/core-values";
            const method = cv.id ? "PUT" : "POST";

            const res = await fetch(endpoint, {
              method,
              headers,
              body: JSON.stringify({
                id: cv.id,
                titleTr: cv.titleTr,
                titleDe: cv.titleDe,
                descriptionTr: cv.descriptionTr,
                descriptionDe: cv.descriptionDe,
                order: cv.order,
              }),
            });
            if (res.status === 401) {
              handleUnauthorized();
              return;
            }
            if (!res.ok) {
              const errorText = await res.text();
              throw new Error(errorText || "Core Value güncelleme başarısız!");
            }
          }
          break;
        }

        case "focusAreas": {
          for (const fa of form.focusAreas) {
            const endpoint = fa.id
              ? `https://localhost:7189/api/AboutUs/focus-areas/${fa.id}`
              : "https://localhost:7189/api/AboutUs/focus-areas";
            const method = fa.id ? "PUT" : "POST";

            const res = await fetch(endpoint, {
              method,
              headers,
              body: JSON.stringify({
                id: fa.id,
                titleTr: fa.titleTr,
                titleDe: fa.titleDe,
                descriptionTr: fa.descriptionTr,
                descriptionDe: fa.descriptionDe,
                order: fa.order,
              }),
            });
            if (res.status === 401) {
              handleUnauthorized();
              return;
            }
            if (!res.ok) {
              const errorText = await res.text();
              throw new Error(errorText || "Focus Area güncelleme başarısız!");
            }
          }
          break;
        }

        case "activityAreas": {
          for (const aa of form.activityAreas) {
            const endpoint = aa.id
              ? `https://localhost:7189/api/AboutUs/activity-areas/${aa.id}`
              : "https://localhost:7189/api/AboutUs/activity-areas";
            const method = aa.id ? "PUT" : "POST";

            const res = await fetch(endpoint, {
              method,
              headers,
              body: JSON.stringify({
                id: aa.id,
                titleTr: aa.titleTr,
                titleDe: aa.titleDe,
                descriptionTr: aa.descriptionTr,
                descriptionDe: aa.descriptionDe,
                order: aa.order,
              }),
            });
            if (res.status === 401) {
              handleUnauthorized();
              return;
            }
            if (!res.ok) {
              const errorText = await res.text();
              throw new Error(
                errorText || "Activity Area güncelleme başarısız!"
              );
            }
          }
          break;
        }

        case "team": {
          for (const tm of form.teamMembers) {
            const endpoint = tm.id
              ? `https://localhost:7189/api/AboutUs/team-members/${tm.id}`
              : "https://localhost:7189/api/AboutUs/team-members";
            const method = tm.id ? "PUT" : "POST";

            // Backend düz string bekliyor, form'da {value: string} tutuluyor
            const res = await fetch(endpoint, {
              method,
              headers,
              body: JSON.stringify({
                id: tm.id,
                name: tm.name?.value || "",
                titleTr: tm.titleTr?.value || "",
                titleDe: tm.titleDe?.value || "",
                descriptionTr: tm.descriptionTr?.value || null,
                descriptionDe: tm.descriptionDe?.value || null,
                imageUrl: tm.imageUrl,
                order: tm.order,
              }),
            });
            if (res.status === 401) {
              handleUnauthorized();
              return;
            }
            if (!res.ok) {
              const errorText = await res.text();
              throw new Error(errorText || "Team Member güncelleme başarısız!");
            }
          }
          break;
        }

        case "humanRights": {
          const endpoint = form.humanRights.id
            ? `https://localhost:7189/api/AboutUs/human-rights/${form.humanRights.id}`
            : "https://localhost:7189/api/AboutUs/human-rights";
          const method = form.humanRights.id ? "PUT" : "POST";

          const res = await fetch(endpoint, {
            method,
            headers,
            body: JSON.stringify({
              id: form.humanRights.id,
              titleTr: form.humanRights.titleTr,
              titleDe: form.humanRights.titleDe,
              descriptionTr: form.humanRights.descriptionTr,
              descriptionDe: form.humanRights.descriptionDe,
              tenkilMuseumUrl: form.humanRights.tenkilMuseumUrl,
              instagramUrl: form.humanRights.instagramUrl,
            }),
          });
          if (res.status === 401) {
            handleUnauthorized();
            return;
          }
          if (!res.ok) {
            const errorText = await res.text();
            throw new Error(errorText || "Human Rights güncelleme başarısız!");
          }
          break;
        }

        case "partners": {
          for (const partner of form.partners) {
            const endpoint = partner.id
              ? `https://localhost:7189/api/Partners/${partner.id}`
              : "https://localhost:7189/api/Partners";
            const method = partner.id ? "PUT" : "POST";

            const res = await fetch(endpoint, {
              method,
              headers,
              body: JSON.stringify({
                id: partner.id,
                name: partner.name,
                descriptionTr: partner.descriptionTr,
                descriptionDe: partner.descriptionDe,
                logoUrl: partner.logoUrl,
                websiteUrl: partner.websiteUrl,
                displayOrder: partner.displayOrder,
                isActive: partner.isActive,
              }),
            });
            if (res.status === 401) {
              handleUnauthorized();
              return;
            }
            if (!res.ok) {
              const errorText = await res.text();
              throw new Error(errorText || "Partner güncelleme başarısız!");
            }
          }
          break;
        }
      }

      setNotification({ message: "Başarıyla kaydedildi!", type: "success" });
      setTimeout(() => setNotification({ message: "", type: "" }), 3000);

      // Güncel veriyi yeniden fetch et
      await fetchAbout();
    } catch (error) {
      setNotification({
        message:
          "Kaydetme hatası: " + (error instanceof Error ? error.message : ""),
        type: "error",
      });
      setTimeout(() => setNotification({ message: "", type: "" }), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  // CoreValue, FocusArea, ActivityArea için liste işlemleri
  const handleCoreValueChange = (
    idx: number,
    field: keyof ApiCoreValue,
    value: any
  ) => {
    setForm((prev) => ({
      ...prev,
      coreValues: prev.coreValues.map((item, i) =>
        i === idx ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleFocusAreaChange = (
    idx: number,
    field: keyof ApiFocusArea,
    value: any
  ) => {
    setForm((prev) => ({
      ...prev,
      focusAreas: prev.focusAreas.map((item, i) =>
        i === idx ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleActivityAreaChange = (
    idx: number,
    field: keyof ApiActivityArea,
    value: any
  ) => {
    setForm((prev) => ({
      ...prev,
      activityAreas: prev.activityAreas.map((item, i) =>
        i === idx ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleTeamMemberChange = (
    idx: number,
    field: keyof ApiTeamMember,
    value: any
  ) => {
    setForm((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.map((item, i) =>
        i === idx ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleAddCoreValue = () => {
    setForm((prev) => ({
      ...prev,
      coreValues: [
        ...prev.coreValues,
        {
          titleTr: "",
          titleDe: "",
          descriptionTr: "",
          descriptionDe: "",
          order: prev.coreValues.length + 1,
        },
      ],
    }));
  };

  const handleAddFocusArea = () => {
    setForm((prev) => ({
      ...prev,
      focusAreas: [
        ...prev.focusAreas,
        {
          titleTr: "",
          titleDe: "",
          descriptionTr: "",
          descriptionDe: "",
          order: prev.focusAreas.length + 1,
        },
      ],
    }));
  };

  const handleAddActivityArea = () => {
    setForm((prev) => ({
      ...prev,
      activityAreas: [
        ...prev.activityAreas,
        {
          titleTr: "",
          titleDe: "",
          descriptionTr: "",
          descriptionDe: "",
          order: prev.activityAreas.length + 1,
        },
      ],
    }));
  };

  const handleAddTeamMember = () => {
    setForm((prev) => ({
      ...prev,
      teamMembers: [
        ...prev.teamMembers,
        {
          name: { value: "" },
          titleTr: { value: "" },
          titleDe: { value: "" },
          descriptionTr: null,
          descriptionDe: null,
          imageUrl: "",
          order: prev.teamMembers.length + 1,
        },
      ],
    }));
  };

  const handleRemoveCoreValue = async (idx: number) => {
    if (!window.confirm(t.confirmDelete)) return;
    const item = form.coreValues[idx];
    if (item.id) {
      try {
        const res = await fetch(
          `https://localhost:7189/api/AboutUs/core-values/${item.id}`,
          {
            method: "DELETE",
            headers: getAuthHeaders(),
          }
        );
        if (res.status === 401) {
          handleUnauthorized();
          return;
        }
        if (!res.ok) {
          console.error("Silme hatası", res.status);
        }
      } catch (error) {
        console.error("Silme hatası", error);
      }
    }
    setForm((prev) => ({
      ...prev,
      coreValues: prev.coreValues.filter((_, i) => i !== idx),
    }));
  };

  const handleRemoveFocusArea = async (idx: number) => {
    if (!window.confirm(t.confirmDelete)) return;
    const item = form.focusAreas[idx];
    if (item.id) {
      try {
        const res = await fetch(
          `https://localhost:7189/api/AboutUs/focus-areas/${item.id}`,
          {
            method: "DELETE",
            headers: getAuthHeaders(),
          }
        );
        if (res.status === 401) {
          handleUnauthorized();
          return;
        }
        if (!res.ok) {
          console.error("Silme hatası", res.status);
        }
      } catch (error) {
        console.error("Silme hatası", error);
      }
    }
    setForm((prev) => ({
      ...prev,
      focusAreas: prev.focusAreas.filter((_, i) => i !== idx),
    }));
  };

  const handleRemoveActivityArea = async (idx: number) => {
    if (!window.confirm(t.confirmDelete)) return;
    const item = form.activityAreas[idx];
    if (item.id) {
      try {
        const res = await fetch(
          `https://localhost:7189/api/AboutUs/activity-areas/${item.id}`,
          {
            method: "DELETE",
            headers: getAuthHeaders(),
          }
        );
        if (res.status === 401) {
          handleUnauthorized();
          return;
        }
        if (!res.ok) {
          console.error("Silme hatası", res.status);
        }
      } catch (error) {
        console.error("Silme hatası", error);
      }
    }
    setForm((prev) => ({
      ...prev,
      activityAreas: prev.activityAreas.filter((_, i) => i !== idx),
    }));
  };

  const handleRemoveTeamMember = async (idx: number) => {
    if (!window.confirm(t.confirmDelete)) return;
    const item = form.teamMembers[idx];
    if (item.id) {
      try {
        const res = await fetch(
          `https://localhost:7189/api/AboutUs/team-members/${item.id}`,
          {
            method: "DELETE",
            headers: getAuthHeaders(),
          }
        );
        if (res.status === 401) {
          handleUnauthorized();
          return;
        }
        if (!res.ok) {
          console.error("Silme hatası", res.status);
        }
      } catch (error) {
        console.error("Silme hatası", error);
      }
    }
    setForm((prev) => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== idx),
    }));
  };

  // Human Rights handlers
  const handleHumanRightsChange = (
    field: keyof ApiHumanRights,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      humanRights: { ...prev.humanRights, [field]: value },
    }));
  };

  // Partner handlers
  const handlePartnerChange = (
    idx: number,
    field: keyof ApiPartner,
    value: any
  ) => {
    setForm((prev) => ({
      ...prev,
      partners: prev.partners.map((item, i) =>
        i === idx ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleAddPartner = () => {
    setForm((prev) => ({
      ...prev,
      partners: [
        ...prev.partners,
        {
          name: "",
          descriptionTr: "",
          descriptionDe: "",
          logoUrl: null,
          websiteUrl: null,
          displayOrder: prev.partners.length + 1,
          isActive: true,
        },
      ],
    }));
  };

  const handleRemovePartner = async (idx: number) => {
    if (!globalThis.confirm(t.confirmDelete)) return;
    const item = form.partners[idx];
    if (item.id) {
      try {
        const res = await fetch(
          `https://localhost:7189/api/Partners/${item.id}`,
          {
            method: "DELETE",
            headers: getAuthHeaders(),
          }
        );
        if (res.status === 401) {
          handleUnauthorized();
          return;
        }
        if (!res.ok) {
          console.error("Silme hatası", res.status);
        }
      } catch (error) {
        console.error("Silme hatası", error);
      }
    }
    setForm((prev) => ({
      ...prev,
      partners: prev.partners.filter((_, i) => i !== idx),
    }));
  };

  const handleMove = <T,>(
    list: T[],
    setList: (newList: T[]) => void,
    idx: number,
    dir: -1 | 1
  ) => {
    const newIdx = idx + dir;
    if (newIdx < 0 || newIdx >= list.length) return;
    const arr = [...list];
    [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
    setList(arr);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{t.loading}</p>
        </div>
      </div>
    );
  }

  const TabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            {/* Who We Are */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-2">{t.whoWeAre}</h3>
              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                rows={4}
                value={
                  language === "tr"
                    ? form.whoWeAre.whoWeAreTr
                    : form.whoWeAre.whoWeAreDe
                }
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    whoWeAre: {
                      ...prev.whoWeAre,
                      [language === "tr" ? "whoWeAreTr" : "whoWeAreDe"]:
                        e.target.value,
                    },
                  }))
                }
              />
            </div>

            {/* Goals */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-2">{t.goals}</h3>
              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                rows={4}
                value={
                  language === "tr" ? form.goals.goalsTr : form.goals.goalsDe
                }
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    goals: {
                      ...prev.goals,
                      [language === "tr" ? "goalsTr" : "goalsDe"]:
                        e.target.value,
                    },
                  }))
                }
              />
            </div>

            {/* Vision */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-2">{t.vision}</h3>
              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                rows={4}
                value={
                  language === "tr"
                    ? form.vision.visionTr
                    : form.vision.visionDe
                }
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    vision: {
                      ...prev.vision,
                      [language === "tr" ? "visionTr" : "visionDe"]:
                        e.target.value,
                    },
                  }))
                }
              />
            </div>

            {/* Mission */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-700 mb-2">{t.mission}</h3>
              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                rows={4}
                value={
                  language === "tr"
                    ? form.mission.missionTr
                    : form.mission.missionDe
                }
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    mission: {
                      ...prev.mission,
                      [language === "tr" ? "missionTr" : "missionDe"]:
                        e.target.value,
                    },
                  }))
                }
              />
            </div>
          </div>
        );

      case "quote":
        return (
          <div className="max-w-2xl">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              {t.quote}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  {t.quoteText} ({language.toUpperCase()})
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                  rows={4}
                  placeholder={t.quoteText}
                  value={
                    language === "tr" ? form.quote.quoteTr : form.quote.quoteDe
                  }
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      quote: {
                        ...prev.quote,
                        [language === "tr" ? "quoteTr" : "quoteDe"]:
                          e.target.value,
                      },
                    }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  {t.quoteAuthor}
                </label>
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  type="text"
                  placeholder={t.quoteAuthor}
                  value={form.quote.quoteAuthor}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      quote: { ...prev.quote, quoteAuthor: e.target.value },
                    }))
                  }
                />
              </div>
            </div>
          </div>
        );

      case "coreValues":
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-700">
                {t.coreValues}
              </h2>
              <button
                onClick={handleAddCoreValue}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  ></path>
                </svg>
                {t.add}
              </button>
            </div>

            <div className="space-y-6">
              {form.coreValues.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="border border-gray-200 rounded-lg p-6 bg-gray-50"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
                      #{idx + 1}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          handleMove(
                            form.coreValues,
                            (list) =>
                              setForm((p) => ({ ...p, coreValues: list })),
                            idx,
                            -1
                          )
                        }
                        disabled={idx === 0}
                        className="p-2 text-gray-600 hover:text-blue-600 disabled:opacity-30"
                        title={t.moveUp}
                      >
                        ↑
                      </button>
                      <button
                        onClick={() =>
                          handleMove(
                            form.coreValues,
                            (list) =>
                              setForm((p) => ({ ...p, coreValues: list })),
                            idx,
                            1
                          )
                        }
                        disabled={idx === form.coreValues.length - 1}
                        className="p-2 text-gray-600 hover:text-blue-600 disabled:opacity-30"
                        title={t.moveDown}
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => handleRemoveCoreValue(idx)}
                        className="p-2 text-red-600 hover:text-red-700"
                        title={t.delete}
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        {t.title} ({language.toUpperCase()})
                      </label>
                      <input
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        type="text"
                        value={language === "tr" ? item.titleTr : item.titleDe}
                        onChange={(e) =>
                          handleCoreValueChange(
                            idx,
                            language === "tr" ? "titleTr" : "titleDe",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        {t.description} ({language.toUpperCase()})
                      </label>
                      <textarea
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                        rows={3}
                        value={
                          language === "tr"
                            ? item.descriptionTr
                            : item.descriptionDe
                        }
                        onChange={(e) =>
                          handleCoreValueChange(
                            idx,
                            language === "tr"
                              ? "descriptionTr"
                              : "descriptionDe",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "focusAreas":
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-700">
                {t.focusAreas}
              </h2>
              <button
                onClick={handleAddFocusArea}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  ></path>
                </svg>
                {t.add}
              </button>
            </div>

            <div className="space-y-6">
              {form.focusAreas.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="border border-gray-200 rounded-lg p-6 bg-gray-50"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
                      #{idx + 1}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          handleMove(
                            form.focusAreas,
                            (list) =>
                              setForm((p) => ({ ...p, focusAreas: list })),
                            idx,
                            -1
                          )
                        }
                        disabled={idx === 0}
                        className="p-2 text-gray-600 hover:text-blue-600 disabled:opacity-30"
                        title={t.moveUp}
                      >
                        ↑
                      </button>
                      <button
                        onClick={() =>
                          handleMove(
                            form.focusAreas,
                            (list) =>
                              setForm((p) => ({ ...p, focusAreas: list })),
                            idx,
                            1
                          )
                        }
                        disabled={idx === form.focusAreas.length - 1}
                        className="p-2 text-gray-600 hover:text-blue-600 disabled:opacity-30"
                        title={t.moveDown}
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => handleRemoveFocusArea(idx)}
                        className="p-2 text-red-600 hover:text-red-700"
                        title={t.delete}
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        {t.title} ({language.toUpperCase()})
                      </label>
                      <input
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        type="text"
                        value={language === "tr" ? item.titleTr : item.titleDe}
                        onChange={(e) =>
                          handleFocusAreaChange(
                            idx,
                            language === "tr" ? "titleTr" : "titleDe",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        {t.description} ({language.toUpperCase()})
                      </label>
                      <textarea
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                        rows={3}
                        value={
                          language === "tr"
                            ? item.descriptionTr
                            : item.descriptionDe
                        }
                        onChange={(e) =>
                          handleFocusAreaChange(
                            idx,
                            language === "tr"
                              ? "descriptionTr"
                              : "descriptionDe",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "activityAreas":
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-700">
                {t.activityAreas}
              </h2>
              <button
                onClick={handleAddActivityArea}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  ></path>
                </svg>
                {t.add}
              </button>
            </div>

            <div className="space-y-6">
              {form.activityAreas.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="border border-gray-200 rounded-lg p-6 bg-gray-50"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
                      #{idx + 1}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          handleMove(
                            form.activityAreas,
                            (list) =>
                              setForm((p) => ({ ...p, activityAreas: list })),
                            idx,
                            -1
                          )
                        }
                        disabled={idx === 0}
                        className="p-2 text-gray-600 hover:text-blue-600 disabled:opacity-30"
                        title={t.moveUp}
                      >
                        ↑
                      </button>
                      <button
                        onClick={() =>
                          handleMove(
                            form.activityAreas,
                            (list) =>
                              setForm((p) => ({ ...p, activityAreas: list })),
                            idx,
                            1
                          )
                        }
                        disabled={idx === form.activityAreas.length - 1}
                        className="p-2 text-gray-600 hover:text-blue-600 disabled:opacity-30"
                        title={t.moveDown}
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => handleRemoveActivityArea(idx)}
                        className="p-2 text-red-600 hover:text-red-700"
                        title={t.delete}
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        {t.title} ({language.toUpperCase()})
                      </label>
                      <input
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        type="text"
                        value={language === "tr" ? item.titleTr : item.titleDe}
                        onChange={(e) =>
                          handleActivityAreaChange(
                            idx,
                            language === "tr" ? "titleTr" : "titleDe",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        {t.description} ({language.toUpperCase()})
                      </label>
                      <textarea
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                        rows={3}
                        value={
                          language === "tr"
                            ? item.descriptionTr
                            : item.descriptionDe
                        }
                        onChange={(e) =>
                          handleActivityAreaChange(
                            idx,
                            language === "tr"
                              ? "descriptionTr"
                              : "descriptionDe",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "team":
        return (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-700">
                {t.teamMembers}
              </h2>
              <button
                onClick={handleAddTeamMember}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  ></path>
                </svg>
                {t.add}
              </button>
            </div>

            <div className="space-y-6">
              {form.teamMembers.map((member, idx) => (
                <div
                  key={member.id || idx}
                  className="border border-gray-200 rounded-lg p-6 bg-gray-50"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
                        #{idx + 1}
                      </span>
                      {member.imageUrl && (
                        <img
                          src={member.imageUrl}
                          alt={member.name?.value || ""}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          handleMove(
                            form.teamMembers,
                            (list) =>
                              setForm((p) => ({ ...p, teamMembers: list })),
                            idx,
                            -1
                          )
                        }
                        disabled={idx === 0}
                        className="p-2 text-gray-600 hover:text-blue-600 disabled:opacity-30"
                        title={t.moveUp}
                      >
                        ↑
                      </button>
                      <button
                        onClick={() =>
                          handleMove(
                            form.teamMembers,
                            (list) =>
                              setForm((p) => ({ ...p, teamMembers: list })),
                            idx,
                            1
                          )
                        }
                        disabled={idx === form.teamMembers.length - 1}
                        className="p-2 text-gray-600 hover:text-blue-600 disabled:opacity-30"
                        title={t.moveDown}
                      >
                        ↓
                      </button>
                      <button
                        onClick={() => handleRemoveTeamMember(idx)}
                        className="p-2 text-red-600 hover:text-red-700"
                        title={t.delete}
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        {t.name}
                      </label>
                      <input
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        type="text"
                        value={member.name?.value || ""}
                        onChange={(e) =>
                          handleTeamMemberChange(idx, "name", {
                            value: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        {t.imageUrl}
                      </label>
                      <input
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        type="text"
                        value={member.imageUrl || ""}
                        onChange={(e) =>
                          handleTeamMemberChange(
                            idx,
                            "imageUrl",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        {t.title} ({language.toUpperCase()})
                      </label>
                      <input
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        type="text"
                        value={
                          language === "tr"
                            ? member.titleTr?.value || ""
                            : member.titleDe?.value || ""
                        }
                        onChange={(e) =>
                          handleTeamMemberChange(
                            idx,
                            language === "tr" ? "titleTr" : "titleDe",
                            { value: e.target.value }
                          )
                        }
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        {t.description} ({language.toUpperCase()})
                      </label>
                      <textarea
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                        rows={3}
                        value={
                          language === "tr"
                            ? member.descriptionTr?.value || ""
                            : member.descriptionDe?.value || ""
                        }
                        onChange={(e) =>
                          handleTeamMemberChange(
                            idx,
                            language === "tr"
                              ? "descriptionTr"
                              : "descriptionDe",
                            { value: e.target.value }
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "humanRights":
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-700 mb-4">
              {t.humanRights}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  {t.titleTR}
                </label>
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  type="text"
                  value={form.humanRights.titleTr}
                  onChange={(e) =>
                    handleHumanRightsChange("titleTr", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  {t.titleDE}
                </label>
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  type="text"
                  value={form.humanRights.titleDe}
                  onChange={(e) =>
                    handleHumanRightsChange("titleDe", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  {t.descriptionTR}
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                  rows={4}
                  value={form.humanRights.descriptionTr}
                  onChange={(e) =>
                    handleHumanRightsChange("descriptionTr", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  {t.descriptionDE}
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                  rows={4}
                  value={form.humanRights.descriptionDe}
                  onChange={(e) =>
                    handleHumanRightsChange("descriptionDe", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  {t.tenkilMuseumUrl}
                </label>
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  type="url"
                  value={form.humanRights.tenkilMuseumUrl}
                  onChange={(e) =>
                    handleHumanRightsChange("tenkilMuseumUrl", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  {t.instagramUrl}
                </label>
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  type="url"
                  value={form.humanRights.instagramUrl}
                  onChange={(e) =>
                    handleHumanRightsChange("instagramUrl", e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        );

      case "partners":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-700">{t.partners}</h3>
              <button
                type="button"
                onClick={handleAddPartner}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t.add}
              </button>
            </div>
            <div className="space-y-4">
              {form.partners.map((partner, idx) => (
                <div
                  key={partner.id || idx}
                  className="bg-gray-50 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-medium text-gray-700">#{idx + 1}</h4>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleMove(
                            form.partners,
                            (list) =>
                              setForm((prev) => ({ ...prev, partners: list })),
                            idx,
                            -1
                          )
                        }
                        disabled={idx === 0}
                        className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                      >
                        {t.moveUp}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleMove(
                            form.partners,
                            (list) =>
                              setForm((prev) => ({ ...prev, partners: list })),
                            idx,
                            1
                          )
                        }
                        disabled={idx === form.partners.length - 1}
                        className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                      >
                        {t.moveDown}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemovePartner(idx)}
                        className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        {t.delete}
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        {t.partnerName}
                      </label>
                      <input
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        type="text"
                        value={partner.name}
                        onChange={(e) =>
                          handlePartnerChange(idx, "name", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        {t.logoUrl}
                      </label>
                      <input
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        type="url"
                        value={partner.logoUrl || ""}
                        onChange={(e) =>
                          handlePartnerChange(
                            idx,
                            "logoUrl",
                            e.target.value || null
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        {t.websiteUrl}
                      </label>
                      <input
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        type="url"
                        value={partner.websiteUrl || ""}
                        onChange={(e) =>
                          handlePartnerChange(
                            idx,
                            "websiteUrl",
                            e.target.value || null
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        {t.displayOrder}
                      </label>
                      <input
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        type="number"
                        value={partner.displayOrder}
                        onChange={(e) =>
                          handlePartnerChange(
                            idx,
                            "displayOrder",
                            parseInt(e.target.value) || 0
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        {t.descriptionTR}
                      </label>
                      <textarea
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                        rows={3}
                        value={partner.descriptionTr}
                        onChange={(e) =>
                          handlePartnerChange(
                            idx,
                            "descriptionTr",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        {t.descriptionDE}
                      </label>
                      <textarea
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                        rows={3}
                        value={partner.descriptionDe}
                        onChange={(e) =>
                          handlePartnerChange(
                            idx,
                            "descriptionDe",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`partner-active-${idx}`}
                        checked={partner.isActive}
                        onChange={(e) =>
                          handlePartnerChange(idx, "isActive", e.target.checked)
                        }
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label
                        htmlFor={`partner-active-${idx}`}
                        className="text-sm font-medium text-gray-600"
                      >
                        {t.isActive}
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">{t.pageTitle}</h1>
        </div>

        {/* Notification */}
        {notification.message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              notification.type === "success"
                ? "bg-green-100 text-green-800 border border-green-200"
                : "bg-red-100 text-red-800 border border-red-200"
            }`}
          >
            {notification.message}
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex flex-wrap -mb-px">
              {[
                { key: "overview", label: t.overview },
                { key: "quote", label: t.quote },
                { key: "coreValues", label: t.coreValues },
                { key: "focusAreas", label: t.focusAreas },
                { key: "activityAreas", label: t.activityAreas },
                { key: "team", label: t.teamMembers },
                { key: "humanRights", label: t.humanRights },
                { key: "partners", label: t.partners },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.key
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            <TabContent />
          </div>

          {/* Save Button */}
          <div className="border-t border-gray-200 p-6 flex justify-end">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`px-6 py-3 rounded-lg font-medium text-white transition-colors ${
                isSaving
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSaving ? t.saving : t.save}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAbout;
