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
import ConfirmDialog from "../../components/ConfirmDialog";

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
  const [accessDenied, setAccessDenied] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [originalRole, setOriginalRole] = useState<string>("");
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
      accessDeniedTitle: "Erişim Yok",
      accessDeniedMessage:
        "Bu sayfaya erişim yetkiniz bulunmamaktadır. Sadece Sistem Yöneticileri kullanıcı yönetimi yapabilir.",
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
      accessDeniedTitle: "Kein Zugriff",
      accessDeniedMessage:
        "Sie haben keine Berechtigung für diese Seite. Nur Systemadministratoren können Benutzer verwalten.",
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

      if (res.status === 403) {
        setAccessDenied(true);
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
    setConfirmDialog({
      isOpen: true,
      title: language === "tr" ? "Kullanıcı Sil" : "Benutzer löschen",
      message: t.confirmDelete,
      onConfirm: () => {
        void (async () => {
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
        })();
      },
    });
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

  if (accessDenied) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-6 bg-red-100 rounded-full">
              <Shield size={64} className="text-red-600" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-4">
            {t.accessDeniedTitle}
          </h2>
          <p className="text-lg text-slate-600 mb-8">{t.accessDeniedMessage}</p>
          <button
            onClick={() => (globalThis.location.href = "/admin")}
            className="px-8 py-3 bg-kpf-teal text-white rounded-xl hover:bg-kpf-teal/90 transition-all font-bold text-base"
          >
            {language === "tr" ? "Ana Sayfaya Dön" : "Zur Startseite"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Message Notification */}
      {notification.message && (
        <div
          className={`p-6 rounded-xl flex items-center gap-4 mb-6 shadow-lg ${
            notification.type === "success"
              ? "bg-green-50 text-green-700 border-2 border-green-200"
              : "bg-red-50 text-red-700 border-2 border-red-200"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle size={32} className="text-green-500 flex-shrink-0" />
          ) : (
            <AlertCircle size={32} className="text-red-500 flex-shrink-0" />
          )}
          <div className="flex-1">
            <p className="font-bold text-lg">{notification.message}</p>
          </div>
          <button
            onClick={() => setNotification({ message: "", type: "" })}
            className="p-2 hover:bg-white/50 rounded-full transition-colors flex-shrink-0"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
        <div className="flex items-center gap-5">
          <div className="p-5 bg-kpf-teal/10 rounded-2xl">
            <Users className="text-kpf-teal" size={40} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              {t.pageTitle}
            </h1>
            <p className="text-base text-slate-600">
              {t.totalUsers} {admins.length} {t.users}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-kpf-teal text-white rounded-xl hover:bg-kpf-teal/90 transition-all shadow-lg font-bold"
        >
          <Plus size={20} />
          <span>{t.newUser}</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
          size={24}
        />
        <input
          type="text"
          placeholder={t.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-14 pr-4 py-4 text-base border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal shadow-sm"
        />
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b-2 border-slate-200">
            <tr>
              <th className="px-8 py-5 text-left text-base font-bold text-slate-700">
                {t.name}
              </th>
              <th className="px-8 py-5 text-left text-base font-bold text-slate-700">
                {t.email}
              </th>
              <th className="px-8 py-5 text-left text-base font-bold text-slate-700">
                {t.role}
              </th>
              <th className="px-8 py-5 text-left text-base font-bold text-slate-700">
                {t.status}
              </th>
              <th className="px-8 py-5 text-left text-base font-bold text-slate-700">
                {t.lastLogin}
              </th>
              <th className="px-8 py-5 text-right text-base font-bold text-slate-700"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredAdmins.map((admin) => (
              <tr
                key={admin.id}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-kpf-teal/10 flex items-center justify-center">
                      <span className="text-kpf-teal font-bold text-xl">
                        {admin.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="font-semibold text-slate-800 text-base">
                      {admin.name}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail size={16} />
                    <span className="text-base">{admin.email}</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border ${getRoleBadgeColor(
                      admin.role,
                    )}`}
                  >
                    {getRoleIcon(admin.role)}
                    {getRoleLabel(admin.role)}
                  </span>
                </td>
                <td className="px-8 py-5">
                  {admin.isActive ? (
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                      <Eye size={14} />
                      {t.active}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 text-slate-600 rounded-full text-sm font-bold">
                      <EyeOff size={14} />
                      {t.inactive}
                    </span>
                  )}
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Clock size={16} />
                    <span>{formatDate(admin.lastLoginAt)}</span>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(admin)}
                      className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                      title={t.edit}
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(admin.id)}
                      className="p-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      title={t.delete}
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredAdmins.length === 0 && (
          <div className="text-center py-16 text-slate-500">
            <Users size={56} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-semibold">{t.noUsersFound}</p>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl">
            <div className="border-b-2 border-slate-200 p-8 flex items-center justify-between">
              <h2 className="text-3xl font-bold text-slate-800">
                {editingId ? t.editUser : t.createUser}
              </h2>
              <button
                onClick={resetForm}
                className="p-3 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X size={28} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Name */}
              <div>
                <label className="block text-base font-bold text-slate-700 mb-3">
                  {t.name} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-5 py-4 text-base border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal focus:border-kpf-teal"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-base font-bold text-slate-700 mb-3">
                  {t.email} *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-5 py-4 text-base border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal focus:border-kpf-teal"
                />
              </div>

              {/* Password - only for create */}
              {!editingId && (
                <div>
                  <label className="block text-base font-bold text-slate-700 mb-3">
                    {t.password} *
                  </label>
                  <input
                    type="password"
                    required={!editingId}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full px-5 py-4 text-base border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal focus:border-kpf-teal"
                  />
                </div>
              )}

              {/* Role - for both create and edit */}
              <div>
                <label className="block text-base font-bold text-slate-700 mb-3">
                  {t.role} *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full px-5 py-4 text-base border-2 border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-kpf-teal focus:border-kpf-teal bg-white"
                >
                  <option value="User">{t.roleUser}</option>
                  <option value="UserAdmin">{t.roleUserAdmin}</option>
                  <option value="SystemAdmin">{t.roleSystemAdmin}</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-6 border-t-2 border-slate-200">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-kpf-teal text-white rounded-xl hover:bg-kpf-teal/90 transition-all font-bold text-base shadow-lg"
                >
                  <Save size={22} />
                  {editingId ? t.update : t.create}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-6 py-4 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 transition-all font-bold text-base"
                >
                  {t.cancel}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

export default AdminTeam;
