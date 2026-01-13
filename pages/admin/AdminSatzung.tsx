import { Book, Plus, Save, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";

// Backend DTO yapısı
interface SectionContent {
  heading: string;
  bodyTurkish: string;
  bodyGerman: string;
}

interface Purpose {
  letter: string;
  content: SectionContent;
}

interface MembershipDetail {
  type: SectionContent;
  descriptionTurkish: SectionContent;
  descriptionGerman: SectionContent;
}

interface SatzungDto {
  id: string;
  titleTurkish: string;
  titleGerman: string;
  nameAndSeatTurkish: SectionContent;
  nameAndSeatGerman: SectionContent;
  nameDescTurkish: SectionContent;
  nameDescGerman: SectionContent;
  seatTurkish: SectionContent;
  seatGerman: SectionContent;
  seatDescTurkish: SectionContent;
  seatDescGerman: SectionContent;
  fiscalYearTurkish: SectionContent;
  fiscalYearGerman: SectionContent;
  fiscalYearDescTurkish: SectionContent;
  fiscalYearDescGerman: SectionContent;
  purposeOfAssociationTurkish: SectionContent;
  purposeOfAssociationGerman: SectionContent;
  purposes: Purpose[];
  gemeinnuetzigkeitTurkish: SectionContent;
  gemeinnuetzigkeitGerman: SectionContent;
  politicalNeutralityTurkish: SectionContent;
  politicalNeutralityGerman: SectionContent;
  memberships: MembershipDetail[];
  updatedAt: string;
}

const createEmptySection = (): SectionContent => ({
  heading: "",
  bodyTurkish: "",
  bodyGerman: "",
});

const EMPTY_STATE: SatzungDto = {
  id: "",
  titleTurkish: "",
  titleGerman: "",
  nameAndSeatTurkish: createEmptySection(),
  nameAndSeatGerman: createEmptySection(),
  nameDescTurkish: createEmptySection(),
  nameDescGerman: createEmptySection(),
  seatTurkish: createEmptySection(),
  seatGerman: createEmptySection(),
  seatDescTurkish: createEmptySection(),
  seatDescGerman: createEmptySection(),
  fiscalYearTurkish: createEmptySection(),
  fiscalYearGerman: createEmptySection(),
  fiscalYearDescTurkish: createEmptySection(),
  fiscalYearDescGerman: createEmptySection(),
  purposeOfAssociationTurkish: createEmptySection(),
  purposeOfAssociationGerman: createEmptySection(),
  purposes: [],
  gemeinnuetzigkeitTurkish: createEmptySection(),
  gemeinnuetzigkeitGerman: createEmptySection(),
  politicalNeutralityTurkish: createEmptySection(),
  politicalNeutralityGerman: createEmptySection(),
  memberships: [],
  updatedAt: "",
};

const AdminSatzung: React.FC = () => {
  const [content, setContent] = useState<SatzungDto>(EMPTY_STATE);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("basic");
  const { language } = useLanguage();

  useEffect(() => {
    loadSatzung();
  }, []);

  const loadSatzung = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        console.warn("Token bulunamadı, giriş yapmalısınız.");
        return; // finally bloğu çalışacaktır
      }

      const res = await fetch("https://localhost:7189/api/Satzung", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.warn("Satzung bulunamadı, boş başlatılıyor");
        return;
      }

      const contentType = res.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        console.warn("Backend JSON döndürmedi");
        return;
      }

      const dataArray = await res.json();
      if (!dataArray || dataArray.length === 0) {
        return;
      }

      const data = dataArray[0];
      setContent({
        ...EMPTY_STATE,
        ...data,
        purposes: data.purposes || [],
        memberships: data.memberships || [],
      });
    } catch (err) {
      console.error("Satzung yükleme hatası:", err);
    } finally {
      // Başarılı olsa da hata alsa da loading'i kapatırız
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        alert("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
        setLoading(false); // Burayı ekledik
        return;
      }

      const res = await fetch("https://localhost:7189/api/Satzung", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(content),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      alert("Tüzük başarıyla güncellendi!");
      await loadSatzung();
    } catch (err) {
      console.error("Satzung kaydetme hatası:", err);
      alert(
        "İşlem başarısız: " +
          (err instanceof Error ? err.message : "Bilinmeyen hata")
      );
    } finally {
      setLoading(false);
    }
  };

  const addPurpose = () => {
    const newPurpose: Purpose = {
      letter: String.fromCharCode(97 + content.purposes.length),
      content: createEmptySection(),
    };
    setContent({
      ...content,
      purposes: [...content.purposes, newPurpose],
    });
  };

  const removePurpose = (index: number) => {
    setContent({
      ...content,
      purposes: content.purposes.filter((_, i) => i !== index),
    });
  };

  const updatePurpose = (
    index: number,
    prop: keyof SectionContent,
    value: string
  ) => {
    const updated = [...content.purposes];
    updated[index] = {
      ...updated[index],
      content: {
        ...updated[index].content,
        [prop]: value,
      },
    };
    setContent({ ...content, purposes: updated });
  };

  const addMembership = () => {
    const newMembership: MembershipDetail = {
      type: createEmptySection(),
      descriptionTurkish: createEmptySection(),
      descriptionGerman: createEmptySection(),
    };
    setContent({
      ...content,
      memberships: [...content.memberships, newMembership],
    });
  };

  const removeMembership = (index: number) => {
    setContent({
      ...content,
      memberships: content.memberships.filter((_, i) => i !== index),
    });
  };

  const updateMembership = (
    index: number,
    field: "type" | "descriptionTurkish" | "descriptionGerman",
    prop: keyof SectionContent,
    value: string
  ) => {
    const updated = [...content.memberships];
    updated[index] = {
      ...updated[index],
      [field]: {
        ...updated[index][field],
        [prop]: value,
      },
    };
    setContent({ ...content, memberships: updated });
  };

  const updateSection = (
    field: keyof SatzungDto,
    prop: keyof SectionContent,
    value: string
  ) => {
    setContent({
      ...content,
      [field]: {
        ...(content[field] as SectionContent),
        [prop]: value,
      },
    });
  };

  const SectionInput: React.FC<{
    label: string;
    field: keyof SatzungDto;
    section: SectionContent;
  }> = ({ label, field, section }) => (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-slate-700">
        {label}
      </label>
      <input
        type="text"
        placeholder="Başlık / Heading"
        value={section.heading}
        onChange={(e) => updateSection(field, "heading", e.target.value)}
        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal text-sm"
      />
      <textarea
        placeholder="Türkçe içerik"
        value={section.bodyTurkish}
        onChange={(e) => updateSection(field, "bodyTurkish", e.target.value)}
        rows={3}
        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal resize-none text-sm"
      />
      <textarea
        placeholder="Deutscher Inhalt"
        value={section.bodyGerman}
        onChange={(e) => updateSection(field, "bodyGerman", e.target.value)}
        rows={3}
        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal resize-none text-sm"
      />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-3">
            <Book className="text-kpf-teal" size={32} />
            {language === "tr" ? "Tüzük Yönetimi" : "Satzung Verwaltung"}
          </h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto">
        {[
          {
            id: "basic",
            label: language === "tr" ? "Temel Bilgiler" : "Grunddaten",
          },
          {
            id: "name",
            label: language === "tr" ? "Ad ve Merkez" : "Name und Sitz",
          },
          { id: "purpose", label: language === "tr" ? "Amaç" : "Zweck" },
          {
            id: "gemeinnuetzigkeit",
            label: language === "tr" ? "Kamu Yararı" : "Gemeinnützigkeit",
          },
          {
            id: "membership",
            label: language === "tr" ? "Üyelik" : "Mitgliedschaft",
          },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 font-semibold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "border-b-2 border-kpf-teal text-kpf-teal"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Temel Bilgiler */}
        {activeTab === "basic" && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">
              {language === "tr" ? "Başlıklar" : "Überschriften"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Başlık (Türkçe)"
                value={content.titleTurkish}
                onChange={(e) =>
                  setContent({ ...content, titleTurkish: e.target.value })
                }
                required
                className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
              />
              <input
                type="text"
                placeholder="Titel (Deutsch)"
                value={content.titleGerman}
                onChange={(e) =>
                  setContent({ ...content, titleGerman: e.target.value })
                }
                required
                className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
              />
            </div>
          </div>
        )}

        {/* Ad ve Merkez */}
        {activeTab === "name" && (
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
            <SectionInput
              label={language === "tr" ? "Ad ve Merkez" : "Name und Sitz"}
              field="nameAndSeatTurkish"
              section={content.nameAndSeatTurkish}
            />
            <div className="border-t border-slate-200 pt-6"></div>
            <SectionInput
              label="Name und Sitz (DE)"
              field="nameAndSeatGerman"
              section={content.nameAndSeatGerman}
            />
            <div className="border-t border-slate-200 pt-6"></div>
            <SectionInput
              label="Ad Açıklaması (TR)"
              field="nameDescTurkish"
              section={content.nameDescTurkish}
            />
            <div className="border-t border-slate-200 pt-6"></div>
            <SectionInput
              label="Name Beschreibung (DE)"
              field="nameDescGerman"
              section={content.nameDescGerman}
            />
            <div className="border-t border-slate-200 pt-6"></div>
            <SectionInput
              label="Merkez (TR)"
              field="seatTurkish"
              section={content.seatTurkish}
            />
            <div className="border-t border-slate-200 pt-6"></div>
            <SectionInput
              label="Sitz (DE)"
              field="seatGerman"
              section={content.seatGerman}
            />
            <div className="border-t border-slate-200 pt-6"></div>
            <SectionInput
              label="Merkez Açıklaması (TR)"
              field="seatDescTurkish"
              section={content.seatDescTurkish}
            />
            <div className="border-t border-slate-200 pt-6"></div>
            <SectionInput
              label="Sitz Beschreibung (DE)"
              field="seatDescGerman"
              section={content.seatDescGerman}
            />
            <div className="border-t border-slate-200 pt-6"></div>
            <SectionInput
              label="Mali Yıl (TR)"
              field="fiscalYearTurkish"
              section={content.fiscalYearTurkish}
            />
            <div className="border-t border-slate-200 pt-6"></div>
            <SectionInput
              label="Geschäftsjahr (DE)"
              field="fiscalYearGerman"
              section={content.fiscalYearGerman}
            />
            <div className="border-t border-slate-200 pt-6"></div>
            <SectionInput
              label="Mali Yıl Açıklaması (TR)"
              field="fiscalYearDescTurkish"
              section={content.fiscalYearDescTurkish}
            />
            <div className="border-t border-slate-200 pt-6"></div>
            <SectionInput
              label="Geschäftsjahr Beschreibung (DE)"
              field="fiscalYearDescGerman"
              section={content.fiscalYearDescGerman}
            />
          </div>
        )}

        {/* Amaç */}
        {activeTab === "purpose" && (
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
            <SectionInput
              label="Derneğin Amacı (TR)"
              field="purposeOfAssociationTurkish"
              section={content.purposeOfAssociationTurkish}
            />
            <div className="border-t border-slate-200 pt-6"></div>
            <SectionInput
              label="Vereinszweck (DE)"
              field="purposeOfAssociationGerman"
              section={content.purposeOfAssociationGerman}
            />

            <div className="border-t border-slate-200 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800">Amaç Maddeleri</h3>
                <button
                  type="button"
                  onClick={addPurpose}
                  className="flex items-center gap-2 px-4 py-2 bg-kpf-red text-white rounded-lg hover:bg-red-700 transition-all"
                >
                  <Plus size={18} />
                  Madde Ekle
                </button>
              </div>

              <div className="space-y-4">
                {content.purposes.map((purpose, idx) => (
                  <div
                    key={idx}
                    className="border border-slate-200 rounded-lg p-4 bg-slate-50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-kpf-red">
                        Madde {purpose.letter})
                      </span>
                      <button
                        type="button"
                        onClick={() => removePurpose(idx)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Başlık"
                      value={purpose.content.heading}
                      onChange={(e) =>
                        updatePurpose(idx, "heading", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-2 text-sm bg-white"
                    />
                    <textarea
                      placeholder="Türkçe"
                      value={purpose.content.bodyTurkish}
                      onChange={(e) =>
                        updatePurpose(idx, "bodyTurkish", e.target.value)
                      }
                      rows={2}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-2 text-sm bg-white resize-none"
                    />
                    <textarea
                      placeholder="Deutsch"
                      value={purpose.content.bodyGerman}
                      onChange={(e) =>
                        updatePurpose(idx, "bodyGerman", e.target.value)
                      }
                      rows={2}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white resize-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Gemeinnützigkeit */}
        {activeTab === "gemeinnuetzigkeit" && (
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
            <SectionInput
              label="Kamu Yararı (TR)"
              field="gemeinnuetzigkeitTurkish"
              section={content.gemeinnuetzigkeitTurkish}
            />
            <div className="border-t border-slate-200 pt-6"></div>
            <SectionInput
              label="Gemeinnützigkeit (DE)"
              field="gemeinnuetzigkeitGerman"
              section={content.gemeinnuetzigkeitGerman}
            />
            <div className="border-t border-slate-200 pt-6"></div>
            <SectionInput
              label="Politik Tarafsızlık (TR)"
              field="politicalNeutralityTurkish"
              section={content.politicalNeutralityTurkish}
            />
            <div className="border-t border-slate-200 pt-6"></div>
            <SectionInput
              label="Politische Neutralität (DE)"
              field="politicalNeutralityGerman"
              section={content.politicalNeutralityGerman}
            />
          </div>
        )}

        {/* Üyelik */}
        {activeTab === "membership" && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">Üyelik Türleri</h3>
              <button
                type="button"
                onClick={addMembership}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
              >
                <Plus size={18} />
                Üyelik Türü Ekle
              </button>
            </div>

            <div className="space-y-6">
              {content.memberships.map((membership, idx) => (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-lg p-4 space-y-4 bg-slate-50"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-600">
                      Üyelik {idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeMembership(idx)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* Tip */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Tip
                    </label>
                    <input
                      type="text"
                      placeholder="Başlık"
                      value={membership.type.heading}
                      onChange={(e) =>
                        updateMembership(idx, "type", "heading", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-2 text-sm bg-white"
                    />
                    <textarea
                      placeholder="Türkçe"
                      value={membership.type.bodyTurkish}
                      onChange={(e) =>
                        updateMembership(
                          idx,
                          "type",
                          "bodyTurkish",
                          e.target.value
                        )
                      }
                      rows={2}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-2 text-sm bg-white resize-none"
                    />
                    <textarea
                      placeholder="Deutsch"
                      value={membership.type.bodyGerman}
                      onChange={(e) =>
                        updateMembership(
                          idx,
                          "type",
                          "bodyGerman",
                          e.target.value
                        )
                      }
                      rows={2}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white resize-none"
                    />
                  </div>

                  {/* Açıklama TR */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Açıklama (TR)
                    </label>
                    <input
                      type="text"
                      placeholder="Başlık"
                      value={membership.descriptionTurkish.heading}
                      onChange={(e) =>
                        updateMembership(
                          idx,
                          "descriptionTurkish",
                          "heading",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-2 text-sm bg-white"
                    />
                    <textarea
                      placeholder="Türkçe"
                      value={membership.descriptionTurkish.bodyTurkish}
                      onChange={(e) =>
                        updateMembership(
                          idx,
                          "descriptionTurkish",
                          "bodyTurkish",
                          e.target.value
                        )
                      }
                      rows={2}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white resize-none"
                    />
                  </div>

                  {/* Açıklama DE */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Beschreibung (DE)
                    </label>
                    <input
                      type="text"
                      placeholder="Heading"
                      value={membership.descriptionGerman.heading}
                      onChange={(e) =>
                        updateMembership(
                          idx,
                          "descriptionGerman",
                          "heading",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-2 text-sm bg-white"
                    />
                    <textarea
                      placeholder="Deutsch"
                      value={membership.descriptionGerman.bodyGerman}
                      onChange={(e) =>
                        updateMembership(
                          idx,
                          "descriptionGerman",
                          "bodyGerman",
                          e.target.value
                        )
                      }
                      rows={2}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-kpf-red text-white rounded-lg hover:bg-red-700 transition-all disabled:opacity-50 shadow-lg text-lg font-semibold"
        >
          <Save size={20} />
          {loading ? "Kaydediliyor..." : "Tüzük Güncelle"}
        </button>
      </form>
    </div>
  );
};

export default AdminSatzung;
