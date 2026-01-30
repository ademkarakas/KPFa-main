import { Book, Plus, Save, Trash2, CheckCircle } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

// Backend DTO (backend contract is preserved)
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

type AdminSatzungTab =
  | "basic"
  | "name"
  | "purpose"
  | "gemeinnuetzigkeit"
  | "membership";

const API_URL = "https://localhost:7189/api/Satzung";

const createUiKey = () =>
  globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;

const isAbortError = (err: unknown) =>
  err instanceof DOMException && err.name === "AbortError";

const SectionInput: React.FC<{
  label: string;
  section: SectionContent;
  headingPlaceholder: string;
  bodyTrPlaceholder: string;
  bodyDePlaceholder: string;
  onHeadingChange: (value: string) => void;
  onBodyTrChange: (value: string) => void;
  onBodyDeChange: (value: string) => void;
}> = ({
  label,
  section,
  headingPlaceholder,
  bodyTrPlaceholder,
  bodyDePlaceholder,
  onHeadingChange,
  onBodyTrChange,
  onBodyDeChange,
}) => (
  <div className="space-y-3">
    <label className="block text-sm font-semibold text-slate-700">
      {label}
    </label>
    <input
      type="text"
      placeholder={headingPlaceholder}
      value={section.heading}
      onChange={(e) => onHeadingChange(e.target.value)}
      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal text-sm"
    />
    <textarea
      placeholder={bodyTrPlaceholder}
      value={section.bodyTurkish}
      onChange={(e) => onBodyTrChange(e.target.value)}
      rows={3}
      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal resize-none text-sm"
    />
    <textarea
      placeholder={bodyDePlaceholder}
      value={section.bodyGerman}
      onChange={(e) => onBodyDeChange(e.target.value)}
      rows={3}
      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal resize-none text-sm"
    />
  </div>
);

const AdminSatzung: React.FC = () => {
  const { t } = useTranslation();
  const [content, setContent] = useState<SatzungDto>(EMPTY_STATE);
  const [activeTab, setActiveTab] = useState<AdminSatzungTab>("basic");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [purposeUiKeys, setPurposeUiKeys] = useState<string[]>([]);
  const [membershipUiKeys, setMembershipUiKeys] = useState<string[]>([]);

  const tabs = useMemo(
    () => [
      { id: "basic" as const, label: t("satzung.tabs.basic") },
      { id: "name" as const, label: t("satzung.tabs.name") },
      { id: "purpose" as const, label: t("satzung.tabs.purpose") },
      {
        id: "gemeinnuetzigkeit" as const,
        label: t("satzung.tabs.gemeinnuetzigkeit"),
      },
      { id: "membership" as const, label: t("satzung.tabs.membership") },
    ],
    [t],
  );

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const parseSatzung = (data: any): SatzungDto => ({
      ...EMPTY_STATE,
      ...data,
      purposes: Array.isArray(data?.purposes) ? data.purposes : [],
      memberships: Array.isArray(data?.memberships) ? data.memberships : [],
    });

    const loadSatzung = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = globalThis.localStorage?.getItem("adminToken");
        if (!token) {
          setError(t("admin.loginRequired"));
          return;
        }

        const res = await fetch(API_URL, {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        });

        if (!res.ok) {
          if (isMounted) {
            setContent(EMPTY_STATE);
            setPurposeUiKeys([]);
            setMembershipUiKeys([]);
          }
          return;
        }

        const contentType = res.headers.get("content-type");
        if (!contentType?.includes("application/json")) {
          setError(t("admin.errors.invalidServerResponse"));
          return;
        }

        const dataArray: any = await res.json();
        const data =
          Array.isArray(dataArray) && dataArray.length > 0
            ? dataArray[0]
            : null;
        const next = data ? parseSatzung(data) : EMPTY_STATE;

        if (isMounted) {
          setContent(next);
          setPurposeUiKeys(next.purposes.map(() => createUiKey()));
          setMembershipUiKeys(next.memberships.map(() => createUiKey()));
        }
      } catch (err) {
        if (isAbortError(err)) return;
        console.error("Satzung load error:", err);
        setError(t("admin.errors.loadFailed"));
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadSatzung();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [t]);

  const updateSection = (
    field: keyof SatzungDto,
    prop: keyof SectionContent,
    value: string,
  ) => {
    setContent((prev) => ({
      ...prev,
      [field]: {
        ...(prev[field] as SectionContent),
        [prop]: value,
      },
    }));
  };

  const updatePurpose = (
    index: number,
    prop: keyof SectionContent,
    value: string,
  ) => {
    setContent((prev) => {
      const purposes = [...prev.purposes];
      purposes[index] = {
        ...purposes[index],
        content: {
          ...purposes[index].content,
          [prop]: value,
        },
      };
      return { ...prev, purposes };
    });
  };

  const addPurpose = () => {
    setContent((prev) => {
      const nextLetter = String.fromCodePoint(97 + prev.purposes.length);
      return {
        ...prev,
        purposes: [
          ...prev.purposes,
          {
            letter: nextLetter,
            content: createEmptySection(),
          },
        ],
      };
    });
    setPurposeUiKeys((prev) => [...prev, createUiKey()]);
  };

  const removePurpose = (index: number) => {
    setContent((prev) => ({
      ...prev,
      purposes: prev.purposes.filter((_, i) => i !== index),
    }));
    setPurposeUiKeys((prev) => prev.filter((_, i) => i !== index));
  };

  const updateMembership = (
    index: number,
    field: "type" | "descriptionTurkish" | "descriptionGerman",
    prop: keyof SectionContent,
    value: string,
  ) => {
    setContent((prev) => {
      const memberships = [...prev.memberships];
      memberships[index] = {
        ...memberships[index],
        [field]: {
          ...memberships[index][field],
          [prop]: value,
        },
      };
      return { ...prev, memberships };
    });
  };

  const addMembership = () => {
    setContent((prev) => ({
      ...prev,
      memberships: [
        ...prev.memberships,
        {
          type: createEmptySection(),
          descriptionTurkish: createEmptySection(),
          descriptionGerman: createEmptySection(),
        },
      ],
    }));
    setMembershipUiKeys((prev) => [...prev, createUiKey()]);
  };

  const removeMembership = (index: number) => {
    setContent((prev) => ({
      ...prev,
      memberships: prev.memberships.filter((_, i) => i !== index),
    }));
    setMembershipUiKeys((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const token = globalThis.localStorage?.getItem("adminToken");
      if (!token) {
        setError(t("admin.loginRequired"));
        return;
      }

      const res = await fetch(API_URL, {
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

      alert(t("satzung.saveSuccess"));
    } catch (err) {
      console.error("Satzung save error:", err);
      alert(
        `${t("satzung.saveError")}: ` +
          (err instanceof Error ? err.message : t("common.unknownError")),
      );
    } finally {
      setSaving(false);
    }
  };

  const headingPlaceholder = t("satzung.placeholders.heading");
  const bodyTrPlaceholder = t("satzung.placeholders.bodyTr");
  const bodyDePlaceholder = t("satzung.placeholders.bodyDe");

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-kpf-teal"></div>
        <p className="mt-4 text-slate-500 font-medium">{t("common.loading")}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-20 px-4">
      <form onSubmit={handleSave} className="space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-slate-100 sticky top-4 z-50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-kpf-teal/10 rounded-2xl">
              <Book className="text-kpf-teal" size={28} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800">
                {t("satzung.pageTitle")}
              </h1>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <CheckCircle size={10} className="text-green-500" />
                {t("satzung.subtitle")}
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 px-10 py-3 bg-kpf-teal text-white rounded-2xl hover:bg-kpf-teal/90 transition-all disabled:opacity-50 shadow-xl shadow-kpf-teal/20 font-bold"
          >
            <Save size={18} />
            {saving ? t("common.saving") : t("common.publish")}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4">
            {error}
          </div>
        )}

        <div className="flex gap-2 border-b border-slate-200 overflow-x-auto bg-white rounded-2xl p-4">
          {tabs.map((tab) => (
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

        {activeTab === "basic" && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-4">
              {t("satzung.sections.titles")}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder={t("satzung.placeholders.titleTr")}
                value={content.titleTurkish}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    titleTurkish: e.target.value,
                  }))
                }
                required
                className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
              />
              <input
                type="text"
                placeholder={t("satzung.placeholders.titleDe")}
                value={content.titleGerman}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    titleGerman: e.target.value,
                  }))
                }
                required
                className="px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
              />
            </div>
          </div>
        )}

        {activeTab === "name" && (
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
            <SectionInput
              label={t("satzung.sections.nameAndSeatTr")}
              section={content.nameAndSeatTurkish}
              headingPlaceholder={headingPlaceholder}
              bodyTrPlaceholder={bodyTrPlaceholder}
              bodyDePlaceholder={bodyDePlaceholder}
              onHeadingChange={(v) =>
                updateSection("nameAndSeatTurkish", "heading", v)
              }
              onBodyTrChange={(v) =>
                updateSection("nameAndSeatTurkish", "bodyTurkish", v)
              }
              onBodyDeChange={(v) =>
                updateSection("nameAndSeatTurkish", "bodyGerman", v)
              }
            />
            <div className="border-t border-slate-200 pt-6"></div>
            <SectionInput
              label={t("satzung.sections.nameAndSeatDe")}
              section={content.nameAndSeatGerman}
              headingPlaceholder={headingPlaceholder}
              bodyTrPlaceholder={bodyTrPlaceholder}
              bodyDePlaceholder={bodyDePlaceholder}
              onHeadingChange={(v) =>
                updateSection("nameAndSeatGerman", "heading", v)
              }
              onBodyTrChange={(v) =>
                updateSection("nameAndSeatGerman", "bodyTurkish", v)
              }
              onBodyDeChange={(v) =>
                updateSection("nameAndSeatGerman", "bodyGerman", v)
              }
            />

            <div className="border-t border-slate-200 pt-6"></div>
            <SectionInput
              label={t("satzung.sections.nameDescTr")}
              section={content.nameDescTurkish}
              headingPlaceholder={headingPlaceholder}
              bodyTrPlaceholder={bodyTrPlaceholder}
              bodyDePlaceholder={bodyDePlaceholder}
              onHeadingChange={(v) =>
                updateSection("nameDescTurkish", "heading", v)
              }
              onBodyTrChange={(v) =>
                updateSection("nameDescTurkish", "bodyTurkish", v)
              }
              onBodyDeChange={(v) =>
                updateSection("nameDescTurkish", "bodyGerman", v)
              }
            />
            <div className="border-t border-slate-200 pt-6"></div>
            <SectionInput
              label={t("satzung.sections.nameDescDe")}
              section={content.nameDescGerman}
              headingPlaceholder={headingPlaceholder}
              bodyTrPlaceholder={bodyTrPlaceholder}
              bodyDePlaceholder={bodyDePlaceholder}
              onHeadingChange={(v) =>
                updateSection("nameDescGerman", "heading", v)
              }
              onBodyTrChange={(v) =>
                updateSection("nameDescGerman", "bodyTurkish", v)
              }
              onBodyDeChange={(v) =>
                updateSection("nameDescGerman", "bodyGerman", v)
              }
            />

            <div className="border-t border-slate-200 pt-6"></div>
            <SectionInput
              label={t("satzung.sections.seatTr")}
              section={content.seatTurkish}
              headingPlaceholder={headingPlaceholder}
              bodyTrPlaceholder={bodyTrPlaceholder}
              bodyDePlaceholder={bodyDePlaceholder}
              onHeadingChange={(v) =>
                updateSection("seatTurkish", "heading", v)
              }
              onBodyTrChange={(v) =>
                updateSection("seatTurkish", "bodyTurkish", v)
              }
              onBodyDeChange={(v) =>
                updateSection("seatTurkish", "bodyGerman", v)
              }
            />
            <div className="border-t border-slate-200 pt-6"></div>
            <SectionInput
              label={t("satzung.sections.seatDe")}
              section={content.seatGerman}
              headingPlaceholder={headingPlaceholder}
              bodyTrPlaceholder={bodyTrPlaceholder}
              bodyDePlaceholder={bodyDePlaceholder}
              onHeadingChange={(v) => updateSection("seatGerman", "heading", v)}
              onBodyTrChange={(v) =>
                updateSection("seatGerman", "bodyTurkish", v)
              }
              onBodyDeChange={(v) =>
                updateSection("seatGerman", "bodyGerman", v)
              }
            />

            <div className="border-t border-slate-200 pt-6"></div>
            <SectionInput
              label={t("satzung.sections.seatDescTr")}
              section={content.seatDescTurkish}
              headingPlaceholder={headingPlaceholder}
              bodyTrPlaceholder={bodyTrPlaceholder}
              bodyDePlaceholder={bodyDePlaceholder}
              onHeadingChange={(v) =>
                updateSection("seatDescTurkish", "heading", v)
              }
              onBodyTrChange={(v) =>
                updateSection("seatDescTurkish", "bodyTurkish", v)
              }
              onBodyDeChange={(v) =>
                updateSection("seatDescTurkish", "bodyGerman", v)
              }
            />
            <div className="border-t border-slate-200 pt-6"></div>
            <SectionInput
              label={t("satzung.sections.seatDescDe")}
              section={content.seatDescGerman}
              headingPlaceholder={headingPlaceholder}
              bodyTrPlaceholder={bodyTrPlaceholder}
              bodyDePlaceholder={bodyDePlaceholder}
              onHeadingChange={(v) =>
                updateSection("seatDescGerman", "heading", v)
              }
              onBodyTrChange={(v) =>
                updateSection("seatDescGerman", "bodyTurkish", v)
              }
              onBodyDeChange={(v) =>
                updateSection("seatDescGerman", "bodyGerman", v)
              }
            />

            <div className="border-t border-slate-200 pt-6"></div>
            <SectionInput
              label={t("satzung.sections.fiscalYearTr")}
              section={content.fiscalYearTurkish}
              headingPlaceholder={headingPlaceholder}
              bodyTrPlaceholder={bodyTrPlaceholder}
              bodyDePlaceholder={bodyDePlaceholder}
              onHeadingChange={(v) =>
                updateSection("fiscalYearTurkish", "heading", v)
              }
              onBodyTrChange={(v) =>
                updateSection("fiscalYearTurkish", "bodyTurkish", v)
              }
              onBodyDeChange={(v) =>
                updateSection("fiscalYearTurkish", "bodyGerman", v)
              }
            />
            <div className="border-t border-slate-200 pt-6"></div>
            <SectionInput
              label={t("satzung.sections.fiscalYearDe")}
              section={content.fiscalYearGerman}
              headingPlaceholder={headingPlaceholder}
              bodyTrPlaceholder={bodyTrPlaceholder}
              bodyDePlaceholder={bodyDePlaceholder}
              onHeadingChange={(v) =>
                updateSection("fiscalYearGerman", "heading", v)
              }
              onBodyTrChange={(v) =>
                updateSection("fiscalYearGerman", "bodyTurkish", v)
              }
              onBodyDeChange={(v) =>
                updateSection("fiscalYearGerman", "bodyGerman", v)
              }
            />

            <div className="border-t border-slate-200 pt-6"></div>
            <SectionInput
              label={t("satzung.sections.fiscalYearDescTr")}
              section={content.fiscalYearDescTurkish}
              headingPlaceholder={headingPlaceholder}
              bodyTrPlaceholder={bodyTrPlaceholder}
              bodyDePlaceholder={bodyDePlaceholder}
              onHeadingChange={(v) =>
                updateSection("fiscalYearDescTurkish", "heading", v)
              }
              onBodyTrChange={(v) =>
                updateSection("fiscalYearDescTurkish", "bodyTurkish", v)
              }
              onBodyDeChange={(v) =>
                updateSection("fiscalYearDescTurkish", "bodyGerman", v)
              }
            />
            <div className="border-t border-slate-200 pt-6"></div>
            <SectionInput
              label={t("satzung.sections.fiscalYearDescDe")}
              section={content.fiscalYearDescGerman}
              headingPlaceholder={headingPlaceholder}
              bodyTrPlaceholder={bodyTrPlaceholder}
              bodyDePlaceholder={bodyDePlaceholder}
              onHeadingChange={(v) =>
                updateSection("fiscalYearDescGerman", "heading", v)
              }
              onBodyTrChange={(v) =>
                updateSection("fiscalYearDescGerman", "bodyTurkish", v)
              }
              onBodyDeChange={(v) =>
                updateSection("fiscalYearDescGerman", "bodyGerman", v)
              }
            />
          </div>
        )}

        {activeTab === "purpose" && (
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
            <SectionInput
              label={t("satzung.sections.purposeOfAssociationTr")}
              section={content.purposeOfAssociationTurkish}
              headingPlaceholder={headingPlaceholder}
              bodyTrPlaceholder={bodyTrPlaceholder}
              bodyDePlaceholder={bodyDePlaceholder}
              onHeadingChange={(v) =>
                updateSection("purposeOfAssociationTurkish", "heading", v)
              }
              onBodyTrChange={(v) =>
                updateSection("purposeOfAssociationTurkish", "bodyTurkish", v)
              }
              onBodyDeChange={(v) =>
                updateSection("purposeOfAssociationTurkish", "bodyGerman", v)
              }
            />
            <div className="border-t border-slate-200 pt-6"></div>
            <SectionInput
              label={t("satzung.sections.purposeOfAssociationDe")}
              section={content.purposeOfAssociationGerman}
              headingPlaceholder={headingPlaceholder}
              bodyTrPlaceholder={bodyTrPlaceholder}
              bodyDePlaceholder={bodyDePlaceholder}
              onHeadingChange={(v) =>
                updateSection("purposeOfAssociationGerman", "heading", v)
              }
              onBodyTrChange={(v) =>
                updateSection("purposeOfAssociationGerman", "bodyTurkish", v)
              }
              onBodyDeChange={(v) =>
                updateSection("purposeOfAssociationGerman", "bodyGerman", v)
              }
            />

            <div className="border-t border-slate-200 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800">
                  {t("satzung.sections.purposeItems")}
                </h3>
                <button
                  type="button"
                  onClick={addPurpose}
                  className="flex items-center gap-2 px-4 py-2 bg-kpf-teal text-white rounded-lg hover:bg-kpf-teal/90 transition-all"
                >
                  <Plus size={18} />
                  {t("common.add")}
                </button>
              </div>

              <div className="space-y-4">
                {content.purposes.map((purpose, idx) => (
                  <div
                    key={
                      purposeUiKeys[idx] ?? purpose.letter ?? `purpose-${idx}`
                    }
                    className="border border-slate-200 rounded-lg p-4 bg-slate-50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-kpf-teal">
                        {t("satzung.purposeItemLabel", {
                          letter: purpose.letter,
                        })}
                      </span>
                      <button
                        type="button"
                        onClick={() => removePurpose(idx)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        aria-label={t("common.delete")}
                        data-size="icon"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <input
                      type="text"
                      placeholder={t("satzung.placeholders.itemHeading")}
                      value={purpose.content.heading}
                      onChange={(e) =>
                        updatePurpose(idx, "heading", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-2 text-sm bg-white"
                    />
                    <textarea
                      placeholder={t("satzung.placeholders.itemBodyTr")}
                      value={purpose.content.bodyTurkish}
                      onChange={(e) =>
                        updatePurpose(idx, "bodyTurkish", e.target.value)
                      }
                      rows={2}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-2 text-sm bg-white resize-none"
                    />
                    <textarea
                      placeholder={t("satzung.placeholders.itemBodyDe")}
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

        {activeTab === "gemeinnuetzigkeit" && (
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-6">
            <SectionInput
              labelKey="satzung.sections.gemeinnuetzigkeitTr"
              field="gemeinnuetzigkeitTurkish"
              section={content.gemeinnuetzigkeitTurkish}
            />
            <div className="border-t border-slate-200 pt-6"></div>
            <SectionInput
              labelKey="satzung.sections.gemeinnuetzigkeitDe"
              field="gemeinnuetzigkeitGerman"
              section={content.gemeinnuetzigkeitGerman}
            />
            <div className="border-t border-slate-200 pt-6"></div>
            <SectionInput
              labelKey="satzung.sections.politicalNeutralityTr"
              field="politicalNeutralityTurkish"
              section={content.politicalNeutralityTurkish}
            />
            <div className="border-t border-slate-200 pt-6"></div>
            <SectionInput
              labelKey="satzung.sections.politicalNeutralityDe"
              field="politicalNeutralityGerman"
              section={content.politicalNeutralityGerman}
            />
          </div>
        )}

        {activeTab === "membership" && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800">
                {t("satzung.sections.membershipTypes")}
              </h3>
              <button
                type="button"
                onClick={addMembership}
                className="flex items-center gap-2 px-4 py-2 bg-kpf-teal text-white rounded-lg hover:bg-kpf-teal/90 transition-all"
              >
                <Plus size={18} />
                {t("common.add")}
              </button>
            </div>

            <div className="space-y-6">
              {content.memberships.map((membership, idx) => (
                <div
                  key={membershipUiKeys[idx] ?? `membership-${idx}`}
                  className="border border-slate-200 rounded-lg p-4 space-y-4 bg-slate-50"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-kpf-teal">
                      {t("satzung.membershipItemLabel", { index: idx + 1 })}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeMembership(idx)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                      aria-label={t("common.delete")}
                      data-size="icon"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      {t("satzung.sections.membershipType")}
                    </label>
                    <input
                      type="text"
                      placeholder={t("satzung.placeholders.itemHeading")}
                      value={membership.type.heading}
                      onChange={(e) =>
                        updateMembership(idx, "type", "heading", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-2 text-sm bg-white"
                    />
                    <textarea
                      placeholder={t("satzung.placeholders.itemBodyTr")}
                      value={membership.type.bodyTurkish}
                      onChange={(e) =>
                        updateMembership(
                          idx,
                          "type",
                          "bodyTurkish",
                          e.target.value,
                        )
                      }
                      rows={2}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-2 text-sm bg-white resize-none"
                    />
                    <textarea
                      placeholder={t("satzung.placeholders.itemBodyDe")}
                      value={membership.type.bodyGerman}
                      onChange={(e) =>
                        updateMembership(
                          idx,
                          "type",
                          "bodyGerman",
                          e.target.value,
                        )
                      }
                      rows={2}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      {t("satzung.sections.descriptionTr")}
                    </label>
                    <input
                      type="text"
                      placeholder={t("satzung.placeholders.itemHeading")}
                      value={membership.descriptionTurkish.heading}
                      onChange={(e) =>
                        updateMembership(
                          idx,
                          "descriptionTurkish",
                          "heading",
                          e.target.value,
                        )
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-2 text-sm bg-white"
                    />
                    <textarea
                      placeholder={t("satzung.placeholders.itemBodyTr")}
                      value={membership.descriptionTurkish.bodyTurkish}
                      onChange={(e) =>
                        updateMembership(
                          idx,
                          "descriptionTurkish",
                          "bodyTurkish",
                          e.target.value,
                        )
                      }
                      rows={2}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      {t("satzung.sections.descriptionDe")}
                    </label>
                    <input
                      type="text"
                      placeholder={t("satzung.placeholders.itemHeading")}
                      value={membership.descriptionGerman.heading}
                      onChange={(e) =>
                        updateMembership(
                          idx,
                          "descriptionGerman",
                          "heading",
                          e.target.value,
                        )
                      }
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg mb-2 text-sm bg-white"
                    />
                    <textarea
                      placeholder={t("satzung.placeholders.itemBodyDe")}
                      value={membership.descriptionGerman.bodyGerman}
                      onChange={(e) =>
                        updateMembership(
                          idx,
                          "descriptionGerman",
                          "bodyGerman",
                          e.target.value,
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
      </form>
    </div>
  );
};

export default AdminSatzung;
