import React, { useState, useEffect, useRef } from "react";
import { Mail, Phone, MapPin, Save } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { TEXTS } from "../../constants";
import { contactInfoApi } from "../../services/api";
import toast from "react-hot-toast";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const QuillEditor = ({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const isUpdating = useRef(false);

  useEffect(() => {
    if (containerRef.current && !quillRef.current) {
      const quill = new Quill(containerRef.current, {
        theme: "snow",
        placeholder,
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

interface Address {
  street?: string;
  houseNo?: string;
  zipCode?: string;
  city?: string;
  state?: string;
  country?: string;
}

interface SocialMedia {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedIn?: string;
  youTube?: string;
}

interface ContactInfo {
  id?: string;
  email: string;
  phone: string;
  address: Address;
  officeHours: string;
  socialMedia: SocialMedia;
}

const AdminContactSettings: React.FC = () => {
  const { language } = useLanguage();
  const t = (key: string) => TEXTS[key]?.[language] || key;

  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    email: "info@kpf.de",
    phone: "+49 69 123 456 78",
    address: {
      street: "",
      houseNo: "",
      zipCode: "",
      city: "",
      country: "",
      state: "",
    },
    officeHours: "",
    socialMedia: {
      facebook: "",
      instagram: "",
      twitter: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    loadContactInfo();
  }, []);

  const loadContactInfo = async () => {
    try {
      setInitialLoading(true);
      const data = await contactInfoApi.get();
      if (data) {
        setContactInfo({
          id: data.id || "",
          email: data.email || "",
          phone: data.phone || "",
          address: data.address || {
            street: "",
            houseNo: "",
            zipCode: "",
            city: "",
            country: "",
            state: "",
          },
          officeHours: data.officeHours || "",
          socialMedia: data.socialMedia || {
            facebook: "",
            instagram: "",
            twitter: "",
          },
        });
      }
    } catch (error) {
      console.error("İletişim bilgileri yüklenirken hata:", error);
    } finally {
      setInitialLoading(false);
    }
  };

  // @ts-expect-error -- React 19 FormEvent type deprecation
  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) return toast.error(t("admin_token_missing"));

      const payload = {
        id: contactInfo.id || "",
        dto: {
          email: contactInfo.email,
          phone: contactInfo.phone,
          address: contactInfo.address,
          officeHours: contactInfo.officeHours,
          socialMedia: contactInfo.socialMedia,
        },
      };

      await contactInfoApi.update(payload);
      toast.success(t("admin_contact_updated"));
    } catch (error: any) {
      console.error("Güncelleme hatası:", error);
      toast.error(
        t("admin_contact_update_failed") +
          ": " +
          (error.message || t("admin_unknown_error")),
      );
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-kpf-teal"></div>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto pb-20 px-4">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sticky Top Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/90 backdrop-blur-md p-4 rounded-3xl shadow-sm border border-slate-100 sticky top-4 z-10">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-kpf-teal/10 rounded-lg">
              <Mail className="text-kpf-teal" size={20} />
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-800">
                {t("admin_contact_title")}
              </h1>
              <p className="text-xs text-slate-400">
                {t("admin_contact_subtitle")}
              </p>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-2 bg-kpf-teal text-white rounded-2xl hover:bg-kpf-teal/90 transition-all disabled:opacity-50 shadow-xl font-semibold"
          >
            <Save size={16} />
            {loading ? t("admin_loading") : t("admin_publish")}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
          {/* Left: Form */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <div className="flex items-center gap-2">
                  <Mail size={18} />
                  {t("admin_contact_email")}
                </div>
              </label>
              <input
                type="email"
                value={contactInfo.email}
                onChange={(e) =>
                  setContactInfo({ ...contactInfo, email: e.target.value })
                }
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all"
              />
            </div>

            {/* Phone */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <div className="flex items-center gap-2">
                  <Phone size={18} />
                  {t("admin_contact_phone")}
                </div>
              </label>
              <input
                type="tel"
                value={contactInfo.phone}
                onChange={(e) =>
                  setContactInfo({ ...contactInfo, phone: e.target.value })
                }
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all"
              />
            </div>

            {/* Address */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <MapPin size={18} />
                {t("admin_contact_address")}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder={t("admin_address_street")}
                  value={contactInfo.address.street}
                  onChange={(e) =>
                    setContactInfo({
                      ...contactInfo,
                      address: {
                        ...contactInfo.address,
                        street: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder={t("admin_address_houseNo")}
                  value={contactInfo.address.houseNo}
                  onChange={(e) =>
                    setContactInfo({
                      ...contactInfo,
                      address: {
                        ...contactInfo.address,
                        houseNo: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder={t("admin_address_postalCode")}
                  value={contactInfo.address.zipCode}
                  onChange={(e) =>
                    setContactInfo({
                      ...contactInfo,
                      address: {
                        ...contactInfo.address,
                        zipCode: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder={t("admin_address_city")}
                  value={contactInfo.address.city}
                  onChange={(e) =>
                    setContactInfo({
                      ...contactInfo,
                      address: { ...contactInfo.address, city: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder={t("admin_address_state")}
                  value={contactInfo.address.state}
                  onChange={(e) =>
                    setContactInfo({
                      ...contactInfo,
                      address: {
                        ...contactInfo.address,
                        state: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
                <input
                  type="text"
                  placeholder={t("admin_address_country")}
                  value={contactInfo.address.country}
                  onChange={(e) =>
                    setContactInfo({
                      ...contactInfo,
                      address: {
                        ...contactInfo.address,
                        country: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            {/* Office Hours */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {t("admin_contact_office_hours")}
              </label>
              <QuillEditor
                value={contactInfo.officeHours}
                onChange={(val) =>
                  setContactInfo({ ...contactInfo, officeHours: val })
                }
                placeholder={t("admin_editor_placeholder")}
              />
            </div>

            {/* Social Media */}
            <div className="pt-4 border-t border-slate-200 mt-4">
              <h3 className="text-lg font-bold text-slate-800 mb-4">
                {t("admin_social_media")}
              </h3>
              <div className="space-y-3">
                {["facebook", "instagram", "twitter"].map((sm) => (
                  <div key={sm}>
                    <label className="block text-sm font-semibold text-slate-700 mb-2 capitalize">
                      {sm}
                    </label>
                    <input
                      type="url"
                      value={
                        contactInfo.socialMedia[sm as keyof SocialMedia] || ""
                      }
                      onChange={(e) =>
                        setContactInfo({
                          ...contactInfo,
                          socialMedia: {
                            ...contactInfo.socialMedia,
                            [sm]: e.target.value,
                          },
                        })
                      }
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Small submit for fallback */}
            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-kpf-teal text-white rounded-lg hover:bg-teal-700 transition-all disabled:opacity-50 shadow-lg"
              >
                <Save size={18} />
                {loading ? t("admin_loading") : t("admin_save")}
              </button>
            </div>
          </div>

          {/* Right: Live Preview */}
          <div className="">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 h-full">
              <div className="sticky top-28 bg-slate-50 py-2">
                <h3 className="text-lg font-bold text-slate-800">
                  {t("admin_preview_title")}
                </h3>
                <p className="text-xs text-slate-500">
                  {t("admin_preview_subtext")}
                </p>
              </div>

              <div className="mt-4 space-y-4">
                {/* German labels preview (sticky header keeps context) */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center gap-3 text-slate-700">
                    <Mail size={18} className="text-kpf-teal" />
                    <span className="font-medium">
                      {t("admin_contact_email")}
                    </span>
                    <span className="ml-auto text-sm text-slate-500">
                      {contactInfo.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-700 mt-3">
                    <Phone size={18} className="text-kpf-teal" />
                    <span className="font-medium">
                      {t("admin_contact_phone")}
                    </span>
                    <span className="ml-auto text-sm text-slate-500">
                      {contactInfo.phone}
                    </span>
                  </div>
                  <div className="flex items-start gap-3 text-slate-700 mt-3">
                    <MapPin size={18} className="text-kpf-teal mt-1" />
                    <div>
                      <div className="text-sm font-medium">
                        {t("admin_contact_address")}
                      </div>
                      <div className="text-sm text-slate-500 whitespace-pre-wrap">
                        {`${contactInfo.address.street || ""} ${contactInfo.address.houseNo || ""}, ${contactInfo.address.zipCode || ""} ${contactInfo.address.city || ""} ${contactInfo.address.state || ""} ${contactInfo.address.country || ""}`}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Turkish / general preview below */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-sm text-slate-500 mb-2">
                    {t("admin_contact_office_hours")}
                  </div>
                  <div
                    className="prose max-w-none text-slate-700"
                    dangerouslySetInnerHTML={{
                      __html:
                        contactInfo.officeHours ||
                        `<em>${t("admin_no_content")}</em>`,
                    }}
                  />
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold mb-2">
                    {t("admin_social_media")}
                  </h4>
                  <div className="space-y-2 text-sm text-slate-600">
                    {contactInfo.socialMedia.facebook && (
                      <div>
                        <a
                          href={contactInfo.socialMedia.facebook}
                          className="text-kpf-teal hover:underline"
                        >
                          Facebook
                        </a>
                      </div>
                    )}
                    {contactInfo.socialMedia.instagram && (
                      <div>
                        <a
                          href={contactInfo.socialMedia.instagram}
                          className="text-kpf-teal hover:underline"
                        >
                          Instagram
                        </a>
                      </div>
                    )}
                    {contactInfo.socialMedia.twitter && (
                      <div>
                        <a
                          href={contactInfo.socialMedia.twitter}
                          className="text-kpf-teal hover:underline"
                        >
                          Twitter
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      <style>{`\n        .quill-modern-container { background: #f8fafc; border-radius: 20px; border: 1px solid #f1f5f9; overflow: hidden; }\n        .quill-modern-container:focus-within { background: #fff; border-color: #0d9488; }\n        .ql-toolbar.ql-snow { border: none !important; border-bottom: 1px solid #f1f5f9 !important; background: #fff; }\n        .ql-container.ql-snow { border: none !important; min-height: 160px; font-size: 15px; }\n        .ql-editor { padding: 15px !important; }\n        .ql-editor.ql-blank::before { color: #94a3b8; font-style: normal; }\n      `}</style>
    </div>
  );
};

export default AdminContactSettings;
