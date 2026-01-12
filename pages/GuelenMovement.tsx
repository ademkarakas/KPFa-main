import React from "react";
import { BookOpen, Heart, Globe, Lightbulb, Users, Quote } from "lucide-react";
import { Language } from "../types";

interface GuelenMovementProps {
  lang: Language;
}

const GuelenMovement: React.FC<GuelenMovementProps> = ({ lang }) => {
  const isGerman = lang === "de";

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-kpf-teal to-teal-700 text-white py-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
          <Globe size={300} />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <Heart className="text-white" size={40} />
            <h1 className="text-4xl md:text-5xl font-serif font-bold">
              {isGerman ? "Über die Gülen-Bewegung" : "Gülen Hareketi Hakkında"}
            </h1>
          </div>
          <p className="text-teal-100 text-lg">
            {isGerman
              ? "Die Gülen-Bewegung und die Wissenschaft"
              : "Gülen Hareketi ve Bilim"}
          </p>
          <div className="w-24 h-1.5 bg-white/30 rounded-full mt-4"></div>
        </div>
      </div>

      {/* Meta Info */}
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 py-8 border-b border-slate-200">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-2 text-slate-700">
            <p className="font-semibold">Dr. Michael Blume – 27.05.2009</p>
            <p className="text-sm">
              {isGerman
                ? "Internationale Konferenz: Muslime zwischen Tradition und Moderne"
                : "Uluslararası Konferans: İslam Gelenekle Modernite Arasında"}
            </p>
            <p className="text-sm italic">
              {isGerman
                ? "Institut für Religionswissenschaft der Universität Potsdam"
                : "Potsdam Üniversitesi Din Bilimleri Enstitüsü"}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="space-y-12">
          {/* Summary */}
          <section className="bg-gradient-to-br from-kpf-teal/5 to-teal-100/10 p-8 rounded-2xl border-l-4 border-kpf-teal">
            <h2 className="text-3xl font-bold text-kpf-dark mb-6">
              {isGerman ? "Zusammenfassung" : "Özet"}
            </h2>
            <div className="space-y-4 text-slate-700 leading-relaxed">
              <p>
                {isGerman
                  ? "Gelehrte monotheistischer Religionen betonen regelmäßig, dass es zwischen den Erkenntnissen von Religion und Wissenschaft letztlich keinen Widerspruch, sondern allenfalls zeitliche Missverständnisse oder ideologischen Missbrauch geben könne."
                  : "Tek tanrılı dinlerin alimler düzenli olarak din ve bilimden gelen bulgular arasında hiçbir çelişki olmadığını, yalnızca geçici yanlış anlamalarlar veya ideolojik suistimalin olabileceğini vurgularlar."}
              </p>
              <p>
                {isGerman
                  ? "Unter den besonderen Bedingungen der religionsfeindlichen Politik der frühen, türkisch-nationalistischen Staatseliten hat der islamische Prediger Fethullah Gülen diese Position nicht nur bekräftigt, sondern seinen Anhängern wiederholt empfohlen, ihr Engagement auf die Förderung von Bildung und Wissenschaft in der Türkei und dann weltweit zu konzentrieren."
                  : "İslami vaiz Fethullah Gülen, erken Türk milliyetçi devlet elitlerinin dine düşmanlık politikası altında sadece bu pozisyonu pekiştirmekle kalmamış, takipçilerine eğitim ve bilimin Türkiye'de ve sonra dünya çapında terciş edilmesine odaklanmasını defalarca tavsiye etmiştir."}
              </p>
              <p>
                {isGerman
                  ? "Die Bejahung rationaler Erkenntnis und disziplinierter Lebensführung soll dabei durch eine intensive, auch im Dialog mit anderen Religionen zu pflegende Spiritualität, der moderne Individualismus durch religiöse Gemeinschaft ausbalanciert werden."
                  : "Rasyonel bilginin ve disiplinli yaşam yürütmesinin onaylanması, diğer dinlerle diyalogda da geliştirilebilecek yoğun bir maneviyat ile dengelenecek, modern bireycilik dini cemaat tarafından dengelenecektir."}
              </p>
            </div>
          </section>

          {/* Introduction */}
          <section className="space-y-6">
            <h2 className="text-3xl font-bold text-kpf-dark">
              {isGerman
                ? "Einführung: Die Lebenswelt von Fethullah Gülen"
                : "Giriş: Fethullah Gülen'in Yaşam Dünyası"}
            </h2>
            <div className="space-y-4 text-slate-700 leading-relaxed">
              <p>
                {isGerman
                  ? "Wer die besondere Haltung der Gülen-Bewegung zu Fragen der Wissenschaft und Bildung erfassen möchte, sollte von der Lebenswelt ausgehen, in der der 1941 geborene, islamische Prediger Fethullah Gülen geprägt wurde. Das islamisch-multireligiöse Osmanische Reich war über Jahrhunderte hinweg zerfallen und die Eroberung der Türkei durch christlich-europäische Mächte nur aufgrund eines nationalen Befreiungskampfes vereitelt worden."
                  : "Gülen Hareketi'nin bilim ve eğitim sorularına karşı özel tutumunu anlamak isteyenler, 1941'de doğan İslami vaiz Fethullah Gülen'in şekillendirildiği yaşam dünyasından başlamalıdır. İslami-çok dinli Osmanlı İmparatorluğu yüzyıllar boyunca dağılmış ve Türkiye'nin Hıristiyan-Avrupai güçler tarafından fethinin ulusal bir özgürlük mücadelesi sayesinde engellenmesi gerekmişti."}
              </p>
              <p>
                {isGerman
                  ? "Die nun herrschenden Nationalisten machten einerseits die ethnisch-religiöse Vielfalt, andererseits aber auch die traditionalistische Haltung islamischer Geistlicher für den wissenschaftlichen, wirtschaftlichen und zuletzt politisch-militärischen Niedergang des Osmanischen Reiches verantwortlich."
                  : "İktidar alan milliyetçiler, bir yandan etnik-dinsel çeşitliliği, diğer yandan ise İslami din adamlarının gelenekçi tutumunu Osmanlı İmparatorluğu'nun bilimsel, ekonomik ve son olarak siyasi-askeri düşüşünden sorumlu saydılar."}
              </p>
              <p>
                {isGerman
                  ? "Entsprechend brutal gingen sie sowohl gegen religiöse und ethnische Minderheiten wie auch gegen nichtstaatliche, islamische Gemeinschaften und Gelehrte vor. Sie errichteten an deren statt mit der Religionsbehörde (heute Diyanet) die Struktur einer Staatskirche, die der nationalen Vereinheitlichung und autoritären Kontrolle der Religionsausübung verpflichtet wurde."
                  : "Buna uygun olarak, hem dinsel ve etnik azınlıklara hem de resmi olmayan İslami topluluklara ve alimlerine karşı acımasızca hareket ettiler. Bunların yerine Religionsbehörde (bugün Diyanet) ile devlet kilisesinin yapısını kurarak ulusal birleşme ve dinin uygulanmasının otoriter kontrolüne bağlı hale getirdiler."}
              </p>
            </div>
          </section>

          {/* The Problem */}
          <section className="bg-gradient-to-br from-red-50 to-white p-8 rounded-2xl border-l-4 border-kpf-red">
            <h2 className="text-2xl font-bold text-kpf-dark mb-6">
              {isGerman
                ? "Das Problem: Religion vs. Wissenschaft"
                : "Sorun: Din vs. Bilim"}
            </h2>
            <p className="text-slate-700 leading-relaxed">
              {isGerman
                ? "In dieser Zeit entstanden grundlegende Missverständnisse zwischen Religion und Wissenschaft. Viele Menschen fragten sich: Wie können wir modern und wissenschaftlich sein und gleichzeitig religiös bleiben? Müssen wir uns zwischen unseren religiösen Überzeugungen und wissenschaftlichem Fortschritt entscheiden?"
                : "Bu dönemde din ve bilim arasında temel yanlış anlamalar ortaya çıktı. Birçok insan kendine şöyle soruyordu: Modern ve bilimsel olmak ve aynı zamanda dini kalabilir miyiz? Dinsel inançlarımız ve bilimsel ilerleme arasında seçim yapmak zorunda mıyız?"}
            </p>
          </section>

          {/* Gülen's Answer */}
          <section className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border border-blue-200">
            <h2 className="text-3xl font-bold text-kpf-dark mb-8">
              {isGerman
                ? "Die Antwort von Fethullah Gülen"
                : "Fethullah Gülen'in Cevabı"}
            </h2>
            <div className="space-y-6">
              <p className="text-slate-700 leading-relaxed">
                {isGerman
                  ? "Anregungen von Said Nursi aufnehmend, sah der anfangs bei der Religionsbehörde arbeitende Prediger Fethullah Gülen die Schuld und Verantwortung sowohl für die wissenschaftliche Erstarrung wie für die religiösen und interreligiösen Spaltungen der osmanischen Spätzeit nicht zuerst bei anderen. Er verstand, dass die Muslime selbst ihre Religion falsch verstanden hatten."
                  : "Said Nursi'den gelen telkinler üzerine, başlangıçta Diyanet'te çalışan vaiz Fethullah Gülen, bilimsel donmanın ve osmanlı geç döneminin dinsel ve dinler arası bölünmelerinin sorumluluğunu başlıca başkalarında görmedi. Müslümanların kendilerinin dinlerini yanlış anladıklarını anladı."}
              </p>

              {/* Quote */}
              <div className="bg-white p-6 rounded-lg border-l-4 border-kpf-teal italic text-slate-700">
                <div className="flex gap-3">
                  <Quote
                    size={20}
                    className="text-kpf-teal flex-shrink-0 mt-1"
                  />
                  <div>
                    <p className="mb-4">
                      {isGerman
                        ? '"Der Islam ist eine missverstande Religion, und verantwortlich dafür sind in erster Linie die Muslime. [...] Zuweilen hat die Menschheit die Religion im Namen der Wissenschaft geleugnet, genauso wie sie umgekehrt auch die Wissenschaft im Namen der Religion geleugnet hat. Die beiden seien nicht miteinander vereinbar, wurde behauptet. Dabei gehört doch alles Wissen Gott, und die Religion stammt von Gott. Wie können Religion und Wissenschaft also im Widerspruch zueinander stehen? Vielleicht erreichen mit unseren gemeinsamen Anstrengungen für den interreligiösen Dialog und für Verständigung und Toleranz zwischen den Menschen ja, dass sich diese Einsicht irgendwann durchsetzen wird."'
                        : "\"İslam yanlış anlaşılan bir dindir ve bundan sorumlu olan başta Müslümanlarıdır. [...] Bazen insanlık dini bilim adına reddetmiş, aynı şekilde de tersi olarak bilimi din adına reddetmiştir. İkisinin birbiriyle uyumlu olmadığı ileri sürüldü. Oysa tüm bilgi Tanrı'ya aittir ve din Tanrı'dan gelir. Din ve bilim nasıl çelişkiye düşebilir? Belki de dinlerarası diyalog ve insanlar arasında anlayış ve tolerans için ortak çabamızla bu iç görüş sonunda hakim olabilir.\""}
                    </p>
                    <p className="text-sm text-slate-500">
                      —{" "}
                      {isGerman
                        ? "Fethullah Gülen an Papst Johannes Paul II."
                        : "Fethullah Gülen, Papa II. Jean Paul'a"}
                    </p>
                  </div>
                </div>
              </div>

              <p className="text-slate-700 leading-relaxed">
                {isGerman
                  ? "Die einzigartige Antwort Gülens bestand nicht darin, Religion oder Wissenschaft zu wählen, sondern beides aktiv zu verbinden. Er sagte seinen Anhängern: Es mangelt den Muslimen nicht an Moscheen und Religionsgemeinschaften, sondern an Schulen, Akademien und Universitäten sowie Stipendien für arme, aber begabte Aufsteiger."
                  : "Gülen'in benzersiz cevabı din veya bilimi seçmek değil, ikisini aktif olarak birleştirmekti. Takipçilerine şöyle söyledi: Müslümanların eksikliği camiler ve dini cemaatler değil, okullar, akademiler ve üniversiteler ile fakir ama yetenekli yükselenler için bursalardır."}
              </p>
            </div>
          </section>

          {/* Key Values */}
          <section>
            <h2 className="text-3xl font-bold text-kpf-dark mb-8">
              {isGerman
                ? "Kernwerte der Bewegung"
                : "Hareketin Temel Değerleri"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  icon: BookOpen,
                  title: isGerman ? "Bildung für Alle" : "Herkes için Eğitim",
                  desc: isGerman
                    ? "Bildung ist nicht nur eine Berechtigung der Eliten, sondern ein Grundrecht aller Menschen"
                    : "Eğitim yalnızca seçkinlerin hakkı değil, tüm insanların temel hakkıdır",
                },
                {
                  icon: Heart,
                  title: isGerman ? "Spiritualität" : "Maneviyat",
                  desc: isGerman
                    ? "Rationale Bildung muss von intensiver Spiritualität begleitet werden"
                    : "Rasyonel eğitim yoğun maneviyat tarafından eşlik edilmelidir",
                },
                {
                  icon: Lightbulb,
                  title: isGerman ? "Wissenssuche" : "Bilgi Arayışı",
                  desc: isGerman
                    ? "Ein Leben ohne ständiges Lernen und Hinterfragen ist unvollständig"
                    : "Sürekli öğrenme ve sorgulamadan uzak bir yaşam eksiktir",
                },
                {
                  icon: Users,
                  title: isGerman ? "Gemeinschaft" : "Topluluk",
                  desc: isGerman
                    ? "Individuelle Entwicklung und Gemeinschaftsverantwortung gehören zusammen"
                    : "Bireysel gelişim ve topluluk sorumluluğu birlikte gider",
                },
              ].map((value, idx) => {
                const Icon = value.icon;
                return (
                  <div
                    key={idx}
                    className="bg-gradient-to-br from-slate-50 to-white p-6 rounded-xl border-l-4 border-kpf-teal hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start gap-4">
                      <Icon
                        size={28}
                        className="text-kpf-teal flex-shrink-0 mt-1"
                      />
                      <div>
                        <h3 className="font-bold text-lg text-slate-800 mb-2">
                          {value.title}
                        </h3>
                        <p className="text-slate-600 text-sm">{value.desc}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Practical Implementation */}
          <section className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl border-l-4 border-green-500">
            <h2 className="text-3xl font-bold text-kpf-dark mb-6">
              {isGerman ? "Praktische Umsetzung" : "Pratik Uygulamalar"}
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-lg text-slate-800 mb-3">
                  {isGerman
                    ? "1. Dschihad neu definiert"
                    : "1. Cihadı Yeniden Tanımlamak"}
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  {isGerman
                    ? "Gülen spitzte den Begriff des Dschihad zu: Der 'große Dschihad' ist die umfassende Bildung der eigenen Persönlichkeit, der 'kleine Dschihad' ist der Einsatz für die Bildung anderer und die Religionsfreiheit."
                    : "Gülen Cihadı şu şekilde tanımladı: 'Büyük cihad' kişinin kendi kişiliğinin kapsamlı eğitimidir, 'küçük cihad' başkalarının eğitimi ve din özgürlüğü için çalışmaktır."}
                </p>
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-800 mb-3">
                  {isGerman
                    ? "2. Förderung von begabten Aufsteigern"
                    : "2. Yetenekli Yükselenenlerin Desteklenmesi"}
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  {isGerman
                    ? "Die Bewegung konzentriert sich auf die Unterstützung von armen, aber begabten Schülern und Studenten durch Schulen, Akademien, Universitäten und Stipendien weltweit."
                    : "Hareket, dünyadaki okullar, akademiler, üniversiteler ve bursalar aracılığıyla fakir ama yetenekli öğrencilerin desteklenmesine odaklanmıştır."}
                </p>
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-800 mb-3">
                  {isGerman
                    ? "3. Interreligiöser Dialog"
                    : "3. Dinler Arası Diyalog"}
                </h3>
                <p className="text-slate-700 leading-relaxed">
                  {isGerman
                    ? "Der Dialog mit anderen Religionen ist nicht Zweck, sondern Mittel zur Förderung von gegenseitigem Verständnis, Frieden und gemeinsamen Werten."
                    : "Diğer dinlerle diyalog, amaç değil karşılıklı anlayış, barış ve ortak değerlerin teşviki için bir araçtır."}
                </p>
              </div>
            </div>
          </section>

          {/* Global Impact */}
          <section className="bg-gradient-to-r from-kpf-teal/10 to-kpf-red/10 p-8 rounded-2xl">
            <h2 className="text-3xl font-bold text-kpf-dark mb-6">
              {isGerman ? "Globale Auswirkungen" : "Küresel Etki"}
            </h2>
            <div className="space-y-4 text-slate-700 leading-relaxed">
              <p>
                {isGerman
                  ? "Heute erwerben in über 2.000 Bildungseinrichtungen, darunter sieben Universitäten, Schülerinnen und Schüler, Studentinnen und Studenten in mehr als 90 Nationen Bildung und Wissen, die ihnen ohne das ehrenamtliche und finanzielle Engagement der Gülen-Bewegung nicht gleichermaßen zugänglich gewesen wären."
                  : "Bugün 2.000'den fazla eğitim kurumunda, bunlardan 7 üniversitede, 90'dan fazla ülkede öğrenciler Gülen Hareketi'nin gönüllü ve mali katkısı olmaksızın eşit ölçüde erişemeyecekleri eğitim ve bilgi elde etmektedir."}
              </p>
              <p>
                {isGerman
                  ? "Hinzu kommen Zeitungen, Fernseh- und Radiosender sowie zahlreiche Dialoginitiativen, die für Frieden auf der Basis von freiheitlicher Demokratie, privatwirtschaftlichem und zivilgesellschaftlichem Engagement sowie gegenseitigem Respekt werben."
                  : "Bunun yanı sıra, özgür demokrasi, özel ve sivil toplum katılımı ve karşılıklı saygı temelinde barış için çalışan gazeteler, televizyon ve radyo istasyonları ile çok sayıda diyalog girişimi bulunmaktadır."}
              </p>
            </div>
          </section>

          {/* Challenges */}
          <section className="bg-gradient-to-br from-amber-50 to-white p-8 rounded-2xl border-l-4 border-amber-500">
            <h2 className="text-3xl font-bold text-kpf-dark mb-6">
              {isGerman
                ? "Herausforderungen: Die Evolutionstheorie"
                : "Zorluklar: Evrim Teorisi"}
            </h2>
            <div className="space-y-4 text-slate-700 leading-relaxed">
              <p>
                {isGerman
                  ? "Von allen wissenschaftlichen Großtheorien fordert keine die religiösen Überlieferungen so sehr heraus wie die Evolutionstheorie. Bisher hat sich die Gülen-Bewegung dem offenen Dialog mit der Evolutionsforschung noch nicht vollständig gestellt."
                  : "Tüm büyük bilimsel teoriler arasında hiçbiri dini mirasları evrim teorisi kadar zorlamamaktadır. Şimdiye kadar Gülen Hareketi evrim araştırmasıyla tam olarak açık diyaloğa girmemiştir."}
              </p>
              <p>
                {isGerman
                  ? "Dies ist eine wichtige Prüfung: Wird die Gülen-Bewegung den konstruktiven Dialog mit der Evolutionsforschung aktiv suchen? Wird sie ihre Balance zwischen Spiritualität und wissenschaftlicher Bildung halten können? Dies wird wesentlich darüber entscheiden, ob die Gülen-Bewegung ihren hohen Standard im Dialog zwischen Religion und Wissenschaft auch im 21. Jahrhundert ausbauen kann."
                  : "Bu önemli bir sınav: Gülen Hareketi evrim araştırmasıyla yapıcı diyaloğu aktif olarak arayacak mı? Maneviyat ve bilimsel eğitim arasındaki dengeyi koruyabilecek mi? Bu, Gülen Hareketi'nin 21. yüzyılda din ve bilim arasındaki diyaloğun standard yüksekliğini koruyup koruyamayacağını belirleyecektir."}
              </p>
            </div>
          </section>

          {/* Conclusion */}
          <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 rounded-2xl">
            <h2 className="text-3xl font-bold mb-6">
              {isGerman ? "Fazit" : "Sonuç"}
            </h2>
            <div className="space-y-4 leading-relaxed text-slate-100">
              <p>
                {isGerman
                  ? "Für die Förderung von Menschenrechten, Demokratie, vor allem aber auch der Bildung, Wissenschaft und des interreligiösen Dialoges sind die Lehren von Fethullah Gülen und die zivilgesellschaftlichen Initiativen der Gülen-Bewegung ein Glücksfall."
                  : "İnsan hakları, demokrasi ve özellikle eğitim, bilim ve dinlerarası diyaloğun terciş edilmesi için Fethullah Gülen'in öğretileri ve Gülen Hareketi'nin sivil toplum girişimleri bir nimettir."}
              </p>
              <p>
                {isGerman
                  ? "Ohne Zweifel gehört die Gülen-Bewegung am Beginn des 21. Jahrhunderts zu den global produktivsten islamischen und interreligiösen Akteuren. Sie hat gezeigt, dass es möglich ist, modern zu sein, wissenschaftlich zu denken und gleichzeitig tiefe spirituelle Überzeugungen zu bewahren."
                  : "Şüphesiz, Gülen Hareketi 21. yüzyılın başında küresel olarak en verimli İslami ve dinler arası aktörlerden biridir. Modern olmanın, bilimsel olarak düşünmenin ve aynı zamanda derin manevi inançları koruymanın mümkün olduğunu göstermiştir."}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default GuelenMovement;
