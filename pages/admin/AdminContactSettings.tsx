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

  const handleSubmit = async (e: React.FormEvent) => {
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
          (error.message || t("admin_unknown_error"))
      );
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-kpf-red"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800 mb-2">
        {t("admin_contact_title")}
      </h1>
      <p className="text-slate-600">{t("admin_contact_subtitle")}</p>

      <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
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
          <div>
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

          {/* Address Fields */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <MapPin size={18} />
              {t("admin_contact_address")}
            </label>

            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Street"
                value={contactInfo.address.street}
                onChange={(e) =>
                  setContactInfo({
                    ...contactInfo,
                    address: { ...contactInfo.address, street: e.target.value },
                  })
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all"
              />
              <input
                type="text"
                placeholder="House No"
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
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all"
              />
              <input
                type="text"
                placeholder="Postal Code"
                value={contactInfo.address.zipCode}
                onChange={(e) =>
                  setContactInfo({
                    ...contactInfo,
                    address: {
                      ...contactInfo.address,
                      postalCode: e.target.value,
                    },
                  })
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all"
              />
              <input
                type="text"
                placeholder="City"
                value={contactInfo.address.city}
                onChange={(e) =>
                  setContactInfo({
                    ...contactInfo,
                    address: { ...contactInfo.address, city: e.target.value },
                  })
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all"
              />
              <input
                type="text"
                placeholder="State"
                value={contactInfo.address.state}
                onChange={(e) =>
                  setContactInfo({
                    ...contactInfo,
                    address: { ...contactInfo.address, state: e.target.value },
                  })
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all"
              />

              <input
                type="text"
                placeholder="Country"
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
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all"
              />
            </div>
          </div>

          {/* Office Hours */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              {t("admin_contact_office_hours")}
            </label>
            <QuillEditor
              value={contactInfo.officeHours}
              onChange={(val) =>
                setContactInfo({ ...contactInfo, officeHours: val })
              }
              placeholder={t("admin_contact_office_hours")}
            />
          </div>

          {/* Social Media */}
          <div className="pt-4 border-t border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4">
              Sosyal Medya
            </h3>
            <div className="space-y-4">
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

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-kpf-red text-white rounded-lg hover:bg-red-700 transition-all disabled:opacity-50 shadow-lg"
          >
            <Save size={20} />
            {loading ? t("admin_loading") : t("admin_save")}
          </button>
        </form>
      </div>

      {/* Preview */}
      <div className="bg-slate-50 rounded-xl p-6 max-w-2xl border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Önizleme</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-slate-700">
            <Mail size={18} className="text-kpf-teal" />
            <span>{contactInfo.email}</span>
          </div>
          <div className="flex items-center gap-3 text-slate-700">
            <Phone size={18} className="text-kpf-teal" />
            <span>{contactInfo.phone}</span>
          </div>
          <div className="flex items-start gap-3 text-slate-700">
            <MapPin size={18} className="text-kpf-teal mt-1" />
            <span>
              {`${contactInfo.address.street || ""} 
              ${contactInfo.address.houseNo || ""},  ${
                contactInfo.address.postalCode || ""
              }
              ${contactInfo.address.city || ""}, ${
                contactInfo.address.state || ""
              }, ${contactInfo.address.country || ""}`}
            </span>
          </div>
        </div>
      </div>

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

export default AdminContactSettings;
