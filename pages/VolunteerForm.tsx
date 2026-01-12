import React, { useState } from "react";
import { Heart, Mail, Phone, AlertCircle, CheckCircle } from "lucide-react";
import { Language } from "../types";

interface VolunteerFormProps {
  lang: Language;
}

const VolunteerForm: React.FC<VolunteerFormProps> = ({ lang }) => {
  const isGerman = lang === "de";
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    interest: "events",
    message: "",
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
    email: isGerman ? "E-Mail *" : "E-Mail *",
    phone: isGerman ? "Telefon" : "Telefon",
    interest: isGerman ? "Interessensgebiet *" : "İlgi Alanı *",
    interest_events: isGerman ? "Veranstaltungen" : "Etkinlik Organizasyonu",
    interest_projects: isGerman ? "Projektarbeit" : "Proje Çalışması",
    interest_community: isGerman ? "Gemeinschaftsarbeit" : "Toplum İçişleri",
    interest_other: isGerman ? "Sonstiges" : "Diğer",
    message: isGerman
      ? "Nachricht / Motivationsschreiben"
      : "Mesaj / Motivasyon Yazısı",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setSubmitted(true);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        interest: "events",
        message: "",
      });
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-kpf-red to-red-700 text-white py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
          <Heart size={300} />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <Heart className="text-white" size={40} />
            <h1 className="text-4xl md:text-5xl font-serif font-bold">
              {t.title}
            </h1>
          </div>
          <p className="text-red-100 text-lg">{t.subtitle}</p>
          <div className="w-24 h-1.5 bg-white/30 rounded-full mt-4"></div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        {submitted ? (
          <div className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl border-l-4 border-green-500 text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle size={64} className="text-green-500" />
            </div>
            <h2 className="text-3xl font-bold text-kpf-dark mb-4">
              {t.success_title}
            </h2>
            <p className="text-lg text-slate-700 mb-6">{t.success_message}</p>
            <div className="mt-8 pt-8 border-t border-green-200">
              <p className="text-slate-600 mb-3">{t.contact_info}</p>
              <div className="space-y-2 text-slate-700">
                <div className="flex items-center justify-center gap-2">
                  <Mail size={20} className="text-kpf-red" />
                  <span>info@kpf-freiburg.de</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Phone size={20} className="text-kpf-red" />
                  <span>+49 761 XXXXXXX</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Info Box */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg flex gap-3">
              <AlertCircle
                size={20}
                className="text-blue-600 flex-shrink-0 mt-0.5"
              />
              <p className="text-sm text-blue-800">{t.required_fields}</p>
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  {t.firstName}
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-red transition-all ${
                    errors.firstName
                      ? "border-red-500 focus:ring-red-500"
                      : "border-slate-300 focus:border-kpf-red"
                  }`}
                  placeholder={isGerman ? "Ihr Vorname" : "Adınız"}
                />
                {errors.firstName && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  {t.lastName}
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-red transition-all ${
                    errors.lastName
                      ? "border-red-500 focus:ring-red-500"
                      : "border-slate-300 focus:border-kpf-red"
                  }`}
                  placeholder={isGerman ? "Ihr Nachname" : "Soyadınız"}
                />
                {errors.lastName && (
                  <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Contact Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  {t.email}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-red transition-all ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "border-slate-300 focus:border-kpf-red"
                  }`}
                  placeholder="email@example.com"
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  {t.phone}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-red focus:border-kpf-red transition-all"
                  placeholder={isGerman ? "+49 ..." : "+49 ..."}
                />
              </div>
            </div>

            {/* Interest Field */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                {t.interest}
              </label>
              <select
                name="interest"
                value={formData.interest}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-red focus:border-kpf-red transition-all"
              >
                <option value="events">{t.interest_events}</option>
                <option value="projects">{t.interest_projects}</option>
                <option value="community">{t.interest_community}</option>
                <option value="other">{t.interest_other}</option>
              </select>
            </div>

            {/* Message Field */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                {t.message}
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-red focus:border-kpf-red transition-all resize-none"
                placeholder={
                  isGerman
                    ? "Erzählen Sie uns von Ihren Interessen..."
                    : "İlginiz hakkında bize anlatın..."
                }
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-kpf-red to-red-700 text-white px-8 py-3 rounded-lg font-bold hover:shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                {t.submit}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default VolunteerForm;
