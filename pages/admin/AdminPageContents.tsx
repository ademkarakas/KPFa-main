import React, { useState, useEffect } from "react";
import { Edit, Save, X, FileText } from "lucide-react";
import { pageContentsApi } from "../../services/api";
import { useLanguage } from "../../contexts/LanguageContext";
import { TEXTS } from "../../constants";

interface PageContentFormData {
  pageKey: string;
  titleTr: string;
  titleDe: string;
  contentTr: string;
  contentDe: string;
}

const AdminPageContents: React.FC = () => {
  const [pageContents, setPageContents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const { language } = useLanguage();
  const t = (key: string) => TEXTS[key]?.[language] || key;
  const [formData, setFormData] = useState<PageContentFormData>({
    pageKey: "",
    titleTr: "",
    titleDe: "",
    contentTr: "",
    contentDe: "",
  });

  const pageKeys = [
    { key: "about", label: "Hakkımızda / Über uns" },
    { key: "privacy", label: "Gizlilik Politikası / Datenschutz" },
    { key: "imprint", label: "Künye / Impressum" },
    { key: "satzung", label: "Tüzük / Satzung" },
    { key: "guelen", label: "Gülen Hareketi / Gülen-Bewegung" },
    { key: "teegespraeche", label: "Çay Sohbetleri / Teegespräche" },
  ];

  useEffect(() => {
    loadPageContents();
  }, []);

  const loadPageContents = async () => {
    try {
      setLoading(true);
      const data = await pageContentsApi.getAll();
      setPageContents(data);
    } catch (error) {
      console.error("Sayfa içerikleri yüklenirken hata:", error);
      alert("Sayfa içerikleri yüklenemedi!");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (content: any) => {
    setFormData({
      pageKey: content.pageKey,
      titleTr: content.titleTr,
      titleDe: content.titleDe,
      contentTr: content.contentTr,
      contentDe: content.contentDe,
    });
    setEditingId(content.id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const dto = {
        pageKey: formData.pageKey,
        titleTr: formData.titleTr,
        titleDe: formData.titleDe,
        contentTr: formData.contentTr,
        contentDe: formData.contentDe,
      };

      if (editingId) {
        await pageContentsApi.update(editingId, dto);
      } else {
        await pageContentsApi.create(dto);
      }

      await loadPageContents();
      resetForm();
      alert("Sayfa içeriği kaydedildi!");
    } catch (error) {
      console.error("Kayıt hatası:", error);
      alert("İşlem başarısız!");
    }
  };

  const resetForm = () => {
    setFormData({
      pageKey: "",
      titleTr: "",
      titleDe: "",
      contentTr: "",
      contentDe: "",
    });
    setEditingId(null);
  };

  const getPageLabel = (pageKey: string) => {
    return pageKeys.find((p) => p.key === pageKey)?.label || pageKey;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-kpf-red"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          {t("admin_pages_title")}
        </h1>
        <p className="text-slate-600">{t("admin_pages_subtitle")}</p>
      </div>

      {/* Content List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {pageKeys.map((page) => {
          const content = pageContents.find((c) => c.pageKey === page.key);
          return (
            <div
              key={page.key}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-kpf-teal/10 rounded-lg">
                    <FileText className="text-kpf-teal" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">
                      {page.label}
                    </h3>
                    <p className="text-sm text-slate-500">{page.key}</p>
                  </div>
                </div>
                {content ? (
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                    {t("admin_active")}
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full">
                    {t("admin_pages_empty")}
                  </span>
                )}
              </div>
              {content && (
                <div className="mb-4">
                  <p className="text-sm text-slate-700 font-semibold mb-1">
                    {content.titleTr}
                  </p>
                  <p className="text-sm text-slate-600 line-clamp-2">
                    {content.contentTr.substring(0, 150)}...
                  </p>
                </div>
              )}
              <button
                onClick={() =>
                  content
                    ? handleEdit(content)
                    : setFormData({ ...formData, pageKey: page.key })
                }
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Edit size={16} />
                {content ? t("admin_edit") : t("admin_pages_create")}
              </button>
            </div>
          );
        })}
      </div>

      {/* Edit Form */}
      {(editingId || formData.pageKey) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto my-8">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-slate-800">
                {getPageLabel(formData.pageKey)} -{" "}
                {t("admin_pages_edit_content")}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Başlık */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Başlık (Türkçe) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.titleTr}
                    onChange={(e) =>
                      setFormData({ ...formData, titleTr: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Titel (Deutsch) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.titleDe}
                    onChange={(e) =>
                      setFormData({ ...formData, titleDe: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                  />
                </div>
              </div>

              {/* İçerik */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    İçerik (Türkçe) *
                  </label>
                  <textarea
                    required
                    rows={15}
                    value={formData.contentTr}
                    onChange={(e) =>
                      setFormData({ ...formData, contentTr: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal resize-none font-mono text-sm"
                    placeholder="HTML içerik girilebilir..."
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    HTML etiketleri kullanabilirsiniz ({"<p>, <ul>, <strong>"}{" "}
                    vb.)
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Inhalt (Deutsch) *
                  </label>
                  <textarea
                    required
                    rows={15}
                    value={formData.contentDe}
                    onChange={(e) =>
                      setFormData({ ...formData, contentDe: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal resize-none font-mono text-sm"
                    placeholder="HTML-Inhalt kann eingegeben werden..."
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    Sie können HTML-Tags verwenden ({"<p>, <ul>, <strong>"}{" "}
                    usw.)
                  </p>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-6 border-t">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-kpf-red text-white rounded-lg hover:bg-red-700 transition-all font-semibold"
                >
                  <Save size={20} />
                  Kaydet
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-all font-semibold"
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPageContents;
