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
} from "lucide-react";
import { Language } from "../types";
import { TEXTS } from "../constants";
import { contactInfoApi } from "@/services/api";

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
  const [isSent, setIsSent] = useState(false);
  const [contactData, setContactData] = useState<ContactData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
    console.log("Form submitted");
    setTimeout(() => {
      setIsSent(true);
    }, 500);
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

                {isSent ? (
                  <div className="absolute inset-0 bg-white z-20 flex flex-col items-center justify-center p-8 text-center animate-fade-in-up">
                    <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-6 shadow-sm">
                      <CheckCircle size={48} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">
                      {t("contact_success")}
                    </h3>
                    <p className="text-slate-500 mb-8 max-w-xs mx-auto">
                      {lang === "tr"
                        ? "Mesajınız tarafımıza ulaşmıştır. En kısa sürede size geri dönüş yapacağız."
                        : "Ihre Nachricht ist bei uns eingegangen. Wir werden uns so schnell wie möglich bei Ihnen melden."}
                    </p>
                    <button
                      onClick={() => setIsSent(false)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 px-8 rounded-xl transition-colors"
                    >
                      {lang === "tr"
                        ? "Yeni Mesaj Gönder"
                        : "Neue Nachricht senden"}
                    </button>
                  </div>
                ) : (
                  <form className="space-y-8" onSubmit={handleSubmit}>
                    <div className="space-y-8">
                      <div className="relative group">
                        <div className="absolute left-4 top-4 text-slate-400 group-focus-within:text-kpf-teal transition-colors">
                          <User size={20} />
                        </div>
                        <input
                          type="text"
                          id="name"
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
                    </div>

                    <div className="relative group">
                      <div className="absolute left-4 top-4 text-slate-400 group-focus-within:text-kpf-teal transition-colors">
                        <MessageSquare size={20} />
                      </div>
                      <textarea
                        id="message"
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
                      className="w-full bg-gradient-to-r from-kpf-teal to-teal-800 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-teal-800/20 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3 group active:scale-[0.98]"
                    >
                      <span className="text-lg">{t("contact_form_send")}</span>
                      <Send
                        size={20}
                        className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform"
                      />
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
