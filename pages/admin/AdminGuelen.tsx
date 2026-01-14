import React, { useState, useEffect } from "react";
import { Save, FileText, Image as ImageIcon, CheckCircle } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { TEXTS } from "../../constants";

interface GuelenContent {
  titleTurkish: string;
  titleGerman: string;
  contentTurkish: string;
  contentGerman: string;
  imageUrl: string;
}

const AdminGuelen: React.FC = () => {
  const { language } = useLanguage();
  const t = (key: string) => TEXTS[key]?.[language] || key;

  const [content, setContent] = useState<GuelenContent>({
    titleTurkish: "Gülen Hareketi Hakkında",
    titleGerman: "Über die Gülen-Bewegung",
    contentTurkish: "",
    contentGerman: "",
    imageUrl: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // API call yapılacak
      console.log("Gülen hareketi içeriği güncellendi:", content);
      alert("Gülen Hareketi sayfası başarıyla güncellendi!");
    } catch (error) {
      console.error("Güncelleme hatası:", error);
      alert("Güncelleme başarısız!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-20 px-4">
      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Sticky Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-sm border border-slate-100 sticky top-4 z-50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-kpf-red/10 rounded-2xl">
              <FileText className="text-kpf-red" size={28} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800">
                Gülen Hareketi / Gülen-Bewegung
              </h1>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                <CheckCircle size={10} className="text-green-500" />
                Gülen Hareketi hakkında sayfa içeriğini düzenleyin
              </p>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 px-10 py-3 bg-kpf-red text-white rounded-2xl hover:bg-red-700 transition-all disabled:opacity-50 shadow-xl shadow-kpf-red/20 font-bold"
          >
            <Save size={18} />
            {loading ? "Kaydediliyor..." : "Sitede Yayınla"}
          </button>
        </div>

        {/* Form */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 lg:p-12 space-y-6">
            {/* Turkish Title */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <div className="flex items-center gap-2">
                  <FileText size={18} />
                  Başlık (Türkçe)
                </div>
              </label>
              <input
                type="text"
                value={content.titleTurkish}
                onChange={(e) =>
                  setContent({ ...content, titleTurkish: e.target.value })
                }
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all"
                placeholder="Gülen Hareketi Hakkında"
              />
            </div>

            {/* German Title */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <div className="flex items-center gap-2">
                  <FileText size={18} />
                  Titel (Deutsch)
                </div>
              </label>
              <input
                type="text"
                value={content.titleGerman}
                onChange={(e) =>
                  setContent({ ...content, titleGerman: e.target.value })
                }
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all"
                placeholder="Über die Gülen-Bewegung"
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <div className="flex items-center gap-2">
                  <ImageIcon size={18} />
                  Görsel URL / Bild-URL
                </div>
              </label>
              <input
                type="url"
                value={content.imageUrl}
                onChange={(e) =>
                  setContent({ ...content, imageUrl: e.target.value })
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all"
                placeholder="https://example.com/image.jpg"
              />
              {content.imageUrl && (
                <img
                  src={content.imageUrl}
                  alt="Preview"
                  className="mt-4 w-full max-w-md rounded-lg shadow-md"
                />
              )}
            </div>

            {/* Turkish Content */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                İçerik (Türkçe)
              </label>
              <textarea
                value={content.contentTurkish}
                onChange={(e) =>
                  setContent({ ...content, contentTurkish: e.target.value })
                }
                required
                rows={20}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all resize-none font-mono text-sm"
                placeholder="Gülen Hareketi hakkında Türkçe içerik..."
              />
            </div>

            {/* German Content */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Inhalt (Deutsch)
              </label>
              <textarea
                value={content.contentGerman}
                onChange={(e) =>
                  setContent({ ...content, contentGerman: e.target.value })
                }
                required
                rows={20}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-kpf-teal transition-all resize-none font-mono text-sm"
                placeholder="Deutscher Inhalt über die Gülen-Bewegung..."
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminGuelen;
