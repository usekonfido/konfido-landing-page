'use client';

import { useT } from '@/components/i18n/LanguageProvider';
import { ArrowRightSmall } from '@/components/Icons';

export function Hero() {
  const t = useT();
  return (
    <section className="hero">
      <div className="hero-inner">
        <div className="eyebrow">
          {t(
            'Q3 2026 launch · Built for global from Day 1',
            "Q3 2026 lansman · Gün 1'den Globale",
          )}
        </div>
        <h1>
          {t("The CFO's ", "CFO'nun ")}
          <span className="accent">{t('Robin.', 'sağ kolu.')}</span>
        </h1>
        <p className="lede">
          {t(
            'Agentic intelligence for treasury. ',
            'Hazinenin agentic zekası. ',
          )}
          <strong>
            {t(
              'We run the numbers. You run the company.',
              'Rakamları o halletsin, siz şirketinize odaklanın.',
            )}
          </strong>
        </p>
        <div className="hero-ctas">
          <a href="#waitlist" className="cta on-dark">
            {t('Join the waitlist', 'Bekleme listesine katılın')}
            <ArrowRightSmall />
          </a>
          <a href="#whitepaper" className="cta ghost on-dark">
            {t('Read the whitepaper', 'Kılavuzu okuyun')}
          </a>
        </div>
      </div>
    </section>
  );
}
