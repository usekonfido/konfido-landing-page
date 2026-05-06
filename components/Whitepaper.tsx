'use client';

import { useT } from '@/components/i18n/LanguageProvider';
import { ArrowRightSmall } from '@/components/Icons';
import { WHITEPAPER_URL } from '@/lib/links';

export function Whitepaper() {
  const t = useT();
  return (
    <section className="wp-banner" id="whitepaper">
      <div className="container">
        <div className="wp-card">
          <div>
            <span className="eyebrow-tag">{t('Whitepaper', 'Kılavuz')}</span>
            <h3>
              {t('How to do AI-powered ', 'Yapay zekâ destekli ')}
              <span className="accent">
                {t('cash flow management.', 'nakit akışı yönetimi.')}
              </span>
            </h3>
            <p>
              {t(
                'Six months of research. The category, how it works, and how we win it.',
                'Altı aylık araştırma. Kategori, nasıl çalıştığı ve gelecek.',
              )}
            </p>
          </div>
          <div className="wp-meta">
            <div className="wp-stats">
              <div className="wp-stat">
                <div className="num">33</div>
                <div className="lbl">{t('pages', 'sayfa')}</div>
              </div>
              <div className="wp-stat">
                <div className="num">5</div>
                <div className="lbl">{t('chapters', 'bölüm')}</div>
              </div>
              <div className="wp-stat">
                <div className="num">v1.1</div>
                <div className="lbl">{t("May '26", "Mayıs '26")}</div>
              </div>
            </div>
            <a
              href={WHITEPAPER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="cta on-dark"
            >
              {t('Read the whitepaper', 'Kılavuzu okuyun')}
              <ArrowRightSmall />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
