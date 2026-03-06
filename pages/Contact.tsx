import React, { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  User,
  MessageSquare,
  AtSign,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Language } from "../types";
import { TEXTS } from "../constants";
import { contactInfoApi } from "@/services/api";
import { contactApi } from "@/services/contactApi";

interface ContactProps {
  lang: Language;
}

interface Address {
  street?: string;
  houseNo?: string;
  zipCode?: string;
  city?: string;
  state?: string;
  country?: string;
}

interface OfficeHours {
  turkish?: string;
  german?: string;
}

interface SocialMedia {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
}

interface ContactData {
  email: string;
  phone: string;
  address: Address;
  officeHours: OfficeHours;
  socialMedia: SocialMedia;
}

const Contact: React.FC<ContactProps> = ({ lang }) => {
  const [contactData, setContactData] = useState<ContactData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [status, setStatus] = useState<{
    type: "idle" | "success" | "error";
    message: string;
  }>({
    type: "idle",
    message: "",
  });
  const [formData, setFormData] = useState({
    anrede: "",
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const t = (key: string) => {
    const translation = TEXTS[key];
    if (!translation) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    return translation[lang];
  };

  useEffect(() => {
    loadContactData();
  }, []);

  const loadContactData = async () => {
    try {
      setLoading(true);
      const data = await contactInfoApi.get();

      // Address ve officeHours'ı object-safe yap
      const safeData: ContactData = {
        email: data.email || "",
        phone: data.phone || "",
        address: data.address || {},
        officeHours: data.officeHours || {},
        socialMedia: data.socialMedia || {},
      };

      setContactData(safeData);
    } catch (err) {
      console.error("Contact bilgileri yüklenirken hata:", err);
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "idle", message: "" });

    // Validation
    if (!formData.anrede || formData.anrede.trim() === "") {
      setStatus({
        type: "error",
        message:
          lang === "tr"
            ? "Lütfen bir anrede seçin."
            : "Bitte wählen Sie eine Anrede.",
      });
      setIsSubmitting(false);
      return;
    }

    if (formData.name.trim().length < 2 || formData.name.trim().length > 200) {
      setStatus({
        type: "error",
        message:
          lang === "tr"
            ? "Ad 2-200 karakter olmalıdır."
            : "Name muss 2-200 Zeichen lang sein.",
      });
      setIsSubmitting(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setStatus({
        type: "error",
        message:
          lang === "tr"
            ? "Geçerli bir e-mail adresi girin."
            : "Bitte geben Sie eine gültige E-Mail-Adresse ein.",
      });
      setIsSubmitting(false);
      return;
    }

    if (
      formData.subject.trim().length < 3 ||
      formData.subject.trim().length > 200
    ) {
      setStatus({
        type: "error",
        message:
          lang === "tr"
            ? "Konu 3-200 karakter olmalıdır."
            : "Betreff muss 3-200 Zeichen lang sein.",
      });
      setIsSubmitting(false);
      return;
    }

    if (
      formData.message.trim().length < 10 ||
      formData.message.trim().length > 5000
    ) {
      setStatus({
        type: "error",
        message:
          lang === "tr"
            ? "Mesaj 10-5000 karakter olmalıdır."
            : "Nachricht muss 10-5000 Zeichen lang sein.",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await contactApi.submitContactMessage({
        anrede: formData.anrede,
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        subject: formData.subject,
        message: formData.message,
      });

      if (result.success) {
        setStatus({
          type: "success",
          message:
            lang === "tr"
              ? "Mesajınız başarıyla gönderildi! En kısa sürede size geri dönüş yapacağız."
              : "Ihre Nachricht wurde erfolgreich versendet! Wir werden uns so schnell wie möglich bei Ihnen melden.",
        });
        setFormData({
          anrede: "",
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
        setTimeout(() => setStatus({ type: "idle", message: "" }), 5000);
      } else {
        setStatus({
          type: "error",
          message:
            result.error ||
            (lang === "tr"
              ? "Bir hata oluştu."
              : "Ein Fehler ist aufgetreten."),
        });
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setStatus({
        type: "error",
        message:
          lang === "tr"
            ? "Mesaj gönderilemedi. Lütfen tekrar deneyin."
            : "Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es später.",
      });
    }

    setIsSubmitting(false);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const formatAddress = (address: Address) => {
    if (!address) return "";

    const streetPart = [address.street, address.houseNo]
      .filter(Boolean)
      .join(" ");
    const postalCityPart = [address.zipCode, address.city]
      .filter(Boolean)
      .join(" ");
    const statePart = address.state || "";
    const countryPart = address.country || "";

    return [streetPart, postalCityPart, statePart, countryPart]
      .filter(Boolean)
      .join(", ");
  };

  return (
    <div className="min-h-screen bg-slate-50 py-20 relative overflow-hidden selection:bg-teal-100 selection:text-teal-900">
      {/* Arka Plan Dekorasyonu */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-100/50 skew-x-12 transform translate-x-32 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-slate-900 mb-4 tracking-tight">
            {t("contact_title")}
          </h1>
          <div className="w-24 h-1.5 bg-gradient-to-r from-teal-500 to-teal-700 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto items-stretch">
          {/* --- SOL TARAF: MODERN FORM --- */}
          <div className="lg:col-span-7 order-2 lg:order-1 flex flex-col h-full">
            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden flex flex-col h-full relative group">
              {/* Üst Renk Çubuğu */}
              <div className="h-2 w-full bg-gradient-to-r from-teal-400 via-teal-600 to-teal-800"></div>

              <div className="p-8 md:p-12 flex flex-col h-full">
                <div className="mb-10">
                  <h3 className="text-3xl font-bold text-slate-800 mb-3 font-serif">
                    {lang === "tr"
                      ? "Bize Mesaj Gönderin"
                      : "Senden Sie uns eine Nachricht"}
                  </h3>
                  <p className="text-slate-500 font-medium">
                    {lang === "tr"
                      ? "Sorularınız veya önerileriniz için aşağıdaki formu doldurabilirsiniz."
                      : "Für Fragen oder Anregungen füllen Sie bitte das untenstehende Formular aus."}
                  </p>
                </div>

                {status.type === "success" ? (
                  <div className="flex-grow flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-300">
                    <div className="w-24 h-24 bg-teal-50 text-teal-500 rounded-full flex items-center justify-center mb-6 shadow-inner">
                      <CheckCircle size={48} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">
                      {lang === "tr" ? "Başarılı!" : "Erfolg!"}
                    </h3>
                    <p className="text-slate-500 mb-8 max-w-xs mx-auto">
                      {status.message}
                    </p>
                    <button
                      onClick={() => setStatus({ type: "idle", message: "" })}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-10 rounded-2xl transition-all shadow-lg active:scale-95"
                    >
                      {lang === "tr" ? "Yeni Mesaj" : "Neue Nachricht"}
                    </button>
                  </div>
                ) : (
                  <form
                    className="space-y-6 flex flex-col flex-grow"
                    onSubmit={handleSubmit}
                  >
                    {status.type !== "idle" && status.message && (
                      <div
                        className={`p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2 duration-300 ${
                          (status.type as "success" | "error") === "success"
                            ? "bg-teal-50 text-teal-800 border border-teal-100"
                            : "bg-red-50 text-red-800 border border-red-100"
                        }`}
                      >
                        {(status.type as "success" | "error") === "success" ? (
                          <CheckCircle size={20} />
                        ) : (
                          <AlertCircle size={20} />
                        )}
                        <p className="text-sm font-semibold">
                          {status.message}
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Anrede */}
                      <div className="relative group/input">
                        <select
                          id="anrede"
                          value={formData.anrede}
                          onChange={handleChange}
                          className="peer w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-slate-50/30 focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 outline-none transition-all appearance-none font-medium text-slate-700"
                          required
                        >
                          <option value="">{t("contact_form_anrede")}</option>
                          <option value="Bay">
                            {t("contact_form_anrede_mr")}
                          </option>
                          <option value="Bayan">
                            {t("contact_form_anrede_mrs")}
                          </option>
                          <option value="Diğer">
                            {t("contact_form_anrede_other")}
                          </option>
                        </select>
                        <User
                          className="absolute left-4 top-4 text-slate-400 group-focus-within/input:text-teal-600 transition-colors"
                          size={20}
                        />
                      </div>

                      {/* Name */}
                      <div className="relative group/input">
                        <input
                          type="text"
                          id="name"
                          value={formData.name}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("name")}
                          onBlur={() => setFocusedField(null)}
                          className="peer w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-slate-50/30 focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 outline-none transition-all font-medium text-slate-700"
                          required
                        />
                        <label
                          className={`absolute left-12 text-slate-400 pointer-events-none transition-all ${focusedField === "name" || formData.name ? "-top-2.5 left-10 text-xs font-bold text-teal-600 bg-white px-2" : "top-4 text-slate-400"}`}
                        >
                          {t("contact_form_name")}
                        </label>
                        <User
                          className="absolute left-4 top-4 text-slate-400 group-focus-within/input:text-teal-600 transition-colors"
                          size={20}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Email */}
                      <div className="relative group/input">
                        <input
                          type="email"
                          id="email"
                          value={formData.email}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("email")}
                          onBlur={() => setFocusedField(null)}
                          className="peer w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-slate-50/30 focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 outline-none transition-all font-medium text-slate-700"
                          required
                        />
                        <label
                          className={`absolute left-12 text-slate-400 pointer-events-none transition-all ${focusedField === "email" || formData.email ? "-top-2.5 left-10 text-xs font-bold text-teal-600 bg-white px-2" : "top-4 text-slate-400"}`}
                        >
                          {t("contact_form_email")}
                        </label>
                        <AtSign
                          className="absolute left-4 top-4 text-slate-400 group-focus-within/input:text-teal-600 transition-colors"
                          size={20}
                        />
                      </div>

                      {/* Phone */}
                      <div className="relative group/input">
                        <input
                          type="tel"
                          id="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          onFocus={() => setFocusedField("phone")}
                          onBlur={() => setFocusedField(null)}
                          className="peer w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-slate-50/30 focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 outline-none transition-all font-medium text-slate-700"
                        />
                        <label
                          className={`absolute left-12 text-slate-400 pointer-events-none transition-all ${focusedField === "phone" || formData.phone ? "-top-2.5 left-10 text-xs font-bold text-teal-600 bg-white px-2" : "top-4 text-slate-400"}`}
                        >
                          {t("contact_form_phone")}
                        </label>
                        <Phone
                          className="absolute left-4 top-4 text-slate-400 group-focus-within/input:text-teal-600 transition-colors"
                          size={20}
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div className="relative group/input">
                      <input
                        type="text"
                        id="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("subject")}
                        onBlur={() => setFocusedField(null)}
                        className="peer w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-slate-50/30 focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 outline-none transition-all font-medium text-slate-700"
                        required
                      />
                      <label
                        className={`absolute left-12 text-slate-400 pointer-events-none transition-all ${focusedField === "subject" || formData.subject ? "-top-2.5 left-10 text-xs font-bold text-teal-600 bg-white px-2" : "top-4 text-slate-400"}`}
                      >
                        {t("contact_form_subject")}
                      </label>
                      <MessageSquare
                        className="absolute left-4 top-4 text-slate-400 group-focus-within/input:text-teal-600 transition-colors"
                        size={20}
                      />
                    </div>

                    {/* Message */}
                    <div className="relative group/input flex-grow">
                      <textarea
                        id="message"
                        value={formData.message}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("message")}
                        onBlur={() => setFocusedField(null)}
                        className="peer w-full h-full min-h-[150px] pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-slate-50/30 focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/5 outline-none transition-all font-medium text-slate-700 resize-none"
                        required
                      ></textarea>
                      <label
                        className={`absolute left-12 text-slate-400 pointer-events-none transition-all ${focusedField === "message" || formData.message ? "-top-2.5 left-10 text-xs font-bold text-teal-600 bg-white px-2" : "top-4 text-slate-400"}`}
                      >
                        {t("contact_form_message")}
                      </label>
                      <MessageSquare
                        className="absolute left-4 top-4 text-slate-400 group-focus-within/input:text-teal-600 transition-colors"
                        size={20}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full font-bold py-5 rounded-2xl flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-xl ${
                        isSubmitting
                          ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                          : "bg-gradient-to-r from-teal-600 to-slate-900 text-white hover:shadow-teal-900/20 hover:-translate-y-1"
                      }`}
                    >
                      {isSubmitting ? (
                        <Loader2 size={24} className="animate-spin" />
                      ) : (
                        <>
                          <span className="text-lg">
                            {t("contact_form_send")}
                          </span>
                          <Send size={20} />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Info Side (Right) */}
          <div className="lg:col-span-5 order-1 lg:order-2 flex flex-col gap-6">
            <div className="bg-gradient-to-br from-kpf-teal to-teal-800 text-white p-10 rounded-3xl shadow-xl relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
              <div className="absolute bottom-10 left-10 w-20 h-20 bg-white/5 rounded-full group-hover:scale-125 transition-transform duration-700 delay-100"></div>

              <div className="absolute top-0 right-0 p-8 opacity-10">
                <MapPin size={120} />
              </div>

              <h3 className="text-2xl font-bold mb-8 relative z-10 font-serif">
                {lang === "tr" ? "İletişim Bilgileri" : "Kontaktdaten"}
              </h3>

              {loading && (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="animate-spin text-white" size={48} />
                </div>
              )}

              {!loading && error && (
                <div className="text-white/80 text-center py-10">
                  <p>
                    {lang === "tr"
                      ? "Bilgiler yüklenemedi"
                      : "Daten konnten nicht geladen werden"}
                  </p>
                </div>
              )}

              {!loading && !error && contactData && (
                <div className="space-y-8 relative z-10">
                  <div className="flex items-start gap-4 group/item">
                    <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm group-hover/item:bg-white/30 transition-colors">
                      <MapPin className="text-white" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1 opacity-80">
                        {lang === "tr" ? "Adres" : "Adresse"}
                      </h4>
                      <p className="text-white/90 leading-relaxed font-medium whitespace-pre-line">
                        {formatAddress(contactData.address)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group/item">
                    <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm group-hover/item:bg-white/30 transition-colors">
                      <Phone className="text-white" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1 opacity-80">
                        {t("contact_form_phone")}
                      </h4>
                      <p className="text-white/90 font-medium">
                        {contactData.phone}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 group/item">
                    <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm group-hover/item:bg-white/30 transition-colors">
                      <Mail className="text-white" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1 opacity-80">
                        E-Mail
                      </h4>
                      <p className="text-white/90 font-medium">
                        {contactData.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Google Maps Embed */}
            <div className="bg-gradient-to-br from-kpf-teal to-teal-800 rounded-3xl overflow-hidden h-[300px] relative border-4 border-white shadow-lg group">
              <iframe
                title={lang === "tr" ? "Konum Haritası" : "Standortkarte"}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2679.1265865217307!2d7.8450!3d48.0150!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4791b420b420b421%3A0x0!2sB%C3%B6cklerstra%C3%9Fe%203%2C%2079110%20Freiburg%20im%20Breisgau!5e0!3m2!1sde!2sde!4v1234567890"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="group-hover:scale-105 transition-transform duration-700"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
