import React, { useState, useEffect } from "react";
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
  Shield,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";

// Admin user interface
interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// Form data for create/edit
interface AdminFormData {
  email: string;
  password: string;
  name: string;
  role: string;
}

const API_BASE_URL = "https://localhost:7189/api";

const AdminTeam: React.FC = () => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [originalRole, setOriginalRole] = useState<string>("");
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error" | "";
  }>({ message: "", type: "" });
  const { language } = useLanguage();

  const [formData, setFormData] = useState<AdminFormData>({
    email: "",
    password: "",
    name: "",
    role: "User",
  });

  const texts = {
    tr: {
      pageTitle: "Kullanıcı Yönetimi",
      totalUsers: "Toplam",
      users: "kullanıcı",
      newUser: "Yeni Kullanıcı",
      searchPlaceholder: "Kullanıcı ara...",
      active: "Aktif",
      inactive: "Pasif",
      edit: "Düzenle",
      delete: "Sil",
      editUser: "Kullanıcı Düzenle",
      createUser: "Yeni Kullanıcı Oluştur",
      name: "İsim",
      email: "E-posta",
      password: "Şifre",
      passwordHint: "Düzenlemede boş bırakılırsa değiştirilmez",
      role: "Rol",
      status: "Durum",
      roleUser: "Kullanıcı",
      roleUserAdmin: "Kullanıcı Yöneticisi",
      roleSystemAdmin: "Sistem Yöneticisi",
      save: "Kaydet",
      update: "Güncelle",
      create: "Oluştur",
      cancel: "İptal",
      confirmDelete: "Bu kullanıcıyı silmek istediğinizden emin misiniz?",
      lastLogin: "Son Giriş",
      createdAt: "Oluşturulma",
      never: "Hiç giriş yapılmadı",
      loadError: "Kullanıcılar yüklenemedi!",
      deleteSuccess: "Kullanıcı silindi!",
      deleteError: "Silme işlemi başarısız!",
      saveSuccess: "Kullanıcı kaydedildi!",
      saveError: "Kayıt başarısız!",
      noUsersFound: "Kullanıcı bulunamadı",
    },
    de: {
      pageTitle: "Benutzerverwaltung",
      totalUsers: "Insgesamt",
      users: "Benutzer",
      newUser: "Neuer Benutzer",
      searchPlaceholder: "Benutzer suchen...",
      active: "Aktiv",
      inactive: "Inaktiv",
      edit: "Bearbeiten",
      delete: "Löschen",
      editUser: "Benutzer bearbeiten",
      createUser: "Neuen Benutzer erstellen",
      name: "Name",
      email: "E-Mail",
      password: "Passwort",
      passwordHint: "Bei Bearbeitung leer lassen, um es nicht zu ändern",
      role: "Rolle",
      status: "Status",
      roleUser: "Benutzer",
      roleUserAdmin: "Benutzeradministrator",
      roleSystemAdmin: "Systemadministrator",
      save: "Speichern",
      update: "Aktualisieren",
      create: "Erstellen",
      cancel: "Abbrechen",
      confirmDelete:
        "Sind Sie sicher, dass Sie diesen Benutzer löschen möchten?",
      lastLogin: "Letzte Anmeldung",
      createdAt: "Erstellt am",
      never: "Nie angemeldet",
      loadError: "Benutzer konnten nicht geladen werden!",
      deleteSuccess: "Benutzer gelöscht!",
      deleteError: "Löschen fehlgeschlagen!",
      saveSuccess: "Benutzer gespeichert!",
      saveError: "Speichern fehlgeschlagen!",
      noUsersFound: "Keine Benutzer gefunden",
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
    alert("Oturum süreniz doldu. Lütfen tekrar giriş yapın.");
    globalThis.location.href = "/admin/login";
  };

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: "", type: "" }), 4000);
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/Admins`, {
        headers: getAuthHeaders(),
      });

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to load admins");
      }

      const data: AdminUser[] = await res.json();
      setAdmins(data);
    } catch (error) {
      console.error("Kullanıcılar yüklenirken hata:", error);
      alert(t.loadError);
    } finally {
      setLoading(false);
    }
  };

  const handleUnauthorizedResponse = (res: Response) => {
    if (res.status !== 401) return false;
    handleUnauthorized();
    return true;
  };

  const getResponseTextOrFallback = async (res: Response, fallback: string) => {
    const text = await res.text();
    return text || fallback;
  };

  const updateAdmin = async () => {
    const res = await fetch(`${API_BASE_URL}/Admins/${editingId}`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        id: editingId,
        email: formData.email,
        name: formData.name,
      }),
    });

    if (handleUnauthorizedResponse(res)) return;
    if (!res.ok) {
      throw new Error(await getResponseTextOrFallback(res, "Update failed"));
    }
  };

  const updateRoleIfChanged = async () => {
    if (!editingId || formData.role === originalRole) return;

    const roleRes = await fetch(`${API_BASE_URL}/Admins/${editingId}/role`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        adminId: editingId,
        role: formData.role,
      }),
    });

    if (handleUnauthorizedResponse(roleRes)) return;
    if (!roleRes.ok) {
      throw new Error(
        await getResponseTextOrFallback(roleRes, "Role update failed"),
      );
    }
  };

  const createAdmin = async () => {
    const res = await fetch(`${API_BASE_URL}/Admins`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: formData.role,
      }),
    });

    if (handleUnauthorizedResponse(res)) return;
    if (!res.ok) {
      throw new Error(await getResponseTextOrFallback(res, "Create failed"));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateAdmin();
        await updateRoleIfChanged();
      } else {
        await createAdmin();
      }

      await loadAdmins();
      resetForm();
      showNotification(t.saveSuccess, "success");
    } catch (error) {
      console.error("Kayıt hatası:", error);
      showNotification(t.saveError, "error");
    }
  };

  const handleEdit = (admin: AdminUser) => {
    setFormData({
      email: admin.email,
      password: "",
      name: admin.name,
      role: admin.role,
    });
    setOriginalRole(admin.role);
    setEditingId(admin.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!globalThis.confirm(t.confirmDelete)) return;

    try {
      const res = await fetch(`${API_BASE_URL}/Admins/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (res.status === 401) {
        handleUnauthorized();
        return;
      }

      if (!res.ok) {
        throw new Error("Delete failed");
      }

      await loadAdmins();
      showNotification(t.deleteSuccess, "success");
    } catch (error) {
      console.error("Silme hatası:", error);
      showNotification(t.deleteError, "error");
    }
  };

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      name: "",
      role: "User",
    });
    setOriginalRole("");
    setEditingId(null);
    setShowForm(false);
  };

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.role.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const formatDate = (dateString: string | null) => {
    if (!dateString) return t.never;
    return new Date(dateString).toLocaleDateString(
      language === "tr" ? "tr-TR" : "de-DE",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      },
    );
  };

  const getRoleIcon = (role: string) => {
    if (role === "SystemAdmin") {
      return <Shield size={14} className="text-red-500" />;
    } else if (role === "UserAdmin") {
      return <Shield size={14} className="text-amber-500" />;
    } else {
      return <User size={14} className="text-blue-500" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    if (role === "SystemAdmin") {
      return "bg-red-100 text-red-800 border-red-200";
    } else if (role === "UserAdmin") {
      return "bg-amber-100 text-amber-800 border-amber-200";
    } else {
      return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "SystemAdmin":
        return t.roleSystemAdmin;
      case "UserAdmin":
        return t.roleUserAdmin;
      default:
        return t.roleUser;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-kpf-teal"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification.message && (
        <div
          className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border transition-all duration-300 animate-slide-in-right ${
            notification.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle size={24} className="text-green-500" />
          ) : (
            <AlertCircle size={24} className="text-red-500" />
          )}
          <div>
            <p className="font-semibold">{notification.message}</p>
          </div>
          <button
            onClick={() => setNotification({ message: "", type: "" })}
            className="ml-4 p-1 hover:bg-white/50 rounded-full transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-3">
            <Users className="text-kpf-teal" />
            {t.pageTitle}
          </h1>
          <p className="text-slate-600">
            {t.totalUsers} {admins.length} {t.users}
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-6 py-3 bg-kpf-teal text-white rounded-lg hover:bg-kpf-teal/90 transition-all shadow-lg"
        >
          <Plus size={20} />
          <span className="font-semibold">{t.newUser}</span>
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
          placeholder={t.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                {t.name}
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                {t.email}
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                {t.role}
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                {t.status}
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-600">
                {t.lastLogin}
              </th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-slate-600"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredAdmins.map((admin) => (
              <tr
                key={admin.id}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-kpf-teal/10 flex items-center justify-center">
                      <span className="text-kpf-teal font-bold text-lg">
                        {admin.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="font-medium text-slate-800">
                      {admin.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail size={14} />
                    <span>{admin.email}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getRoleBadgeColor(
                      admin.role,
                    )}`}
                  >
                    {getRoleIcon(admin.role)}
                    {getRoleLabel(admin.role)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {admin.isActive ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                      <Eye size={12} />
                      {t.active}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold">
                      <EyeOff size={12} />
                      {t.inactive}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Clock size={14} />
                    <span>{formatDate(admin.lastLoginAt)}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(admin)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title={t.edit}
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(admin.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title={t.delete}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredAdmins.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <Users size={48} className="mx-auto mb-4 opacity-30" />
            <p>{t.noUsersFound}</p>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="border-b border-slate-200 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-800">
                {editingId ? t.editUser : t.createUser}
              </h2>
              <button
                onClick={resetForm}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  {t.name} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  {t.email} *
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

              {/* Password - only for create */}
              {!editingId && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    {t.password} *
                  </label>
                  <input
                    type="password"
                    required={!editingId}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal"
                  />
                </div>
              )}

              {/* Role - for both create and edit */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  {t.role} *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal bg-white"
                >
                  <option value="User">{t.roleUser}</option>
                  <option value="UserAdmin">{t.roleUserAdmin}</option>
                  <option value="SystemAdmin">{t.roleSystemAdmin}</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4 border-t">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-kpf-teal text-white rounded-lg hover:bg-kpf-teal/90 transition-all font-semibold"
                >
                  <Save size={20} />
                  {editingId ? t.update : t.create}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-6 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-all font-semibold"
                >
                  {t.cancel}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Animation Styles */}
      <style>{`
        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(100px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AdminTeam;
