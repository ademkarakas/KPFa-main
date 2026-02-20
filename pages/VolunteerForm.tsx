import React, { useState } from "react";
import {
  Heart,
  Mail,
  Phone,
  AlertCircle,
  CheckCircle,
  Send,
} from "lucide-react";
import { Language } from "../types";
import { newsletterApi } from "../services/newsletterApi";
import { volunteersApi } from "../services/api";

interface VolunteerFormProps {
  lang: Language;
}

const VolunteerForm: React.FC<VolunteerFormProps> = ({ lang }) => {
  const isGerman = lang === "de";
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    interest: "events",
    message: "",
    subscribeToNewsletter: false,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const t = {
    title: isGerman ? "Freiwilligenformular" : "Gönüllü Başvuru Formu",
    subtitle: isGerman
      ? "Treten Sie unserem Freiwilligenteam bei"
      : "Gönüllü Ekibimize Katılın",
    form_title: isGerman ? "Bewerbungsformular" : "Başvuru Formu",
    firstName: isGerman ? "Vorname *" : "Ad *",
    lastName: isGerman ? "Nachname *" : "Soyadı *",
    email: isGerman ? "E-Mail *" : "E-Posta *",
    phone: isGerman ? "Telefon" : "Telefon Numarası",
    interest: isGerman ? "Interessensgebiet *" : "İlgi Alanı *",
    interest_events: isGerman ? "Veranstaltungen" : "Etkinlik Organizasyonu",
    interest_projects: isGerman ? "Projektarbeit" : "Proje Çalışması",
    interest_community: isGerman ? "Gemeinschaftsarbeit" : "Toplum İçişleri",
    interest_other: isGerman ? "Sonstiges" : "Diğer",
    message: isGerman
      ? "Nachricht / Motivationsschreiben"
      : "Mesaj / Motivasyon Yazısı",
    newsletter_subscribe: isGerman
      ? "Ich möchte den Newsletter erhalten"
      : "Bülten almak istiyorum",
    newsletter_info: isGerman
      ? "Bleiben Sie über unsere Aktivitäten und Veranstaltungen informiert"
      : "Etkinlikler ve faaliyetlerimizden haberdar olun",
    submit: isGerman ? "Abschicken" : "Gönder",
    required_fields: isGerman
      ? "Alle mit * gekennzeichneten Felder sind erforderlich"
      : "* ile işaretlenmiş alanlar gereklidir",
    error_required: isGerman
      ? "Dieses Feld ist erforderlich"
      : "Bu alan gereklidir",
    error_email: isGerman
      ? "Bitte geben Sie eine gültige E-Mail-Adresse ein"
      : "Lütfen geçerli bir e-mail adresi girin",
    error_submit: isGerman
      ? "Fehler beim Senden der Bewerbung. Bitte versuchen Sie es erneut."
      : "Başvuru gönderilirken hata oluştu. Lütfen tekrar deneyin.",
    success_title: isGerman
      ? "Vielen Dank für Ihre Bewerbung!"
      : "Başvurunuz İçin Teşekkür Ederiz!",
    success_message: isGerman
      ? "Wir werden uns in Kürze mit Ihnen in Verbindung setzen. Vielen Dank für Ihr Interesse, unser Freiwilligenteam zu unterstützen!"
      : "Kısa sürede sizinle iletişime geçeceğiz. Gönüllü ekibimizi desteklemeye gösterdiğiniz ilgi için teşekkür ederiz!",
    contact_info: isGerman
      ? "Oder kontaktieren Sie uns direkt:"
      : "Veya doğrudan bizimle iletişime geçin:",
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = t.error_required;
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = t.error_required;
    }
    if (!formData.email.trim()) {
      newErrors.email = t.error_required;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t.error_email;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      // Send volunteer submission via volunteersApi
      await volunteersApi.submit({
        fullName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone || "",
        message: `${isGerman ? "Interessensgebiet" : "İlgi Alanı"}: ${formData.interest}\n\n${formData.message}`,
      });

      // Subscribe to newsletter if checkbox is checked
      if (formData.subscribeToNewsletter) {
        try {
          const result = await newsletterApi.subscribe(
            formData.email,
            `${formData.firstName} ${formData.lastName}`,
          );
          if (result.success) {
            console.log("Newsletter subscription successful");
          }
        } catch (err) {
          console.error("Newsletter subscription error:", err);
          // Don't block the main flow if newsletter subscription fails
        }
      }

      // Success!
      setSubmitted(true);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        interest: "events",
        message: "",
        subscribeToNewsletter: false,
      });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error: any) {
      console.error("Error sending volunteer submission:", error);
      setSubmitError(error.message || t.error_submit);
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* --- HEADER (HERO) --- */}
      <div className="bg-gradient-to-br from-teal-600 via-teal-700 to-slate-900 text-white py-20 relative overflow-hidden">
        {/* Dekoratif Arka Plan */}
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none translate-x-1/4 -translate-y-1/4">
          <Heart size={400} fill="currentColor" />
        </div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2"></div>

        <div className="container mx-auto px-4 relative z-10 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/20 shadow-xl">
              <Heart className="text-white" size={40} fill="currentColor" />
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-tight mb-3">
                {t.title}
              </h1>
              <p className="text-teal-50/80 text-lg md:text-xl font-light max-w-2xl">
                {t.subtitle}
              </p>
            </div>
          </div>
          <div className="w-20 h-1.5 bg-teal-400 rounded-full mt-8 md:ml-2"></div>
        </div>
      </div>

      {/* --- CONTENT --- */}
      <div className="container mx-auto px-4 -mt-12 pb-20 relative z-20">
        <div className="max-w-3xl mx-auto">
          {submitted ? (
            /* BAŞARI MESAJI */
            <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 md:p-16 text-center border border-teal-50 animate-in fade-in zoom-in duration-500">
              <div className="w-24 h-24 bg-teal-50 text-teal-500 rounded-full flex items-center justify-center mb-8 mx-auto shadow-inner">
                <CheckCircle size={56} strokeWidth={1.5} />
              </div>
              <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">
                {t.success_title}
              </h2>
              <p className="text-lg text-slate-500 mb-10 leading-relaxed">
                {t.success_message}
              </p>

              <div className="pt-10 border-t border-slate-100 space-y-4">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
                  {t.contact_info}
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-6">
                  <a
                    href="mailto:info@kulturplattformfreiburg.org"
                    className="flex items-center gap-3 text-slate-700 hover:text-teal-600 transition-colors font-medium"
                  >
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                      <Mail size={18} />
                    </div>
                    info@kulturplattformfreiburg.org
                  </a>
                  <a
                    href="tel:+49761000000"
                    className="flex items-center gap-3 text-slate-700 hover:text-teal-600 transition-colors font-medium"
                  >
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                      <Phone size={18} />
                    </div>
                    +49 761 XXXXXXX
                  </a>
                </div>
              </div>
            </div>
          ) : (
            /* FORM */
            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100 transition-all">
              {/* Form Üst Şeridi */}
              <div className="h-2 w-full bg-gradient-to-r from-teal-400 via-teal-600 to-slate-800"></div>

              <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
                {/* Bilgi Kutusu */}
                <div className="bg-teal-50/50 border border-teal-100 p-5 rounded-2xl flex gap-4 items-center">
                  <AlertCircle size={24} className="text-teal-600 shrink-0" />
                  <p className="text-sm text-teal-900 font-medium">
                    {t.required_fields}
                  </p>
                </div>

                {/* İsim Alanları */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="relative group">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1 group-focus-within:text-teal-600 transition-colors">
                      {t.firstName} *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full px-5 py-4 bg-slate-50/50 border rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-500/5 focus:bg-white transition-all font-medium ${
                        errors.firstName
                          ? "border-red-300 ring-red-500/5"
                          : "border-slate-200 focus:border-teal-500"
                      }`}
                      placeholder={isGerman ? "Ihr Vorname" : "Adınız"}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-xs mt-2 ml-1 font-medium">
                        {errors.firstName}
                      </p>
                    )}
                  </div>

                  <div className="relative group">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1 group-focus-within:text-teal-600 transition-colors">
                      {t.lastName} *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full px-5 py-4 bg-slate-50/50 border rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-500/5 focus:bg-white transition-all font-medium ${
                        errors.lastName
                          ? "border-red-300 ring-red-500/5"
                          : "border-slate-200 focus:border-teal-500"
                      }`}
                      placeholder={isGerman ? "Ihr Nachname" : "Soyadınız"}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-xs mt-2 ml-1 font-medium">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                {/* İletişim Alanları */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="relative group">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1 group-focus-within:text-teal-600 transition-colors">
                      {t.email} *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-5 py-4 bg-slate-50/50 border rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-500/5 focus:bg-white transition-all font-medium ${
                        errors.email
                          ? "border-red-300 ring-red-500/5"
                          : "border-slate-200 focus:border-teal-500"
                      }`}
                      placeholder="email@example.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-2 ml-1 font-medium">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div className="relative group">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1 group-focus-within:text-teal-600 transition-colors">
                      {t.phone}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500 focus:bg-white transition-all font-medium"
                      placeholder="+49 ..."
                    />
                  </div>
                </div>

                {/* İlgi Alanı - Modern Select */}
                <div className="relative group">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1 group-focus-within:text-teal-600 transition-colors">
                    {t.interest}
                  </label>
                  <div className="relative">
                    <select
                      name="interest"
                      value={formData.interest}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500 focus:bg-white transition-all font-medium appearance-none"
                    >
                      <option value="events">{t.interest_events}</option>
                      <option value="projects">{t.interest_projects}</option>
                      <option value="community">{t.interest_community}</option>
                      <option value="other">{t.interest_other}</option>
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <CheckCircle size={18} /> {/* Veya aşağı ok ikonu */}
                    </div>
                  </div>
                </div>

                {/* Mesaj Alanı */}
                <div className="relative group">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 ml-1 group-focus-within:text-teal-600 transition-colors">
                    {t.message}
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-5 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-500/5 focus:border-teal-500 focus:bg-white transition-all font-medium resize-none"
                    placeholder={
                      isGerman
                        ? "Erzählen Sie uns mehr..."
                        : "Bize daha fazlasını anlatın..."
                    }
                  ></textarea>
                </div>

                {/* Newsletter Checkbox */}
                <div className="bg-gradient-to-br from-teal-50/50 to-slate-50/50 border border-teal-100/50 p-6 rounded-2xl">
                  <label
                    htmlFor="subscribeToNewsletter"
                    className="flex items-start gap-4 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      id="subscribeToNewsletter"
                      name="subscribeToNewsletter"
                      checked={formData.subscribeToNewsletter}
                      onChange={handleChange}
                      className="mt-1 w-5 h-5 rounded-lg border-2 border-teal-300 text-teal-600 focus:ring-4 focus:ring-teal-500/20 transition-all cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Mail size={18} className="text-teal-600" />
                        <span className="font-bold text-slate-800 group-hover:text-teal-600 transition-colors">
                          {t.newsletter_subscribe}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600">
                        {t.newsletter_info}
                      </p>
                    </div>
                  </label>
                </div>

                {/* Error Message */}
                {submitError && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex items-start gap-3">
                    <AlertCircle
                      size={20}
                      className="text-red-600 flex-shrink-0 mt-0.5"
                    />
                    <p className="text-red-700 text-sm font-medium">
                      {submitError}
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-teal-600 to-slate-900 text-white px-8 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-teal-900/20 transition-all transform hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>
                        {isGerman ? "Wird gesendet..." : "Gönderiliyor..."}
                      </span>
                    </>
                  ) : (
                    <>
                      <span>{t.submit}</span>
                      <Send
                        size={20}
                        className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                      />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VolunteerForm;
