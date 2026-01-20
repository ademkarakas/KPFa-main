import React, { useState, useEffect } from "react";
import {
  Save,
  Plus,
  Trash2,
  Edit2,
  Search,
  Globe,
  Filter,
  X,
} from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { TEXTS } from "../../constants";
import { localizationApi } from "../../services/api";

interface Translation {
  id: string;
  key: string;
  turkish: string;
  german: string;
  section: string;
  createdAt?: string;
  updatedAt?: string;
}

const AdminTranslations: React.FC = () => {
  const { language } = useLanguage();
  const t = (key: string) => TEXTS[key]?.[language] || key;

  const [translations, setTranslations] = useState<Translation[]>([]);
  const [filteredTranslations, setFilteredTranslations] = useState<
    Translation[]
  >([]);
  const [editingTranslation, setEditingTranslation] =
    useState<Translation | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sectionFilter, setSectionFilter] = useState<string>("all");

  const sections = [
    "all",
    "common",
    "navigation",
    "contact",
    "volunteer",
    "activities",
    "courses",
    "about",
    "donate",
  ];

  const emptyTranslation: Translation = {
    id: "",
    key: "",
    turkish: "",
    german: "",
    section: "common",
  };

  useEffect(() => {
    loadTranslations();
  }, []);

  useEffect(() => {
    filterTranslations();
  }, [translations, searchTerm, sectionFilter]);

  const loadTranslations = async () => {
    try {
      setLoading(true);
      const data = await localizationApi.getAll();
      setTranslations(data);
    } catch (error) {
      console.error("Çeviriler yüklenirken hata:", error);
      // Fallback: constants.ts'deki key'leri yükle
      const fallbackTranslations: Translation[] = Object.entries(TEXTS).map(
        ([key, value]) => ({
          id: key,
          key: key,
          turkish: value.tr || "",
          german: value.de || "",
          section: "common",
        }),
      );
      setTranslations(fallbackTranslations);
    } finally {
      setLoading(false);
    }
  };

  const filterTranslations = () => {
    let filtered = [...translations];

    // Section filter
    if (sectionFilter !== "all") {
      filtered = filtered.filter((t) => t.section === sectionFilter);
    }

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.key.toLowerCase().includes(search) ||
          t.turkish.toLowerCase().includes(search) ||
          t.german.toLowerCase().includes(search),
      );
    }

    setFilteredTranslations(filtered);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingTranslation?.id) {
        // Update existing
        await localizationApi.update(editingTranslation.id, {
          turkish: editingTranslation.turkish,
          german: editingTranslation.german,
        });
        alert("Çeviri başarıyla güncellendi!");
      } else {
        // Create new
        await localizationApi.create(editingTranslation);
        alert("Çeviri başarıyla eklendi!");
      }
      await loadTranslations();
      setShowForm(false);
      setEditingTranslation(null);
    } catch (error) {
      console.error("İşlem hatası:", error);
      alert("İşlem başarısız!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bu çeviriyi silmek istediğinize emin misiniz?")) {
      try {
        await localizationApi.delete(id);
        await loadTranslations();
        alert("Çeviri silindi!");
      } catch (error) {
        console.error("Silme hatası:", error);
        alert("Silme başarısız!");
      }
    }
  };

  const handleEdit = (translation: Translation) => {
    setEditingTranslation(translation);
    setShowForm(true);
  };

  const handleNew = () => {
    setEditingTranslation(emptyTranslation);
    setShowForm(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            <Globe className="inline-block mr-2" size={32} />
            Çeviri Yönetimi / Translation Management
          </h1>
          <p className="text-slate-600">
            Backend'den gelen dinamik çevirileri yönetin
          </p>
        </div>
        {!showForm && (
          <button
            onClick={handleNew}
            className="flex items-center gap-2 px-6 py-3 bg-kpf-red text-white rounded-lg hover:bg-red-700 transition-all shadow-lg"
          >
            <Plus size={20} />
            Yeni Çeviri Ekle
          </button>
        )}
      </div>

      {/* Filters */}
      {!showForm && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <Search size={16} className="inline mr-2" />
                Ara / Search
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Key, Turkish, German..."
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all"
              />
            </div>

            {/* Section Filter */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <Filter size={16} className="inline mr-2" />
                Bölüm / Section
              </label>
              <select
                value={sectionFilter}
                onChange={(e) => setSectionFilter(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all"
              >
                {sections.map((section) => (
                  <option key={section} value={section}>
                    {section === "all"
                      ? "Tümü / All"
                      : section.charAt(0).toUpperCase() + section.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 text-sm text-slate-600">
            <strong>{filteredTranslations.length}</strong> çeviri gösteriliyor
          </div>
        </div>
      )}

      {/* Form */}
      {showForm && editingTranslation && (
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-800">
              {editingTranslation.id ? "Çeviri Düzenle" : "Yeni Çeviri"}
            </h2>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingTranslation(null);
              }}
              className="p-2 hover:bg-slate-100 rounded-lg transition-all"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Key */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Key <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={editingTranslation.key}
                  onChange={(e) =>
                    setEditingTranslation({
                      ...editingTranslation,
                      key: e.target.value,
                    })
                  }
                  required
                  disabled={!!editingTranslation.id}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all disabled:bg-slate-100"
                  placeholder="contact.form.title"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Nokta ile ayrılmış format: section.subsection.name
                </p>
              </div>

              {/* Section */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Section <span className="text-red-500">*</span>
                </label>
                <select
                  value={editingTranslation.section}
                  onChange={(e) =>
                    setEditingTranslation({
                      ...editingTranslation,
                      section: e.target.value,
                    })
                  }
                  required
                  disabled={!!editingTranslation.id}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all disabled:bg-slate-100"
                >
                  {sections
                    .filter((s) => s !== "all")
                    .map((section) => (
                      <option key={section} value={section}>
                        {section.charAt(0).toUpperCase() + section.slice(1)}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Turkish */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                🇹🇷 Türkçe <span className="text-red-500">*</span>
              </label>
              <textarea
                value={editingTranslation.turkish}
                onChange={(e) =>
                  setEditingTranslation({
                    ...editingTranslation,
                    turkish: e.target.value,
                  })
                }
                required
                rows={3}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all resize-none"
                placeholder="Türkçe çeviri..."
              />
            </div>

            {/* German */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                🇩🇪 Deutsch <span className="text-red-500">*</span>
              </label>
              <textarea
                value={editingTranslation.german}
                onChange={(e) =>
                  setEditingTranslation({
                    ...editingTranslation,
                    german: e.target.value,
                  })
                }
                required
                rows={3}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all resize-none"
                placeholder="Deutsche Übersetzung..."
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-kpf-red text-white rounded-lg hover:bg-red-700 transition-all disabled:opacity-50 shadow-lg"
              >
                <Save size={20} />
                {loading ? "Kaydediliyor..." : "Kaydet"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingTranslation(null);
                }}
                className="px-6 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-all"
              >
                İptal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Translations Table */}
      {!showForm && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Key
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Section
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    🇹🇷 Türkçe
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                    🇩🇪 Deutsch
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredTranslations.map((translation) => (
                  <tr
                    key={translation.id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-mono text-slate-900">
                      {translation.key}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-semibold">
                        {translation.section}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700 max-w-xs truncate">
                      {translation.turkish}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700 max-w-xs truncate">
                      {translation.german}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(translation)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Düzenle"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(translation.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Sil"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTranslations.length === 0 && (
            <div className="p-12 text-center text-slate-500">
              {searchTerm || sectionFilter !== "all"
                ? "Filtreye uygun çeviri bulunamadı."
                : "Henüz çeviri eklenmedi. Yeni eklemek için yukarıdaki butonu kullanın."}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminTranslations;
