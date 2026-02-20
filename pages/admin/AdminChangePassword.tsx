import React, { useState } from "react";
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import { authApi } from "../../services/api";
import { useLanguage } from "../../contexts/LanguageContext";
import { TEXTS } from "../../constants";

const AdminChangePassword: React.FC = () => {
  const { language } = useLanguage();
  const t = (key: string) => TEXTS[key]?.[language] || key;

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      setMessage({
        type: "error",
        text: t("admin_change_password_all_fields_required"),
      });
      return;
    }

    if (!validatePassword(newPassword)) {
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
      // Clear form
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
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          {t("admin_change_password_title")}
        </h1>
        <p className="text-slate-600">{t("admin_change_password_subtitle")}</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              {t("admin_change_password_current")}
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock size={20} />
              </div>
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full pl-11 pr-11 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-kpf-teal focus:border-transparent transition-all"
                placeholder={t("admin_change_password_current_placeholder")}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                tabIndex={-1}
              >
                {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              {t("admin_change_password_new")}
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock size={20} />
              </div>
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-11 pr-11 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-kpf-teal focus:border-transparent transition-all"
                placeholder={t("admin_change_password_new_placeholder")}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                tabIndex={-1}
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <p className="mt-2 text-sm text-slate-500">
              {t("admin_change_password_requirements")}
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              {t("admin_change_password_confirm")}
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock size={20} />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-11 pr-11 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-kpf-teal focus:border-transparent transition-all"
                placeholder={t("admin_change_password_confirm_placeholder")}
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div
              className={`flex items-start gap-3 p-4 rounded-lg ${
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

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-kpf-teal to-teal-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? t("admin_change_password_updating")
                : t("admin_change_password_submit")}
            </button>
          </div>
        </form>
      </div>

      {/* Security Tips */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-3">
          {t("admin_change_password_security_tips_title")}
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>{t("admin_change_password_tip_1")}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>{t("admin_change_password_tip_2")}</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-1">•</span>
            <span>{t("admin_change_password_tip_3")}</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminChangePassword;
