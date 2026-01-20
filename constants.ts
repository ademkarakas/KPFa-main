import { Translation, Partner } from "./types";

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
  admin_menu_team: { tr: "Kullanıcılar", de: "Benutzer" },
  admin_menu_partners: { tr: "Partnerler", de: "Partner" },
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
  admin_publish: {
    tr: "Sitede Yayınla",
    de: "Auf der Website veröffentlichen",
  },
  admin_preview_title: {
    tr: "Önizleme",
    de: "Vorschau",
  },
  admin_preview_subtext: {
    tr: "Almanca bölüm her zaman üstte görünür.",
    de: "Der deutsche Abschnitt bleibt immer oben sichtbar.",
  },
  admin_social_media: { tr: "Sosyal Medya", de: "Soziale Medien" },
  admin_no_content: { tr: "Henüz içerik yok", de: "Noch kein Inhalt" },
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

  about_values_title: { tr: "Temel Değerlerimiz", de: "Grundwerte" },
  about_practices_title: {
    tr: "Faaliyet Alanlarımız",
    de: "Hizmet-Werte in der Praxis",
  },
  about_focus_title: { tr: "Odak Noktalarımız", de: "Unsere Schwerpunkte" },
  partners_title: { tr: "Çözüm Ortaklarımız", de: "Partnerschaften" },

  // Activities & Teegespräche
  activities_title: { tr: "Faaliyetlerimiz", de: "Unsere Aktivitäten" },
  activities_filter_all: { tr: "Tümü", de: "Alle" },
  activities_filter_music: { tr: "Müzik", de: "Musik" },
  activities_filter_art: { tr: "Sanat", de: "Kunst" },
  activities_filter_education: { tr: "Eğitim", de: "Bildung" },
  activities_filter_social: { tr: "Sosyal", de: "Soziales" },
  activities_filter_sports: { tr: "Spor", de: "Sport" },

  teegespraeche_title: { tr: "Çay Sohbetleri", de: "Teegespräche" },

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

  donate_bank_title: { tr: "Banka Hesap Bilgileri", de: "Bankverbindung" },
  donate_paypal_title: { tr: "PayPal ile Bağış", de: "Spenden über PayPal" },
  donate_paypal_button: {
    tr: "PayPal ile Bağış Yap",
    de: "Mit PayPal spenden",
  },

  contact_title: { tr: "İletişime Geçin", de: "Kontaktieren Sie uns" },
  contact_form_anrede: { tr: "Anrede seçin", de: "Anrede wählen" },
  contact_form_anrede_mr: { tr: "Bay", de: "Herr" },
  contact_form_anrede_mrs: { tr: "Bayan", de: "Frau" },
  contact_form_anrede_other: { tr: "Diğer", de: "Divers" },
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

export const PARTNERS: Partner[] = [
  {
    id: "1",
    name: "Time to Help",
    description: {
      tr: "Uluslararası insani yardım kuruluşu.",
      de: "Internationale humanitäre Hilfsorganisation.",
    },
    logoUrl: "/assets/tth-logo-1a.png.webp",
    websiteUrl: "https://timetohelp.eu/",
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
