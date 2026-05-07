'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useT } from '@/components/i18n/LanguageProvider';

function Point({
  index,
  icon,
  title,
  body,
  revealed,
}: {
  index: number;
  icon: ReactNode;
  title: string;
  body: string;
  revealed: boolean;
}) {
  return (
    <div
      className="point"
      data-revealed={revealed ? 'true' : undefined}
      style={{ '--point-reveal-delay': `${index * 130}ms` } as React.CSSProperties}
    >
      <div className="point-icon">{icon}</div>
      <div>
        <h4>{title}</h4>
        <p>{body}</p>
      </div>
    </div>
  );
}

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
  const sequenceRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const sequence = sequenceRef.current;
    if (!sequence || revealed) return;

    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !('IntersectionObserver' in window)
    ) {
      requestAnimationFrame(() => setRevealed(true));
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setRevealed(true);
        observer.disconnect();
      },
      { threshold: 0.3, rootMargin: '0px 0px -10% 0px' },
    );

    observer.observe(sequence);
    return () => observer.disconnect();
  }, [revealed]);

  return (
    <section className="day1">
      <div className="container">
        <div className="day1-header">
          <span className="eyebrow-tag">
            {t('Day 1 · Cash visibility', 'Gün 1 · Nakit görünürlüğü')}
          </span>
          <h2 className="section-title">
            {t('The first module. ', 'İlk modül. ')}
            <span className="accent">
              {t('Across borders.', 'Sınırların ötesinde.')}
            </span>
          </h2>
        </div>
        <div className="day1-grid">
          <div ref={sequenceRef} className="day1-text">
            <p className="section-lede" style={{ marginBottom: 0 }}>
              {t(
                'Every bank, every entity, every currency. Joined live by open banking, refreshed on its own.',
                'Her banka, her şirket, her para birimi. Açık bankacılıkla canlı bağlanır, kendiliğinden tazelenir.',
              )}
            </p>

            <div className="day1-points">
              <Point
                index={0}
                revealed={revealed}
                icon={<EyeIcon />}
                title={t('One live view', 'Tek ekran canlı görünüm')}
                body={t(
                  'Domestic and foreign banks in one dashboard. The daily Excel goes away.',
                  'Yurt içi ve yurt dışı bankalar tek panelde. Günlük Excel devri bitti.',
                )}
              />
              <Point
                index={1}
                revealed={revealed}
                icon={<PlusCircleIcon />}
                title={t('Built on open banking', 'Açık bankacılık üzerine kurulu')}
                body={t(
                  'Direct API connections. Hours, not months.',
                  'Doğrudan API bağlantısı. Aylar değil, saatler.',
                )}
              />
              <Point
                index={2}
                revealed={revealed}
                icon={<CheckIcon />}
                title={t('Onboarded in days', 'Günler içinde devrede')}
                body={t(
                  'No year-long rollout. First bank connected in an afternoon.',
                  'Bir yıllık kurulum yok. İlk banka aynı öğleden sonra bağlanır.',
                )}
              />
            </div>

            <div
              className="day1-promise"
              data-revealed={revealed ? 'true' : undefined}
            >
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
