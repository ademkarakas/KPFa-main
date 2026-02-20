import { Translation, Partner } from "./types";

export const TEXTS: Record<string, Translation> = {
  common_site_title: {
    tr: "Kültür Platformu Freiburg",
    de: "KulturPlattform Freiburg",
  },
  common_site_description: {
    tr: "Freiburg Kültür Platformu (KPF), Freiburg'da kültürel değişimi ve toplumsal katılımı teşvik eden bir inisiyatiftir.",
    de: "Kultur Plattform Freiburg (KPF) ist eine Initiative, die den kulturellen Austausch und das gesellschaftliche Engagement in Freiburg fördert.",
  },
  nav_home: { tr: "Ana Sayfa", de: "Startseite" },
  nav_about: { tr: "Hakkımızda", de: "Über Uns" },
  nav_activities: { tr: "Faaliyetler", de: "Aktivitäten" },
  nav_activities_all: { tr: "Tüm Etkinlikler", de: "Alle Aktivitäten" },
  nav_teegespraeche: { tr: "Çay Sohbetleri", de: "Teegespräche" },
  nav_courses: { tr: "Kurslar", de: "Kursangebote" },
  nav_donate: { tr: "Bağış Yap", de: "Spenden" },
  nav_contact: { tr: "İletişim", de: "Kontakt" },

  // Language names
  common_language_tr: { tr: "Türkçe", de: "Türkisch" },
  common_language_de: { tr: "Deutsch", de: "Deutsch" },

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
  admin_logout: { tr: "Çıkış Yap", de: "Abmelden" },
  admin_website: { tr: "Siteyi Görüntüle", de: "Website ansehen" },

  // Admin Menu
  admin_menu_dashboard: { tr: "Kontrol Paneli", de: "Dashboard" },
  admin_menu_home: { tr: "Anasayfa", de: "Startseite" },
  admin_menu_about: { tr: "Hakkımızda", de: "Über Uns" },
  admin_menu_about_us: { tr: "Hakkımızda", de: "Über Uns" },
  admin_menu_guelen: { tr: "Gülen Hareketi", de: "Guelen Bewegung" },
  admin_menu_satzung: { tr: "Tüzük", de: "Satzung" },
  admin_menu_content: { tr: "İçerik", de: "Inhalte" },
  admin_menu_management: { tr: "Yönetim", de: "Verwaltung" },
  admin_menu_volunteer_page: {
    tr: "Gönüllü Ol",
    de: "Freiwillig Mitmachen",
  },
  admin_menu_system: { tr: "Sistem", de: "System" },
  admin_menu_translations: { tr: "Çeviriler", de: "Übersetzungen" },
  admin_menu_activities: { tr: "Etkinlikler", de: "Aktivitäten" },
  admin_menu_teegespraeche: { tr: "Çay Sohbetleri", de: "Teegespräche" },
  admin_menu_courses: { tr: "Kurslar", de: "Kurse" },
  admin_menu_team: { tr: "Kullanıcılar", de: "Benutzer" },
  admin_menu_partners: { tr: "Partnerler", de: "Partner" },
  admin_menu_volunteers: { tr: "Gönüllüler", de: "Freiwillige" },
  admin_menu_newsletter: { tr: "Bülten", de: "Newsletter" },
  admin_menu_newsletter_subscribers: {
    tr: "Bülten Aboneleri",
    de: "Newsletter-Abonnenten",
  },
  admin_menu_newsletter_campaigns: {
    tr: "Bülten Kampanyaları",
    de: "Newsletter-Kampagnen",
  },
  admin_menu_change_password: { tr: "Şifre Değiştir", de: "Passwort ändern" },
  admin_imprint_title: { tr: "Künye", de: "Impressum" },
  admin_donate_title: { tr: "Bağış", de: "Spende" },

  // Admin Change Password
  admin_change_password_title: { tr: "Şifre Değiştir", de: "Passwort ändern" },
  admin_change_password_subtitle: {
    tr: "Hesap güvenliğiniz için şifrenizi güncelleyin",
    de: "Aktualisieren Sie Ihr Passwort für die Kontosicherheit",
  },
  admin_change_password_current: {
    tr: "Mevcut Şifre",
    de: "Aktuelles Passwort",
  },
  admin_change_password_current_placeholder: {
    tr: "Mevcut şifrenizi girin",
    de: "Geben Sie Ihr aktuelles Passwort ein",
  },
  admin_change_password_new: { tr: "Yeni Şifre", de: "Neues Passwort" },
  admin_change_password_new_placeholder: {
    tr: "Yeni şifrenizi girin",
    de: "Geben Sie Ihr neues Passwort ein",
  },
  admin_change_password_confirm: {
    tr: "Yeni Şifreyi Onayla",
    de: "Neues Passwort bestätigen",
  },
  admin_change_password_confirm_placeholder: {
    tr: "Yeni şifrenizi tekrar girin",
    de: "Geben Sie Ihr neues Passwort erneut ein",
  },
  admin_change_password_requirements: {
    tr: "Şifre en az 6 karakter olmalıdır",
    de: "Das Passwort muss mindestens 6 Zeichen lang sein",
  },
  admin_change_password_submit: {
    tr: "Şifreyi Güncelle",
    de: "Passwort aktualisieren",
  },
  admin_change_password_updating: {
    tr: "Güncelleniyor...",
    de: "Wird aktualisiert...",
  },
  admin_change_password_success: {
    tr: "Şifreniz başarıyla güncellendi",
    de: "Ihr Passwort wurde erfolgreich aktualisiert",
  },
  admin_change_password_error: {
    tr: "Şifre güncellenirken bir hata oluştu",
    de: "Beim Aktualisieren des Passworts ist ein Fehler aufgetreten",
  },
  admin_change_password_all_fields_required: {
    tr: "Tüm alanları doldurun",
    de: "Alle Felder müssen ausgefüllt werden",
  },
  admin_change_password_min_length: {
    tr: "Yeni şifre en az 6 karakter olmalıdır",
    de: "Das neue Passwort muss mindestens 6 Zeichen lang sein",
  },
  admin_change_password_no_match: {
    tr: "Yeni şifreler eşleşmiyor",
    de: "Die neuen Passwörter stimmen nicht überein",
  },
  admin_change_password_same_as_current: {
    tr: "Yeni şifre mevcut şifreden farklı olmalıdır",
    de: "Das neue Passwort muss sich vom aktuellen unterscheiden",
  },
  admin_change_password_security_tips_title: {
    tr: "Güvenlik İpuçları",
    de: "Sicherheitstipps",
  },
  admin_change_password_tip_1: {
    tr: "Güçlü bir şifre için büyük harf, küçük harf, rakam ve özel karakterler kullanın",
    de: "Verwenden Sie Groß- und Kleinbuchstaben, Zahlen und Sonderzeichen für ein sicheres Passwort",
  },
  admin_change_password_tip_2: {
    tr: "Şifrenizi başka hiçbir yerde kullanmayın",
    de: "Verwenden Sie Ihr Passwort nirgendwo anders",
  },
  admin_change_password_tip_3: {
    tr: "Şifrenizi düzenli olarak güncelleyin",
    de: "Aktualisieren Sie Ihr Passwort regelmäßig",
  },

  // Admin Settings
  admin_settings_title: { tr: "Ayarlar", de: "Einstellungen" },
  admin_settings_subtitle: {
    tr: "Hesap ayarlarınızı yönetin",
    de: "Verwalten Sie Ihre Kontoeinstellungen",
  },
  admin_settings_menu: { tr: "Ayarlar", de: "Einstellungen" },
  admin_settings_name: { tr: "İsim", de: "Name" },
  admin_settings_email: { tr: "E-posta", de: "E-Mail" },
  admin_settings_role: { tr: "Rol", de: "Rolle" },
  admin_settings_password: { tr: "Şifre", de: "Passwort" },
  admin_settings_name_placeholder: {
    tr: "İsminizi girin",
    de: "Geben Sie Ihren Namen ein",
  },
  admin_settings_email_placeholder: {
    tr: "E-posta adresinizi girin",
    de: "Geben Sie Ihre E-Mail-Adresse ein",
  },
  admin_settings_name_required: {
    tr: "İsim gereklidir",
    de: "Name ist erforderlich",
  },
  admin_settings_email_required: {
    tr: "E-posta gereklidir",
    de: "E-Mail ist erforderlich",
  },
  admin_settings_email_invalid: {
    tr: "Geçersiz e-posta adresi",
    de: "Ungültige E-Mail-Adresse",
  },
  admin_settings_update_success: {
    tr: "Bilgileriniz başarıyla güncellendi",
    de: "Ihre Informationen wurden erfolgreich aktualisiert",
  },
  admin_settings_update_error: {
    tr: "Güncelleme sırasında bir hata oluştu",
    de: "Beim Aktualisieren ist ein Fehler aufgetreten",
  },
  admin_settings_security_tips: {
    tr: "Güvenlik İpuçları",
    de: "Sicherheitstipps",
  },
  admin_settings_relogin_required: {
    tr: "Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.",
    de: "Ihre Sitzung ist abgelaufen. Bitte melden Sie sich erneut an.",
  },

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
  admin_total: { tr: "Toplam", de: "Insgesamt" },
  admin_search: { tr: "Ara...", de: "Suchen..." },
  admin_new: { tr: "Yeni", de: "Neu" },
  admin_edit: { tr: "Düzenle", de: "Bearbeiten" },
  admin_delete: { tr: "Sil", de: "Löschen" },
  admin_save: { tr: "Kaydet", de: "Speichern" },
  admin_saving: { tr: "Kaydediliyor...", de: "Wird gespeichert..." },
  admin_update: { tr: "Güncelle", de: "Aktualisieren" },
  admin_create: { tr: "Oluştur", de: "Erstellen" },
  admin_cancel: { tr: "İptal", de: "Abbrechen" },
  admin_actions: { tr: "İşlemler", de: "Aktionen" },
  admin_active: { tr: "Aktif", de: "Aktiv" },
  admin_inactive: { tr: "Pasif", de: "Inaktiv" },
  admin_loading: { tr: "Yükleniyor...", de: "Lädt..." },
  admin_url_placeholder: {
    tr: "https://example.com",
    de: "https://example.com",
  },
  admin_preview_alt: { tr: "Önizleme", de: "Vorschau" },
  admin_website_short: { tr: "Website", de: "Website" },
  admin_confirm_delete: {
    tr: "Silmek istediğinize emin misiniz?",
    de: "Möchten Sie wirklich löschen?",
  },
  admin_add: { tr: "Ekle", de: "Hinzufügen" },
  admin_uploaded: { tr: "Yüklendi", de: "Hochgeladen" },
  admin_clear_search: { tr: "Aramayı Temizle", de: "Suche zurücksetzen" },
  admin_fill_all_fields: {
    tr: "Tüm alanları doldurun",
    de: "Füllen Sie alle Felder aus",
  },
  admin_content_tr: {
    tr: "Türkçe (TR) İçerik",
    de: "Türkisch (TR) Inhalt",
  },
  admin_content_de: {
    tr: "Almanca (DE) İçerik",
    de: "Deutsch (DE) Inhalt",
  },
  admin_toggle_on: { tr: "AÇIK", de: "AN" },
  admin_toggle_off: { tr: "KAPALI", de: "AUS" },
  admin_publish_status_label: {
    tr: "Yayın Durumu",
    de: "Veröffentlichungsstatus",
  },
  admin_publish_status_help: {
    tr: "Etkinlik web sitesinde görünsün mü?",
    de: "Soll die Aktivität auf der Website sichtbar sein?",
  },
  admin_unknown_error: { tr: "Bilinmeyen hata", de: "Unbekannter Fehler" },
  admin_save_failed: {
    tr: "Kaydedilirken hata oluştu",
    de: "Fehler beim Speichern",
  },
  admin_delete_failed: {
    tr: "Silinirken hata oluştu",
    de: "Fehler beim Löschen",
  },
  admin_created_success: {
    tr: "Başarıyla eklendi!",
    de: "Erfolgreich hinzugefügt!",
  },
  admin_updated_success: {
    tr: "Başarıyla güncellendi!",
    de: "Erfolgreich aktualisiert!",
  },
  admin_try_again: {
    tr: "Hata oluştu, lütfen tekrar deneyin.",
    de: "Ein Fehler ist aufgetreten, bitte erneut versuchen.",
  },
  admin_operation_failed: {
    tr: "❌ İşlem başarısız!",
    de: "❌ Vorgang fehlgeschlagen!",
  },

  // Admin Home
  admin_home_title: { tr: "Anasayfa Yönetimi", de: "Homepage-Verwaltung" },
  admin_home_subtitle: {
    tr: "Anasayfa içeriğini düzenle",
    de: "Homepage bearbeiten",
  },
  admin_section_hero: { tr: "Hero Bölümü", de: "Hero-Bereich" },
  admin_home_hero_saved: {
    tr: "Hero bölümü kaydedildi",
    de: "Hero-Bereich gespeichert",
  },
  admin_home_features_title: {
    tr: "Özellikler (3 Sütun)",
    de: "Features (3 Säulen)",
  },
  admin_home_edit_feature: {
    tr: "Özelliği Düzenle",
    de: "Feature bearbeiten",
  },
  admin_feature_saved: { tr: "Özellik kaydedildi", de: "Feature gespeichert" },
  admin_feature_deleted: { tr: "Özellik silindi", de: "Feature gelöscht" },
  admin_field_icon_type: { tr: "İkon Türü", de: "Icon-Typ" },
  admin_icon_users: { tr: "Kişiler", de: "Personen" },
  admin_icon_sparkles: { tr: "Parlak", de: "Glitzernd" },
  admin_icon_calendar: { tr: "Takvim", de: "Kalender" },
  admin_field_title_tr: { tr: "Başlık (TR)", de: "Titel (TR)" },
  admin_field_title_de: { tr: "Başlık (DE)", de: "Titel (DE)" },
  admin_field_subtitle_tr: { tr: "Alt Başlık (TR)", de: "Untertitel (TR)" },
  admin_field_subtitle_de: { tr: "Alt Başlık (DE)", de: "Untertitel (DE)" },
  admin_field_description_tr: {
    tr: "Açıklama (TR)",
    de: "Beschreibung (TR)",
  },
  admin_field_description_de: {
    tr: "Açıklama (DE)",
    de: "Beschreibung (DE)",
  },
  admin_field_background_image_url: {
    tr: "Arka Plan Görsel URL",
    de: "Hintergrundbild URL",
  },
  admin_field_background_image_file: {
    tr: "Arka Plan Görseli (Dosya)",
    de: "Hintergrundbild (Datei)",
  },
  admin_field_primary_button_text_tr: {
    tr: "Ana Buton Metni (TR)",
    de: "Primär-Schaltflächentext (TR)",
  },
  admin_field_primary_button_text_de: {
    tr: "Ana Buton Metni (DE)",
    de: "Primär-Schaltflächentext (DE)",
  },
  admin_field_secondary_button_text_tr: {
    tr: "İkincil Buton Metni (TR)",
    de: "Sekundär-Schaltflächentext (TR)",
  },
  admin_field_secondary_button_text_de: {
    tr: "İkincil Buton Metni (DE)",
    de: "Sekundär-Schaltflächentext (DE)",
  },
  admin_section_instagram: {
    tr: "Instagram Bölümü",
    de: "Instagram-Bereich",
  },
  admin_home_instagram_saved: {
    tr: "Instagram bölümü kaydedildi",
    de: "Instagram-Bereich gespeichert",
  },
  admin_field_instagram_handle: {
    tr: "Instagram Hesabı",
    de: "Instagram-Konto",
  },
  admin_instagram_item_saved: {
    tr: "Instagram görseli kaydedildi",
    de: "Instagram-Bild gespeichert",
  },
  admin_instagram_item_deleted: {
    tr: "Instagram görseli silindi",
    de: "Instagram-Bild gelöscht",
  },
  admin_edit_instagram_item: {
    tr: "Instagram Görseli Düzenle",
    de: "Instagram-Bild bearbeiten",
  },
  admin_no_instagram_items: {
    tr: "Henüz Instagram görseli eklenmedi",
    de: "Noch keine Instagram-Bilder hinzugefügt",
  },
  admin_field_image_url: {
    tr: "Görsel URL",
    de: "Bild-URL",
  },
  admin_field_link: {
    tr: "Bağlantı",
    de: "Link",
  },
  admin_optional: {
    tr: "opsiyonel",
    de: "optional",
  },
  admin_no_image: {
    tr: "Görsel yok",
    de: "Kein Bild",
  },
  admin_section_cta: {
    tr: "Çağrı Bölümü (CTA)",
    de: "Call-to-Action-Bereich",
  },
  admin_home_cta_saved: {
    tr: "CTA bölümü kaydedildi",
    de: "CTA-Bereich gespeichert",
  },

  // Admin Imprint
  admin_imprint_subtitle: {
    tr: "Yasal bilgileri ve künye içeriğini düzenleyin",
    de: "Rechtliche Informationen und Impressum bearbeiten",
  },
  admin_imprint_created: {
    tr: "Künye başarıyla oluşturuldu!",
    de: "Impressum erfolgreich erstellt!",
  },
  admin_imprint_updated: {
    tr: "Künye başarıyla güncellendi!",
    de: "Impressum erfolgreich aktualisiert!",
  },
  admin_imprint_failed: {
    tr: "İşlem başarısız",
    de: "Vorgang fehlgeschlagen",
  },

  // Admin Teegespraeche
  admin_teegespraeche_admin_title: {
    tr: "Tee-Gespräche Yönetimi",
    de: "Teegespräche Verwaltung",
  },
  admin_teegespraeche_admin_subtitle: {
    tr: "Çay Sohbetleri etkinlik içeriklerini buradan güncelleyebilirsiniz",
    de: "Hier können Sie die Inhalte der Teegespräche aktualisieren",
  },
  admin_teegespraeche_add_new: {
    tr: "Yeni Etkinlik Ekle",
    de: "Neue Veranstaltung hinzufügen",
  },
  admin_mode_edit: { tr: "DÜZENLEME MODU", de: "BEARBEITUNGSMODUS" },
  admin_mode_new: { tr: "YENİ KAYIT MODU", de: "NEUER EINTRAG" },
  admin_teegespraeche_confirm_delete: {
    tr: "Bu Tee-Gespräch'i silmek istediğinize emin misiniz?",
    de: "Möchten Sie dieses Teegespräch wirklich löschen?",
  },

  // Admin Translations
  admin_translations_title: {
    tr: "Çeviri Yönetimi",
    de: "Übersetzungsverwaltung",
  },
  admin_translations_subtitle: {
    tr: "Backend'den gelen dinamik çevirileri yönetin",
    de: "Dynamische Übersetzungen aus dem Backend verwalten",
  },
  admin_translations_new: {
    tr: "Yeni Çeviri Ekle",
    de: "Neue Übersetzung hinzufügen",
  },
  admin_translations_search_label: { tr: "Ara", de: "Suchen" },
  admin_translations_search_placeholder: {
    tr: "Key, Türkçe, Almanca...",
    de: "Key, Türkisch, Deutsch...",
  },
  admin_translations_section_label: { tr: "Bölüm", de: "Bereich" },
  admin_translations_all_sections: { tr: "Tümü", de: "Alle" },
  admin_translations_showing: {
    tr: "çeviri gösteriliyor",
    de: "Übersetzungen angezeigt",
  },
  admin_translations_edit: {
    tr: "Çeviri Düzenle",
    de: "Übersetzung bearbeiten",
  },
  admin_translations_create: { tr: "Yeni Çeviri", de: "Neue Übersetzung" },
  admin_translations_key_label: { tr: "Key", de: "Schlüssel" },
  admin_translations_key_example: {
    tr: "contact.form.title",
    de: "contact.form.title",
  },
  admin_translations_key_help: {
    tr: "Nokta ile ayrılmış format: section.subsection.name",
    de: "Format mit Punkten: section.subsection.name",
  },
  admin_translations_turkish_placeholder: {
    tr: "Türkçe çeviri...",
    de: "Türkische Übersetzung...",
  },
  admin_translations_german_placeholder: {
    tr: "Almanca çeviri...",
    de: "Deutsche Übersetzung...",
  },
  admin_translations_delete_confirm: {
    tr: "Bu çeviriyi silmek istediğinize emin misiniz?",
    de: "Möchten Sie diese Übersetzung wirklich löschen?",
  },
  admin_translations_alert_updated: {
    tr: "Çeviri başarıyla güncellendi!",
    de: "Übersetzung erfolgreich aktualisiert!",
  },
  admin_translations_alert_created: {
    tr: "Çeviri başarıyla eklendi!",
    de: "Übersetzung erfolgreich hinzugefügt!",
  },
  admin_translations_alert_deleted: {
    tr: "Çeviri silindi!",
    de: "Übersetzung gelöscht!",
  },
  admin_translations_alert_delete_failed: {
    tr: "Silme başarısız!",
    de: "Löschen fehlgeschlagen!",
  },
  admin_translations_no_results: {
    tr: "Filtreye uygun çeviri bulunamadı.",
    de: "Keine passenden Übersetzungen gefunden.",
  },
  admin_translations_empty: {
    tr: "Henüz çeviri eklenmedi. Yeni eklemek için yukarıdaki butonu kullanın.",
    de: "Noch keine Übersetzungen vorhanden. Verwenden Sie oben die Schaltfläche zum Hinzufügen.",
  },

  // Admin Activities
  admin_activities_title: {
    tr: "Etkinlik Yönetimi",
    de: "Aktivitätenverwaltung",
  },
  admin_activities_total: { tr: "Toplam Etkinlik", de: "Gesamtaktivitäten" },
  admin_activities_new: { tr: "Yeni Etkinlik", de: "Neue Aktivität" },
  admin_activities_edit: { tr: "Etkinlik Düzenle", de: "Aktivität bearbeiten" },
  admin_activities_create: {
    tr: "Yeni Etkinlik Oluştur",
    de: "Neue Aktivität erstellen",
  },
  admin_activities_list: { tr: "Etkinlik Listesi", de: "Aktivitätsliste" },
  admin_activities_loading: {
    tr: "Etkinlikler yükleniyor...",
    de: "Aktivitäten werden geladen...",
  },
  admin_activities_load_failed: {
    tr: "Etkinlikler yüklenemedi!",
    de: "Aktivitäten konnten nicht geladen werden!",
  },
  admin_activities_search_placeholder: {
    tr: "🔍 Etkinlik ara... (başlık, konum veya kategoriye göre)",
    de: "🔍 Aktivität suchen... (nach Titel, Ort oder Kategorie)",
  },
  admin_activities_no_results_title: {
    tr: "🔍 Arama sonuçunda etkinlik bulunamadı",
    de: "🔍 Keine Aktivitäten gefunden",
  },
  admin_activities_no_results_subtitle: {
    tr: "Farklı anahtar kelimeler deneyin veya yeni bir etkinlik ekleyin",
    de: "Versuchen Sie andere Schlüsselwörter oder fügen Sie eine neue Aktivität hinzu",
  },
  admin_activities_header_activity: { tr: "📋 Etkinlik", de: "📋 Aktivität" },
  admin_activities_header_category: { tr: "🏷️ Kategori", de: "🏷️ Kategorie" },
  admin_activities_header_date: { tr: "📅 Tarih", de: "📅 Datum" },
  admin_activities_header_location: { tr: "📍 Konum", de: "📍 Ort" },
  admin_activities_header_status: { tr: "👁️ Durum", de: "👁️ Status" },
  admin_activities_header_actions: { tr: "⚙️ İşlemler", de: "⚙️ Aktionen" },
  admin_activities_activate: { tr: "Aktif yap", de: "Aktivieren" },
  admin_activities_deactivate: { tr: "Pasif yap", de: "Deaktivieren" },
  admin_activities_activated_success: {
    tr: "✓ Etkinlik aktif hale getirildi!",
    de: "✓ Aktivität aktiviert!",
  },
  admin_activities_deactivated_success: {
    tr: "✓ Etkinlik pasif hale getirildi!",
    de: "✓ Aktivität deaktiviert!",
  },
  admin_activities_toggle_failed: {
    tr: "❌ Durum değişirilemedi!",
    de: "❌ Status konnte nicht geändert werden!",
  },
  admin_activities_delete_confirm: {
    tr: "Bu etkinliği silmek istediğinizden emin misiniz?",
    de: "Sind Sie sicher, dass Sie diese Aktivität löschen möchten?",
  },
  admin_activities_delete_success: {
    tr: "✓ Etkinlik silindi!",
    de: "✓ Aktivität gelöscht!",
  },
  admin_activities_delete_failed: {
    tr: "❌ Silme işlemi başarısız!",
    de: "❌ Löschvorgang fehlgeschlagen!",
  },
  admin_activities_not_found: {
    tr: "❌ Etkinlik bulunamadı!",
    de: "❌ Aktivität nicht gefunden!",
  },
  admin_activities_update_success: {
    tr: "✓ Etkinlik başarıyla güncellendi!",
    de: "✓ Aktivität erfolgreich aktualisiert!",
  },
  admin_activities_create_success: {
    tr: "✓ Yeni etkinlik oluşturuldu!",
    de: "✓ Neue Aktivität erstellt!",
  },
  admin_activities_payload_too_large: {
    tr: "Payload çok büyük!",
    de: "Payload zu groß!",
  },
  admin_activities_payload_too_large_hint: {
    tr: "Daha az resim kullanın veya daha düşük çözünürlüklü resimler seçin.",
    de: "Verwenden Sie weniger oder kleinere Bilder.",
  },
  admin_activities_image_upload_success: {
    tr: "Resim başarıyla yüklendi!",
    de: "Bild erfolgreich hochgeladen!",
  },
  admin_activities_image_upload_failed: {
    tr: "Resim yüklenemedi!",
    de: "Bild konnte nicht hochgeladen werden!",
  },
  admin_activities_file_too_large: {
    tr: "Dosya çok büyük! Mevcut:",
    de: "Datei zu groß! Aktuell:",
  },
  admin_activities_compressed_image_too_large: {
    tr: "Sıkıştırılan resim çok büyük! Daha düşük çözünürlüklü bir resim kullanın.",
    de: "Komprimiertes Bild zu groß! Bitte verwenden Sie ein Bild mit niedrigerer Auflösung.",
  },
  admin_activities_form_title_tr_placeholder: {
    tr: "Etkinlik Başlığı (Türkçe) *",
    de: "Titel (Türkisch) *",
  },
  admin_activities_form_title_de_placeholder: {
    tr: "Aktivite Başlığı (Almanca) *",
    de: "Titel (Deutsch) *",
  },
  admin_activities_short_description_label: {
    tr: "Kısa Açıklama",
    de: "Kurzbeschreibung",
  },
  admin_activities_short_description_tr_placeholder: {
    tr: "Etkinlik hakkında kısa açıklama...",
    de: "Kurze Beschreibung (Türkisch)...",
  },
  admin_activities_short_description_de_placeholder: {
    tr: "Aktivite hakkında kısa açıklama (Almanca)...",
    de: "Kurze Beschreibung (Deutsch)...",
  },
  admin_activities_detailed_content_label: {
    tr: "Detaylı İçerik",
    de: "Detaillierter Inhalt",
  },
  admin_activities_detailed_content_tr_placeholder: {
    tr: "Detay sayfasında gösterilecek içerik...",
    de: "Inhalt (Türkisch) für die Detailseite...",
  },
  admin_activities_detailed_content_de_placeholder: {
    tr: "Detay sayfasında gösterilecek içerik (Almanca)...",
    de: "Inhalt (Deutsch) für die Detailseite...",
  },
  admin_activities_date_label: {
    tr: "Etkinlik Tarihi",
    de: "Aktivitätsdatum",
  },
  admin_activities_category_label: { tr: "Kategori", de: "Kategorie" },
  admin_activities_category_music: { tr: "🎵 Müzik", de: "🎵 Musik" },
  admin_activities_category_art: { tr: "🎨 Sanat", de: "🎨 Kunst" },
  admin_activities_category_education: { tr: "📚 Eğitim", de: "📚 Bildung" },
  admin_activities_category_culture: { tr: "🌍 Kültür", de: "🌍 Kultur" },
  admin_activities_category_sport: { tr: "⚽ Spor", de: "⚽ Sport" },
  admin_activities_category_social: { tr: "🤝 Sosyal", de: "🤝 Sozial" },
  admin_activities_address_section_title: {
    tr: "📍 Adres Bilgileri",
    de: "📍 Adressinformationen",
  },
  admin_activities_address_street_placeholder: {
    tr: "örn: Rheinstraße",
    de: "z.B. Rheinstraße",
  },
  admin_activities_address_house_placeholder: {
    tr: "örn: 45",
    de: "z.B. 45",
  },
  admin_activities_address_zip_placeholder: {
    tr: "örn: 64283",
    de: "z.B. 64283",
  },
  admin_activities_address_city_placeholder: {
    tr: "örn: Darmstadt",
    de: "z.B. Darmstadt",
  },
  admin_activities_address_state_placeholder: {
    tr: "örn: Hessen",
    de: "z.B. Hessen",
  },
  admin_activities_address_country_placeholder: {
    tr: "örn: Deutschland",
    de: "z.B. Deutschland",
  },
  admin_activities_address_help: {
    tr: "Adres bilgileri otomatik olarak birleştirilerek görüntülenir",
    de: "Adressinformationen werden automatisch kombiniert angezeigt",
  },
  admin_activities_main_image: { tr: "Ana Kapak Resmi", de: "Hauptbild" },
  admin_activities_video_label: {
    tr: "Video URL (Opsiyonel)",
    de: "Video-URL (Optional)",
  },
  admin_activities_video_placeholder: {
    tr: "https://youtube.com/watch?v=... veya Vimeo URL",
    de: "https://youtube.com/watch?v=... oder Vimeo URL",
  },
  admin_activities_video_help: {
    tr: "YouTube veya Vimeo video bağlantısı ekleyebilirsiniz",
    de: "Sie können YouTube- oder Vimeo-Videolinks hinzufügen",
  },
  admin_activities_gallery_label: {
    tr: "Galeri Resimleri (URL veya Yükle)",
    de: "Galerie-Bilder (URL oder Upload)",
  },
  admin_activities_gallery_url_placeholder: {
    tr: "Resim URL'sini yapıştırın... (https://...)",
    de: "Bild-URL einfügen... (https://...)",
  },
  admin_activities_gallery_add_success: {
    tr: "Resim URL'si başarıyla eklendi!",
    de: "Bild-URL erfolgreich hinzugefügt!",
  },
  admin_activities_gallery_add_invalid_url: {
    tr: "Lütfen geçerli bir URL girin!",
    de: "Bitte geben Sie eine gültige URL ein!",
  },
  admin_activities_gallery_help: {
    tr: "Birden fazla resim seçebilirsiniz. Her resmi silmek için üzerindeki X'e tıklayın.",
    de: "Sie können mehrere Bilder auswählen. Klicken Sie auf X, um ein Bild zu entfernen.",
  },
  admin_activities_gallery_image_alt: {
    tr: "Galeri Resmi",
    de: "Galeriebild",
  },
  admin_activities_gallery_limit_reached: {
    tr: "Maksimum galeri resim sayısına ulaştınız!",
    de: "Sie haben das Maximum an Galeriebildern erreicht!",
  },
  admin_activities_gallery_upload_success: {
    tr: "resim başarıyla yüklendi!",
    de: "Bilder erfolgreich hochgeladen!",
  },
  admin_activities_gallery_upload_failed: {
    tr: "resim yüklenemedi:",
    de: "Bilder konnten nicht hochgeladen werden:",
  },
  admin_activities_gallery_upload_failed_generic: {
    tr: "Galeri resimleri yüklenemedi!",
    de: "Galeriebilder konnten nicht hochgeladen werden!",
  },

  // Admin Courses
  admin_courses_title: { tr: "Kurs Yönetimi", de: "Kursverwaltung" },
  admin_courses_total: { tr: "Toplam", de: "Gesamt" },
  admin_courses_unit: { tr: "kurs", de: "Kurse" },
  admin_courses_new: { tr: "Yeni Kurs", de: "Neuer Kurs" },
  admin_courses_loading: {
    tr: "Kurslar yükleniyor...",
    de: "Kurse werden geladen...",
  },
  admin_courses_load_failed: {
    tr: "Kurslar yüklenemedi!",
    de: "Kurse konnten nicht geladen werden!",
  },
  admin_courses_image_upload_failed: {
    tr: "Resim yüklenemedi!",
    de: "Bild konnte nicht hochgeladen werden!",
  },
  admin_courses_create_success: {
    tr: "Kurs oluşturuldu!",
    de: "Kurs wurde erstellt!",
  },
  admin_courses_update_success: {
    tr: "Kurs güncellendi!",
    de: "Kurs wurde aktualisiert!",
  },
  admin_courses_delete_confirm: {
    tr: "Bu kursu silmek istediğinizden emin misiniz?",
    de: "Möchten Sie diesen Kurs wirklich löschen?",
  },
  admin_courses_delete_success: {
    tr: "Kurs silindi!",
    de: "Kurs wurde gelöscht!",
  },
  admin_courses_delete_failed: {
    tr: "Silme işlemi başarısız!",
    de: "Löschen fehlgeschlagen!",
  },
  admin_courses_not_found: {
    tr: "Kurs bulunamadı!",
    de: "Kurs nicht gefunden!",
  },
  admin_courses_activated_success: {
    tr: "Kurs aktif hale getirildi!",
    de: "Kurs aktiviert!",
  },
  admin_courses_deactivated_success: {
    tr: "Kurs pasif hale getirildi!",
    de: "Kurs deaktiviert!",
  },
  admin_courses_toggle_failed: {
    tr: "Durum değiştirilemedi!",
    de: "Status konnte nicht geändert werden!",
  },
  admin_courses_search_placeholder: {
    tr: "🔍 Kurs ara... (başlık, eğitmen veya kategoriye göre)",
    de: "🔍 Kurs suchen... (nach Titel, Dozent oder Kategorie)",
  },
  admin_courses_no_results_title: {
    tr: "🔍 Arama sonucunda kurs bulunamadı",
    de: "🔍 Keine Kurse gefunden",
  },
  admin_courses_no_results_subtitle: {
    tr: "Farklı anahtar kelimeler deneyin veya yeni bir kurs ekleyin",
    de: "Versuchen Sie andere Schlüsselwörter oder fügen Sie einen neuen Kurs hinzu",
  },
  admin_courses_activate: { tr: "Aktif yap", de: "Aktivieren" },
  admin_courses_deactivate: { tr: "Pasif yap", de: "Deaktivieren" },

  admin_courses_header_course: { tr: "📚 Kurs", de: "📚 Kurs" },
  admin_courses_header_instructor: { tr: "👨‍🏫 Eğitmen", de: "👨‍🏫 Dozent" },
  admin_courses_header_schedule: { tr: "📅 Program", de: "📅 Zeitplan" },
  admin_courses_header_capacity: { tr: "👥 Kapasite", de: "👥 Kapazität" },
  admin_courses_header_status: { tr: "👁️ Durum", de: "👁️ Status" },
  admin_courses_header_actions: { tr: "⚙️ İşlemler", de: "⚙️ Aktionen" },

  admin_courses_create: { tr: "Yeni Kurs Oluştur", de: "Neuen Kurs erstellen" },
  admin_courses_edit: { tr: "Kurs Düzenle", de: "Kurs bearbeiten" },
  admin_courses_submit_create: {
    tr: "✓ Kursu Oluştur",
    de: "✓ Kurs erstellen",
  },
  admin_courses_submit_update: {
    tr: "✓ Değişiklikleri Kaydet",
    de: "✓ Änderungen speichern",
  },

  admin_courses_form_title_tr_placeholder: {
    tr: "Kurs Başlığı *",
    de: "Kurstitel (TR) *",
  },
  admin_courses_form_title_de_placeholder: {
    tr: "Kurs Titel (DE) *",
    de: "Kurs Titel *",
  },
  admin_courses_short_description_label: {
    tr: "Kısa Açıklama",
    de: "Kurzbeschreibung",
  },
  admin_courses_short_description_tr_placeholder: {
    tr: "Kurs hakkında kısa açıklama...",
    de: "Kurze Beschreibung (TR)...",
  },
  admin_courses_short_description_de_placeholder: {
    tr: "Kurze Beschreibung des Kurses...",
    de: "Kurze Beschreibung des Kurses...",
  },
  admin_courses_detailed_description_label: {
    tr: "Detaylı Açıklama",
    de: "Detaillierte Beschreibung",
  },
  admin_courses_details_tr_placeholder: {
    tr: "Detay sayfasında gösterilecek içerik...",
    de: "Inhalt für Detailseite (TR)...",
  },
  admin_courses_details_de_placeholder: {
    tr: "Inhalt für Detailseite...",
    de: "Inhalt für Detailseite...",
  },

  admin_courses_schedule_tr_label: { tr: "Program (TR)", de: "Zeitplan (TR)" },
  admin_courses_schedule_de_label: { tr: "Zeitplan (DE)", de: "Zeitplan (DE)" },
  admin_courses_schedule_tr_placeholder: {
    tr: "örn: Pazartesi 18:00-20:00",
    de: "z.B: Montag 18:00-20:00 (TR)",
  },
  admin_courses_schedule_de_placeholder: {
    tr: "z.B: Montag 18:00-20:00",
    de: "z.B: Montag 18:00-20:00",
  },

  admin_courses_instructor_label: { tr: "Eğitmen", de: "Dozent" },
  admin_courses_instructor_placeholder: {
    tr: "Eğitmen adı",
    de: "Dozent Name",
  },
  admin_courses_start_date_label: { tr: "Başlangıç Tarihi", de: "Startdatum" },
  admin_courses_icon_label: { tr: "İkon", de: "Icon" },
  admin_courses_icon_bookopen: {
    tr: "📖 Kurs / Eğitim (BookOpen)",
    de: "📖 Kurs / Bildung (BookOpen)",
  },
  admin_courses_icon_messagecircle: {
    tr: "💬 Sohbet / Söyleşi (MessageCircle)",
    de: "💬 Gesprächsrunde / Diskussion (MessageCircle)",
  },
  admin_courses_icon_languages: {
    tr: "🌐 Dil Eğitimi (Languages)",
    de: "🌐 Sprachkurs (Languages)",
  },
  admin_courses_icon_music: {
    tr: "🎶 Müzik / Sanat (Music)",
    de: "🎶 Musik / Kunst (Music)",
  },
  admin_courses_icon_heart: {
    tr: "❤️ Gönüllülük / Yardım (Heart)",
    de: "❤️ Ehrenamt / Hilfe (Heart)",
  },
  admin_courses_icon_palette: {
    tr: "🎨 Resim / El Sanatları (Palette)",
    de: "🎨 Malerei / Kunsthandwerk (Palette)",
  },
  admin_courses_icon_users: {
    tr: "👥 Toplantı / Grup (Users)",
    de: "👥 Treffen / Gruppe (Users)",
  },
  admin_courses_icon_coffee: {
    tr: "☕ Çay / Kahve Sohbeti (Coffee)",
    de: "☕ Tee- / Kaffee-Runde (Coffee)",
  },
  admin_courses_icon_globe: {
    tr: "🌍 Kültürel Etkinlik (Globe)",
    de: "🌍 Kulturveranstaltung (Globe)",
  },
  admin_courses_icon_mic: {
    tr: "🎤 Seminer / Konferans (Mic)",
    de: "🎤 Seminar / Konferenz (Mic)",
  },
  admin_courses_icon_camera: {
    tr: "📷 Fotoğrafçılık (Camera)",
    de: "📷 Fotografie (Camera)",
  },
  admin_courses_icon_utensils: {
    tr: "🍲 Mutfak Kültürü (Utensils)",
    de: "🍲 Kochkultur (Utensils)",
  },
  admin_courses_icon_smile: {
    tr: "😊 Gençlik / Çocuk (Smile)",
    de: "😊 Jugend / Kinder (Smile)",
  },
  admin_courses_icon_lightbulb: {
    tr: "💡 Atölye / Fikir (Lightbulb)",
    de: "💡 Workshop / Idee (Lightbulb)",
  },
  admin_courses_icon_pentool: {
    tr: "🖋️ Yazarlık / Edebiyat (PenTool)",
    de: "🖋️ Schreiben / Literatur (PenTool)",
  },
  admin_courses_icon_scroll: {
    tr: "📜 Tarih / Gelenek (Scroll)",
    de: "📜 Geschichte / Tradition (Scroll)",
  },

  admin_courses_address_section_title: {
    tr: "📍 Adres Bilgileri",
    de: "📍 Adressinformationen",
  },
  admin_courses_address_street_placeholder: {
    tr: "örn: Rheinstraße",
    de: "z.B: Rheinstraße",
  },
  admin_courses_address_house_placeholder: { tr: "örn: 45", de: "z.B: 45" },
  admin_courses_address_zip_placeholder: { tr: "örn: 64283", de: "z.B: 64283" },
  admin_courses_address_city_placeholder: {
    tr: "örn: Darmstadt",
    de: "z.B: Darmstadt",
  },
  admin_courses_address_state_placeholder: {
    tr: "örn: Hessen",
    de: "z.B: Hessen",
  },
  admin_courses_address_country_placeholder: {
    tr: "örn: Almanya",
    de: "z.B: Deutschland",
  },

  admin_courses_category_label: {
    tr: "Kategori / Kategorie",
    de: "Kategorie",
  },
  admin_courses_category_placeholder: {
    tr: "örn: Dil Kursu, Sprachkurs",
    de: "z.B: Sprachkurs",
  },
  admin_courses_image_label: { tr: "Kurs Resmi", de: "Kursbild" },

  admin_courses_publish_status_label: {
    tr: "Yayın Durumu",
    de: "Veröffentlichungsstatus",
  },
  admin_courses_publish_status_help: {
    tr: "Kurs web sitesinde görünsün mü?",
    de: "Soll der Kurs auf der Website sichtbar sein?",
  },

  // Admin Team
  admin_team_title: { tr: "Ekip Yönetimi", de: "Teamverwaltung" },
  admin_team_new: { tr: "Yeni Ekip Üyesi", de: "Neues Teammitglied" },

  // Admin Partners
  admin_partners_title: { tr: "Partner Yönetimi", de: "Partnerverwaltung" },
  admin_partners_new: { tr: "Yeni Partner", de: "Neuer Partner" },
  admin_partners_edit: { tr: "Partner Düzenle", de: "Partner bearbeiten" },
  admin_partners_count_label: { tr: "partner", de: "Partner" },
  admin_partners_search_placeholder: {
    tr: "Partner ara...",
    de: "Partner suchen...",
  },
  admin_partners_name_tr: { tr: "İsim (Türkçe)", de: "Name (Türkisch)" },
  admin_partners_name_de: { tr: "Name (Deutsch)", de: "Name (Deutsch)" },
  admin_partners_description_tr: {
    tr: "Açıklama (Türkçe)",
    de: "Beschreibung (Türkisch)",
  },
  admin_partners_description_de: {
    tr: "Beschreibung (Deutsch)",
    de: "Beschreibung (Deutsch)",
  },
  admin_partners_description_tr_placeholder: {
    tr: "Açıklama (Türkçe)",
    de: "Beschreibung (Türkisch)",
  },
  admin_partners_description_de_placeholder: {
    tr: "Beschreibung (Deutsch)",
    de: "Beschreibung (Deutsch)",
  },
  admin_partners_website_url: { tr: "Website URL", de: "Website-URL" },
  admin_partners_logo: { tr: "Logo", de: "Logo" },
  admin_partners_active: { tr: "Partner Aktif", de: "Partner aktiv" },

  // Admin Volunteers
  admin_volunteers_title: {
    tr: "Gönüllü Başvuruları",
    de: "Freiwilligenbewerbungen",
  },
  admin_volunteers_total: { tr: "Toplam Başvuru", de: "Gesamtbewerbungen" },
  admin_volunteers_search_placeholder: {
    tr: "Başvuru ara...",
    de: "Bewerbung suchen...",
  },
  admin_volunteers_no_results: {
    tr: "Aramanıza uygun başvuru bulunamadı.",
    de: "Keine passenden Bewerbungen gefunden.",
  },
  admin_volunteers_no_submissions: {
    tr: "Henüz başvuru bulunmamaktadır.",
    de: "Es liegen noch keine Bewerbungen vor.",
  },
  admin_volunteers_details_title: {
    tr: "Başvuru Detayları",
    de: "Bewerbungsdetails",
  },
  admin_volunteers_person_info: {
    tr: "Kişi Bilgileri",
    de: "Personendaten",
  },
  admin_volunteers_label_fullname: { tr: "Ad Soyad", de: "Name" },
  admin_volunteers_label_email: { tr: "E-posta", de: "E-Mail" },
  admin_volunteers_label_phone: { tr: "Telefon", de: "Telefon" },
  admin_volunteers_label_date: { tr: "Başvuru Tarihi", de: "Bewerbungsdatum" },
  admin_volunteers_message_title: { tr: "Mesaj / Başvuru", de: "Nachricht" },
  admin_volunteers_email_subject: {
    tr: "KPF Gönüllülük Başvurusu",
    de: "KPF Freiwilligenbewerbung",
  },
  admin_volunteers_send_email: { tr: "E-posta Gönder", de: "E-Mail senden" },
  admin_volunteers_call: { tr: "Ara", de: "Anrufen" },
  admin_volunteers_open_details: {
    tr: "Başvuru detaylarını aç",
    de: "Bewerbungsdetails öffnen",
  },

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
  admin_address_street: { tr: "Sokak", de: "Straße" },
  admin_address_houseNo: { tr: "No", de: "Hausnr." },
  admin_address_postalCode: { tr: "Posta Kodu", de: "PLZ" },
  admin_address_city: { tr: "Şehir", de: "Stadt" },
  admin_address_state: { tr: "Eyalet", de: "Bundesland" },
  admin_address_country: { tr: "Ülke", de: "Land" },
  admin_editor_placeholder: {
    tr: "İçerik yazın...",
    de: "Inhalt schreiben...",
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
  activities_filter_culture: { tr: "Kültür", de: "Kultur" },
  activities_filter_workshop: { tr: "Atölye", de: "Workshop" },

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
