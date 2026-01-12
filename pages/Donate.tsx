
import React from 'react';
import { Heart, CreditCard, Copy, ExternalLink, ShieldCheck, CheckCircle, FileCheck } from 'lucide-react';
import { Language } from '../types';
import { TEXTS } from '../constants';

interface DonateProps {
  lang: Language;
}

const Donate: React.FC<DonateProps> = ({ lang }) => {
  const t = (key: string) => TEXTS[key][lang];

  return (
    <div className="py-20 bg-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 max-w-4xl text-center mb-16">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-red-50 text-kpf-red rounded-full mb-8 shadow-sm animate-fade-in-down">
          <Heart size={48} />
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-kpf-dark mb-4 animate-fade-in-up">{t('donate_hero_title')}</h1>
        <p className="text-xl md:text-2xl text-kpf-teal font-medium mb-12 animate-fade-in-up delay-100">
          {t('donate_hero_subtitle')}
        </p>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        {/* Features Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center hover:bg-white hover:shadow-lg transition-all duration-300">
             <div className="w-12 h-12 bg-teal-100 text-kpf-teal rounded-xl flex items-center justify-center mx-auto mb-4">
               <ShieldCheck size={24} />
             </div>
             <h3 className="font-bold text-lg mb-2">{t('donate_feature_nonprofit')}</h3>
          </div>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center hover:bg-white hover:shadow-lg transition-all duration-300">
             <div className="w-12 h-12 bg-red-100 text-kpf-red rounded-xl flex items-center justify-center mx-auto mb-4">
               <FileCheck size={24} />
             </div>
             <h3 className="font-bold text-lg mb-2">{t('donate_feature_tax')}</h3>
          </div>
          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center hover:bg-white hover:shadow-lg transition-all duration-300">
             <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
               <CheckCircle size={24} />
             </div>
             <h3 className="font-bold text-lg mb-2">{t('donate_feature_transparent')}</h3>
          </div>
        </div>

        {/* Why & Where Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20 items-stretch">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-10 rounded-3xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10">
               <Heart size={150} />
             </div>
             <h2 className="text-2xl font-serif font-bold mb-6 relative z-10">{t('donate_why_title')}</h2>
             <p className="text-lg text-slate-300 leading-relaxed relative z-10">
               {t('donate_why_desc')}
             </p>
          </div>
          <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm">
             <h2 className="text-2xl font-serif font-bold text-kpf-dark mb-6">{t('donate_where_title')}</h2>
             <p className="text-lg text-slate-600 leading-relaxed">
               {t('donate_where_desc')}
             </p>
             <div className="mt-8 p-4 bg-teal-50 text-teal-800 rounded-xl text-sm font-medium border border-teal-100 flex items-start gap-3">
               <FileCheck size={20} className="shrink-0 mt-0.5" />
               {t('donate_tax_info')}
             </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bank Transfer */}
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 md:p-10">
            <h2 className="text-xl font-bold text-kpf-dark mb-6 flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm"><CreditCard className="text-kpf-teal" size={20} /></div>
              {t('donate_bank_title')}
            </h2>
            
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm group hover:border-kpf-teal transition-colors">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">IBAN</span>
                <div className="flex justify-between items-center">
                  <code className="text-lg md:text-xl font-mono text-slate-800 font-bold tracking-tight">DE12 3456 7890 1234 5678 90</code>
                  <button className="text-slate-400 hover:text-kpf-teal p-2 transition-colors" title="Copy">
                    <Copy size={18} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">BIC / SWIFT</span>
                  <div className="text-lg font-mono text-slate-800 font-bold">SOLADE1XXX</div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    {lang === 'tr' ? 'Alıcı' : 'Empfänger'}
                  </span>
                  <div className="text-lg font-bold text-slate-800">KulturPlattform Freiburg e.V.</div>
                </div>
              </div>
            </div>
          </div>

          {/* PayPal Donation */}
          <div className="bg-[#003087] text-white rounded-3xl p-8 md:p-10 relative overflow-hidden flex flex-col justify-center items-center text-center shadow-lg group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent"></div>
            
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-10 mb-6 relative z-10 brightness-0 invert" />
            
            <h2 className="text-2xl font-bold mb-4 relative z-10">{t('donate_paypal_title')}</h2>
            <p className="text-blue-100 mb-8 max-w-sm mx-auto relative z-10 text-lg">
              {lang === 'tr' 
               ? 'Hızlı, güvenli ve kolay bir şekilde destek olun.'
               : 'Unterstützen Sie uns schnell, sicher und einfach.'}
            </p>
            
            <a 
              href="https://www.paypal.com/paypalme/kpfreiburg" 
              target="_blank" 
              rel="noopener noreferrer"
              className="relative z-10 inline-flex items-center gap-3 bg-white text-[#003087] px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              <span>{t('donate_paypal_button')}</span>
              <ExternalLink size={18} />
            </a>
            <div className="mt-4 text-blue-200 font-mono text-sm relative z-10">@kpfreiburg</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Donate;
