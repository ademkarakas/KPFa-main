import {
  Activity,
  TeamMember,
  Translation,
  ValueItem,
  Partner,
  Course,
} from "./types";

export const TEXTS: Record<string, Translation> = {
  nav_home: { tr: "Ana Sayfa", de: "Startseite" },
  nav_about: { tr: "Hakkımızda", de: "Über Uns" },
  nav_activities: { tr: "Faaliyetler", de: "Aktivitäten" },
  nav_activities_all: { tr: "Tüm Etkinlikler", de: "Alle Aktivitäten" },
  nav_teegespraeche: { tr: "Çay Sohbetleri", de: "Teegespräche" },
  nav_courses: { tr: "Kurslar", de: "Kursangebote" },
  nav_donate: { tr: "Bağış Yap", de: "Spenden" },
  nav_contact: { tr: "İletişim", de: "Kontakt" },

  // Admin Panel
  admin_title: { tr: "KPF Admin Panel", de: "KPF Admin Panel" },
  admin_subtitle: {
    tr: "Kültür Platformu Freiburg Yönetim Paneli",
    de: "Kültür Plattform Freiburg Verwaltung",
  },
  admin_login: { tr: "Giriş Yap", de: "Anmelden" },
  admin_logging_in: { tr: "Giriş yapılıyor...", de: "Anmeldung..." },
  admin_email: { tr: "E-Posta", de: "E-Mail" },
  admin_password: { tr: "Şifre", de: "Passwort" },
  admin_login_error: {
    tr: "Giriş başarısız. Lütfen bilgilerinizi kontrol edin.",
    de: "Login fehlgeschlagen. Bitte überprüfen Sie Ihre Anmeldedaten.",
  },
  admin_error_occurred: {
    tr: "Bir hata oluştu. Lütfen tekrar deneyin.",
    de: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
  },
  admin_demo_credentials: { tr: "Demo", de: "Demo" },
  admin_logout: { tr: "Çıkış Yap", de: "Abmelden" },
  admin_website: { tr: "Siteyi Görüntüle", de: "Website ansehen" },

  // Admin Menu
  admin_menu_dashboard: { tr: "Kontrol Paneli", de: "Dashboard" },
  admin_menu_activities: { tr: "Etkinlikler", de: "Aktivitäten" },
  admin_menu_teegespraeche: { tr: "Çay Sohbetleri", de: "Teegespräche" },
  admin_menu_courses: { tr: "Kurslar", de: "Kurse" },
  admin_menu_team: { tr: "Ekip", de: "Team" },
  admin_menu_partners: { tr: "Partnerler", de: "Partner" },
  admin_menu_pages: { tr: "Sayfa İçerikleri", de: "Seiteninhalte" },
  admin_menu_volunteers: { tr: "Gönüllüler", de: "Freiwillige" },
  admin_imprint_title: { tr: "Künye", de: "Impressum" },
  admin_donate_title: { tr: "Bağış", de: "Spende" },

  // Admin Dashboard
  admin_dashboard_title: { tr: "Kontrol Paneli", de: "Dashboard" },
  admin_dashboard_subtitle: {
    tr: "Kültür Platformu Freiburg Yönetim Paneli",
    de: "Kültür Plattform Freiburg Verwaltung",
  },
  admin_stats_activities: { tr: "Etkinlikler", de: "Aktivitäten" },
  admin_stats_courses: { tr: "Kurslar", de: "Kurse" },
  admin_stats_team: { tr: "Ekip Üyeleri", de: "Teammitglieder" },
  admin_stats_partners: { tr: "Partnerler", de: "Partner" },
  admin_stats_volunteers: {
    tr: "Gönüllü Başvuruları",
    de: "Freiwilligenbewerbungen",
  },
  admin_recent_submissions: {
    tr: "Son Gönüllü Başvuruları",
    de: "Aktuelle Freiwilligenbewerbungen",
  },
  admin_no_submissions: {
    tr: "Henüz başvuru bulunmamaktadır.",
    de: "Es liegen noch keine Bewerbungen vor.",
  },
  admin_quick_actions: { tr: "Hızlı İşlemler", de: "Schnellaktionen" },
  admin_new_activity: { tr: "Yeni Etkinlik", de: "Neue Aktivität" },
  admin_new_course: { tr: "Yeni Kurs", de: "Neuer Kurs" },
  admin_add_team_member: {
    tr: "Ekip Üyesi Ekle",
    de: "Teammitglied hinzufügen",
  },
  admin_add_partner: { tr: "Partner Ekle", de: "Partner hinzufügen" },

  // Admin Common
  admin_search: { tr: "Ara...", de: "Suchen..." },
  admin_new: { tr: "Yeni", de: "Neu" },
  admin_edit: { tr: "Düzenle", de: "Bearbeiten" },
  admin_delete: { tr: "Sil", de: "Löschen" },
  admin_save: { tr: "Kaydet", de: "Speichern" },
  admin_cancel: { tr: "İptal", de: "Abbrechen" },
  admin_active: { tr: "Aktif", de: "Aktiv" },
  admin_inactive: { tr: "Pasif", de: "Inaktiv" },
  admin_loading: { tr: "Yükleniyor...", de: "Lädt..." },
  admin_confirm_delete: {
    tr: "Silmek istediğinize emin misiniz?",
    de: "Möchten Sie wirklich löschen?",
  },

  // Admin Activities
  admin_activities_title: {
    tr: "Etkinlik Yönetimi",
    de: "Aktivitätenverwaltung",
  },
  admin_activities_total: { tr: "Toplam Etkinlik", de: "Gesamtaktivitäten" },
  admin_activities_new: { tr: "Yeni Etkinlik", de: "Neue Aktivität" },
  admin_activities_edit: { tr: "Etkinlik Düzenle", de: "Aktivität bearbeiten" },
  admin_activities_list: { tr: "Etkinlik Listesi", de: "Aktivitätsliste" },

  // Admin Page Contents
  admin_pages_title: {
    tr: "Sayfa İçerikleri Yönetimi",
    de: "Verwaltung der Seiteninhalte",
  },
  admin_pages_subtitle: {
    tr: "Statik sayfa içeriklerini düzenleyin",
    de: "Bearbeiten Sie die statischen Seiteninhalte",
  },
  admin_pages_empty: { tr: "Boş", de: "Leer" },
  admin_pages_create: { tr: "Oluştur", de: "Erstellen" },
  admin_pages_edit_content: { tr: "İçeriği Düzenle", de: "Inhalt bearbeiten" },

  // Admin Courses
  admin_courses_title: { tr: "Kurs Yönetimi", de: "Kursverwaltung" },
  admin_courses_new: { tr: "Yeni Kurs", de: "Neuer Kurs" },

  // Admin Team
  admin_team_title: { tr: "Ekip Yönetimi", de: "Teamverwaltung" },
  admin_team_new: { tr: "Yeni Ekip Üyesi", de: "Neues Teammitglied" },

  // Admin Partners
  admin_partners_title: { tr: "Partner Yönetimi", de: "Partnerverwaltung" },
  admin_partners_new: { tr: "Yeni Partner", de: "Neuer Partner" },

  // Admin Volunteers
  admin_volunteers_title: {
    tr: "Gönüllü Başvuruları",
    de: "Freiwilligenbewerbungen",
  },
  admin_volunteers_total: { tr: "Toplam Başvuru", de: "Gesamtbewerbungen" },

  // Admin Contact Settings
  admin_contact_title: { tr: "İletişim Bilgileri", de: "Kontaktinformationen" },
  admin_contact_subtitle: {
    tr: "Site iletişim bilgilerini güncelleyin",
    de: "Aktualisieren Sie die Kontaktinformationen der Website",
  },
  admin_contact_email: { tr: "E-posta Adresi", de: "E-Mail-Adresse" },
  admin_contact_phone: { tr: "Telefon", de: "Telefon" },
  admin_contact_address: { tr: "Adres", de: "Adresse" },
  admin_contact_office_hours: { tr: "Ofis Saatleri", de: "Öffnungszeiten" },
  admin_contact_updated: {
    tr: "İletişim bilgileri başarıyla güncellendi!",
    de: "Kontaktinformationen erfolgreich aktualisiert!",
  },
  admin_contact_update_failed: {
    tr: "İletişim bilgileri güncellenirken hata oluştu",
    de: "Fehler beim Aktualisieren der Kontaktinformationen",
  },
  token_not_found: {
    tr: "Token bulunamadı! Lütfen tekrar giriş yapın.",
    de: "Token nicht gefunden! Bitte erneut anmelden.",
  },

  hero_title: { tr: "Kültürel Değerler", de: "Kulturelle Werte" },
  hero_subtitle: {
    tr: "Freiburg'da kültürel değerleri yaşatıyor, kültürlerarası köprüler kuruyoruz.",
    de: "Wir halten kulturelle Werte in Freiburg lebendig und bauen interkulturelle Brücken.",
  },
  hero_cta_primary: {
    tr: "Etkinlikleri İncele",
    de: "Veranstaltungen ansehen",
  },
  hero_cta_secondary: { tr: "Gönüllü Ol", de: "Ehrenamtlich mitmachen" },

  // Home Page Features (The 3 Pillars)
  home_feature_1_title: { tr: "Topluluk", de: "Gemeinschaft" },
  home_feature_1_desc: {
    tr: "Sosyal dayanışmayı güçlendiriyor, farklı kökenlerden insanları bir araya getirerek büyük bir aile oluyoruz.",
    de: "Wir stärken die soziale Solidarität und bringen Menschen unterschiedlicher Herkunft zusammen, um eine große Familie zu werden.",
  },
  home_feature_2_title: { tr: "Kültür & Değerler", de: "Kultur & Werte" },
  home_feature_2_desc: {
    tr: "Köklerimizden gelen zenginliği korurken, evrensel insani değerlerle geleceği inşa ediyoruz.",
    de: "Während wir den Reichtum unserer Wurzeln bewahren, bauen wir die Zukunft mit universellen menschlichen Werten auf.",
  },
  home_feature_3_title: { tr: "Etkinlikler", de: "Veranstaltungen" },
  home_feature_3_desc: {
    tr: "Konserler, seminerler ve atölyelerle her ay düzenli olarak buluşuyor, birlikte öğreniyor ve eğleniyoruz.",
    de: "Wir treffen uns regelmäßig jeden Monat zu Konzerten, Seminaren und Workshops, lernen gemeinsam und haben Spaß.",
  },

  // Social Section
  home_follow_instagram: {
    tr: "Bizi Instagram'da Takip Edin",
    de: "Folgen Sie uns auf Instagram",
  },
  home_follow_desc: {
    tr: "En güncel haberler ve fotoğraflar için.",
    de: "Für die neuesten Nachrichten und Fotos.",
  },

  about_title: { tr: "Hakkımızda", de: "Über uns" },

  // Who We Are
  about_who_title: { tr: "Biz Kimiz?", de: "Wer sind wir?" },
  about_who_desc: {
    tr: "Kültür Platformu Freiburg e.V., Freiburg bölgesinde çocuk ve gençlik çalışmaları, ebeveyn çalışmaları, eğitim ve öğretim alanlarındaki talebi karşılamak için çocuklar, gençler ve yetişkinler için teklifler sunmaktadır. Sosyal aktiviteler, öğrenme yardımı, projeler, yarışmalar, seminerler, kültürel etkinlikler, geziler, danışmanlık veya ev ziyaretleri, Kültür Platformu Freiburg e.V. tarafından sunulan hizmetlerden sadece birkaç örnektir.\n\nBu teklifle Freiburg sakinleri olarak sorumluluğumuzu yerine getirmek istiyoruz. Çünkü ancak ergenlere güçlü yönlerini ve potansiyellerini geliştirmeleri için yeterli fırsatlar sunulursa ve eksikliklerini gidermelerine yardımcı olunursa, dengeli bir karaktere sahip olgun kişilikler olarak şehir yaşamına katılabilir ve barışçıl bir birlikteliğe katkıda bulunabilirler. Burada yetişkinlere ve ebeveynlere de önemli bir rol düşmektedir. Onları da sorumluluklarını yerine getirmeleri ve yeteneklerini fark edip güçlendirmeleri konusunda destekliyoruz.",
    de: "Kulturplattform Freiburg e.V. bietet Angebote für Kinder, Jugendliche und Erwachsene an um der Nachfrage in den Bereichen Kinder- und Jugendarbeit, Elternarbeit, Erziehung und Bildung im Freiburger Raum begegnen zu können. Soziale Aktivitäten, Lernhilfe, Projekte, Wettbewerbe, Seminare, kulturelle Veranstaltungen, Ausflüge, Beratungen oder Hausbesuche sind nur einige Beispiele des Angebots von Kulturplattform Freiburg e.V.\n\nWir wollen mit diesem Angebot unserer Verantwortung als Freiburger nachkommen. Denn nur, wenn Heranwachsenden ausreichend Möglichkeiten geboten werden um ihre Stärken und Potenziale zu entwickeln und ihnen geholfen wird ihre Defizite zu beheben, können sie als gereifte Persönlichkeiten mit ausgeglichenem Charakter am Stadtleben partizipieren und wiederum ihren Beitrag für ein friedliches Miteinander leisten. Dabei fällt auch Erwachsenen und Eltern eine wichtige Rolle zu. Auch sie unterstützen wir darin, ihre Verantwortung wahrzunehmen und ihre Fähigkeiten zu erkennen und zu stärken.",
  },

  // Goals
  about_goals_title: { tr: "Hedeflerimiz", de: "Ziele" },
  about_goals_desc: {
    tr: "En büyük önceliğimiz eğitim ve diyaloğun teşvik edilmesidir. Farklı kültürler arasında canlı bir arayüz olarak, insanları eğitim yoluyla bir araya getirmeyi ve daha derin bir anlayış yaratmak için diyaloğu teşvik etmeyi taahhüt ediyoruz. Kültürel çeşitliliği sadece bir zenginlik olarak değil, sosyal, dini veya kültürel geçmişlerine bakılmaksızın insanları bir araya getiren birleştirici bir unsur olarak görüyoruz. Vizyonumuz, barış, pozitiflik ve yapıcı etkileşimlerle karakterize edilen uyumlu bir birlikteliği desteklemektir.",
    de: "Unsere höchste Priorität liegt in der Förderung von Bildung und Dialog. Als lebendige Schnittstelle zwischen verschiedenen Kulturen setzen wir uns dafür ein, Menschen durch Bildung zusammenzubringen und den Dialog zu fördern, um ein tieferes Verständnis zu schaffen. Die kulturelle Diversität sehen wir nicht nur als Reichtum, sondern als ein verbindendes Element, das Menschen unabhängig von sozialen, religiösen oder kulturellen Hintergründen zusammenführt. Unsere Vision ist es, ein harmonisches Zusammenleben zu unterstützen, das von Frieden, Positivität und konstruktiven Interaktionen geprägt ist.",
  },

  // Vision
  about_vision_title: { tr: "Vizyon", de: "Vision" },
  about_vision_desc: {
    tr: "Kültür Platformu Freiburg e.V.'nin vizyonu, kültürel ve bireysel çeşitliliğin bir zenginlik olarak kabul edilmesiyle şekillenmiştir. Farklı inançların, dinlerin ve kültürlerin bir çatışma kaynağı değil, bir zenginlik ve bağlantı kaynağı olması için duyarlılık yaratmaya çalışıyoruz. İstişare ve ortak anlayış arayışımız, daha etkili ve kapsayıcı faaliyetler tasarlamamızı sağlar. Bağımsız bir sivil toplum hareketi olarak demokratik değerlere ve sosyal dayanışmaya büyük önem veriyoruz. Mültecileri destekleyerek insan haklarına saygı ilkesini vurguluyor ve her bireyin güvenli ve saygılı bir topluma entegrasyonunu hedefliyoruz.",
    de: "Die Vision von Kulturplattform Freiburg e.V. ist geprägt von der Akzeptanz kultureller und individueller Vielfalt als Bereicherung. Wir streben danach, Sensibilität zu schaffen, damit verschiedene Glaubensrichtungen, Religionen und Kulturen keine Quelle von Konflikten, sondern eine Quelle von Reichtum und Verbindung werden. Unser Streben nach Konsultation und gemeinsamem Verständnis ermöglicht es uns, effektivere und inklusivere Aktivitäten zu gestalten. Als unabhängige zivilgesellschaftliche Bewegung legen wir großen Wert auf demokratische Werte und soziale Solidarität. Durch die Unterstützung von Flüchtlingen betonen wir das Prinzip der Achtung der Menschenrechte und streben die Integration jedes Individuums in eine sichere und respektvolle Gemeinschaft an.",
  },

  // Mission
  about_mission_title: { tr: "Misyon", de: "Mission" },
  // Short summary for Home Page to avoid cutoff
  about_mission_short: {
    tr: "Misyonumuz, her insanın onuruna ve insan haklarına koşulsuz saygıya olan sarsılmaz inancımıza dayanmaktadır. Sosyal adalet ve fırsat eşitliği ilkeleri doğrultusunda hareket eder, insan onurunun korunması için aktif olarak çalışırız.",
    de: "Unsere Mission gründet sich auf dem festen Glauben an die Würde eines jeden Menschen und der uneingeschränkten Achtung der Menschenrechte. Wir handeln stets im Einklang mit den Prinzipien der sozialen Gerechtigkeit und Chancengleichheit.",
  },
  about_mission_desc: {
    tr: "Misyonumuz, her insanın onuruna ve insan haklarına koşulsuz saygıya olan sarsılmaz inancımıza dayanmaktadır. Kültür Platformu Freiburg e.V. her zaman sosyal adalet ve fırsat eşitliği ilkeleri doğrultusunda hareket eder ve insan onurunun korunması ve muhafaza edilmesi için aktif olarak çalışırız. Sadece ulusal yasalara uymakla kalmıyor, aynı zamanda genel kabul görmüş evrensel hukuk ilkeleri çerçevesinde hareket ediyoruz. Amacımız, şiddeti kesinlikle reddeden ve bunun yerine ortak yaşam potansiyelini güçlendirmek için yapıcı yollara odaklanan barışçıl ve olumlu bir hareketi teşvik etmektir. Herkes için eşit fırsatları teşvik ederek ve toplumsal hayata aktif katılımlarını destekleyerek kadınların toplumsal rolünün güçlendirilmesine özel önem veriyoruz.",
    de: "Unsere Mission gründet sich auf dem festen Glauben an die Würde eines jeden Menschen und der uneingeschränkten Achtung der Menschenrechte. Kulturplattform Freiburg e.V. handelt stets im Einklang mit den Prinzipien der sozialen Gerechtigkeit und Chancengleichheit, und wir setzen uns aktiv für den Schutz und die Wahrung der Menschenwürde ein. Dabei beachten wir nicht nur nationale Gesetze, sondern agieren auch im Rahmen allgemein gültiger universeller Rechtsgrundsätze. Unser Ziel ist es, eine friedliche und positive Bewegung zu fördern, die Gewalt strikt ablehnt und stattdessen auf konstruktive Wege setzt, um das Potenzial für ein gemeinsames Zusammenleben zu stärken. Besonderes Augenmerk legen wir auf die Stärkung der gesellschaftlichen Rolle von Frauen, indem wir gleiche Chancen für alle fördern und ihre aktive Beteiligung am gesellschaftlichen Leben unterstützen.",
  },

  quote_text: {
    tr: "Bir entelektüel sadece aydınlanmış bir insan değildir, aynı zamanda bir eylem insanıdır.",
    de: "Ein Intellektueller ist nicht nur ein aufgeklärter Mensch, er ist auch ein Mensch der Tat.",
  },
  quote_author: { tr: "M. Fethullah Gülen", de: "M. Fethullah Gülen" },

  about_values_title: { tr: "Temel Değerlerimiz", de: "Grundwerte" },
  about_practices_title: {
    tr: "Faaliyet Alanlarımız",
    de: "Hizmet-Werte in der Praxis",
  },
  about_focus_title: { tr: "Odak Noktalarımız", de: "Unsere Schwerpunkte" },
  partners_title: { tr: "Çözüm Ortaklarımız", de: "Partnerschaften" },

  // Tenkil Museum Section
  about_tenkil_title: {
    tr: "Tenkil Müzesi & İnsan Hakları",
    de: "Tenkil Museum & Menschenrechte",
  },
  about_tenkil_desc: {
    tr: "Almanya Federal Cumhuriyeti'nde, çok farklı kültürlerin ve dinlerin birlikteliği ve yan yana yaşamı yıllardır gündelik hayatın bir parçası olmuştur. Gelecekte de toplum, artan çoğullaşma süreçleriyle şekillenecektir. Bireysel değer yargıları ile farklı sosyal ve kültürel geçmişlere sahip insanların bir araya geldiği yerlerde çatışma potansiyeli vardır. Çoğulculuğu bir zenginlik olarak görüyor ve aynı zamanda zorluklarının da farkındayız. Bu nedenle deneyimlerimiz ve yetkinliklerimizle toplumsal müzakere süreçlerine üretken ve arabulucu bir şekilde katılmak istiyoruz. Şu anda özellikle \"Gruplara Yönelik İnsan Düşmanlığı\" konusunda harekete geçilmesi gerektiğini görüyoruz. Bu alandaki angajmanımız çok geniştir ve bir yanda antisemitizm ve aşırı sağcılıktan, diğer yanda İslamcılığa kadar uzanmaktadır. Ayrıca mültecilerin bakımı birkaç yıldır çalışmalarımızın değişmez bir parçasıdır – şu anki odağımız özellikle Türkiye'den gelen siyasi mülteciler üzerinedir.",
    de: "In der Bundesrepublik Deutschland ist das Neben- und Miteinander höchst unterschiedlicher Kulturen und Religionen bereits seit Jahren Alltag. Auch in Zukunft wird die Gesellschaft zunehmend von Pluralisierungs-prozessen geprägt sein. Dort, wo Menschen mit individuellen Wertvorstellungen und unterschiedlichen sozialen und kulturellen Hintergründen zusammenkommen, besteht Konfliktpotential. Wir verstehen Pluralität als Bereicherung und sind uns gleichzeitig ihrer Herausforderungen bewusst. Deswegen wollen wir uns mit unseren Erfahrungen und Kompetenzen produktiv und vermittelnd an den gesellschaftlichen Aushandlungsprozessen beteiligen. Aktuell sehen wir besonderen Handlungsbedarf im Hinblick auf das Thema „Gruppenbezogene Menschenfeindlichkeit“. Unser Engagement in diesem Bereich ist sehr breit gefasst und reicht von Antisemitismus und Rechtsradikalismus auf der einen bis zu Islamismus auf der anderen Seite. Außerdem ist die Betreuung von Flüchtlingen seit einigen Jahren ein beständiger Teil unserer Arbeit – unser Fokus liegt aktuell vor allem auf politischen Flüchtlingen aus der Türkei.",
  },

  // Activities & Teegespräche
  activities_title: { tr: "Faaliyetlerimiz", de: "Unsere Aktivitäten" },
  activities_filter_all: { tr: "Tümü", de: "Alle" },
  activities_filter_music: { tr: "Müzik", de: "Musik" },
  activities_filter_art: { tr: "Sanat", de: "Kunst" },
  activities_filter_education: { tr: "Eğitim", de: "Bildung" },

  teegespraeche_title: { tr: "Çay Sohbetleri", de: "Teegespräche" },
  teegespraeche_subtitle: {
    tr: "Hayat Boyu Öğrenme ve Maneviyat",
    de: "Sohbets sind spirituelle Gesprächskreise zum lebenslangen Lernen",
  },
  teegespraeche_desc: {
    tr: "Sohbetler, UNESCO Dünya Mirası listesinde yer almaktadır. 2008'den bu yana binalar ve anıtların yanı sıra somut olmayan kültürel miras için de bir kategori bulunmaktadır. Almanya'da kooperatif fikri ve ekmek kültürü bu listededir. Sohbetler 2010 yılından beri, Alevilerin Semah dansları veya Kürtlerin Newroz festivali gibi Türk Dünya Mirası olarak kabul edilmektedir.\n\nRamazan projesi kapsamında haftalık sanal bir Sohbet gerçekleştirdik. Geri bildirimler o kadar iyiydi ki bu formatı sürdürmeye karar verdik.\n\nHer ikinci Cuma saat 16:00'da, Allah ve dünya üzerine bir Sohbet gerçekleşmektedir. Katılın ve tartışın.",
    de: "Sohbets sind spirituelle Gesprächskreise zum lebenslangen Lernen. Sie stehen auf der Liste des UNESCO-Weltkulturerbes. Seit 2008 gibt es dort neben den Gebäuden und Denkmälern eine Rubrik für immaterielle Kulturgüter, für schützenswerte kulturelle Praktiken also. In Deutschland stehen die Genossenschaftsidee, die Walz und die Brotkultur auf der Liste. Sohbets gelten seit 2010 als türkisches Weltkulturerbe, ebenso wie die Semah-Tänze der Aleviten, das Newroz-Fest der Kurden oder die türkische Kaffeekultur.\n\nIm Rahmen des Projektes Ramadan haben wir wöchentlich einen virtuellen Sohbet durchgeführt. Die Resonanz war so gut, dass wir das Format beibehalten werden.\n\nJeden zweiten Freitag um 16:00 findet ein Gespräch, ein sogenannter Sohbet über Gott und die Welt statt. Schalten Sie ein und diskutieren Sie mit.",
  },
  teegespraeche_cta: { tr: "Kayıt Ol", de: "Hier anmelden" },

  courses_title: { tr: "Kurs Teklifleri", de: "Kursangebote" },
  courses_desc: {
    tr: "Kendinizi geliştirmek, yeni bir dil öğrenmek veya manevi değerlerinizi güçlendirmek için kurslarımıza katılın.",
    de: "Nehmen Sie an unseren Kursen teil, um sich weiterzuentwickeln, eine neue Sprache zu lernen oder Ihre spirituellen Werte zu stärken.",
  },
  course_cta: {
    tr: "Kayıt Olmak İster misiniz?",
    de: "Möchten Sie sich anmelden?",
  },
  course_cta_desc: {
    tr: "Kurslarımıza katılmak veya detaylı bilgi almak için bizimle iletişime geçebilirsiniz.",
    de: "Kontaktieren Sie uns, um an unseren Kursen teilzunehmen oder weitere Informationen zu erhalten.",
  },

  // Donation Section
  donate_hero_title: { tr: "Bize Destek Olun", de: "Unterstützen Sie uns" },
  donate_hero_subtitle: {
    tr: "Birlikte daha fazlasını başaralım",
    de: "Gemeinsam mehr erreichen",
  },
  donate_why_title: { tr: "Neden bağış yapmalısınız?", de: "Warum spenden?" },
  donate_why_desc: {
    tr: "Bağışlarınız, önemli eğitim ve entegrasyon projelerimizi sürdürmemizi sağlar. Kâr amacı gütmeyen bir dernek olarak desteğinize güveniyoruz.",
    de: "Ihre Spende ermöglicht es uns, wichtige Bildungs- und Integrationsprojekte fortzusetzen. Als gemeinnütziger Verein sind wir auf Ihre Unterstützung angewiesen.",
  },
  donate_where_title: {
    tr: "Bağışlar nerede kullanılıyor?",
    de: "Wofür werden Spenden verwendet?",
  },
  donate_where_desc: {
    tr: "Bağışlar %100 oranında projelerimize aktarılmaktadır: Eğitim materyalleri, seminerler için oda kiraları, ihtiyaç sahibi ailelerin desteklenmesi ve kültürel etkinlikler.",
    de: "Spenden fließen zu 100% in unsere Projekte: Lernmaterialien, Raummieten für Seminare, Unterstützung bedürftiger Familien und kulturelle Events.",
  },
  donate_feature_nonprofit: { tr: "%100 Kamu Yararı", de: "100% Gemeinnützig" },
  donate_feature_tax: {
    tr: "Vergiden Düşülebilir",
    de: "Steuerlich absetzbar",
  },
  donate_feature_transparent: {
    tr: "Şeffaf Kullanım",
    de: "Transparente Verwendung",
  },
  donate_tax_info: {
    tr: "Bağışlar vergiden düşülebilir. İsteğiniz üzerine memnuniyetle bağış makbuzu düzenleriz.",
    de: "Spenden sind steuerlich absetzbar. Wir stellen gerne eine Spendenbescheinigung aus.",
  },
  donate_bank_title: { tr: "Banka Hesap Bilgileri", de: "Bankverbindung" },
  donate_paypal_title: { tr: "PayPal ile Bağış", de: "Spenden über PayPal" },
  donate_paypal_button: {
    tr: "PayPal ile Bağış Yap",
    de: "Mit PayPal spenden",
  },

  contact_title: { tr: "İletişime Geçin", de: "Kontaktieren Sie uns" },
  contact_form_name: { tr: "Adınız Soyadınız", de: "Vor- und Nachname" },
  contact_form_email: { tr: "E-posta Adresiniz", de: "Ihre E-Mail-Adresse" },
  contact_form_message: { tr: "Mesajınız", de: "Ihre Nachricht" },
  contact_form_send: { tr: "Gönder", de: "Senden" },
  contact_success: {
    tr: "Mesajınız başarıyla gönderildi!",
    de: "Ihre Nachricht wurde erfolgreich gesendet!",
  },

  footer_rights: {
    tr: "Tüm hakları saklıdır.",
    de: "Alle Rechte vorbehalten.",
  },
  footer_privacy: { tr: "Gizlilik Politikası", de: "Datenschutz" },
  footer_imprint: { tr: "Künye", de: "Impressum" },
  footer_contact_header: {
    tr: "Hemen bize ulaşın",
    de: "Kontaktieren Sie uns",
  },
};

export const CORE_VALUES: ValueItem[] = [
  {
    id: "1",
    title: {
      tr: "İnsana ve Temel Haklara Saygı",
      de: "Respekt vor dem Menschen und den grundlegenden Menschenrechten",
    },
    description: {
      tr: "Her insanın doğuştan değerli olduğuna inanır, onurlu davranılmayı hak ettiğini savunuruz. Sosyal adalet ve fırsat eşitliği temel ilkelerimizdendir.",
      de: "Hizmet-Engagierte glauben, dass jeder Mensch an sich wertvoll ist und würdevoll behandelt werden muss. Jede Person ist als Mensch und vor dem Gesetz gleich.",
    },
  },
  {
    id: "2",
    title: { tr: "Hukukun Üstünlüğü", de: "Rechtsstaatlichkeit" },
    description: {
      tr: "Hukuka saygılıyız. Hiç kimseyi kanunların üzerinde görmez, insan onurunu koruyan evrensel hukuk ilkelerine ve ülke yasalarına bağlı kalırız.",
      de: "Hizmet-Engagierte achten den Rechtsstaat. Sie betrachten niemanden als über dem Gesetz stehend und handeln im Rahmen des Schutzes der Menschenwürde.",
    },
  },
  {
    id: "3",
    title: {
      tr: "Barışçıl ve Yapıcı Eylem",
      de: "Friedliches und konstruktives Handeln",
    },
    description: {
      tr: "Şiddeti reddederiz. Pozitif ve yapıcı hareket eder, düşmanca ve yıkıcı eylemlerden kaçınırız.",
      de: "Hizmet ist eine friedliche Bewegung. Hizmet-Engagierte lehnen den Einsatz von Gewalt ab. Sie handeln positiv und konstruktiv.",
    },
  },
  {
    id: "4",
    title: { tr: "Kadınların Güçlendirilmesi", de: "Empowerment von Frauen" },
    description: {
      tr: "Kadınların eşit fırsatlara sahip olması ve toplumun her alanında ayrımcılık olmaksızın yer alması idealine bağlıyız.",
      de: "Hizmet-Engagierte sind dem Ideal verpflichtet, dass Frauen gleiche Chancen erhalten und ohne Diskriminierung in allen Bereichen der Gesellschaft mitwirken können.",
    },
  },
  {
    id: "5",
    title: { tr: "Etik Davranış", de: "Ethisches Handeln" },
    description: {
      tr: "Dürüstlük, güvenilirlik, nezaket ve adalet gibi temel etik ilkelere uyarız. Hedeflerimize sadece meşru yollarla ulaşabileceğimize inanırız.",
      de: "Hizmet-Engagierte achten bei ihren Aktivitäten sowohl auf ethische Normen als auch auf moralische Grundsätze wie Ehrlichkeit, Vertrauenswürdigkeit, Güte und Fairness.",
    },
  },
  {
    id: "6",
    title: {
      tr: "Çeşitliliğe Saygı ve Çoğulculuk",
      de: "Respekt vor Vielfalt, Pluralismus",
    },
    description: {
      tr: "Kolektif ve bireysel çeşitliliği bir zenginlik olarak görürüz. İnanç farklılıklarından kaynaklanan çatışmaları önleyici bir tutum sergileriz.",
      de: "Hizmet-Engagierte betrachten die kollektive und individuelle Vielfalt als Reichtum, solange sie nicht im Widerspruch zu den grundlegenden Menschenrechten steht.",
    },
  },
  {
    id: "7",
    title: {
      tr: "Gönüllülük ve Diğerkâmlık",
      de: "Freiwilligkeit und Altruismus",
    },
    description: {
      tr: "Faaliyetlere gönüllü olarak katılırız. İnsanlığa faydalı projelere hem maddi hem de manevi destek sağlarız.",
      de: "Hizmet-Engagierte nehmen freiwillig und aus eigener Entscheidung an Aktivitäten teil. Sie beteiligen sich durch Spenden genauso wie durch ehrenamtliche Arbeit.",
    },
  },
  {
    id: "8",
    title: {
      tr: "İstişare ve Ortak Akıl",
      de: "Beratung und Erfahrungsaustausch",
    },
    description: {
      tr: "Farklı bakış açılarının ve fikirlerin paylaşılmasıyla ortaya çıkan kolektif bilgiden (ortak akıl) faydalanırız.",
      de: "Hizmet-Engagierte profitieren vom kollektiven Wissen, das durch den Austausch unterschiedlicher Perspektiven und Meinungen zustande kommt.",
    },
  },
  {
    id: "9",
    title: {
      tr: "Sivil Toplum ve Bağımsızlık",
      de: "Zivilgesellschaftlichkeit, Unabhängigkeit",
    },
    description: {
      tr: "Bağımsız bir sivil hareketiz. Demokratik değerleri benimser, dini veya siyasi araçsallaştırmaya karşı dururuz.",
      de: "Hizmet ist eine zivilgesellschaftliche Bewegung und handelt unabhängig. Für Hizmet-Engagierte sind die Verinnerlichung demokratischer Werte von besonderer Wichtigkeit.",
    },
  },
  {
    id: "10",
    title: {
      tr: "Toplumsal Katılım ve Sorumluluk",
      de: "Ziviles Engagement und Teilhabe",
    },
    description: {
      tr: "Topluma katkı sağlamayı ve sorunların çözümüne yardımcı olmayı sosyal bir sorumluluk olarak görürüz. İnsanlığı bir aile olarak kabul ederiz.",
      de: "Hizmet-Engagierte betrachten es als soziale Verantwortung, einen Beitrag zur Gesellschaft zu leisten und zur Lösung gesellschaftlicher Probleme beizutragen.",
    },
  },
  {
    id: "11",
    title: { tr: "Çevre Koruma", de: "Umweltschutz" },
    description: {
      tr: "Dünyayı ve ekosistemleri gelecek nesiller için korunması gereken bir emanet olarak görür, çevreyi koruma bilinciyle hareket ederiz.",
      de: "Hizmet-Engagierte betrachten die Erde mit all ihren Ökosystemen als ein Gut, das es für künftige Generationen zu bewahren gilt.",
    },
  },
  {
    id: "12",
    title: {
      tr: "İnsana Bütüncül Bakış",
      de: "Ganzheitlicher Blick auf den Menschen",
    },
    description: {
      tr: "İnsanın maddi ve manevi gelişimini sağlamak için hem aklı ve bilimi hem de manevi disiplinleri bir arada kullanırız.",
      de: "Hizmet-Engagierte vertreten die Auffassung, dass sowohl die Vernunft und wissenschaftlichen Erkenntnisse, als auch spirituelle Disziplinen gleichermaßen genutzt werden sollten.",
    },
  },
];

export const PRACTICE_AREAS: ValueItem[] = [
  {
    id: "1",
    title: { tr: "Eğitim", de: "Bildung" },
    description: {
      tr: "Toplumsal gelişim, barış ve fırsat eşitliği için eğitimin gücüne inanıyoruz. Okul dışı programlar, seminerler ve kurslar düzenliyoruz.",
      de: "Für Hizmet-Engagierte ist Bildung ein Weg zu gesellschaftlicher Entwicklung, Frieden, Chancengleichheit und sozialer Gerechtigkeit. Wir gründen Bildungseinrichtungen und organisieren Kurse.",
    },
  },
  {
    id: "2",
    title: { tr: "Manevi Gelişim", de: "Spirituelle Entwicklung" },
    description: {
      tr: "Bireylerin manevi ihtiyaçlarını karşılamalarına ve kendilerini geliştirmelerine yardımcı olacak kültürel ve manevi etkinlikler düzenliyoruz.",
      de: "Wir organisieren und unterstützen religiöse/spirituelle, soziale und kulturelle Aktivitäten, die helfen, spirituelle Bedürfnisse zu erfüllen und sich spirituell zu entwickeln.",
    },
  },
  {
    id: "3",
    title: {
      tr: "Diyalog ve Toplumsal Barış",
      de: "Dialog und Frieden in der Gesellschaft",
    },
    description: {
      tr: "Farklı din, etnik köken ve kültürden insanlar arasında diyaloğu geliştirerek önyargıları kırmayı ve toplumsal barışı hedefliyoruz.",
      de: "Ziel dieser Aktivitäten ist es, gesellschaftlichen Frieden zu schaffen, das gegenseitige Kennenlernen zu fördern, Einfühlungsvermögen und die Bereitschaft zu fördern, jeden Menschen so zu akzeptieren, wie er ist.",
    },
  },
  {
    id: "4",
    title: { tr: "İnsani Yardım", de: "Humanitäre Hilfe" },
    description: {
      tr: "İnsanlığa hizmeti bir sorumluluk olarak görüyor; ihtiyaç sahiplerine yardım eli uzatıyor ve sürdürülebilir kalkınma projelerini destekliyoruz.",
      de: "Hizmet-Engagierte betrachten den Dienst an der Menschheit als soziale Verantwortung und auch als gelebte Spiritualität. Wir stellen Menschen in Not Nahrungsmittel und Unterkünfte zur Verfügung.",
    },
  },
  {
    id: "5",
    title: { tr: "Sanat ve Kültür", de: "Kunst und Kultur" },
    description: {
      tr: "Sanatın evrensel diliyle iletişimi güçlendiriyor, yeteneklerin gelişimine katkı sağlayan kurslar ve festivaller düzenliyoruz.",
      de: "Als universelle Sprache fördern Kunst und Kultur Kommunikation, Frieden und Harmonie. Wir organisieren Aktivitäten wie Kunstkurse, Kunstaufführungen sowie Sprach- und Kulturfestivals.",
    },
  },
  {
    id: "6",
    title: { tr: "Yayınlar", de: "Veröffentlichungen" },
    description: {
      tr: "Evrensel insani değerleri, barışı ve çevre bilincini yaymak amacıyla çeşitli yayınlarla toplumu bilgilendiriyoruz.",
      de: "Hizmet-Engagierte publizieren Zeitschriften, Magazine und Bücher zur Förderung und Verbreitung universeller menschlicher Werte wie gesellschaftlicher Frieden.",
    },
  },
];

export const FOCUS_AREAS: ValueItem[] = [
  {
    id: "f1",
    title: {
      tr: "Kadınlar: Toplumsal Cinsiyet Adaleti",
      de: "Frauen: Geschlechtergerechtigkeit und Gender",
    },
    description: {
      tr: "Eşitlik, barışçıl bir birliktelik için esastır. Cinsiyet, cinsel yönelim veya kimliğe dayalı ayrımcılıkla mücadele ediyoruz. Cinsiyet konularının birçok alanla kesiştiğinin farkındayız. Genel sosyo-politik soruların yanı sıra, odağımız bu konu kompleksinin dini boyutudur. Burada düşünme süreçlerini teşvik etmek ve stereotipleri yıkmak istiyoruz.",
      de: "Gleichberechtigung ist essentiell für ein friedliches Zusammenleben. Wir wollen auf die virulenten Probleme aufmerksam machen und gemeinsam an ihrer Überwindung arbeiten. Neben den allgemeinen gesellschaftspolitischen Fragen liegt unser Schwerpunkt auf der religiösen Dimension des Themenkomplexes. Hier wollen wir zu Reflexionsprozessen anregen und Stereotype aufarbeiten.",
    },
  },
  {
    id: "f2",
    title: { tr: "Sosyal Katılım", de: "Soziale Teilhabe" },
    description: {
      tr: "Tüm insanların sosyal hayata eşit erişim hakkına sahip olması gerektiğine inanıyoruz. Dezavantajlı gruplar için kültürel ve sanatsal teklifleri erişilebilir kılmaya yardımcı olmak istiyoruz. Bu nedenle müzeler, sergiler veya tarihi yerlere geziler ve şehir turları düzenliyoruz.",
      de: "Wir sind davon überzeugt, dass alle Menschen ein Recht auf einen gleichberechtigten Zugang zum gesellschaftlichen Leben haben sollen. Wir wollen dabei helfen, kulturelle und künstlerische Angebote für alle Mitglieder dieser Gesellschaft verfügbar zu machen. Deswegen organisieren wir Ausflüge, Städtetrips und Besuche zu Museen, Ausstellungen oder historischen Sehenswürdigkeiten.",
    },
  },
  {
    id: "f3",
    title: {
      tr: "Kültürlerarası ve Dinlerarası Diyalog",
      de: "Interkultureller und Interreligiöser Dialog",
    },
    description: {
      tr: "Diyalog çalışmasının önemli bir kısmı karşılaşmalara dayanır. İnsanların ayrımcılık korkusu olmadan birbirlerini tanıyabilecekleri güvenli alanlar yaratmayı görev edindik. Yahudi-Hristiyan-İslam üçlü diyaloğu temel çalışma alanlarımızdan biridir. Farklı gelenekleri tanımak ve hikayelerini anlamak istiyoruz. Yeni kurulan Anadolu Kardeşliği (AnKa) girişimimiz buna örnektir.",
      de: "Anonymität birgt die Gefahr, dass sich Ängste vor dem Unbekannten entwickeln. Deswegen haben wir es uns zur Aufgabe gemacht, sichere Räume für Begegnungen zu schaffen. Eines unserer zentralen Betätigungsfelder ist dabei der jüdisch-christlich-islamische Trialog. Diese Arbeit findet u.a. in unserer neugegründeten Initiative Anatolische Geschwisterlichkeit (AnKa) besonderen Ausdruck.",
    },
  },
];

export const PARTNERS: Partner[] = [
  {
    id: "1",
    name: "Time to Help",
    description: {
      tr: "Uluslararası insani yardım kuruluşu.",
      de: "Internationale humanitäre Hilfsorganisation.",
    },
    logoUrl: "/assets/tth-logo-1a.png.webp",
    websiteUrl: "https://timetohelp.de/",
  },
  {
    id: "2",
    name: "Forum Dialog",
    description: {
      tr: "Diyalog ve kültürlerarası anlayış platformu.",
      de: "Plattform für Dialog und interkulturelles Verständnis.",
    },
    logoUrl: "/assets/R.jpeg",
    websiteUrl: "https://forumdialog.org/",
  },
  {
    id: "3",
    name: "Tenkil Müzesi",
    description: {
      tr: "İnsan hakları ve hafıza müzesi.",
      de: "Museum für Menschenrechte und Erinnerung.",
    },
    logoUrl: "/assets/tenkil_logo_yanyana-600x84-1.png",
    websiteUrl: "https://tenkilmuseum.com/",
  },
];

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: "1",
    title: {
      tr: "Geleneksel Türk Müziği Konseri",
      de: "Konzert für traditionelle türkische Musik",
    },
    description: {
      tr: "Freiburg konser salonunda gerçekleşecek olan bu özel gecede, Türk Sanat Müziğinin en seçkin eserleri icra edilecektir. Gecemizde sürpriz konuk sanatçılar ve geleneksel enstrümanlarla unutulmaz bir müzik şöleni sizleri bekliyor.",
      de: "An diesem besonderen Abend im Konzerthaus Freiburg werden die herausragendsten Werke der türkischen Kunstmusik aufgeführt. Erleben Sie ein unvergessliches Musikfest mit Überraschungsgästen und traditionellen Instrumenten.",
    },
    detailedContent: {
      tr: "<h3>Program Detayları</h3><p>Bu özel gecede Türk Sanat Müziğinin en seçkin eserlerini dinleyeceksiniz. Konserda klasik saz eserleri, Dede Efendi, Itri gibi usta bestekârların eserleri seslendirilecektir.</p><h3>Sanatçılar</h3><ul><li>Ahmet Yılmaz - Ud</li><li>Ayşe Demir - Ses</li><li>Mehmet Kaya - Kanun</li></ul>",
      de: "<h3>Programmdetails</h3><p>An diesem besonderen Abend hören Sie die herausragendsten Werke der türkischen Kunstmusik. Das Konzert präsentiert klassische Saz-Stücke und Werke von Meisterkomponisten wie Dede Efendi und Itri.</p><h3>Künstler</h3><ul><li>Ahmet Yılmaz - Ud</li><li>Ayşe Demir - Gesang</li><li>Mehmet Kaya - Kanun</li></ul>",
    },
    date: { tr: "15 Mayıs 2024 - 19:30", de: "15. Mai 2024 - 19:30" },
    dateISO: "2025-05-15",
    location: "Konzerthaus Freiburg",
    category: "music",
    imageUrl: "https://picsum.photos/800/600?random=1",
    galleryImages: [
      "https://picsum.photos/800/600?random=10",
      "https://picsum.photos/800/600?random=11",
      "https://picsum.photos/800/600?random=12",
      "https://picsum.photos/800/600?random=13",
    ],
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: "2",
    title: {
      tr: "Ebru Sanatı Atölyesi",
      de: "Ebrupapier-Kunst-Workshop",
    },
    description: {
      tr: "Su üzerine resim yapma sanatı olan Ebru'yu öğrenmek isteyenler için başlangıç seviyesi atölye çalışması. Kendi renklerinizi suyla buluşturun ve benzersiz eserler ortaya çıkarın. Malzemeler derneğimiz tarafından karşılanacaktır.",
      de: "Ein Anfänger-Workshop für alle, die die Kunst des Malens auf Wasser (Ebru) erlernen möchten. Verbinden Sie Ihre eigenen Farben mit dem Wasser und erschaffen Sie einzigartige Werke. Materialien werden gestellt.",
    },
    date: { tr: "22 Haziran 2024 - 14:00", de: "22. Juni 2024 - 14:00" },
    dateISO: "2025-06-22",
    location: "KPF Kültür Merkezi",
    category: "art",
    imageUrl: "https://picsum.photos/800/600?random=2",
  },
  {
    id: "3",
    title: {
      tr: "Çift Dilli Okuma Günleri",
      de: "Zweisprachige Lesetage",
    },
    description: {
      tr: "Çocuklar için hem Türkçe hem Almanca kitapların okunduğu, kültürel etkileşimi artıran etkinlik. Çocuklarınızın dil gelişimine katkıda bulunmak ve onlara okuma sevgisi aşılamak için harika bir fırsat.",
      de: "Eine Veranstaltung, bei der Bücher auf Türkisch und Deutsch gelesen werden, um den kulturellen Austausch für Kinder zu fördern. Eine großartige Gelegenheit, die Sprachentwicklung Ihrer Kinder zu unterstützen und ihnen die Liebe zum Lesen zu vermitteln.",
    },
    date: { tr: "Her Cumartesi - 11:00", de: "Jeden Samstag - 11:00" },
    dateISO: "2025-12-06",
    location: "Stadtbibliothek",
    category: "education",
    imageUrl: "https://picsum.photos/800/600?random=3",
  },
  {
    id: "4",
    title: {
      tr: "Anadolu Lezzetleri Kermesi",
      de: "Basar für anatolische Köstlichkeiten",
    },
    description: {
      tr: "Türk mutfağının eşsiz lezzetlerinin sunulduğu, geliri eğitim burslarına aktarılacak kermes. Ev yapımı mantılar, sarmalar ve tatlılar eşliğinde keyifli bir gün geçirin.",
      de: "Ein Basar mit einzigartigen Geschmäckern der türkischen Küche, dessen Erlös in Bildungsstipendien fließt. Genießen Sie hausgemachte Köstlichkeiten wie Manti, Sarma und Desserts.",
    },
    date: { tr: "10 Temmuz 2024 - 10:00", de: "10. Juli 2024 - 10:00" },
    dateISO: "2025-07-10",
    location: "Münsterplatz",
    category: "social",
    imageUrl: "https://picsum.photos/800/600?random=4",
  },
];

export const COURSES_DATA: Course[] = [
  {
    id: "c1",
    title: { tr: "Almanca Kursu", de: "Deutschkurs" },
    description: {
      tr: "Her seviyeye uygun pratik ağırlıklı Almanca dersleri.",
      de: "Praxisorientierter Deutschunterricht für alle Niveaus.",
    },
    details: {
      tr: "Tecrübeli eğitmenler eşliğinde A1'den C1 seviyesine kadar yoğunlaştırılmış Almanca kursları. Konuşma pratikleri ve gramer eğitimi iç içe.",
      de: "Intensive Deutschkurse von A1 bis C1 mit erfahrenen Lehrern. Sprechpraxis und Grammatiktraining integriert.",
    },
    icon: "MessageCircle",
    schedule: { tr: "Pazartesi / Çarşamba", de: "Montag / Mittwoch" },
    instructor: "Dr. Maria Schmidt",
    date: "2025-01-15",
    address: "KPF Kültür Merkezi, Böcklerstraße 3, 79110 Freiburg",
  },
  {
    id: "c2",
    title: { tr: "Türkçe Kursu", de: "Türkischkurs" },
    description: {
      tr: "Ana dilini geliştirmek veya yeni öğrenmek isteyenler için.",
      de: "Für alle, die ihre Muttersprache verbessern oder neu lernen möchten.",
    },
    details: {
      tr: "Çocuklar ve yetişkinler için ayrı sınıflarda, kültürel öğelerle zenginleştirilmiş Türkçe eğitimi. Okuma ve yazma becerilerini geliştirin.",
      de: "Türkischunterricht, angereichert mit kulturellen Elementen, in separaten Klassen für Kinder und Erwachsene. Verbessern Sie Lese- und Schreibfähigkeiten.",
    },
    icon: "Languages",
    schedule: { tr: "Salı / Perşembe", de: "Dienstag / Donnerstag" },
    instructor: "Ayşe Yilmaz",
    date: "2025-01-20",
    address: "KPF Kültür Merkezi, Böcklerstraße 3, 79110 Freiburg",
  },
  {
    id: "c3",
    title: { tr: "Gitar Kursu", de: "Gitarrenunterricht" },
    description: {
      tr: "Müzikle ruhunuzu dinlendirin. Başlangıç ve orta seviye.",
      de: "Entspannen Sie Ihre Seele mit Musik. Anfänger und Fortgeschrittene.",
    },
    details: {
      tr: "Nota bilgisi ve pratik uygulama ile gitar çalmayı öğrenin. Bireysel ve grup dersi seçenekleri mevcuttur.",
      de: "Lernen Sie Gitarre spielen mit Notenkenntnissen und praktischer Anwendung. Einzel- und Gruppenunterricht verfügbar.",
    },
    icon: "Music",
    schedule: { tr: "Cuma", de: "Freitag" },
    instructor: "Prof. Ahmet Özkan",
    date: "2025-02-01",
    address: "Musik Studio, Freiburg",
  },
  {
    id: "c4",
    title: { tr: "Kuran Eğitimi", de: "Koranunterricht" },
    description: {
      tr: "Çocuklar ve yetişkinler için tecvidli Kuran okuma dersleri.",
      de: "Koranlesekurse mit Tajweed für Kinder und Erwachsene.",
    },
    details: {
      tr: "Usulüne uygun Kuran okuma, tecvid kuralları ve temel dini bilgiler eğitimi.",
      de: "Koranlesen nach den Regeln, Tajweed und grundlegendes religiöses Wissen.",
    },
    icon: "BookOpen",
    schedule: { tr: "Hafta sonu", de: "Wochenende" },
    instructor: "Imam Hassan",
    date: "2025-01-25",
    address: "KPF İbadet Merkezi, Freiburg",
  },
  {
    id: "c5",
    title: { tr: "Değerler ve Siyer", de: "Werte und Siyer" },
    description: {
      tr: "Hz. Muhammed'in (sav) hayatı ve evrensel ahlaki değerler.",
      de: "Das Leben des Propheten (s.a.w.) und universelle moralische Werte.",
    },
    details: {
      tr: "Peygamber efendimizin örnek hayatı üzerinden günümüze ışık tutan değerler eğitimi seminerleri.",
      de: "Werteerziehungsseminare, die durch das beispielhafte Leben des Propheten Licht auf unsere heutige Zeit werfen.",
    },
    icon: "Heart",
    schedule: { tr: "Pazar", de: "Sonntag" },
    instructor: "Dr. Mehmet Arslan",
    date: "2025-02-10",
    address: "KPF Kültür Merkezi, Böcklerstraße 3, 79110 Freiburg",
  },
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "1",
    name: "Ünal Çakır",
    role: { tr: "Başkan", de: "Vorsitzender" },
    bio: {
      tr: "Ünal Çakır, derneğimizin başkanı olarak kültür ve diyalog misyonumuzu liderlik etmektedir.",
      de: "Ünal Çakır leitet unseren Verein als Vorsitzender und führt unsere Kultur- und Dialogmission.",
    },
    imageUrl: "https://picsum.photos/300/300?random=10",
  },
  {
    id: "2",
    name: "Yusuf Atçı",
    role: { tr: "Ko-Başkan", de: "Ko-Vorsitzender" },
    bio: {
      tr: "Yusuf Atçı, Ko-Başkan olarak derneğimizin vizyonunun hayata geçirilmesinde önemli rol oynamaktadır.",
      de: "Yusuf Atçı spielt als Ko-Vorsitzender eine wichtige Rolle bei der Umsetzung unserer Vereinsvision.",
    },
    imageUrl: "https://picsum.photos/300/300?random=11",
  },
  // {
  //   id: "3",
  //   name: { tr: "Hans Müller", de: "Hans Müller" },
  //   role: { tr: "Genel Sekreter", de: "Generalsekretär" },
  //   bio: {
  //     tr: "Türk-Alman dostluğu üzerine çalışmalar yapan sosyolog. Kültürlerarası diyalog projelerinde uzmanlaşmıştır.",
  //     de: "Soziologe, der an der türkisch-deutschen Freundschaft arbeitet. Er ist spezialisiert auf interkulturelle Dialogprojekte.",
  //   },
  //   imageUrl: "https://picsum.photos/300/300?random=12",
  //   email: "hans@example.com",
  // },
];
