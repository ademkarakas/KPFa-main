import React, { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Handshake,
  ExternalLink,
  Eye,
  EyeOff,
  Save,
  X,
} from "lucide-react";
import { partnersApi, uploadApi } from "../../services/api";
import { useLanguage } from "../../contexts/LanguageContext";
import { TEXTS } from "../../constants";

interface PartnerFormData {
  nameTr: string;
  nameDe: string;
  descriptionTr: string;
  descriptionDe: string;
  logoUrl: string;
  websiteUrl: string;
  isActive: boolean;
}

const AdminPartners: React.FC = () => {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const { language } = useLanguage();
  const t = (key: string) => TEXTS[key]?.[language] || key;
  const [formData, setFormData] = useState<PartnerFormData>({
    nameTr: "",
    nameDe: "",
    descriptionTr: "",
    descriptionDe: "",
    logoUrl: "",
    websiteUrl: "",
    isActive: true,
  });

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = async () => {
    try {
      setLoading(true);
      const data = await partnersApi.getAll(true);
      setPartners(data);
    } catch (error) {
      console.error("Partnerler yüklenirken hata:", error);
      alert("Partnerler yüklenemedi!");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const logoUrl = await uploadApi.uploadFile(file);
      setFormData({ ...formData, logoUrl });
    } catch (error) {
      console.error("Logo yüklenirken hata:", error);
      alert("Logo yüklenemedi!");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const dto = {
        nameTr: formData.nameTr,
        nameDe: formData.nameDe,
        descriptionTr: formData.descriptionTr,
        descriptionDe: formData.descriptionDe,
        logoUrl: formData.logoUrl,
        websiteUrl: formData.websiteUrl,
        isActive: formData.isActive,
      };

      if (editingId) {
        await partnersApi.update(editingId, dto);
      } else {
        await partnersApi.create(dto);
      }

      await loadPartners();
      resetForm();
      alert(editingId ? "Partner güncellendi!" : "Partner oluşturuldu!");
    } catch (error) {
      console.error("Kayıt hatası:", error);
      alert("İşlem başarısız!");
    }
  };

  const handleEdit = (partner: any) => {
    setFormData({
      nameTr: partner.nameTr,
      nameDe: partner.nameDe,
      descriptionTr: partner.descriptionTr,
      descriptionDe: partner.descriptionDe,
      logoUrl: partner.logoUrl,
      websiteUrl: partner.websiteUrl,
      isActive: partner.isActive,
    });
    setEditingId(partner.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bu partneri silmek istediğinizden emin misiniz?")) return;

    try {
      await partnersApi.delete(id);
      await loadPartners();
      alert("Partner silindi!");
    } catch (error) {
      console.error("Silme hatası:", error);
      alert("Silme işlemi başarısız!");
    }
  };

  const resetForm = () => {
    setFormData({
      nameTr: "",
      nameDe: "",
      descriptionTr: "",
      descriptionDe: "",
      logoUrl: "",
      websiteUrl: "",
      isActive: true,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const filteredPartners = partners.filter(
    (p) =>
      p.nameTr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nameDe.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            {t("admin_partners_title")}
          </h1>
          <p className="text-slate-600">Toplam {partners.length} partner</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-kpf-red text-white rounded-lg hover:bg-red-700 transition-all shadow-lg"
        >
          <Plus size={20} />
          <span className="font-semibold">{t("admin_partners_new")}</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Partner ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
        />
      </div>

      {/* Partners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPartners.map((partner) => (
          <div
            key={partner.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="relative bg-slate-50 h-40 flex items-center justify-center p-4">
              <img
                src={partner.logoUrl}
                alt={partner.nameTr}
                className="max-h-full max-w-full object-contain"
              />
              <div className="absolute top-4 right-4">
                {partner.isActive ? (
                  <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                    <Eye size={14} />
                    Aktif
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-slate-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                    <EyeOff size={14} />
                    Pasif
                  </span>
                )}
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                {partner.nameTr}
              </h3>
              <p className="text-sm text-slate-600 mb-4 line-clamp-2">
                {partner.descriptionTr}
              </p>
              {partner.websiteUrl && (
                <a
                  href={partner.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-kpf-teal hover:text-kpf-dark mb-4 transition-colors"
                >
                  <ExternalLink size={14} />
                  <span className="truncate">Website</span>
                </a>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(partner)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                >
                  <Edit size={14} />
                  Düzenle
                </button>
                <button
                  onClick={() => handleDelete(partner.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                >
                  <Trash2 size={14} />
                  Sil
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto my-8">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-slate-800">
                {editingId ? "Partner Düzenle" : "Yeni Partner"}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* İsim */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    İsim (Türkçe) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nameTr}
                    onChange={(e) =>
                      setFormData({ ...formData, nameTr: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Name (Deutsch) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nameDe}
                    onChange={(e) =>
                      setFormData({ ...formData, nameDe: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                  />
                </div>
              </div>

              {/* Açıklama */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Açıklama (Türkçe) *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.descriptionTr}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        descriptionTr: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Beschreibung (Deutsch) *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.descriptionDe}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        descriptionDe: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal resize-none"
                  />
                </div>
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Website URL
                </label>
                <input
                  type="url"
                  value={formData.websiteUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, websiteUrl: e.target.value })
                  }
                  placeholder="https://example.com"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                />
              </div>

              {/* Logo */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Logo *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                />
                {formData.logoUrl && (
                  <div className="mt-3 bg-slate-50 p-4 rounded-lg">
                    <img
                      src={formData.logoUrl}
                      alt="Preview"
                      className="h-24 w-auto mx-auto"
                    />
                  </div>
                )}
              </div>

              {/* Aktif/Pasif */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="w-5 h-5 text-kpf-teal focus:ring-kpf-teal border-slate-300 rounded"
                />
                <label
                  htmlFor="isActive"
                  className="text-sm font-semibold text-slate-700"
                >
                  Partner Aktif
                </label>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-6 border-t">
                <button
                  type="submit"
                  disabled={uploadingImage}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-kpf-red text-white rounded-lg hover:bg-red-700 transition-all disabled:opacity-50 font-semibold"
                >
                  <Save size={20} />
                  {editingId ? "Güncelle" : "Oluştur"}
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

export default AdminPartners;
