import React, { useState, useEffect, useRef } from "react";
import {
  Save,
  X,
  Plus,
  Edit,
  Trash2,
  Eye,
  Sparkles,
  Heart,
  Users,
} from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { API_BASE_URL } from "../../services/api";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import ConfirmDialog from "../../components/ConfirmDialog";

// ============= API Interface'leri =============
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
  bannerImageUrl: string | null;
  bannerImageBase64: string | null;
  bannerImageFileName: string | null;
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
  iconUrl: string | null;
  iconBase64: string | null;
  iconFileName: string | null;
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

interface ApiHumanRights {
  id?: string;
  titleTr: string;
  titleDe: string;
  descriptionTr: string;
  descriptionDe: string;
  tenkilMuseumUrl: string;
  instagramUrl: string;
}

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

// ============= QuillEditor Component =============
const QuillEditor = ({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const isUpdating = useRef(false);

  useEffect(() => {
    if (containerRef.current && !quillRef.current) {
      const quill = new Quill(containerRef.current, {
        theme: "snow",
        placeholder: placeholder || "İçerik yazın...",
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "clean"],
          ],
        },
      });

      quill.on("text-change", () => {
        if (!isUpdating.current) {
          const html = quill.root.innerHTML;
          onChange(html === "<p><br></p>" ? "" : html);
        }
      });

      quillRef.current = quill;

      if (value) {
        quill.root.innerHTML = value;
      }
    }
  }, []);

  useEffect(() => {
    if (quillRef.current) {
      const currentContent = quillRef.current.root.innerHTML;
      const normalizedValue = value || "";
      const normalizedCurrent =
        currentContent === "<p><br></p>" ? "" : currentContent;

      if (normalizedValue !== normalizedCurrent) {
        isUpdating.current = true;
        quillRef.current.root.innerHTML = normalizedValue;
        setTimeout(() => {
          isUpdating.current = false;
        }, 100);
      }
    }
  }, [value]);

  return (
    <div className="quill-modern-container">
      <div ref={containerRef} />
    </div>
  );
};

// ============= Main Component =============
// eslint-disable-next-line sonarjs/cognitive-complexity
const AdminAbout: React.FC = () => {
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "";
  }>({ message: "", type: "" });

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  // ============= States =============
  const [quote, setQuote] = useState<ApiQuote>({
    quoteTr: "",
    quoteDe: "",
    quoteAuthor: "",
  });

  const [whoWeAre, setWhoWeAre] = useState<ApiWhoWeAre>({
    whoWeAreTr: "",
    whoWeAreDe: "",
    bannerImageUrl: null,
    bannerImageBase64: null,
    bannerImageFileName: null,
  });

  const [goals, setGoals] = useState<ApiGoals>({ goalsTr: "", goalsDe: "" });
  const [vision, setVision] = useState<ApiVision>({
    visionTr: "",
    visionDe: "",
  });
  const [mission, setMission] = useState<ApiMission>({
    missionTr: "",
    missionDe: "",
  });

  const [coreValues, setCoreValues] = useState<ApiCoreValue[]>([]);
  const [focusAreas, setFocusAreas] = useState<ApiFocusArea[]>([]);
  const [activityAreas, setActivityAreas] = useState<ApiActivityArea[]>([]);
  const [teamMembers, setTeamMembers] = useState<ApiTeamMember[]>([]);
  const [humanRights, setHumanRights] = useState<ApiHumanRights>({
    titleTr: "",
    titleDe: "",
    descriptionTr: "",
    descriptionDe: "",
    tenkilMuseumUrl: "",
    instagramUrl: "",
  });
  const [partners, setPartners] = useState<ApiPartner[]>([]);

  // Modal states
  const [editingFocusArea, setEditingFocusArea] = useState<ApiFocusArea | null>(
    null,
  );
  const [editingCoreValue, setEditingCoreValue] = useState<ApiCoreValue | null>(
    null,
  );
  const [editingActivityArea, setEditingActivityArea] =
    useState<ApiActivityArea | null>(null);
  const [editingTeamMember, setEditingTeamMember] =
    useState<ApiTeamMember | null>(null);
  const [editingPartner, setEditingPartner] = useState<ApiPartner | null>(null);

  // Track which section was last modified
  const [lastModifiedSection, setLastModifiedSection] =
    useState<string>("quote");

  const texts = {
    tr: {
      pageTitle: "Hakkımızda Sayfası",
      quote: "Alıntı",
      quoteTextTrLabel: "Alıntı Metni (TR)",
      quoteTextDeLabel: "Alıntı Metni (DE)",
      quoteAuthorLabel: "Alıntı Sahibi",
      whoWeAre: "Biz Kimiz?",
      goals: "Hedeflerimiz",
      vision: "Vizyon",
      mission: "Misyon",
      coreValues: "Temel Değerler",
      focusAreas: "Odak Alanlar",
      activityAreas: "Faaliyet Alanları",
      teamMembers: "Ekip Üyeleri",
      humanRights: "İnsan Hakları",
      partners: "Ortaklar",
      save: "Kaydet",
      saving: "Kaydediliyor...",
      add: "Ekle",
      edit: "Düzenle",
      delete: "Sil",
      cancel: "İptal",
      confirm: "Emin misiniz?",
      loading: "Yükleniyor...",
      success: "Başarıyla kaydedildi!",
      error: "Hata oluştu",
      publish: "Sitede Yayınla",
    },
    de: {
      pageTitle: "Über Uns",
      quote: "Zitat",
      quoteTextTrLabel: "Zitat Text (TR)",
      quoteTextDeLabel: "Zitat Text (DE)",
      quoteAuthorLabel: "Autor",
      whoWeAre: "Wer sind wir?",
      goals: "Ziele",
      vision: "Vision",
      mission: "Mission",
      coreValues: "Kernwerte",
      focusAreas: "Schwerpunkte",
      activityAreas: "Aktivitätsbereiche",
      teamMembers: "Teammitglieder",
      humanRights: "Menschenrechte",
      partners: "Partner",
      save: "Speichern",
      saving: "Wird gespeichert...",
      add: "Hinzufügen",
      edit: "Bearbeiten",
      delete: "Löschen",
      cancel: "Abbrechen",
      confirm: "Sind Sie sicher?",
      loading: "Lädt...",
      success: "Erfolgreich gespeichert!",
      error: "Fehler",
      publish: "Veröffentlichen",
    },
  };

  const t = texts[language];

  const getAuthHeaders = () => {
    const token = localStorage.getItem("adminToken");
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token || ""}`,
    };
  };

  const handleUnauthorized = () => {
    localStorage.removeItem("adminToken");
    globalThis.location.href = "/admin/login";
  };

  // ============= API Calls =============
  const fetchAboutData = async () => {
    try {
      setIsLoading(true);

      // Fetch all lazy loading endpoints in parallel
      const [
        summaryRes,
        valuesRes,
        focusAreasRes,
        activityAreasRes,
        teamRes,
        humanRightsRes,
        partnersRes,
      ] = await Promise.all([
        fetch(`${API_BASE_URL}/AboutUs/summary`),
        fetch(`${API_BASE_URL}/AboutUs/values`),
        fetch(`${API_BASE_URL}/AboutUs/focus-areas`),
        fetch(`${API_BASE_URL}/AboutUs/activity-areas`),
        fetch(`${API_BASE_URL}/AboutUs/team`),
        fetch(`${API_BASE_URL}/AboutUs/human-rights`),
        fetch(`${API_BASE_URL}/Partners`),
      ]);

      if (summaryRes.status === 401 || valuesRes.status === 401) {
        handleUnauthorized();
        return;
      }

      // Parse summary data (quote, whoWeAre, goals)
      const summaryData: {
        quote: ApiQuote;
        whoWeAre: ApiWhoWeAre;
        goals: ApiGoals;
      } = summaryRes.ok
        ? await summaryRes.json()
        : {
            quote: { quoteTr: "", quoteDe: "", quoteAuthor: "" },
            whoWeAre: { whoWeAreTr: "", whoWeAreDe: "" },
            goals: { goalsTr: "", goalsDe: "" },
          };

      // Parse values data (vision, mission, coreValues)
      const valuesData: {
        vision: ApiVision;
        mission: ApiMission;
        coreValues: ApiCoreValue[];
      } = valuesRes.ok
        ? await valuesRes.json()
        : {
            vision: { visionTr: "", visionDe: "" },
            mission: { missionTr: "", missionDe: "" },
            coreValues: [],
          };

      // Parse focus areas
      const focusAreasData: ApiFocusArea[] = focusAreasRes.ok
        ? await focusAreasRes.json()
        : [];

      // Parse activity areas
      const activityAreasData: ApiActivityArea[] = activityAreasRes.ok
        ? await activityAreasRes.json()
        : [];

      // Parse team members
      const teamData: ApiTeamMember[] = teamRes.ok ? await teamRes.json() : [];

      // Parse human rights
      const humanRightsData: ApiHumanRights | null = humanRightsRes.ok
        ? await humanRightsRes.json()
        : null;

      // Parse partners
      const partnersData: ApiPartner[] = partnersRes.ok
        ? await partnersRes.json()
        : [];

      // Set all state
      setQuote(summaryData.quote);
      setWhoWeAre(summaryData.whoWeAre);
      setGoals(summaryData.goals);
      setVision(valuesData.vision);
      setMission(valuesData.mission);
      setCoreValues(valuesData.coreValues);
      setFocusAreas(focusAreasData);
      setActivityAreas(activityAreasData);
      setTeamMembers(teamData);
      setHumanRights(
        humanRightsData || {
          titleTr: "",
          titleDe: "",
          descriptionTr: "",
          descriptionDe: "",
          tenkilMuseumUrl: "",
          instagramUrl: "",
        },
      );
      setPartners(partnersData || []);
    } catch (err) {
      console.error("Error fetching data:", err);
      showNotification(t.error, "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAboutData();
  }, []);

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 3000);
  };

  const handleSave = async (
    data: any,
    endpoint: string,
    method: "PUT" | "POST" = "PUT",
    onSuccess?: () => void,
  ) => {
    setIsSaving(true);
    try {
      const res = await fetch(endpoint, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!res.ok) {
        const errorText = await res.text().catch(() => "");
        throw new Error(
          errorText
            ? `Save failed (HTTP ${res.status}): ${errorText}`
            : `Save failed (HTTP ${res.status})`,
        );
      }
      showNotification(t.success, "success");
      onSuccess?.();
      await fetchAboutData();
    } catch (err) {
      console.error("Error saving:", err);
      showNotification(t.error, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (endpoint: string, onSuccess?: () => void) => {
    setConfirmDialog({
      isOpen: true,
      title: language === "tr" ? "Sil" : "Löschen",
      message: t.confirm,
      onConfirm: () => {
        void (async () => {
          setIsSaving(true);
          try {
            const res = await fetch(endpoint, {
              method: "DELETE",
              headers: getAuthHeaders(),
            });

            if (res.status === 401) {
              handleUnauthorized();
              return;
            }

            if (!res.ok) throw new Error("Delete failed");
            showNotification(t.success, "success");
            onSuccess?.();
            await fetchAboutData();
          } catch (err) {
            console.error("Error deleting:", err);
            showNotification(t.error, "error");
          } finally {
            setIsSaving(false);
          }
        })();
      },
    });
  };

  // ============= Save Functions =============
  const saveQuote = () => {
    const endpoint = quote.id
      ? `${API_BASE_URL}/AboutUs/quote/${quote.id}`
      : `${API_BASE_URL}/AboutUs/quote`;
    const method = quote.id ? "PUT" : "POST";
    void handleSave(quote, endpoint, method);
  };

  const saveWhoWeAre = () => {
    const endpoint = whoWeAre.id
      ? `${API_BASE_URL}/AboutUs/who-we-are/${whoWeAre.id}`
      : `${API_BASE_URL}/AboutUs/who-we-are`;
    const method = whoWeAre.id ? "PUT" : "POST";
    void handleSave(whoWeAre, endpoint, method);
  };

  const saveGoals = () => {
    const endpoint = goals.id
      ? `${API_BASE_URL}/AboutUs/goals/${goals.id}`
      : `${API_BASE_URL}/AboutUs/goals`;
    const method = goals.id ? "PUT" : "POST";
    void handleSave(goals, endpoint, method);
  };

  const saveVision = () => {
    const endpoint = vision.id
      ? `${API_BASE_URL}/AboutUs/vision/${vision.id}`
      : `${API_BASE_URL}/AboutUs/vision`;
    const method = vision.id ? "PUT" : "POST";
    void handleSave(vision, endpoint, method);
  };

  const saveMission = () => {
    const endpoint = mission.id
      ? `${API_BASE_URL}/AboutUs/mission/${mission.id}`
      : `${API_BASE_URL}/AboutUs/mission`;
    const method = mission.id ? "PUT" : "POST";
    void handleSave(mission, endpoint, method);
  };

  const saveHumanRights = () => {
    const endpoint = humanRights.id
      ? `${API_BASE_URL}/AboutUs/human-rights/${humanRights.id}`
      : `${API_BASE_URL}/AboutUs/human-rights`;
    const method = humanRights.id ? "PUT" : "POST";
    void handleSave(humanRights, endpoint, method);
  };

  // ============= CRUD Operations =============
  const saveCoreValue = (item: ApiCoreValue) => {
    const endpoint = item.id
      ? `${API_BASE_URL}/AboutUs/core-values/${item.id}`
      : `${API_BASE_URL}/AboutUs/core-values`;
    const method = item.id ? "PUT" : "POST";
    void handleSave(item, endpoint, method, () => setEditingCoreValue(null));
  };

  const deleteCoreValue = (id: string) => {
    void handleDelete(`${API_BASE_URL}/AboutUs/core-values/${id}`);
  };

  const saveFocusArea = (item: ApiFocusArea) => {
    const endpoint = item.id
      ? `${API_BASE_URL}/AboutUs/focus-areas/${item.id}`
      : `${API_BASE_URL}/AboutUs/focus-areas`;
    const method = item.id ? "PUT" : "POST";

    const payload: ApiFocusArea = {
      ...item,
      iconUrl: item.iconUrl?.trim() ? item.iconUrl.trim() : null,
      iconBase64: item.iconBase64?.trim() ? item.iconBase64 : null,
      iconFileName: item.iconFileName?.trim() ? item.iconFileName : null,
    };

    void handleSave(payload, endpoint, method, () => setEditingFocusArea(null));
  };

  const deleteFocusArea = (id: string) => {
    void handleDelete(`${API_BASE_URL}/AboutUs/focus-areas/${id}`);
  };

  const saveActivityArea = (item: ApiActivityArea) => {
    const endpoint = item.id
      ? `${API_BASE_URL}/AboutUs/activity-areas/${item.id}`
      : `${API_BASE_URL}/AboutUs/activity-areas`;
    const method = item.id ? "PUT" : "POST";
    void handleSave(item, endpoint, method, () => setEditingActivityArea(null));
  };

  const deleteActivityArea = (id: string) => {
    void handleDelete(`${API_BASE_URL}/AboutUs/activity-areas/${id}`);
  };

  const saveTeamMember = (item: ApiTeamMember) => {
    const endpoint = item.id
      ? `${API_BASE_URL}/AboutUs/team-members/${item.id}`
      : `${API_BASE_URL}/AboutUs/team-members`;
    const method = item.id ? "PUT" : "POST";
    void handleSave(item, endpoint, method, () => setEditingTeamMember(null));
  };

  const deleteTeamMember = (id: string) => {
    void handleDelete(`${API_BASE_URL}/AboutUs/team-members/${id}`);
  };

  const savePartner = (item: ApiPartner) => {
    const endpoint = item.id
      ? `${API_BASE_URL}/Partners/${item.id}`
      : `${API_BASE_URL}/Partners`;
    const method = item.id ? "PUT" : "POST";
    void handleSave(item, endpoint, method, () => setEditingPartner(null));
  };

  const deletePartner = (id: string) => {
    void handleDelete(`${API_BASE_URL}/Partners/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-kpf-teal mx-auto mb-4"></div>
          <p className="text-gray-600">{t.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-kpf-teal/10 rounded-lg">
              <Heart className="text-kpf-teal" size={24} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">{t.pageTitle}</h1>
          </div>
          <button
            onClick={() => {
              const saveBySection: Record<string, () => void> = {
                quote: saveQuote,
                whoWeAre: saveWhoWeAre,
                goals: saveGoals,
                vision: saveVision,
                mission: saveMission,
              };
              (saveBySection[lastModifiedSection] ?? saveQuote)();
            }}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2 bg-kpf-teal text-white rounded-lg hover:bg-kpf-teal/90 transition-all disabled:opacity-50 font-bold shadow-lg"
          >
            <Save size={20} />
            {isSaving ? t.saving : t.publish}
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-7xl mx-auto pb-20">
          {/* Notification */}
          {notification.message && (
            <div
              className={`p-4 rounded-lg flex items-center gap-3 mb-6 ${
                notification.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {notification.type === "success" ? "✓" : "✕"}{" "}
              {notification.message}
            </div>
          )}

          {/* Quote Section */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Sparkles size={24} className="text-amber-600" />
              {t.quote}
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="about_quote_tr"
                  className="block text-sm font-bold text-gray-700 mb-2"
                >
                  {t.quoteTextTrLabel}
                </label>
                <textarea
                  id="about_quote_tr"
                  value={quote.quoteTr}
                  onChange={(e) =>
                    setQuote({ ...quote, quoteTr: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kpf-teal focus:border-kpf-teal resize-none"
                  rows={4}
                />
              </div>

              <div>
                <label
                  htmlFor="about_quote_de"
                  className="block text-sm font-bold text-gray-700 mb-2"
                >
                  {t.quoteTextDeLabel}
                </label>
                <textarea
                  id="about_quote_de"
                  value={quote.quoteDe}
                  onChange={(e) =>
                    setQuote({ ...quote, quoteDe: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kpf-teal focus:border-kpf-teal resize-none"
                  rows={4}
                />
              </div>

              <div className="lg:col-span-2">
                <label
                  htmlFor="about_quote_author"
                  className="block text-sm font-bold text-gray-700 mb-2"
                >
                  {t.quoteAuthorLabel}
                </label>
                <input
                  id="about_quote_author"
                  type="text"
                  value={quote.quoteAuthor}
                  onChange={(e) =>
                    setQuote({ ...quote, quoteAuthor: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kpf-teal focus:border-kpf-teal"
                />
              </div>
            </div>

            <button
              onClick={saveQuote}
              disabled={isSaving}
              className="mt-6 flex items-center gap-2 px-6 py-3 bg-kpf-teal text-white rounded-lg hover:bg-kpf-teal/90 transition-all disabled:opacity-50 font-bold"
            >
              <Save size={18} />
              {isSaving ? t.saving : t.save}
            </button>
          </div>

          {/* Who We Are Section */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Users size={24} className="text-blue-600" />
              {t.whoWeAre}
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="block text-sm font-bold text-gray-700 mb-2">
                  {t.whoWeAre} (TR)
                </div>
                <QuillEditor
                  value={whoWeAre.whoWeAreTr}
                  onChange={(val) =>
                    setWhoWeAre({ ...whoWeAre, whoWeAreTr: val })
                  }
                  placeholder="Türkçe metni girin..."
                />
              </div>

              <div>
                <div className="block text-sm font-bold text-gray-700 mb-2">
                  {t.whoWeAre} (DE)
                </div>
                <QuillEditor
                  value={whoWeAre.whoWeAreDe}
                  onChange={(val) =>
                    setWhoWeAre({ ...whoWeAre, whoWeAreDe: val })
                  }
                  placeholder="Deutsche Text..."
                />
              </div>

              <div className="lg:col-span-2">
                <label
                  htmlFor="about_who_we_are_banner_file"
                  className="block text-sm font-bold text-gray-700 mb-2"
                >
                  Banner Görseli Yükle
                </label>
                <input
                  id="about_who_we_are_banner_file"
                  type="file"
                  accept="image/*"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kpf-teal focus:border-kpf-teal file:mr-4 file:py-3 file:px-5 md:file:py-2 md:file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  onChange={(e) => {
                    setLastModifiedSection("whoWeAre");
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        setWhoWeAre({
                          ...whoWeAre,
                          bannerImageBase64: event.target?.result as string,
                          bannerImageFileName: file.name,
                        });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Veya URL ile açıkla:
                </p>
                <input
                  type="text"
                  value={whoWeAre.bannerImageUrl || ""}
                  onChange={(e) => {
                    setLastModifiedSection("whoWeAre");
                    setWhoWeAre({
                      ...whoWeAre,
                      bannerImageUrl: e.target.value,
                    });
                  }}
                  placeholder="https://..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kpf-teal focus:border-kpf-teal mt-2"
                />
                {(whoWeAre.bannerImageUrl || whoWeAre.bannerImageBase64) && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-300">
                    <p className="text-sm font-semibold text-gray-700 mb-3">
                      📸 Ön İzleme
                    </p>
                    <img
                      src={
                        whoWeAre.bannerImageBase64 ||
                        whoWeAre.bannerImageUrl ||
                        ""
                      }
                      alt="Banner Preview"
                      className="max-h-48 object-cover rounded-lg w-full"
                      onError={(e) => {
                        (e.target as HTMLImageElement).alt =
                          "Görsel yüklenemedi";
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={saveWhoWeAre}
              disabled={isSaving}
              className="mt-6 flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 font-bold"
            >
              <Save size={18} />
              {isSaving ? t.saving : t.save}
            </button>
          </div>

          {/* Goals Section */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Sparkles size={24} className="text-purple-600" />
              {t.goals}
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="block text-sm font-bold text-gray-700 mb-2">
                  {t.goals} (TR)
                </div>
                <QuillEditor
                  value={goals.goalsTr}
                  onChange={(val) => setGoals({ ...goals, goalsTr: val })}
                  placeholder="Türkçe metni girin..."
                />
              </div>

              <div>
                <div className="block text-sm font-bold text-gray-700 mb-2">
                  {t.goals} (DE)
                </div>
                <QuillEditor
                  value={goals.goalsDe}
                  onChange={(val) => setGoals({ ...goals, goalsDe: val })}
                  placeholder="Deutsche Text..."
                />
              </div>
            </div>

            <button
              onClick={saveGoals}
              disabled={isSaving}
              className="mt-6 flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all disabled:opacity-50 font-bold"
            >
              <Save size={18} />
              {isSaving ? t.saving : t.save}
            </button>
          </div>

          {/* Vision Section */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Eye size={24} className="text-indigo-600" />
              {t.vision}
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="block text-sm font-bold text-gray-700 mb-2">
                  {t.vision} (TR)
                </div>
                <QuillEditor
                  value={vision.visionTr}
                  onChange={(val) => setVision({ ...vision, visionTr: val })}
                  placeholder="Türkçe metni girin..."
                />
              </div>

              <div>
                <div className="block text-sm font-bold text-gray-700 mb-2">
                  {t.vision} (DE)
                </div>
                <QuillEditor
                  value={vision.visionDe}
                  onChange={(val) => setVision({ ...vision, visionDe: val })}
                  placeholder="Deutsche Text..."
                />
              </div>
            </div>

            <button
              onClick={saveVision}
              disabled={isSaving}
              className="mt-6 flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all disabled:opacity-50 font-bold"
            >
              <Save size={18} />
              {isSaving ? t.saving : t.save}
            </button>
          </div>

          {/* Mission Section */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Heart size={24} className="text-rose-600" />
              {t.mission}
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="block text-sm font-bold text-gray-700 mb-2">
                  {t.mission} (TR)
                </div>
                <QuillEditor
                  value={mission.missionTr}
                  onChange={(val) => setMission({ ...mission, missionTr: val })}
                  placeholder="Türkçe metni girin..."
                />
              </div>

              <div>
                <div className="block text-sm font-bold text-gray-700 mb-2">
                  {t.mission} (DE)
                </div>
                <QuillEditor
                  value={mission.missionDe}
                  onChange={(val) => setMission({ ...mission, missionDe: val })}
                  placeholder="Deutsche Text..."
                />
              </div>
            </div>

            <button
              onClick={saveMission}
              disabled={isSaving}
              className="mt-6 flex items-center gap-2 px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-all disabled:opacity-50 font-bold"
            >
              <Save size={18} />
              {isSaving ? t.saving : t.save}
            </button>
          </div>

          {/* Core Values Section */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Users size={24} className="text-teal-600" />
              {t.coreValues}
            </h2>

            <div className="space-y-4 mb-6">
              {coreValues.map((item, idx) => (
                <div
                  key={
                    item.id ??
                    `${item.order ?? "new"}-${item.titleTr}-${item.titleDe}`
                  }
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex justify-between items-start"
                >
                  <div className="flex-1">
                    <p className="font-bold text-gray-800">{item.titleTr}</p>
                    <p className="text-sm text-gray-600">{item.titleDe}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingCoreValue(item)}
                      className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => deleteCoreValue(item.id || "")}
                      className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() =>
                setEditingCoreValue({
                  titleTr: "",
                  titleDe: "",
                  descriptionTr: "",
                  descriptionDe: "",
                  order: coreValues.length,
                })
              }
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-bold"
            >
              <Plus size={18} />
              {t.add}
            </button>
          </div>

          {/* Focus Areas Section */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Sparkles size={24} className="text-cyan-600" />
              {t.focusAreas}
            </h2>

            <div className="space-y-4 mb-6">
              {focusAreas.map((item, idx) => (
                <div
                  key={
                    item.id ??
                    `${item.order ?? "new"}-${item.titleTr}-${item.titleDe}`
                  }
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex justify-between items-start"
                >
                  <div className="flex-1">
                    <p className="font-bold text-gray-800">{item.titleTr}</p>
                    <p className="text-sm text-gray-600">{item.titleDe}</p>
                    {item.iconUrl && (
                      <div className="mt-3">
                        <p className="text-xs text-gray-600 mb-2">
                          Icon Ön İzleme:
                        </p>
                        <img
                          src={item.iconUrl}
                          alt="Icon"
                          className="h-12 w-12 object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).alt = "Yüklenemedi";
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingFocusArea(item)}
                      className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => deleteFocusArea(item.id || "")}
                      className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() =>
                setEditingFocusArea({
                  titleTr: "",
                  titleDe: "",
                  descriptionTr: "",
                  descriptionDe: "",
                  order: focusAreas.length,
                  iconUrl: null,
                  iconBase64: null,
                  iconFileName: null,
                })
              }
              className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 font-bold"
            >
              <Plus size={18} />
              {t.add}
            </button>
          </div>

          {/* Activity Areas Section */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Users size={24} className="text-orange-600" />
              {t.activityAreas}
            </h2>

            <div className="space-y-4 mb-6">
              {activityAreas.map((item, idx) => (
                <div
                  key={
                    item.id ??
                    `${item.order ?? "new"}-${item.titleTr}-${item.titleDe}`
                  }
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex justify-between items-start"
                >
                  <div className="flex-1">
                    <p className="font-bold text-gray-800">{item.titleTr}</p>
                    <p className="text-sm text-gray-600">{item.titleDe}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingActivityArea(item)}
                      className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => deleteActivityArea(item.id || "")}
                      className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() =>
                setEditingActivityArea({
                  titleTr: "",
                  titleDe: "",
                  descriptionTr: "",
                  descriptionDe: "",
                  order: activityAreas.length,
                })
              }
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-bold"
            >
              <Plus size={18} />
              {t.add}
            </button>
          </div>

          {/* Team Members Section */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Users size={24} className="text-green-600" />
              {t.teamMembers}
            </h2>

            <div className="space-y-4 mb-6">
              {teamMembers.map((item, idx) => (
                <div
                  key={
                    item.id ??
                    `${item.order ?? "new"}-${item.name?.value ?? ""}-${
                      item.titleTr?.value ?? ""
                    }`
                  }
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex justify-between items-start"
                >
                  <div className="flex-1 flex gap-4">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.name?.value || ""}
                        className="w-16 h-16 object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).alt = "Yüklenemedi";
                        }}
                      />
                    )}
                    <div>
                      <p className="font-bold text-gray-800">
                        {item.name?.value}
                      </p>
                      <p className="text-sm text-gray-600">
                        {item.titleTr?.value}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingTeamMember(item)}
                      className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => deleteTeamMember(item.id || "")}
                      className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() =>
                setEditingTeamMember({
                  name: { value: "" },
                  titleTr: { value: "" },
                  titleDe: { value: "" },
                  descriptionTr: { value: "" },
                  descriptionDe: { value: "" },
                  imageUrl: "",
                  order: teamMembers.length,
                })
              }
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold"
            >
              <Plus size={18} />
              {t.add}
            </button>
          </div>

          {/* Human Rights Section */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Heart size={24} className="text-kpf-teal" />
              {t.humanRights}
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="about_human_rights_title_tr"
                  className="block text-sm font-bold text-gray-700 mb-2"
                >
                  Başlık (TR)
                </label>
                <input
                  id="about_human_rights_title_tr"
                  type="text"
                  value={humanRights.titleTr}
                  onChange={(e) =>
                    setHumanRights({ ...humanRights, titleTr: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kpf-teal focus:border-kpf-teal"
                />
              </div>

              <div>
                <label
                  htmlFor="about_human_rights_title_de"
                  className="block text-sm font-bold text-gray-700 mb-2"
                >
                  Titel (DE)
                </label>
                <input
                  id="about_human_rights_title_de"
                  type="text"
                  value={humanRights.titleDe}
                  onChange={(e) =>
                    setHumanRights({ ...humanRights, titleDe: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kpf-teal focus:border-kpf-teal"
                />
              </div>

              <div className="lg:col-span-2">
                <label
                  htmlFor="about_human_rights_description_tr"
                  className="block text-sm font-bold text-gray-700 mb-2"
                >
                  Açıklama (TR)
                </label>
                <textarea
                  id="about_human_rights_description_tr"
                  value={humanRights.descriptionTr}
                  onChange={(e) =>
                    setHumanRights({
                      ...humanRights,
                      descriptionTr: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kpf-teal focus:border-kpf-teal resize-none"
                  rows={3}
                />
              </div>

              <div className="lg:col-span-2">
                <label
                  htmlFor="about_human_rights_description_de"
                  className="block text-sm font-bold text-gray-700 mb-2"
                >
                  Beschreibung (DE)
                </label>
                <textarea
                  id="about_human_rights_description_de"
                  value={humanRights.descriptionDe}
                  onChange={(e) =>
                    setHumanRights({
                      ...humanRights,
                      descriptionDe: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kpf-teal focus:border-kpf-teal resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label
                  htmlFor="about_human_rights_tenkil_museum_url"
                  className="block text-sm font-bold text-gray-700 mb-2"
                >
                  Tenkil Müzesi URL
                </label>
                <input
                  id="about_human_rights_tenkil_museum_url"
                  type="text"
                  value={humanRights.tenkilMuseumUrl}
                  onChange={(e) =>
                    setHumanRights({
                      ...humanRights,
                      tenkilMuseumUrl: e.target.value,
                    })
                  }
                  placeholder="https://..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kpf-teal focus:border-kpf-teal"
                />
              </div>

              <div>
                <label
                  htmlFor="about_human_rights_instagram_url"
                  className="block text-sm font-bold text-gray-700 mb-2"
                >
                  Instagram URL
                </label>
                <input
                  id="about_human_rights_instagram_url"
                  type="text"
                  value={humanRights.instagramUrl}
                  onChange={(e) =>
                    setHumanRights({
                      ...humanRights,
                      instagramUrl: e.target.value,
                    })
                  }
                  placeholder="https://..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-kpf-teal focus:border-kpf-teal"
                />
              </div>
            </div>

            <button
              onClick={saveHumanRights}
              disabled={isSaving}
              className="mt-6 flex items-center gap-2 px-6 py-3 bg-kpf-teal text-white rounded-lg hover:bg-kpf-teal/90 transition-all disabled:opacity-50 font-bold"
            >
              <Save size={18} />
              {isSaving ? t.saving : t.save}
            </button>
          </div>

          {/* Partners Section */}
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Users size={24} className="text-indigo-600" />
              {t.partners}
            </h2>

            <div className="space-y-4 mb-6">
              {partners.map((item, idx) => (
                <div
                  key={item.id ?? `${item.displayOrder ?? "new"}-${item.name}`}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex justify-between items-start"
                >
                  <div className="flex-1 flex gap-4">
                    {item.logoUrl && (
                      <img
                        src={item.logoUrl}
                        alt={item.name}
                        className="w-16 h-16 object-contain"
                        onError={(e) => {
                          (e.target as HTMLImageElement).alt = "Yüklenemedi";
                        }}
                      />
                    )}
                    <div>
                      <p className="font-bold text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        {item.descriptionTr}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingPartner(item)}
                      className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => deletePartner(item.id || "")}
                      className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() =>
                setEditingPartner({
                  name: "",
                  descriptionTr: "",
                  descriptionDe: "",
                  logoUrl: null,
                  websiteUrl: null,
                  displayOrder: partners.length,
                  isActive: true,
                })
              }
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold"
            >
              <Plus size={18} />
              {t.add}
            </button>
          </div>
        </div>
      </div>

      {/* Modal: Core Value */}
      {editingCoreValue && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 md:p-4">
          <div className="bg-white rounded-xl max-w-[98vw] md:max-w-2xl w-full max-h-[95vh] md:max-h-[90vh] overflow-y-auto p-4 sm:p-6 md:p-8">
            <h3 className="text-xl font-bold mb-6">
              {editingCoreValue.id ? t.edit : t.add} - {t.coreValues}
            </h3>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="about_modal_core_value_title_tr"
                  className="block text-sm font-bold text-gray-700 mb-2"
                >
                  Başlık (TR)
                </label>
                <input
                  id="about_modal_core_value_title_tr"
                  type="text"
                  value={editingCoreValue.titleTr}
                  onChange={(e) =>
                    setEditingCoreValue({
                      ...editingCoreValue,
                      titleTr: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label
                  htmlFor="about_modal_core_value_title_de"
                  className="block text-sm font-bold text-gray-700 mb-2"
                >
                  Titel (DE)
                </label>
                <input
                  id="about_modal_core_value_title_de"
                  type="text"
                  value={editingCoreValue.titleDe}
                  onChange={(e) =>
                    setEditingCoreValue({
                      ...editingCoreValue,
                      titleDe: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label
                  htmlFor="about_modal_core_value_description_tr"
                  className="block text-sm font-bold text-gray-700 mb-2"
                >
                  Açıklama (TR)
                </label>
                <textarea
                  id="about_modal_core_value_description_tr"
                  value={editingCoreValue.descriptionTr}
                  onChange={(e) =>
                    setEditingCoreValue({
                      ...editingCoreValue,
                      descriptionTr: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label
                  htmlFor="about_modal_core_value_description_de"
                  className="block text-sm font-bold text-gray-700 mb-2"
                >
                  Beschreibung (DE)
                </label>
                <textarea
                  id="about_modal_core_value_description_de"
                  value={editingCoreValue.descriptionDe}
                  onChange={(e) =>
                    setEditingCoreValue({
                      ...editingCoreValue,
                      descriptionDe: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 resize-none"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditingCoreValue(null)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-bold"
              >
                <X size={18} />
                {t.cancel}
              </button>
              <button
                onClick={() => saveCoreValue(editingCoreValue)}
                disabled={isSaving}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 font-bold"
              >
                <Save size={18} />
                {isSaving ? t.saving : t.save}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Focus Area */}
      {editingFocusArea && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 md:p-4">
          <div className="bg-white rounded-xl max-w-[98vw] md:max-w-2xl w-full max-h-[95vh] md:max-h-[90vh] overflow-y-auto p-4 sm:p-6 md:p-8">
            <h3 className="text-xl font-bold mb-6">
              {editingFocusArea.id ? t.edit : t.add} - {t.focusAreas}
            </h3>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="about_modal_focus_area_title_tr"
                  className="block text-sm font-bold text-gray-700 mb-2"
                >
                  Başlık (TR)
                </label>
                <input
                  id="about_modal_focus_area_title_tr"
                  type="text"
                  value={editingFocusArea.titleTr}
                  onChange={(e) =>
                    setEditingFocusArea({
                      ...editingFocusArea,
                      titleTr: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label
                  htmlFor="about_modal_focus_area_title_de"
                  className="block text-sm font-bold text-gray-700 mb-2"
                >
                  Titel (DE)
                </label>
                <input
                  id="about_modal_focus_area_title_de"
                  type="text"
                  value={editingFocusArea.titleDe}
                  onChange={(e) =>
                    setEditingFocusArea({
                      ...editingFocusArea,
                      titleDe: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label
                  htmlFor="about_modal_focus_area_description_tr"
                  className="block text-sm font-bold text-gray-700 mb-2"
                >
                  Açıklama (TR)
                </label>
                <textarea
                  id="about_modal_focus_area_description_tr"
                  value={editingFocusArea.descriptionTr}
                  onChange={(e) =>
                    setEditingFocusArea({
                      ...editingFocusArea,
                      descriptionTr: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label
                  htmlFor="about_modal_focus_area_description_de"
                  className="block text-sm font-bold text-gray-700 mb-2"
                >
                  Beschreibung (DE)
                </label>
                <textarea
                  id="about_modal_focus_area_description_de"
                  value={editingFocusArea.descriptionDe}
                  onChange={(e) =>
                    setEditingFocusArea({
                      ...editingFocusArea,
                      descriptionDe: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label
                  htmlFor="about_modal_focus_area_icon_file"
                  className="block text-sm font-bold text-gray-700 mb-2"
                >
                  İcon Dosyası Yükle
                </label>
                <input
                  id="about_modal_focus_area_icon_file"
                  type="file"
                  accept="image/*"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 file:mr-4 file:py-3 file:px-5 md:file:py-2 md:file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        setEditingFocusArea({
                          ...editingFocusArea,
                          iconBase64: event.target?.result as string,
                          iconFileName: file.name,
                        });
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Veya URL ile açıkla:
                </p>
                <input
                  id="about_modal_focus_area_icon_url"
                  type="text"
                  value={editingFocusArea.iconUrl || ""}
                  onChange={(e) =>
                    setEditingFocusArea({
                      ...editingFocusArea,
                      iconUrl: e.target.value,
                    })
                  }
                  placeholder="https://..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 mt-2"
                />
                {(editingFocusArea.iconUrl || editingFocusArea.iconBase64) && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg flex items-center gap-3">
                    <span className="text-sm text-gray-600">📸 Ön İzleme:</span>
                    <img
                      src={
                        editingFocusArea.iconBase64 ||
                        editingFocusArea.iconUrl ||
                        ""
                      }
                      alt="Icon Preview"
                      className="h-12 w-12 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).alt = "Yüklenemedi";
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditingFocusArea(null)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-bold"
              >
                <X size={18} />
                {t.cancel}
              </button>
              <button
                onClick={() => saveFocusArea(editingFocusArea)}
                disabled={isSaving}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 font-bold"
              >
                <Save size={18} />
                {isSaving ? t.saving : t.save}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Activity Area */}
      {editingActivityArea && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 md:p-4">
          <div className="bg-white rounded-xl max-w-[98vw] md:max-w-2xl w-full max-h-[95vh] md:max-h-[90vh] overflow-y-auto p-4 sm:p-6 md:p-8">
            <h3 className="text-xl font-bold mb-6">
              {editingActivityArea.id ? t.edit : t.add} - {t.activityAreas}
            </h3>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="about_modal_activity_area_title_tr"
                  className="block text-sm font-bold text-gray-700 mb-2"
                >
                  Başlık (TR)
                </label>
                <input
                  id="about_modal_activity_area_title_tr"
                  type="text"
                  value={editingActivityArea.titleTr}
                  onChange={(e) =>
                    setEditingActivityArea({
                      ...editingActivityArea,
                      titleTr: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label
                  htmlFor="about_modal_activity_area_title_de"
                  className="block text-sm font-bold text-gray-700 mb-2"
                >
                  Titel (DE)
                </label>
                <input
                  id="about_modal_activity_area_title_de"
                  type="text"
                  value={editingActivityArea.titleDe}
                  onChange={(e) =>
                    setEditingActivityArea({
                      ...editingActivityArea,
                      titleDe: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label
                  htmlFor="about_modal_activity_area_description_tr"
                  className="block text-sm font-bold text-gray-700 mb-2"
                >
                  Açıklama (TR)
                </label>
                <textarea
                  id="about_modal_activity_area_description_tr"
                  value={editingActivityArea.descriptionTr}
                  onChange={(e) =>
                    setEditingActivityArea({
                      ...editingActivityArea,
                      descriptionTr: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label
                  htmlFor="about_modal_activity_area_description_de"
                  className="block text-sm font-bold text-gray-700 mb-2"
                >
                  Beschreibung (DE)
                </label>
                <textarea
                  id="about_modal_activity_area_description_de"
                  value={editingActivityArea.descriptionDe}
                  onChange={(e) =>
                    setEditingActivityArea({
                      ...editingActivityArea,
                      descriptionDe: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 resize-none"
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditingActivityArea(null)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-bold"
              >
                <X size={18} />
                {t.cancel}
              </button>
              <button
                onClick={() => saveActivityArea(editingActivityArea)}
                disabled={isSaving}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 font-bold"
              >
                <Save size={18} />
                {isSaving ? t.saving : t.save}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Team Member */}
      {editingTeamMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 md:p-4">
          <div className="bg-white rounded-xl max-w-[98vw] md:max-w-2xl w-full max-h-[95vh] md:max-h-[90vh] overflow-y-auto p-4 sm:p-6 md:p-8">
            <h3 className="text-xl font-bold mb-6">
              {editingTeamMember.id ? t.edit : t.add} - {t.teamMembers}
            </h3>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="about_modal_team_member_name"
                  className="block text-sm font-bold text-gray-700 mb-2"
                >
                  Ad
                </label>
                <input
                  id="about_modal_team_member_name"
                  type="text"
                  value={editingTeamMember.name?.value || ""}
                  onChange={(e) =>
                    setEditingTeamMember({
                      ...editingTeamMember,
                      name: { value: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label
                  htmlFor="about_modal_team_member_title_tr"
                  className="block text-sm font-bold text-gray-700 mb-2"
                >
                  Ünvan (TR)
                </label>
                <input
                  id="about_modal_team_member_title_tr"
                  type="text"
                  value={editingTeamMember.titleTr?.value || ""}
                  onChange={(e) =>
                    setEditingTeamMember({
                      ...editingTeamMember,
                      titleTr: { value: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label
                  htmlFor="about_modal_team_member_title_de"
                  className="block text-sm font-bold text-gray-700 mb-2"
                >
                  Titel (DE)
                </label>
                <input
                  id="about_modal_team_member_title_de"
                  type="text"
                  value={editingTeamMember.titleDe?.value || ""}
                  onChange={(e) =>
                    setEditingTeamMember({
                      ...editingTeamMember,
                      titleDe: { value: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label
                  htmlFor="about_modal_team_member_image_url"
                  className="block text-sm font-bold text-gray-700 mb-2"
                >
                  Görsel URL
                </label>
                <input
                  id="about_modal_team_member_image_url"
                  type="text"
                  value={editingTeamMember.imageUrl || ""}
                  onChange={(e) =>
                    setEditingTeamMember({
                      ...editingTeamMember,
                      imageUrl: e.target.value,
                    })
                  }
                  placeholder="https://..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
                {editingTeamMember.imageUrl && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <img
                      src={editingTeamMember.imageUrl}
                      alt="Preview"
                      className="h-24 w-24 object-cover rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).alt = "Yüklenemedi";
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditingTeamMember(null)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-bold"
              >
                <X size={18} />
                {t.cancel}
              </button>
              <button
                onClick={() => saveTeamMember(editingTeamMember)}
                disabled={isSaving}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 font-bold"
              >
                <Save size={18} />
                {isSaving ? t.saving : t.save}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Partner */}
      {editingPartner && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 md:p-4">
          <div className="bg-white rounded-xl max-w-[98vw] md:max-w-2xl w-full max-h-[95vh] md:max-h-[90vh] overflow-y-auto p-4 sm:p-6 md:p-8">
            <h3 className="text-xl font-bold mb-6">
              {editingPartner.id ? t.edit : t.add} - {t.partners}
            </h3>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="about_modal_partner_name"
                  className="block text-sm font-bold text-gray-700 mb-2"
                >
                  Ad
                </label>
                <input
                  id="about_modal_partner_name"
                  type="text"
                  value={editingPartner.name}
                  onChange={(e) =>
                    setEditingPartner({
                      ...editingPartner,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label
                  htmlFor="about_modal_partner_description_tr"
                  className="block text-sm font-bold text-gray-700 mb-2"
                >
                  Açıklama (TR)
                </label>
                <textarea
                  id="about_modal_partner_description_tr"
                  value={editingPartner.descriptionTr}
                  onChange={(e) =>
                    setEditingPartner({
                      ...editingPartner,
                      descriptionTr: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label
                  htmlFor="about_modal_partner_description_de"
                  className="block text-sm font-bold text-gray-700 mb-2"
                >
                  Beschreibung (DE)
                </label>
                <textarea
                  id="about_modal_partner_description_de"
                  value={editingPartner.descriptionDe}
                  onChange={(e) =>
                    setEditingPartner({
                      ...editingPartner,
                      descriptionDe: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label
                  htmlFor="about_modal_partner_logo_url"
                  className="block text-sm font-bold text-gray-700 mb-2"
                >
                  Logo URL
                </label>
                <input
                  id="about_modal_partner_logo_url"
                  type="text"
                  value={editingPartner.logoUrl || ""}
                  onChange={(e) =>
                    setEditingPartner({
                      ...editingPartner,
                      logoUrl: e.target.value,
                    })
                  }
                  placeholder="https://..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
                {editingPartner.logoUrl && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <img
                      src={editingPartner.logoUrl}
                      alt="Logo Preview"
                      className="h-16 w-16 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).alt = "Yüklenemedi";
                      }}
                    />
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="about_modal_partner_website_url"
                  className="block text-sm font-bold text-gray-700 mb-2"
                >
                  Website URL
                </label>
                <input
                  id="about_modal_partner_website_url"
                  type="text"
                  value={editingPartner.websiteUrl || ""}
                  onChange={(e) =>
                    setEditingPartner({
                      ...editingPartner,
                      websiteUrl: e.target.value,
                    })
                  }
                  placeholder="https://..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  id="about_modal_partner_is_active"
                  type="checkbox"
                  checked={editingPartner.isActive}
                  onChange={(e) =>
                    setEditingPartner({
                      ...editingPartner,
                      isActive: e.target.checked,
                    })
                  }
                  className="w-4 h-4"
                />
                <label
                  htmlFor="about_modal_partner_is_active"
                  className="text-sm font-bold text-gray-700"
                >
                  Aktif
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditingPartner(null)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-bold"
              >
                <X size={18} />
                {t.cancel}
              </button>
              <button
                onClick={() => savePartner(editingPartner)}
                disabled={isSaving}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 font-bold"
              >
                <Save size={18} />
                {isSaving ? t.saving : t.save}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quill Editor Styling */}
      <style>{`
        .quill-modern-container {
          background: #f8fafc;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          overflow: hidden;
        }
        .quill-modern-container:focus-within {
          background: #fff;
          border-color: #14b8a6;
        }
        .ql-toolbar.ql-snow {
          border: none !important;
          border-bottom: 1px solid #e2e8f0 !important;
          background: #fff;
        }
        .ql-container.ql-snow {
          border: none !important;
          min-height: 120px;
          font-size: 15px;
        }
        .ql-editor {
          padding: 12px !important;
        }
      `}</style>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={language === "tr" ? "Sil" : "Löschen"}
        cancelText={language === "tr" ? "İptal" : "Abbrechen"}
        type="danger"
      />
    </div>
  );
};

export default AdminAbout;
