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
  Clock,
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
  const [status, setStatus] = useState<
    { type: ""; message: "" } | { type: "success" | "error"; message: string }
  >({
    type: "",
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

  const t = (key: string) => TEXTS[key][lang];

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    // Validation
    if (formData.name.trim().length < 3 || formData.name.trim().length > 200) {
      setStatus({
        type: "error",
        message:
          lang === "tr"
            ? "Ad 3-200 karakter olmalıdır."
            : "Name must be 3-200 characters.",
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
            : "Please enter a valid email.",
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
            : "Subject must be 3-200 characters.",
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
            : "Message must be 10-5000 characters.",
      });
      setIsSubmitting(false);
      return;
    }

    const result = await contactApi.submitContactMessage(formData);

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
      setTimeout(() => setStatus({ type: "", message: "" }), 5000);
    } else {
      setStatus({
        type: "error",
        message:
          result.error ||
          (lang === "tr" ? "Bir hata oluştu." : "An error occurred."),
      });
    }

    setIsSubmitting(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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
    <div className="min-h-screen bg-slate-50 py-20 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-100/50 skew-x-12 transform translate-x-32"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-kpf-teal/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-serif font-bold text-kpf-dark mb-4">
            {t("contact_title")}
          </h1>
          <div className="w-24 h-1.5 bg-kpf-teal mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-6xl mx-auto">
          {/* Form Side (Left) */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div className="bg-white rounded-3xl shadow-xl border-0 h-full relative overflow-hidden group">
              <div className="h-2 w-full bg-gradient-to-r from-kpf-teal via-teal-400 to-kpf-teal"></div>

              <div className="p-10 md:p-12">
                <h3 className="text-3xl font-bold text-slate-800 mb-2 font-serif">
                  {lang === "tr"
                    ? "Bize Mesaj Gönderin"
                    : "Senden Sie uns eine Nachricht"}
                </h3>
                <p className="text-slate-500 mb-10">
                  {lang === "tr"
                    ? "Sorularınız veya önerileriniz için aşağıdaki formu doldurabilirsiniz."
                    : "Für Fragen oder Anregungen füllen Sie bitte das untenstehende Formular aus."}
                </p>

                {status.type === "success" ? (
                  <div className="absolute inset-0 bg-white z-20 flex flex-col items-center justify-center p-8 text-center animate-fade-in-up">
                    <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-sm">
                      <CheckCircle size={48} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">
                      {lang === "tr" ? "Başarılı!" : "Erfolg!"}
                    </h3>
                    <p className="text-slate-500 mb-8 max-w-xs mx-auto">
                      {status.message}
                    </p>
                    <button
                      onClick={() => setStatus({ type: "", message: "" })}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 px-8 rounded-xl transition-colors"
                    >
                      {lang === "tr"
                        ? "Yeni Mesaj Gönder"
                        : "Neue Nachricht senden"}
                    </button>
                  </div>
                ) : (
                  <form className="space-y-8" onSubmit={handleSubmit}>
                    {status.message && (
                      <div
                        className={`p-4 rounded-xl flex items-start gap-3 ${
                          status.type === "success"
                            ? "bg-green-50 border border-green-200 text-green-800"
                            : "bg-red-50 border border-red-200 text-red-800"
                        }`}
                      >
                        <div className="flex-shrink-0 mt-0.5">
                          {status.type === "success" ? (
                            <CheckCircle size={20} />
                          ) : (
                            <AlertCircle size={20} />
                          )}
                        </div>
                        <p className="text-sm font-medium">{status.message}</p>
                      </div>
                    )}
                    <div className="space-y-8">
                      <div className="relative group">
                        <div className="absolute left-4 top-4 text-slate-400 group-focus-within:text-kpf-teal transition-colors">
                          <User size={20} />
                        </div>
                        <select
                          id="anrede"
                          value={formData.anrede}
                          onChange={handleChange}
                          className="peer w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-kpf-teal focus:ring-4 focus:ring-teal-500/10 outline-none transition-all"
                          required
                        >
                          <option value="">
                            {lang === "tr" ? "Anrede seçin" : "Anrede wählen"}
                          </option>
                          {lang === "tr" ? (
                            <>
                              <option value="Sayın">Sayın</option>
                              <option value="Hanım">Hanım</option>
                            </>
                          ) : (
                            <>
                              <option value="Herr">Herr</option>
                              <option value="Frau">Frau</option>
                            </>
                          )}
                        </select>
                        <label
                          htmlFor="anrede"
                          className="absolute left-12 -top-2.5 bg-white px-2 text-xs font-bold text-slate-400 peer-focus:text-kpf-teal transition-all cursor-text pointer-events-none"
                        >
                          {lang === "tr" ? "Anrede" : "Anrede"}
                        </label>
                      </div>

                      <div className="relative group">
                        <div className="absolute left-4 top-4 text-slate-400 group-focus-within:text-kpf-teal transition-colors">
                          <User size={20} />
                        </div>
                        <input
                          type="text"
                          id="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="peer w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-kpf-teal focus:ring-4 focus:ring-teal-500/10 outline-none transition-all placeholder-transparent"
                          placeholder={t("contact_form_name")}
                          required
                        />
                        <label
                          htmlFor="name"
                          className="absolute left-12 -top-2.5 bg-white px-2 text-xs font-bold text-slate-400 peer-focus:text-kpf-teal peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-4 peer-placeholder-shown:bg-transparent transition-all cursor-text pointer-events-none"
                        >
                          {t("contact_form_name")}
                        </label>
                      </div>

                      <div className="relative group">
                        <div className="absolute left-4 top-4 text-slate-400 group-focus-within:text-kpf-teal transition-colors">
                          <AtSign size={20} />
                        </div>
                        <input
                          type="email"
                          id="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="peer w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-kpf-teal focus:ring-4 focus:ring-teal-500/10 outline-none transition-all placeholder-transparent"
                          placeholder={t("contact_form_email")}
                          required
                        />
                        <label
                          htmlFor="email"
                          className="absolute left-12 -top-2.5 bg-white px-2 text-xs font-bold text-slate-400 peer-focus:text-kpf-teal peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-4 peer-placeholder-shown:bg-transparent transition-all cursor-text pointer-events-none"
                        >
                          {t("contact_form_email")}
                        </label>
                      </div>

                      <div className="relative group">
                        <div className="absolute left-4 top-4 text-slate-400 group-focus-within:text-kpf-teal transition-colors">
                          <Phone size={20} />
                        </div>
                        <input
                          type="tel"
                          id="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="peer w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-kpf-teal focus:ring-4 focus:ring-teal-500/10 outline-none transition-all placeholder-transparent"
                          placeholder={
                            lang === "tr"
                              ? "Telefon (isteğe bağlı)"
                              : "Telefon (optional)"
                          }
                        />
                        <label
                          htmlFor="phone"
                          className="absolute left-12 -top-2.5 bg-white px-2 text-xs font-bold text-slate-400 peer-focus:text-kpf-teal peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-4 peer-placeholder-shown:bg-transparent transition-all cursor-text pointer-events-none"
                        >
                          {lang === "tr" ? "Telefon" : "Telefon"}
                        </label>
                      </div>

                      <div className="relative group">
                        <div className="absolute left-4 top-4 text-slate-400 group-focus-within:text-kpf-teal transition-colors">
                          <MessageSquare size={20} />
                        </div>
                        <input
                          type="text"
                          id="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          className="peer w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-kpf-teal focus:ring-4 focus:ring-teal-500/10 outline-none transition-all placeholder-transparent"
                          placeholder={lang === "tr" ? "Konu" : "Betreff"}
                          required
                        />
                        <label
                          htmlFor="subject"
                          className="absolute left-12 -top-2.5 bg-white px-2 text-xs font-bold text-slate-400 peer-focus:text-kpf-teal peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-4 peer-placeholder-shown:bg-transparent transition-all cursor-text pointer-events-none"
                        >
                          {lang === "tr" ? "Konu" : "Betreff"}
                        </label>
                      </div>
                    </div>

                    <div className="relative group">
                      <div className="absolute left-4 top-4 text-slate-400 group-focus-within:text-kpf-teal transition-colors">
                        <MessageSquare size={20} />
                      </div>
                      <textarea
                        id="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={8}
                        className="peer w-full pl-12 pr-4 py-4 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-kpf-teal focus:ring-4 focus:ring-teal-500/10 outline-none transition-all placeholder-transparent resize-none"
                        placeholder={t("contact_form_message")}
                        required
                      ></textarea>
                      <label
                        htmlFor="message"
                        className="absolute left-12 -top-2.5 bg-white px-2 text-xs font-bold text-slate-400 peer-focus:text-kpf-teal peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-4 peer-placeholder-shown:bg-transparent transition-all cursor-text pointer-events-none"
                      >
                        {t("contact_form_message")}
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full font-bold py-4 rounded-xl flex items-center justify-center gap-3 group active:scale-[0.98] transition-all ${
                        isSubmitting
                          ? "bg-slate-300 text-slate-600 cursor-not-allowed"
                          : "bg-gradient-to-r from-kpf-teal to-teal-800 text-white hover:shadow-lg hover:shadow-teal-800/20 hover:-translate-y-0.5"
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={20} className="animate-spin" />
                          <span className="text-lg">
                            {lang === "tr"
                              ? "Gönderiliyor..."
                              : "Wird übermittelt..."}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="text-lg">
                            {t("contact_form_send")}
                          </span>
                          <Send
                            size={20}
                            className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform"
                          />
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

              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="animate-spin text-white" size={48} />
                </div>
              ) : error ? (
                <div className="text-white/80 text-center py-10">
                  <p>
                    {lang === "tr"
                      ? "Bilgiler yüklenemedi"
                      : "Daten konnten nicht geladen werden"}
                  </p>
                </div>
              ) : contactData ? (
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
                        {lang === "tr" ? "Telefon" : "Telefon"}
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

                  {/* {contactData.officeHours && (
                    <div className="flex items-start gap-4 group/item">
                      <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm group-hover/item:bg-white/30 transition-colors">
                        <Clock className="text-white" size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-1 opacity-80">
                          {lang === "tr"
                            ? "Çalışma Saatleri"
                            : "Öffnungszeiten"}
                        </h4>
                        <p className="text-white/90 font-medium whitespace-pre-line">
                          {lang === "tr"
                            ? contactData.officeHours.turkish
                            : contactData.officeHours.german}
                        </p>
                      </div>
                    </div>
                  )} */}
                </div>
              ) : null}
            </div>

            {/* Google Maps Embed */}
            <div className="bg-gradient-to-br from-kpf-teal to-teal-800 rounded-3xl overflow-hidden h-[300px] relative border-4 border-white shadow-lg group">
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
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
