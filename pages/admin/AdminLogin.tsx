import React, { useState } from "react";
import { Lock, Mail, AlertCircle, Eye, EyeOff } from "lucide-react";
import { authApi } from "../../services/api";
import { useTranslation } from "react-i18next";

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authApi.login(email, password);

      if (response.token) {
        localStorage.setItem("adminToken", response.token);
        if (response.name) {
          localStorage.setItem("adminName", response.name);
        }
        if (response.email) {
          localStorage.setItem("adminEmail", response.email);
        }
        if (response.role) {
          localStorage.setItem("adminRole", response.role);
        }
        onLoginSuccess();
      } else {
        setError(t("admin_login_error"));
      }
    } catch (err: any) {
      setError(err.message || t("admin_error_occurred"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-kpf-teal rounded-2xl mb-6 shadow-2xl">
            <Lock className="text-white" size={48} />
          </div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">
            {t("admin_title")}
          </h1>
          <p className="text-slate-600">{t("admin_subtitle")}</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-lg p-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-start gap-3">
                <AlertCircle
                  className="text-red-500 flex-shrink-0 mt-0.5"
                  size={20}
                />
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {t("admin_email")}
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal focus:border-transparent transition-all"
                  placeholder={t("admin_login_email_placeholder")}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {t("admin_password")}
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
                  size={20}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-12 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal focus:border-transparent transition-all"
                  placeholder={t("admin_login_password_placeholder")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-kpf-teal text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading ? t("admin_logging_in") : t("admin_login")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
