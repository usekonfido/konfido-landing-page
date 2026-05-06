'use client';

import { useT } from '@/components/i18n/LanguageProvider';
import { Logo } from '@/components/Logo';

export function Footer() {
  const t = useT();
  return (
    <footer>
      <div className="footer-inner">
        <div className="footer-brand">
          <a href="#" className="nav-brand">
            <span className="logo-mark">
              <Logo size={30} variant="mono-light" />
            </span>
            Konfido
          </a>
          <p>
            {t(
              'Agentic intelligence for treasury. We run the numbers. You run the company.',
              'Hazinenin agentic zekası. Rakamları o halletsin, siz şirketinize odaklanın.',
            )}
          </p>
        </div>
        <div className="footer-cols">
          <div className="footer-col">
            <h5>{t('Product', 'Ürün')}</h5>
            <a href="#waitlist">
              {t('Join the waitlist', 'Bekleme listesi')}
            </a>
            <a href="#whitepaper">{t('Whitepaper', 'Kılavuz')}</a>
          </div>
          <div className="footer-col">
            <h5>{t('Contact', 'İletişim')}</h5>
            <a href="mailto:info@usekonfido.com">info@usekonfido.com</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Konfido</span>
        <span>{t('Built in Türkiye · Global from Day 1', "Türkiye'den Globale")}</span>
      </div>
    </footer>
  );
}
