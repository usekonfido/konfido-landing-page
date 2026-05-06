'use client';

import { useLanguage, useT } from '@/components/i18n/LanguageProvider';
import { Logo } from '@/components/Logo';

export function Nav() {
  const { lang, setLang } = useLanguage();
  const t = useT();

  return (
    <nav className="nav">
      <div className="nav-inner">
        <a href="#" className="nav-brand" aria-label="Konfido">
          <span className="logo-mark">
            <Logo size={30} />
          </span>
          Konfido
        </a>
        <div className="nav-right">
          <a href="#whitepaper" className="nav-link whitepaper-link">
            {t('Whitepaper', 'Kılavuz')}
          </a>
          <div className="lang-toggle" role="group" aria-label="Language">
            <button
              type="button"
              className={lang === 'en' ? 'active' : ''}
              onClick={() => setLang('en')}
            >
              EN
            </button>
            <button
              type="button"
              className={lang === 'tr' ? 'active' : ''}
              onClick={() => setLang('tr')}
            >
              TR
            </button>
          </div>
          <a href="#waitlist" className="cta">
            {t('Join the waitlist', 'Bekleme listesine katıl')}
          </a>
        </div>
      </div>
    </nav>
  );
}
