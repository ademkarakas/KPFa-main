import React, { useState, useEffect } from "react";
import { useLanguage } from "../../contexts/LanguageContext";

interface MultilangField {
  value: string;
}

interface AboutField {
  titleTr: MultilangField;
  titleDe: MultilangField;
  descriptionTr: MultilangField;
  descriptionDe: MultilangField;
  order: number;
}

interface TeamMemberField {
  name: MultilangField;
  titleTr: MultilangField;
  titleDe: MultilangField;
  imageUrl: string;
  order: number;
}

interface AboutForm {
  quoteTr: MultilangField;
  quoteDe: MultilangField;
  quoteAuthor: string;
  whoWeAreTr: MultilangField;
  whoWeAreDe: MultilangField;
  goalsTr: MultilangField;
  goalsDe: MultilangField;
  visionTr: MultilangField;
  visionDe: MultilangField;
  missionTr: MultilangField;
  missionDe: MultilangField;
  coreValues: AboutField[];
  focusAreas: AboutField[];
  activityAreas: AboutField[];
  teamMembers: TeamMemberField[];
}

const initialForm: AboutForm = {
  quoteTr: { value: "" },
  quoteDe: { value: "" },
  quoteAuthor: "",
  whoWeAreTr: { value: "" },
  whoWeAreDe: { value: "" },
  goalsTr: { value: "" },
  goalsDe: { value: "" },
  visionTr: { value: "" },
  visionDe: { value: "" },
  missionTr: { value: "" },
  missionDe: { value: "" },
  coreValues: [
    {
      titleTr: { value: "" },
      titleDe: { value: "" },
      descriptionTr: { value: "" },
      descriptionDe: { value: "" },
      order: 1,
    },
  ],
  focusAreas: [
    {
      titleTr: { value: "" },
      titleDe: { value: "" },
      descriptionTr: { value: "" },
      descriptionDe: { value: "" },
      order: 1,
    },
  ],
  activityAreas: [
    {
      titleTr: { value: "" },
      titleDe: { value: "" },
      descriptionTr: { value: "" },
      descriptionDe: { value: "" },
      order: 1,
    },
  ],
  teamMembers: [
    {
      name: { value: "" },
      titleTr: { value: "" },
      titleDe: { value: "" },
      imageUrl: "",
      order: 1,
    },
  ],
};

const AdminAbout: React.FC = () => {
  const { language } = useLanguage();
  const [form, setForm] = useState<AboutForm>(initialForm);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<
    | "overview"
    | "quote"
    | "coreValues"
    | "focusAreas"
    | "activityAreas"
    | "team"
  >("overview");
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "";
  }>({ message: "", type: "" });

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const res = await fetch("https://localhost:7189/api/AboutUs");
        if (!res.ok) {
          console.error("HTTP hata:", res.status);
          return;
        }
        const data = await res.json();
        setForm(data);
      } catch (error) {
        console.error("AboutUs verisi alınamadı", error);
      }
    };
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
    },
  };

  const t = texts[language];

  const handleSave = async () => {
    const token = localStorage.getItem("adminToken");
    setIsSaving(true);
    try {
      const response = await fetch("https://localhost:7189/api/AboutUs", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error("Güncelleme başarısız!");
      setNotification({ message: "Başarıyla kaydedildi!", type: "success" });
      setTimeout(() => setNotification({ message: "", type: "" }), 3000);
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

  const handleFieldChange = (field: keyof AboutForm, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleListChange = (
    key: "coreValues" | "focusAreas" | "activityAreas" | "teamMembers",
    idx: number,
    field: string,
    value: any
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: prev[key].map((item: any, i: number) =>
        i === idx ? { ...item, [field]: value } : item
      ),
    }));
  };

  const handleAdd = (
    key: "coreValues" | "focusAreas" | "activityAreas" | "teamMembers",
    emptyObj: AboutField | TeamMemberField
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: [
        ...(prev[key] as any[]),
        { ...emptyObj, order: prev[key].length + 1 },
      ],
    }));
  };

  const handleRemove = (
    key: "coreValues" | "focusAreas" | "activityAreas" | "teamMembers",
    idx: number
  ) => {
    if (window.confirm(t.confirmDelete)) {
      setForm((prev) => ({
        ...prev,
        [key]: prev[key].filter((_: any, i: number) => i !== idx),
      }));
    }
  };

  const handleMove = (
    key: "coreValues" | "focusAreas" | "activityAreas" | "teamMembers",
    idx: number,
    dir: -1 | 1
  ) => {
    setForm((prev) => {
      const arr = [...prev[key]];
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= arr.length) return prev;
      [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
      return { ...prev, [key]: arr };
    });
  };

  const TabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            {[
              { key: "whoWeAreTr", label: t.whoWeAre, show: language === "tr" },
              { key: "whoWeAreDe", label: t.whoWeAre, show: language === "de" },
              { key: "goalsTr", label: t.goals, show: language === "tr" },
              { key: "goalsDe", label: t.goals, show: language === "de" },
              { key: "visionTr", label: t.vision, show: language === "tr" },
              { key: "visionDe", label: t.vision, show: language === "de" },
              { key: "missionTr", label: t.mission, show: language === "tr" },
              { key: "missionDe", label: t.mission, show: language === "de" },
            ]
              .filter((item) => item.show)
              .map((item) => (
                <div key={item.key} className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-700 mb-2">
                    {item.label}
                  </h3>
                  <textarea
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                    rows={4}
                    value={
                      (form[item.key as keyof AboutForm] as MultilangField)
                        .value
                    }
                    onChange={(e) =>
                      handleFieldChange(item.key as keyof AboutForm, {
                        value: e.target.value,
                      })
                    }
                  />
                </div>
              ))}
          </div>
        );

      case "quote":
        return (
          <div className="max-w-2xl">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              {t.quote}
            </h2>
            <div className="space-y-4">
              {language === "tr" && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    {t.quoteText}
                  </label>
                  <textarea
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                    rows={4}
                    placeholder={t.quoteText}
                    value={form.quoteTr.value}
                    onChange={(e) =>
                      handleFieldChange("quoteTr", {
                        value: e.target.value,
                      })
                    }
                  />
                </div>
              )}
              {language === "de" && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">
                    {t.quoteText}
                  </label>
                  <textarea
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                    rows={4}
                    placeholder={t.quoteText}
                    value={form.quoteDe.value}
                    onChange={(e) =>
                      handleFieldChange("quoteDe", {
                        value: e.target.value,
                      })
                    }
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  {t.quoteAuthor}
                </label>
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  type="text"
                  placeholder={t.quoteAuthor}
                  value={form.quoteAuthor}
                  onChange={(e) =>
                    handleFieldChange("quoteAuthor", e.target.value)
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
                onClick={() =>
                  handleAdd("coreValues", {
                    titleTr: { value: "" },
                    titleDe: { value: "" },
                    descriptionTr: { value: "" },
                    descriptionDe: { value: "" },
                    order: 1,
                  })
                }
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
              {(form.coreValues as AboutField[]).map((item, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-lg p-6 bg-gray-50"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
                      #{idx + 1}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleMove("coreValues", idx, -1)}
                        disabled={idx === 0}
                        className="p-2 text-gray-600 hover:text-blue-600 disabled:opacity-30"
                        title={t.moveUp}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 10l7-7m0 0l7 7m-7-7v18"
                          ></path>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleMove("coreValues", idx, 1)}
                        disabled={
                          idx === (form.coreValues as AboutField[]).length - 1
                        }
                        className="p-2 text-gray-600 hover:text-blue-600 disabled:opacity-30"
                        title={t.moveDown}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                          ></path>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleRemove("coreValues", idx)}
                        className="p-2 text-red-600 hover:text-red-700"
                        title={t.delete}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {language === "tr" && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            {t.title}
                          </label>
                          <input
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            type="text"
                            value={item.titleTr.value}
                            onChange={(e) =>
                              handleListChange("coreValues", idx, "titleTr", {
                                value: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            {t.description}
                          </label>
                          <textarea
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                            rows={3}
                            value={item.descriptionTr.value}
                            onChange={(e) =>
                              handleListChange(
                                "coreValues",
                                idx,
                                "descriptionTr",
                                {
                                  value: e.target.value,
                                }
                              )
                            }
                          />
                        </div>
                      </>
                    )}
                    {language === "de" && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            {t.title}
                          </label>
                          <input
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            type="text"
                            value={item.titleDe.value}
                            onChange={(e) =>
                              handleListChange("coreValues", idx, "titleDe", {
                                value: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            {t.description}
                          </label>
                          <textarea
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                            rows={3}
                            value={item.descriptionDe.value}
                            onChange={(e) =>
                              handleListChange(
                                "coreValues",
                                idx,
                                "descriptionDe",
                                {
                                  value: e.target.value,
                                }
                              )
                            }
                          />
                        </div>
                      </>
                    )}
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
                onClick={() =>
                  handleAdd("focusAreas", {
                    titleTr: { value: "" },
                    titleDe: { value: "" },
                    descriptionTr: { value: "" },
                    descriptionDe: { value: "" },
                    order: 1,
                  })
                }
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
              {(form.focusAreas as AboutField[]).map((item, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-lg p-6 bg-gray-50"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
                      #{idx + 1}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleMove("focusAreas", idx, -1)}
                        disabled={idx === 0}
                        className="p-2 text-gray-600 hover:text-blue-600 disabled:opacity-30"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 10l7-7m0 0l7 7m-7-7v18"
                          ></path>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleMove("focusAreas", idx, 1)}
                        disabled={
                          idx === (form.focusAreas as AboutField[]).length - 1
                        }
                        className="p-2 text-gray-600 hover:text-blue-600 disabled:opacity-30"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                          ></path>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleRemove("focusAreas", idx)}
                        className="p-2 text-red-600 hover:text-red-700"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {language === "tr" && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            {t.title}
                          </label>
                          <input
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            type="text"
                            value={item.titleTr.value}
                            onChange={(e) =>
                              handleListChange("focusAreas", idx, "titleTr", {
                                value: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            {t.description}
                          </label>
                          <textarea
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                            rows={3}
                            value={item.descriptionTr.value}
                            onChange={(e) =>
                              handleListChange(
                                "focusAreas",
                                idx,
                                "descriptionTr",
                                {
                                  value: e.target.value,
                                }
                              )
                            }
                          />
                        </div>
                      </>
                    )}
                    {language === "de" && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            {t.title}
                          </label>
                          <input
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            type="text"
                            value={item.titleDe.value}
                            onChange={(e) =>
                              handleListChange("focusAreas", idx, "titleDe", {
                                value: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            {t.description}
                          </label>
                          <textarea
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                            rows={3}
                            value={item.descriptionDe.value}
                            onChange={(e) =>
                              handleListChange(
                                "focusAreas",
                                idx,
                                "descriptionDe",
                                {
                                  value: e.target.value,
                                }
                              )
                            }
                          />
                        </div>
                      </>
                    )}
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
                onClick={() =>
                  handleAdd("activityAreas", {
                    titleTr: { value: "" },
                    titleDe: { value: "" },
                    descriptionTr: { value: "" },
                    descriptionDe: { value: "" },
                    order: 1,
                  })
                }
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
              {(form.activityAreas as AboutField[]).map((item, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-lg p-6 bg-gray-50"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
                      #{idx + 1}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleMove("activityAreas", idx, -1)}
                        disabled={idx === 0}
                        className="p-2 text-gray-600 hover:text-blue-600 disabled:opacity-30"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 10l7-7m0 0l7 7m-7-7v18"
                          ></path>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleMove("activityAreas", idx, 1)}
                        disabled={
                          idx ===
                          (form.activityAreas as AboutField[]).length - 1
                        }
                        className="p-2 text-gray-600 hover:text-blue-600 disabled:opacity-30"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                          ></path>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleRemove("activityAreas", idx)}
                        className="p-2 text-red-600 hover:text-red-700"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {language === "tr" && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            {t.title}
                          </label>
                          <input
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            type="text"
                            value={item.titleTr.value}
                            onChange={(e) =>
                              handleListChange(
                                "activityAreas",
                                idx,
                                "titleTr",
                                {
                                  value: e.target.value,
                                }
                              )
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            {t.description}
                          </label>
                          <textarea
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                            rows={3}
                            value={item.descriptionTr.value}
                            onChange={(e) =>
                              handleListChange(
                                "activityAreas",
                                idx,
                                "descriptionTr",
                                {
                                  value: e.target.value,
                                }
                              )
                            }
                          />
                        </div>
                      </>
                    )}
                    {language === "de" && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            {t.title}
                          </label>
                          <input
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            type="text"
                            value={item.titleDe.value}
                            onChange={(e) =>
                              handleListChange(
                                "activityAreas",
                                idx,
                                "titleDe",
                                {
                                  value: e.target.value,
                                }
                              )
                            }
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-2">
                            {t.description}
                          </label>
                          <textarea
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                            rows={3}
                            value={item.descriptionDe.value}
                            onChange={(e) =>
                              handleListChange(
                                "activityAreas",
                                idx,
                                "descriptionDe",
                                {
                                  value: e.target.value,
                                }
                              )
                            }
                          />
                        </div>
                      </>
                    )}
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
                onClick={() =>
                  handleAdd("teamMembers", {
                    name: { value: "" },
                    titleTr: { value: "" },
                    titleDe: { value: "" },
                    imageUrl: "",
                    order: 1,
                  })
                }
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {form.teamMembers.map((member, idx) => (
                <div
                  key={idx}
                  className="border border-gray-200 rounded-lg p-6 bg-gray-50"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm">
                      #{idx + 1}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleMove("teamMembers", idx, -1)}
                        disabled={idx === 0}
                        className="p-2 text-gray-600 hover:text-blue-600 disabled:opacity-30"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 10l7-7m0 0l7 7m-7-7v18"
                          ></path>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleMove("teamMembers", idx, 1)}
                        disabled={idx === form.teamMembers.length - 1}
                        className="p-2 text-gray-600 hover:text-blue-600 disabled:opacity-30"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                          ></path>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleRemove("teamMembers", idx)}
                        className="p-2 text-red-600 hover:text-red-700"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        {t.name}
                      </label>
                      <input
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        type="text"
                        value={member.name.value}
                        onChange={(e) =>
                          handleListChange("teamMembers", idx, "name", {
                            value: e.target.value,
                          })
                        }
                      />
                    </div>

                    {language === "tr" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          {t.title}
                        </label>
                        <input
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          type="text"
                          value={member.titleTr.value}
                          onChange={(e) =>
                            handleListChange("teamMembers", idx, "titleTr", {
                              value: e.target.value,
                            })
                          }
                        />
                      </div>
                    )}

                    {language === "de" && (
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">
                          {t.title}
                        </label>
                        <input
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          type="text"
                          value={member.titleDe.value}
                          onChange={(e) =>
                            handleListChange("teamMembers", idx, "titleDe", {
                              value: e.target.value,
                            })
                          }
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-2">
                        {t.imageUrl}
                      </label>
                      <input
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        type="text"
                        value={member.imageUrl}
                        onChange={(e) =>
                          handleListChange(
                            "teamMembers",
                            idx,
                            "imageUrl",
                            e.target.value
                          )
                        }
                      />
                      {member.imageUrl && (
                        <div className="mt-4">
                          <p className="text-sm font-medium text-gray-600 mb-2">
                            {t.photoPreview}
                          </p>
                          <img
                            src={member.imageUrl}
                            alt="Preview"
                            className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "https://via.placeholder.com/150";
                            }}
                          />
                        </div>
                      )}
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
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {notification.message && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
            notification.type === "success"
              ? "bg-green-100 text-green-800 border border-green-300"
              : "bg-red-100 text-red-800 border border-red-300"
          }`}
        >
          <div className="flex items-center">
            <span className="mr-2">
              {notification.type === "success" ? "✓" : "✗"}
            </span>
            {notification.message}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">{t.pageTitle}</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSaving ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {t.saving}
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  {t.save}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-t-xl shadow-lg border-b border-gray-200 overflow-x-auto">
          <div className="flex min-w-full">
            {[
              {
                id: "overview",
                label: language === "tr" ? "Genel Bilgi" : "Übersicht",
              },
              { id: "quote", label: t.quote },
              { id: "coreValues", label: t.coreValues },
              { id: "focusAreas", label: t.focusAreas },
              { id: "activityAreas", label: t.activityAreas },
              { id: "team", label: t.teamMembers },
            ].map((tab, idx) => (
              <button
                key={tab.id}
                onClick={() =>
                  setActiveTab(
                    tab.id as
                      | "overview"
                      | "quote"
                      | "coreValues"
                      | "focusAreas"
                      | "activityAreas"
                      | "team"
                  )
                }
                className={`flex-1 px-4 py-4 font-medium transition-all whitespace-nowrap ${
                  idx > 0 ? "border-l border-gray-200" : ""
                } ${
                  activeTab === tab.id
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-b-xl shadow-lg p-6 mb-8">
          <TabContent />
        </div>

        {/* Sticky Save Button */}
        <div className="sticky bottom-6 bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center">
            <button
              onClick={() => setForm(initialForm)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t.cancel}
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSaving ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {t.saving}
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  {t.save}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAbout;
