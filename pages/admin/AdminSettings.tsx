import React, { useState } from "react";
import {
  User,
  Mail,
  Lock,
  Edit2,
  X,
  Check,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { authApi } from "../../services/api";
import { useLanguage } from "../../contexts/LanguageContext";
import { TEXTS } from "../../constants";

type EditMode = "name" | "email" | "password" | null;

const AdminSettings: React.FC = () => {
  const { language } = useLanguage();
  const t = (key: string) => TEXTS[key]?.[language] || key;

  // Get user info from localStorage
  const [adminName, setAdminName] = useState(
    localStorage.getItem("adminName") || "Admin User",
  );
  const [adminEmail, setAdminEmail] = useState(
    localStorage.getItem("adminEmail") || "",
  );
  const adminRole = localStorage.getItem("adminRole") || "Administrator";

  // Edit mode state
  const [editMode, setEditMode] = useState<EditMode>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Edit form values
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  // Password change values
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const getUserInitials = (name: string) => {
    if (!name) return "AD";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + (parts.at(-1)?.[0] || "")).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleEditClick = (mode: EditMode) => {
    setMessage(null);
    setEditMode(mode);
    if (mode === "name") {
      setEditName(adminName);
    } else if (mode === "email") {
      setEditEmail(adminEmail);
    } else if (mode === "password") {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const handleCancelEdit = () => {
    setEditMode(null);
    setEditName("");
    setEditEmail("");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setMessage(null);
  };

  const handleSaveName = async () => {
    if (!editName.trim()) {
      setMessage({
        type: "error",
        text: t("admin_settings_name_required"),
      });
      return;
    }

    setLoading(true);
    try {
      await authApi.updateProfile({ name: editName });
      setAdminName(editName);
      setMessage({
        type: "success",
        text: t("admin_settings_update_success"),
      });
      setEditMode(null);
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || t("admin_settings_update_error"),
      });

      // If the error is about missing admin ID, suggest re-login
      if (error.message?.includes("Admin ID not found")) {
        setTimeout(() => {
          if (
            confirm(
              t("admin_settings_relogin_required") ||
                "Please login again to continue.",
            )
          ) {
            globalThis.location.href = "/admin";
          }
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEmail = async () => {
    if (!editEmail.trim()) {
      setMessage({
        type: "error",
        text: t("admin_settings_email_required"),
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editEmail)) {
      setMessage({
        type: "error",
        text: t("admin_settings_email_invalid"),
      });
      return;
    }

    setLoading(true);
    try {
      await authApi.updateProfile({ email: editEmail });
      setAdminEmail(editEmail);
      setMessage({
        type: "success",
        text: t("admin_settings_update_success"),
      });
      setEditMode(null);
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || t("admin_settings_update_error"),
      });

      // If the error is about missing admin ID, suggest re-login
      if (error.message?.includes("Admin ID not found")) {
        setTimeout(() => {
          if (
            confirm(
              t("admin_settings_relogin_required") ||
                "Please login again to continue.",
            )
          ) {
            globalThis.location.href = "/admin";
          }
        }, 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSavePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({
        type: "error",
        text: t("admin_change_password_all_fields_required"),
      });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({
        type: "error",
        text: t("admin_change_password_min_length"),
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({
        type: "error",
        text: t("admin_change_password_no_match"),
      });
      return;
    }

    if (currentPassword === newPassword) {
      setMessage({
        type: "error",
        text: t("admin_change_password_same_as_current"),
      });
      return;
    }

    setLoading(true);
    try {
      await authApi.changePassword(currentPassword, newPassword);
      setMessage({
        type: "success",
        text: t("admin_change_password_success"),
      });
      setEditMode(null);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || t("admin_change_password_error"),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          {t("admin_settings_title")}
        </h1>
        <p className="text-slate-600">{t("admin_settings_subtitle")}</p>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`mb-6 flex items-start gap-3 p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-50 text-green-800 border border-green-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
          )}
          <p className="text-sm font-medium">{message.text}</p>
        </div>
      )}

      {/* Profile Card with Avatar */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-kpf-teal to-teal-600 h-20"></div>
        <div className="px-6 pb-6">
          <div className="flex items-center gap-4 -mt-10">
            <div className="relative">
              <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white text-2xl font-bold shadow-lg border-4 border-white">
                {getUserInitials(adminName)}
              </div>
              <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="pt-8">
              <h2 className="text-xl font-bold text-slate-800">{adminName}</h2>
              <p className="text-slate-500 text-sm">{adminRole}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Settings List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 divide-y divide-slate-200">
        {/* Name Setting */}
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <div className="p-2 bg-blue-50 rounded-lg mt-1">
                <User className="text-blue-600" size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-slate-700 mb-1">
                  {t("admin_settings_name")}
                </h3>
                {editMode === "name" ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-kpf-teal focus:border-transparent"
                      placeholder={t("admin_settings_name_placeholder")}
                      disabled={loading}
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveName}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-kpf-teal text-white rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-50"
                      >
                        <Check size={16} />
                        {t("admin_save")}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50"
                      >
                        <X size={16} />
                        {t("admin_cancel")}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-800 font-medium">{adminName}</p>
                )}
              </div>
            </div>
            {editMode !== "name" && (
              <button
                onClick={() => handleEditClick("name")}
                disabled={editMode !== null}
                className="flex items-center gap-2 px-4 py-2 text-kpf-teal hover:bg-teal-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Edit2 size={16} />
                {t("admin_edit")}
              </button>
            )}
          </div>
        </div>

        {/* Email Setting */}
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <div className="p-2 bg-purple-50 rounded-lg mt-1">
                <Mail className="text-purple-600" size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-slate-700 mb-1">
                  {t("admin_settings_email")}
                </h3>
                {editMode === "email" ? (
                  <div className="space-y-3">
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-kpf-teal focus:border-transparent"
                      placeholder={t("admin_settings_email_placeholder")}
                      disabled={loading}
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveEmail}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-kpf-teal text-white rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-50"
                      >
                        <Check size={16} />
                        {t("admin_save")}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50"
                      >
                        <X size={16} />
                        {t("admin_cancel")}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-800 font-medium">{adminEmail}</p>
                )}
              </div>
            </div>
            {editMode !== "email" && (
              <button
                onClick={() => handleEditClick("email")}
                disabled={editMode !== null}
                className="flex items-center gap-2 px-4 py-2 text-kpf-teal hover:bg-teal-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Edit2 size={16} />
                {t("admin_edit")}
              </button>
            )}
          </div>
        </div>

        {/* Password Setting */}
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <div className="p-2 bg-orange-50 rounded-lg mt-1">
                <Lock className="text-orange-600" size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-slate-700 mb-1">
                  {t("admin_settings_password")}
                </h3>
                {editMode === "password" ? (
                  <div className="space-y-3">
                    {/* Current Password */}
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full pl-4 pr-11 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-kpf-teal focus:border-transparent"
                        placeholder={t("admin_change_password_current")}
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        tabIndex={-1}
                      >
                        {showCurrentPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>

                    {/* New Password */}
                    <div className="relative">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full pl-4 pr-11 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-kpf-teal focus:border-transparent"
                        placeholder={t("admin_change_password_new")}
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        tabIndex={-1}
                      >
                        {showNewPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>

                    {/* Confirm Password */}
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pl-4 pr-11 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-kpf-teal focus:border-transparent"
                        placeholder={t("admin_change_password_confirm")}
                        disabled={loading}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>

                    <p className="text-xs text-slate-500">
                      {t("admin_change_password_requirements")}
                    </p>

                    <div className="flex gap-2">
                      <button
                        onClick={handleSavePassword}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-kpf-teal text-white rounded-lg hover:bg-teal-600 transition-colors disabled:opacity-50"
                      >
                        <Check size={16} />
                        {t("admin_save")}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50"
                      >
                        <X size={16} />
                        {t("admin_cancel")}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-800 font-medium">••••••••</p>
                )}
              </div>
            </div>
            {editMode !== "password" && (
              <button
                onClick={() => handleEditClick("password")}
                disabled={editMode !== null}
                className="flex items-center gap-2 px-4 py-2 text-kpf-teal hover:bg-teal-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Edit2 size={16} />
                {t("admin_edit")}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Security Tips */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2 text-sm">
          {t("admin_settings_security_tips")}
        </h4>
        <ul className="space-y-1 text-xs text-blue-800">
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">•</span>
            <span>{t("admin_change_password_tip_1")}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">•</span>
            <span>{t("admin_change_password_tip_2")}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">•</span>
            <span>{t("admin_change_password_tip_3")}</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminSettings;
