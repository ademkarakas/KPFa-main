import React, { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

interface VolunteerSectionItem {
  titleTr: string;
  titleDe: string;
  icon: string;
}
interface VolunteerSection {
  headingTr: string;
  headingDe: string;
  bodyTr: string;
  bodyDe: string;
  items: VolunteerSectionItem[];
}
interface VolunteerData {
  id: string;
  titleTr: string;
  titleDe: string;
  subtitleTr: string;
  subtitleDe: string;
  introTr: string;
  introDe: string;
  nameAndPurpose: VolunteerSection;
  why: VolunteerSection;
  who: VolunteerSection;
  how: VolunteerSection;
  ctaButtonTr: string;
  ctaButtonDe: string;
}

const AdminVolunteerPage: React.FC = () => {
  const { language } = useLanguage();
  const isGerman = language === "de";
  const [data, setData] = useState<VolunteerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchVolunteer = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          "https://localhost:7189/api/ValueItems/6620cb16-c787-486c-920a-6d559d12a6fa"
        );
        if (!res.ok) throw new Error("Failed to fetch");
        const json: any = await res.json();
        console.log("API Volunteer response:", json);
        // Eksik section'lar varsa doldur
        const emptySection = {
          headingTr: "",
          headingDe: "",
          bodyTr: "",
          bodyDe: "",
          items: [],
        };
        // Eğer sections dizisi varsa, sırayla map'le
        let nameAndPurpose = emptySection,
          why = emptySection,
          who = emptySection,
          how = emptySection;
        if (Array.isArray(json.sections)) {
          nameAndPurpose = json.sections[0] ?? emptySection;
          why = json.sections[1] ?? emptySection;
          who = json.sections[2] ?? emptySection;
          how = json.sections[3] ?? emptySection;
        }
        setData({
          ...json,
          nameAndPurpose:
            json.nameAndPurpose && typeof json.nameAndPurpose === "object"
              ? json.nameAndPurpose
              : nameAndPurpose,
          why: json.why && typeof json.why === "object" ? json.why : why,
          who: json.who && typeof json.who === "object" ? json.who : who,
          how: json.how && typeof json.how === "object" ? json.how : how,
        });
      } catch (err) {
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchVolunteer();
  }, []);

  const handleChange = (field: keyof VolunteerData, value: any) => {
    if (!data) return;
    setData({ ...data, [field]: value });
  };

  const handleSectionChange = (
    sectionKey: keyof Pick<
      VolunteerData,
      "nameAndPurpose" | "why" | "who" | "how"
    >,
    field: keyof VolunteerSection,
    value: any
  ) => {
    if (!data) return;
    setData({ ...data, [sectionKey]: { ...data[sectionKey], [field]: value } });
  };

  const handleItemChange = (
    sectionKey: keyof Pick<
      VolunteerData,
      "nameAndPurpose" | "why" | "who" | "how"
    >,
    iidx: number,
    field: keyof VolunteerSectionItem,
    value: any
  ) => {
    if (!data) return;
    const updatedItems = [...data[sectionKey].items];
    updatedItems[iidx] = { ...updatedItems[iidx], [field]: value };
    setData({
      ...data,
      [sectionKey]: { ...data[sectionKey], items: updatedItems },
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data) return;
    setSaving(true);
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        alert("Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.");
        return;
      }
      const res = await fetch(
        `https://localhost:7189/api/ValueItems/${data.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );
      if (!res.ok) throw new Error("Kaydetme başarısız");
      alert("Gönüllü Ol sayfası başarıyla güncellendi!");
    } catch (err) {
      alert(
        "Kaydetme başarısız: " +
          (err instanceof Error ? err.message : "Bilinmeyen hata")
      );
    } finally {
      setSaving(false);
    }
  };

  const getIcon = (iconName: string) => {
    // Sadece örnek: Admin panelde ikonlar sade gösterilebilir
    return (
      <span className="inline-block w-6 h-6 bg-slate-200 rounded-full text-xs text-slate-500 flex items-center justify-center">
        {iconName}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] bg-white">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-kpf-teal"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[40vh] bg-white">
        <p className="text-red-600">
          {isGerman
            ? "Freiwilligen-Daten konnten nicht geladen werden."
            : "Gönüllü verisi yüklenemedi."}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-[60vh] rounded-xl shadow p-8">
      <form onSubmit={handleSave} className="space-y-8">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <Heart className="text-kpf-red" size={36} />
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={data.titleTr}
                onChange={(e) => handleChange("titleTr", e.target.value)}
                placeholder="Başlık (TR)"
                className="px-3 py-2 border rounded-lg text-lg font-bold w-56"
              />
              <input
                type="text"
                value={data.titleDe}
                onChange={(e) => handleChange("titleDe", e.target.value)}
                placeholder="Başlık (DE)"
                className="px-3 py-2 border rounded-lg text-lg font-bold w-56"
              />
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={data.subtitleTr}
                onChange={(e) => handleChange("subtitleTr", e.target.value)}
                placeholder="Alt Başlık (TR)"
                className="px-3 py-2 border rounded-lg w-56"
              />
              <input
                type="text"
                value={data.subtitleDe}
                onChange={(e) => handleChange("subtitleDe", e.target.value)}
                placeholder="Alt Başlık (DE)"
                className="px-3 py-2 border rounded-lg w-56"
              />
            </div>
          </div>
        </div>
        {/* Intro */}
        <div className="mb-8 flex gap-2">
          <textarea
            value={data.introTr}
            onChange={(e) => handleChange("introTr", e.target.value)}
            placeholder="Açıklama (TR)"
            className="w-1/2 px-3 py-2 border rounded-lg min-h-[60px]"
          />
          <textarea
            value={data.introDe}
            onChange={(e) => handleChange("introDe", e.target.value)}
            placeholder="Açıklama (DE)"
            className="w-1/2 px-3 py-2 border rounded-lg min-h-[60px]"
          />
        </div>
        {/* Bölümler: nameAndPurpose, why, who, how */}
        <div className="space-y-8">
          {(
            [
              {
                key: "nameAndPurpose",
                label: isGerman ? "Name und Zweck" : "Ad ve Amaç",
              },
              { key: "why", label: isGerman ? "Warum?" : "Neden?" },
              { key: "who", label: isGerman ? "Wer?" : "Kim?" },
              { key: "how", label: isGerman ? "Wie?" : "Nasıl?" },
            ] as const
          ).map(({ key, label }) => {
            const section = data[key];
            return (
              <div
                key={key}
                className="bg-slate-50 rounded-lg p-6 border-l-4 border-kpf-red space-y-4"
              >
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={section.headingTr}
                    onChange={(e) =>
                      handleSectionChange(key, "headingTr", e.target.value)
                    }
                    placeholder={label + " Başlık (TR)"}
                    className="px-3 py-2 border rounded-lg w-1/2"
                  />
                  <input
                    type="text"
                    value={section.headingDe}
                    onChange={(e) =>
                      handleSectionChange(key, "headingDe", e.target.value)
                    }
                    placeholder={label + " Başlık (DE)"}
                    className="px-3 py-2 border rounded-lg w-1/2"
                  />
                </div>
                <div className="flex gap-2 mb-2">
                  <textarea
                    value={section.bodyTr}
                    onChange={(e) =>
                      handleSectionChange(key, "bodyTr", e.target.value)
                    }
                    placeholder={label + " Açıklama (TR)"}
                    className="px-3 py-2 border rounded-lg w-1/2 min-h-[40px]"
                  />
                  <textarea
                    value={section.bodyDe}
                    onChange={(e) =>
                      handleSectionChange(key, "bodyDe", e.target.value)
                    }
                    placeholder={label + " Açıklama (DE)"}
                    className="px-3 py-2 border rounded-lg w-1/2 min-h-[40px]"
                  />
                </div>
                <div className="space-y-2">
                  {Array.isArray(section.items) &&
                    section.items.map((item, iidx) => (
                      <div key={iidx} className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={item.titleTr}
                          onChange={(e) =>
                            handleItemChange(
                              key,
                              iidx,
                              "titleTr",
                              e.target.value
                            )
                          }
                          placeholder={label + " Madde (TR)"}
                          className="px-2 py-1 border rounded-lg w-1/3"
                        />
                        <input
                          type="text"
                          value={item.titleDe}
                          onChange={(e) =>
                            handleItemChange(
                              key,
                              iidx,
                              "titleDe",
                              e.target.value
                            )
                          }
                          placeholder={label + " Madde (DE)"}
                          className="px-2 py-1 border rounded-lg w-1/3"
                        />
                        <input
                          type="text"
                          value={item.icon}
                          onChange={(e) =>
                            handleItemChange(key, iidx, "icon", e.target.value)
                          }
                          placeholder="İkon"
                          className="px-2 py-1 border rounded-lg w-1/6"
                        />
                      </div>
                    ))}
                </div>
              </div>
            );
          })}
        </div>
        <button
          type="submit"
          disabled={saving}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-kpf-red text-white rounded-lg hover:bg-red-700 transition-all disabled:opacity-50 shadow-lg"
        >
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </form>
    </div>
  );
};

export default AdminVolunteerPage;
