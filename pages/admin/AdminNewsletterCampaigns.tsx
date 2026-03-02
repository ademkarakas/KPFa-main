import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  Send,
  Mail,
  Calendar,
  Users,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../contexts/LanguageContext";
import toast from "react-hot-toast";
import {
  newsletterAdminApi,
  NewsletterCampaign,
  CreateCampaignRequest,
} from "../../services/newsletterApi";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import ConfirmDialog from "../../components/ConfirmDialog";

// Quill Editor Component with unique instance ID
const QuillEditor = ({
  value,
  onChange,
  placeholder,
  editorId,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  editorId: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const isInitialized = useRef(false);

  // Initialize editor once
  useEffect(() => {
    if (!containerRef.current || isInitialized.current) return;

    isInitialized.current = true;

    const quill = new Quill(containerRef.current, {
      theme: "snow",
      placeholder: placeholder ?? "",
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image"],
          ["clean"],
        ],
      },
    });

    // Set initial value
    if (value) {
      quill.root.innerHTML = value;
    }

    // Listen for changes
    quill.on("text-change", () => {
      const html = quill.root.innerHTML;
      const normalizedHtml = html === "<p><br></p>" ? "" : html;
      onChange(normalizedHtml);
    });

    quillRef.current = quill;
  }, []);

  return (
    <div className="quill-modern-container">
      <div ref={containerRef} id={editorId} />
    </div>
  );
};

const AdminNewsletterCampaigns: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [view, setView] = useState<"list" | "create">("list");
  const [campaigns, setCampaigns] = useState<NewsletterCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [sending, setSending] = useState<string | null>(null); // Track which campaign is being sent

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

  // Form state
  const [formData, setFormData] = useState<CreateCampaignRequest>({
    subject: "",
    contentTr: "",
    contentDe: "",
    headerImageUrl: "",
    scheduledAt: undefined,
  });

  useEffect(() => {
    if (view === "list") {
      fetchCampaigns();
    }
  }, [view]);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      // Check if token exists
      const token = localStorage.getItem("adminToken");
      if (!token) {
        toast.error("Please login first");
        setLoading(false);
        return;
      }

      const data = await newsletterAdminApi.getCampaigns();
      setCampaigns(data);
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
      const errorMsg = error instanceof Error ? error.message : String(error);
      if (errorMsg.includes("403") || errorMsg.includes("401")) {
        toast.error("Authentication failed. Please login again.");
        localStorage.removeItem("adminToken");
      } else {
        toast.error(t("newsletter.admin.campaigns.createError"));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCampaign = async () => {
    // Validation
    if (!formData.subject.trim()) {
      toast.error("Subject is required");
      return;
    }
    if (!formData.contentTr.trim() || !formData.contentDe.trim()) {
      toast.error("Both Turkish and German content are required");
      return;
    }

    setCreating(true);
    try {
      await newsletterAdminApi.createCampaign(formData);
      toast.success(t("newsletter.admin.campaigns.createSuccess"));

      // Reset form
      setFormData({
        subject: "",
        contentTr: "",
        contentDe: "",
        headerImageUrl: "",
        scheduledAt: undefined,
      });

      // Go back to list
      setView("list");
    } catch (error) {
      console.error("Campaign creation error:", error);
      toast.error(t("newsletter.admin.campaigns.createError"));
    } finally {
      setCreating(false);
    }
  };

  const handleSendCampaign = async (campaignId: string) => {
    setConfirmDialog({
      isOpen: true,
      title: t("newsletter.admin.campaigns.sendTitle"),
      message: t("newsletter.admin.campaigns.sendConfirm"),
      onConfirm: () => {
        void (async () => {
          setSending(campaignId);
          const loadingToast = toast.loading("Kampanya gönderiliyor...");

          try {
            const result = await newsletterAdminApi.sendCampaign(campaignId);

            toast.dismiss(loadingToast);

            if (result.successful > 0) {
              toast.success(
                `✅ Kampanya başarıyla gönderildi!\n` +
                  `Başarılı: ${result.successful}\n` +
                  `Başarısız: ${result.failed}\n` +
                  `Toplam: ${result.total}`,
                { duration: 5000 },
              );
            } else {
              toast.error(
                `⚠️ Kampanya gönderilemedi!\n` +
                  `Başarısız: ${result.failed}/${result.total}`,
                { duration: 5000 },
              );
            }

            // Refresh campaign list to show updated status
            await fetchCampaigns();
          } catch (error) {
            toast.dismiss(loadingToast);
            console.error("Campaign send error:", error);
            const errorMsg =
              error instanceof Error ? error.message : String(error);
            toast.error(`❌ Gönderme hatası: ${errorMsg}`, { duration: 5000 });
          } finally {
            setSending(null);
          }
        })();
      },
    });
  };

  const handleSendTest = async (campaignId: string) => {
    const testEmail = prompt(
      t("newsletter.admin.campaigns.testEmailPlaceholder"),
    );
    if (!testEmail) return;

    try {
      await newsletterAdminApi.sendTestEmail(campaignId, testEmail);
      toast.success(t("newsletter.admin.campaigns.testEmailSent"));
    } catch (error) {
      console.error("Test email error:", error);
      toast.error("Failed to send test email");
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      Draft: "bg-slate-100 text-slate-600",
      Scheduled: "bg-blue-100 text-blue-800",
      Sending: "bg-yellow-100 text-yellow-800",
      Sent: "bg-green-100 text-green-800",
      Failed: "bg-red-100 text-red-800",
    };
    return badges[status as keyof typeof badges] || badges.Draft;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("de-DE", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // List View
  if (view === "list") {
    return (
      <div className="p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              {t("newsletter.admin.campaigns.pageTitle")}
            </h1>
            <p className="text-slate-600">
              {t("newsletter.admin.menu.campaigns")}
            </p>
          </div>
          <button
            onClick={() => setView("create")}
            className="flex items-center gap-2 bg-kpf-teal hover:bg-teal-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <Plus size={20} />
            {t("newsletter.admin.campaigns.createNew")}
          </button>
        </div>

        {/* Campaigns List */}
        {loading && (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-kpf-teal"></div>
          </div>
        )}

        {!loading && campaigns.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-16 text-center">
            <Mail className="mx-auto text-slate-300 mb-4" size={64} />
            <p className="text-slate-600 text-lg mb-6">
              {t("newsletter.admin.campaigns.noCampaigns")}
            </p>
            <button
              onClick={() => setView("create")}
              className="inline-flex items-center gap-2 bg-kpf-teal hover:bg-teal-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <Plus size={20} />
              {t("newsletter.admin.campaigns.createNew")}
            </button>
          </div>
        )}

        {!loading && campaigns.length > 0 && (
          <div className="grid grid-cols-1 gap-6">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold text-slate-800">
                        {campaign.subject}
                      </h3>
                      <span
                        className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusBadge(campaign.status)}`}
                      >
                        {t(
                          `newsletter.admin.campaigns.${campaign.status.toLowerCase()}`,
                        )}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar size={16} />
                        <span>
                          {t("newsletter.admin.campaigns.createdAt")}:{" "}
                          {formatDate(campaign.createdAt)}
                        </span>
                      </div>
                      {campaign.sentAt && (
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Send size={16} />
                          <span>
                            {t("newsletter.admin.campaigns.sentAt")}:{" "}
                            {formatDate(campaign.sentAt)}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Users size={16} />
                        <span>
                          {campaign.totalRecipients}{" "}
                          {t("newsletter.admin.campaigns.recipients")}
                        </span>
                      </div>
                      {campaign.status === "Sent" && (
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="text-green-600" size={16} />
                          <span className="text-green-700 font-medium">
                            {campaign.successfulSends}/
                            {campaign.totalRecipients}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    {campaign.status === "Draft" && (
                      <>
                        <button
                          onClick={() => handleSendTest(campaign.id)}
                          className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg transition-colors text-sm"
                        >
                          <Mail size={16} />
                          {t("newsletter.admin.campaigns.sendTest")}
                        </button>
                        <button
                          onClick={() => handleSendCampaign(campaign.id)}
                          disabled={sending === campaign.id}
                          className="flex items-center gap-2 bg-kpf-teal hover:bg-teal-600 text-white px-4 py-2 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {sending === campaign.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                              Gönderiliyor...
                            </>
                          ) : (
                            <>
                              <Send size={16} />
                              {t("newsletter.admin.campaigns.send")}
                            </>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Create View
  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setView("list")}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            {t("newsletter.admin.campaigns.createNew")}
          </h1>
          <p className="text-slate-600 text-sm">
            {language === "tr"
              ? "Kullanılabilir değişkenler: {{name}}, {{email}}"
              : "Verfügbare Variablen: {{name}}, {{email}}"}
          </p>
        </div>
      </div>

      {/* Create Form */}
      <div className="bg-white rounded-xl shadow-sm p-8 space-y-6">
        {/* Subject */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            {t("newsletter.admin.campaigns.subject")} *
          </label>
          <input
            type="text"
            value={formData.subject}
            onChange={(e) =>
              setFormData({ ...formData, subject: e.target.value })
            }
            placeholder={t("newsletter.admin.campaigns.subjectPlaceholder")}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal focus:border-transparent"
          />
        </div>

        {/* Header Image URL */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            {t("newsletter.admin.campaigns.headerImage")}
          </label>
          <input
            type="text"
            value={formData.headerImageUrl}
            onChange={(e) =>
              setFormData({ ...formData, headerImageUrl: e.target.value })
            }
            placeholder={t("newsletter.admin.campaigns.headerImagePlaceholder")}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal focus:border-transparent"
          />
        </div>

        {/* Content TR */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            {t("newsletter.admin.campaigns.contentTr")} *
          </label>
          <QuillEditor
            editorId="newsletter-editor-tr"
            value={formData.contentTr}
            onChange={(val) =>
              setFormData((prev) => ({ ...prev, contentTr: val }))
            }
            placeholder="Türkçe içerik yazın..."
          />
        </div>

        {/* Content DE */}
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">
            {t("newsletter.admin.campaigns.contentDe")} *
          </label>
          <QuillEditor
            editorId="newsletter-editor-de"
            value={formData.contentDe}
            onChange={(val) =>
              setFormData((prev) => ({ ...prev, contentDe: val }))
            }
            placeholder="Deutschen Inhalt schreiben..."
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-6 border-t border-slate-200">
          <button
            onClick={handleCreateCampaign}
            disabled={
              creating ||
              !formData.subject.trim() ||
              !formData.contentTr.trim() ||
              !formData.contentDe.trim()
            }
            className="flex items-center gap-2 bg-kpf-teal hover:bg-teal-600 text-white px-8 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {creating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                {t("common.saving")}
              </>
            ) : (
              <>
                <CheckCircle size={20} />
                {t("newsletter.admin.campaigns.createNew")}
              </>
            )}
          </button>
          <button
            onClick={() => setView("list")}
            className="px-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
          >
            {t("common.cancel")}
          </button>
        </div>
      </div>

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText={t("common.send") || "Gönder"}
        cancelText={t("common.cancel") || "İptal"}
        type="warning"
      />
    </div>
  );
};

export default AdminNewsletterCampaigns;
