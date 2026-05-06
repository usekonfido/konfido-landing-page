'use client';

import Image from 'next/image';
import { useT } from '@/components/i18n/LanguageProvider';

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="2.5" fill="currentColor" />
      <path
        d="M1 9c2-3.5 5-5.5 8-5.5s6 2 8 5.5c-2 3.5-5 5.5-8 5.5S3 12.5 1 9z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}
function PlusCircleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M2 9h14M9 2v14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M3 9l4 4 8-8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Day1() {
  const t = useT();
  return (
    <section className="day1">
      <div className="container">
        <div className="day1-grid">
          <div className="day1-text">
            <span className="eyebrow-tag">
              {t('Day 1 · Cash visibility', 'Gün 1 · Nakit görünürlüğü')}
            </span>
            <h2 className="section-title">
              {t('The first module. ', 'İlk modül. ')}
              <span className="accent">
                {t('Across borders.', 'Sınırların ötesinde.')}
              </span>
            </h2>
            <p className="section-lede" style={{ marginBottom: 0 }}>
              {t(
                'Every bank, every entity, every currency. Joined live by open banking, refreshed on its own.',
                'Her banka, her şirket, her para birimi. Açık bankacılıkla canlı bağlanır, kendiliğinden tazelenir.',
              )}
            </p>

            <div className="day1-points">
              <div className="point">
                <div className="point-icon">
                  <EyeIcon />
                </div>
                <div>
                  <h4>{t('One live view', 'Tek ekran canlı görünüm')}</h4>
                  <p>
                    {t(
                      'Domestic and foreign banks in one dashboard. The daily Excel goes away.',
                      'Yurt içi ve yurt dışı bankalar tek panelde. Günlük Excel devri bitti.',
                    )}
                  </p>
                </div>
              </div>
              <div className="point">
                <div className="point-icon">
                  <PlusCircleIcon />
                </div>
                <div>
                  <h4>{t('Built on open banking', 'Açık bankacılık üzerine kurulu')}</h4>
                  <p>
                    {t(
                      'Direct API connections. Hours, not months.',
                      'Doğrudan API bağlantısı. Aylar değil, saatler.',
                    )}
                  </p>
                </div>
              </div>
              <div className="point">
                <div className="point-icon">
                  <CheckIcon />
                </div>
                <div>
                  <h4>{t('Onboarded in days', 'Günler içinde devrede')}</h4>
                  <p>
                    {t(
                      'No year-long rollout. First bank connected in an afternoon.',
                      'Bir yıllık kurulum yok. İlk banka aynı öğleden sonra bağlanır.',
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="day1-promise">
              {t(
                'Start with Türkiye today. Europe and the US within six months — same product, no second contract.',
                'Bugün Türkiye ile başlayın. Altı ay içinde Avrupa ve ABD... Aynı ürün, ikinci sözleşme yok.',
              )
                .split(/(Start with Türkiye today\.|Bugün Türkiye ile başlayın\.)/)
                .map((part, i) =>
                  part === 'Start with Türkiye today.' ||
                  part === 'Bugün Türkiye ile başlayın.' ? (
                    <strong key={i}>{part}</strong>
                  ) : (
                    <span key={i}>{part}</span>
                  ),
                )}
            </div>
          </div>

          <div className="app-shot has-image">
            <Image
              src="/app-screenshot.jpg"
              alt={t(
                'Konfido dashboard — consolidated bank balances and transactions in one view',
                'Konfido paneli — bankalar ve işlemler tek ekranda',
              )}
              width={1600}
              height={837}
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
