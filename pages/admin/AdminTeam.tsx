import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Users,
  Mail,
  Eye,
  EyeOff,
  Save,
  X,
} from "lucide-react";
import { teamMembersApi, uploadApi } from "../../services/api";
import { useLanguage } from "../../contexts/LanguageContext";
import { TEXTS } from "../../constants";
import Quill from "quill";
import "quill/dist/quill.snow.css";

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

interface TeamMemberFormData {
  nameTr: string;
  nameDe: string;
  roleTr: string;
  roleDe: string;
  bioTr: string;
  bioDe: string;
  email: string;
  photoUrl: string;
  isActive: boolean;
}

const AdminTeam: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const { language } = useLanguage();
  const t = (key: string) => TEXTS[key]?.[language] || key;
  const [formData, setFormData] = useState<TeamMemberFormData>({
    nameTr: "",
    nameDe: "",
    roleTr: "",
    roleDe: "",
    bioTr: "",
    bioDe: "",
    email: "",
    photoUrl: "",
    isActive: true,
  });

  useEffect(() => {
    loadTeamMembers();
  }, []);

  const loadTeamMembers = async () => {
    try {
      setLoading(true);
      const data = await teamMembersApi.getAll(true);
      setTeamMembers(data);
    } catch (error) {
      console.error("Ekip üyeleri yüklenirken hata:", error);
      alert("Ekip üyeleri yüklenemedi!");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const photoUrl = await uploadApi.uploadFile(file);
      setFormData({ ...formData, photoUrl });
    } catch (error) {
      console.error("Resim yüklenirken hata:", error);
      alert("Resim yüklenemedi!");
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
        roleTr: formData.roleTr,
        roleDe: formData.roleDe,
        bioTr: formData.bioTr,
        bioDe: formData.bioDe,
        email: formData.email,
        photoUrl: formData.photoUrl,
        isActive: formData.isActive,
      };

      if (editingId) {
        await teamMembersApi.update(editingId, dto);
      } else {
        await teamMembersApi.create(dto);
      }

      await loadTeamMembers();
      resetForm();
      alert(editingId ? "Ekip üyesi güncellendi!" : "Ekip üyesi oluşturuldu!");
    } catch (error) {
      console.error("Kayıt hatası:", error);
      alert("İşlem başarısız!");
    }
  };

  const handleEdit = (member: any) => {
    setFormData({
      nameTr: member.nameTr,
      nameDe: member.nameDe,
      roleTr: member.roleTr,
      roleDe: member.roleDe,
      bioTr: member.bioTr,
      bioDe: member.bioDe,
      email: member.email,
      photoUrl: member.photoUrl,
      isActive: member.isActive,
    });
    setEditingId(member.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bu ekip üyesini silmek istediğinizden emin misiniz?")) return;

    try {
      await teamMembersApi.delete(id);
      await loadTeamMembers();
      alert("Ekip üyesi silindi!");
    } catch (error) {
      console.error("Silme hatası:", error);
      alert("Silme işlemi başarısız!");
    }
  };

  const resetForm = () => {
    setFormData({
      nameTr: "",
      nameDe: "",
      roleTr: "",
      roleDe: "",
      bioTr: "",
      bioDe: "",
      email: "",
      photoUrl: "",
      isActive: true,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const filteredMembers = teamMembers.filter(
    (m) =>
      m.nameTr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.nameDe.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase())
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
            {t("admin_team_title")}
          </h1>
          <p className="text-slate-600">
            Toplam {teamMembers.length} ekip üyesi
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-kpf-red text-white rounded-lg hover:bg-red-700 transition-all shadow-lg"
        >
          <Plus size={20} />
          <span className="font-semibold">{t("admin_team_new")}</span>
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
          placeholder="Ekip üyesi ara..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
        />
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="relative">
              <img
                src={member.photoUrl}
                alt={member.nameTr}
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-4 right-4">
                {member.isActive ? (
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
              <h3 className="text-lg font-bold text-slate-800 mb-1">
                {member.nameTr}
              </h3>
              <p className="text-sm text-kpf-teal font-semibold mb-3">
                {member.roleTr}
              </p>
              <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
                <Mail size={14} />
                <span className="truncate">{member.email}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(member)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                >
                  <Edit size={14} />
                  Düzenle
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
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
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto my-8">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between z-10">
              <h2 className="text-2xl font-bold text-slate-800">
                {editingId ? "Ekip Üyesi Düzenle" : "Yeni Ekip Üyesi"}
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

              {/* Rol */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Rol (Türkçe) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.roleTr}
                    onChange={(e) =>
                      setFormData({ ...formData, roleTr: e.target.value })
                    }
                    placeholder="örn: Kurucu Üye"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Rolle (Deutsch) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.roleDe}
                    onChange={(e) =>
                      setFormData({ ...formData, roleDe: e.target.value })
                    }
                    placeholder="z.B: Gründungsmitglied"
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                  />
                </div>
              </div>

              {/* Biyografi */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Biyografi (Türkçe) *
                  </label>
                  <QuillEditor
                    value={formData.bioTr}
                    onChange={(val) => setFormData({ ...formData, bioTr: val })}
                    placeholder="Biyografi (Türkçe)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Biografie (Deutsch) *
                  </label>
                  <QuillEditor
                    value={formData.bioDe}
                    onChange={(val) => setFormData({ ...formData, bioDe: val })}
                    placeholder="Biografie (Deutsch)"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  E-Mail *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                />
              </div>

              {/* Fotoğraf */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Fotoğraf *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                />
                {formData.photoUrl && (
                  <img
                    src={formData.photoUrl}
                    alt="Preview"
                    className="mt-3 h-40 w-auto rounded-lg"
                  />
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
                  Ekip Üyesi Aktif
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

      <style>{`
        .quill-modern-container { background: #f8fafc; border-radius: 20px; border: 1px solid #f1f5f9; overflow: hidden; }
        .quill-modern-container:focus-within { background: #fff; border-color: #0d9488; }
        .ql-toolbar.ql-snow { border: none !important; border-bottom: 1px solid #f1f5f9 !important; background: #fff; }
        .ql-container.ql-snow { border: none !important; min-height: 160px; font-size: 15px; }
        .ql-editor { padding: 15px !important; }
        .ql-editor.ql-blank::before { color: #94a3b8; font-style: normal; }
      `}</style>
    </div>
  );
};

export default AdminTeam;
