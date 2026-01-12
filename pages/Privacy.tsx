import React from "react";
import { Shield, Lock, Eye, FileText } from "lucide-react";
import { Language } from "../types";

interface PrivacyProps {
  lang: Language;
}

const Privacy: React.FC<PrivacyProps> = ({ lang }) => {
  const isGerman = lang === "de";

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-kpf-teal to-teal-700 text-white py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
          <Shield size={200} />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <Lock className="text-white" size={40} />
            <h1 className="text-4xl md:text-5xl font-serif font-bold">
              {isGerman ? "Datenschutzerklärung" : "Gizlilik Politikası"}
            </h1>
          </div>
          <div className="w-24 h-1.5 bg-white/30 rounded-full"></div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="space-y-12">
          {/* Introduction */}
          <section className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
            <h2 className="text-2xl font-bold text-kpf-dark mb-4 flex items-center gap-3">
              <Eye size={24} className="text-kpf-teal" />
              {isGerman
                ? "Überblick über den Datenschutz"
                : "Veri Koruması Özeti"}
            </h2>
            <p className="text-slate-700 leading-relaxed">
              {isGerman
                ? "KulturPlattform Freiburg e.V. nimmt den Schutz Ihrer persönlichen Daten sehr ernst. Diese Datenschutzerklärung erläutert, wie wir Ihre Informationen sammeln, verwenden und schützen."
                : "KulturPlattform Freiburg e.V. kişisel verilerinizin korunmasını çok ciddi alır. Bu gizlilik politikası, verilerinizi nasıl topladığımızı, kullandığımızı ve koruduğumuzu açıklar."}
            </p>
          </section>

          {/* 1. Data Collection */}
          <section>
            <h2 className="text-2xl font-bold text-kpf-dark mb-4">
              {isGerman ? "1. Datenerfassung" : "1. Veri Toplama"}
            </h2>
            <div className="space-y-4 text-slate-700">
              <p>
                {isGerman
                  ? "Wir erfassen Informationen, die Sie uns freiwillig zur Verfügung stellen, z.B.:"
                  : "Gönüllü olarak bize sağladığınız bilgileri toplarız:"}
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  {isGerman
                    ? "Kontaktinformationen (Name, E-Mail, Telefonnummer)"
                    : "İletişim Bilgileri (Ad, E-posta, Telefon)"}
                </li>
                <li>
                  {isGerman
                    ? "Kurse und Veranstaltungsanmeldungen"
                    : "Kurs ve Etkinlik Kayıtları"}
                </li>
                <li>
                  {isGerman
                    ? "Nachrichten und Anfragen über unsere Kontaktformulare"
                    : "İletişim Formları aracılığıyla iletilen Mesajlar"}
                </li>
                <li>{isGerman ? "Spendendaten" : "Bağış Bilgileri"}</li>
              </ul>
            </div>
          </section>

          {/* 2. Data Usage */}
          <section>
            <h2 className="text-2xl font-bold text-kpf-dark mb-4">
              {isGerman ? "2. Datennutzung" : "2. Veri Kullanımı"}
            </h2>
            <div className="space-y-4 text-slate-700">
              <p>
                {isGerman
                  ? "Ihre Daten werden verwendet für:"
                  : "Verileriniz aşağıdaki amaçlar için kullanılır:"}
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  {isGerman
                    ? "Beantwortung von Anfragen und Bereitstellung von Kundenservice"
                    : "Soruların Yanıtlanması ve Müşteri Hizmetinin Sağlanması"}
                </li>
                <li>
                  {isGerman
                    ? "Versand von Veranstaltungs- und Kursinformationen"
                    : "Etkinlik ve Kurs Bilgilerinin Gönderilmesi"}
                </li>
                <li>
                  {isGerman
                    ? "Verbesserung unserer Dienstleistungen"
                    : "Hizmetlerimizin İyileştirilmesi"}
                </li>
                <li>
                  {isGerman
                    ? "Einhaltung gesetzlicher Verpflichtungen"
                    : "Yasal Yükümlülüklerin Yerine Getirilmesi"}
                </li>
              </ul>
            </div>
          </section>

          {/* 3. Data Protection */}
          <section>
            <h2 className="text-2xl font-bold text-kpf-dark mb-4">
              {isGerman ? "3. Datenschutz" : "3. Veri Koruması"}
            </h2>
            <div className="space-y-4 text-slate-700">
              <p>
                {isGerman
                  ? "Wir implementieren angemessene technische und organisatorische Maßnahmen zum Schutz Ihrer Daten vor unbefugtem Zugriff, Alteration oder Offenlegung."
                  : "Verilerinizi yetkisiz erişim, değiştirilme veya açıklanmaya karşı korumak için uygun teknik ve yönetimsel önlemler alırız."}
              </p>
            </div>
          </section>

          {/* 4. Data Retention */}
          <section>
            <h2 className="text-2xl font-bold text-kpf-dark mb-4">
              {isGerman ? "4. Datenspeicherung" : "4. Veri Saklama"}
            </h2>
            <div className="space-y-4 text-slate-700">
              <p>
                {isGerman
                  ? "Wir bewahren Ihre persönlichen Daten nur so lange auf, wie es notwendig ist, um die Zwecke zu erfüllen, für die sie erfasst wurden, oder wie gesetzlich erforderlich."
                  : "Kişisel verilerinizi yalnızca gerekli olan süre boyunca veya yasal olarak gerekli olan sürece saklarız."}
              </p>
            </div>
          </section>

          {/* 5. Your Rights */}
          <section>
            <h2 className="text-2xl font-bold text-kpf-dark mb-4">
              {isGerman ? "5. Ihre Rechte" : "5. Haklarınız"}
            </h2>
            <div className="space-y-4 text-slate-700">
              <p>
                {isGerman
                  ? "Sie haben das Recht zu erfahren, welche Daten wir von Ihnen speichern, und können:"
                  : "Hakkınız olan işlemler:"}
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>
                  {isGerman
                    ? "Zugang zu Ihren Daten anfordern"
                    : "Verilerinize erişim talebinde bulunmak"}
                </li>
                <li>
                  {isGerman
                    ? "Korrektur oder Löschung Ihrer Daten beantragen"
                    : "Verilerinizin Düzeltilmesini veya Silinmesini İsteme"}
                </li>
                <li>
                  {isGerman
                    ? "Der Verarbeitung widersprechen"
                    : "İşlenmeye İtiraz Etme"}
                </li>
              </ul>
            </div>
          </section>

          {/* 6. Contact */}
          <section className="bg-kpf-teal/10 p-8 rounded-2xl border border-kpf-teal/20">
            <h2 className="text-2xl font-bold text-kpf-dark mb-4">
              {isGerman ? "6. Kontakt" : "6. İletişim"}
            </h2>
            <p className="text-slate-700 mb-4">
              {isGerman
                ? "Für Fragen zu dieser Datenschutzerklärung oder zum Ausüben Ihrer Rechte wenden Sie sich bitte an:"
                : "Bu gizlilik politikası hakkında sorularınız veya haklarınızı kullanmak için lütfen iletişime geçin:"}
            </p>
            <div className="space-y-2 text-slate-700">
              <p>
                <strong>KulturPlattform Freiburg e.V.</strong>
              </p>
              <p>Böcklerstraße 3</p>
              <p>79110 Freiburg im Breisgau</p>
              <p>Email: info@kulturplattformfreiburg.org</p>
            </div>
          </section>

          {/* Last Updated */}
          <div className="text-center text-slate-500 text-sm pt-8 border-t border-slate-200">
            <p>
              {isGerman ? "Zuletzt aktualisiert:" : "Son Güncelleme:"}{" "}
              {new Date().toLocaleDateString(isGerman ? "de-DE" : "tr-TR")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
