'use client';

import { useEffect, useRef, useState } from 'react';
import { useT } from '@/components/i18n/LanguageProvider';
import { ArrowRightSmall } from '@/components/Icons';

type Stop = {
  pinEn: string;
  pinTr: string;
  liveDot?: boolean;
  titleEn: string;
  titleTr: string;
  countryEn: string;
  countryTr: string;
  banks: string[];
  hasMore?: boolean;
  now?: boolean;
};

const STOPS: Stop[] = [
  {
    pinEn: 'Now · Q3 2026',
    pinTr: 'Şimdi · Q3 2026',
    liveDot: true,
    titleEn: 'Türkiye',
    titleTr: 'Türkiye',
    countryEn: 'Live at launch. +20 banks in scope.',
    countryTr: 'Lansmanda canlı. +20 banka, aynı anda.',
    banks: ['Ziraat', 'İş Bankası', 'Garanti BBVA', 'Yapı Kredi', 'Akbank', 'QNB'],
    hasMore: true,
    now: true,
  },
  {
    pinEn: 'Q4 2026',
    pinTr: 'Q4 2026',
    titleEn: 'Europe',
    titleTr: 'Avrupa',
    countryEn: 'PSD2-native. Coverage across the EEA.',
    countryTr: 'PSD2 üzerine kurulu. AEA genelinde kapsam.',
    banks: ['Deutsche Bank', 'BNP Paribas', 'ING', 'Santander', 'UniCredit'],
    hasMore: true,
  },
  {
    pinEn: 'Q1 2027',
    pinTr: 'Q1 2027',
    titleEn: 'United States',
    titleTr: 'ABD',
    countryEn: 'API and SWIFT. The US mid-market that runs internationally.',
    countryTr: 'API ve SWIFT. Uluslararası çalışan ABD orta ölçeği.',
    banks: ['JPMorgan', 'Bank of America', 'Citi', 'Wells Fargo'],
    hasMore: true,
  },
  {
    pinEn: '2027+',
    pinTr: '2027+',
    titleEn: 'Global',
    titleTr: 'Global',
    countryEn: 'SWIFT-first. LATAM, MENA, APAC.',
    countryTr: 'Önce SWIFT. LATAM, MENA, APAC.',
    banks: ['HSBC', 'Standard Chartered', 'Itaú', '+ SWIFT'],
  },
];

function GridIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function Roadmap() {
  const t = useT();
  const timelineRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const timeline = timelineRef.current;
    if (!timeline || revealed) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    if (!('IntersectionObserver' in window)) {
      requestAnimationFrame(() => setRevealed(true));
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setRevealed(true);
        observer.disconnect();
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.18 },
    );

    observer.observe(timeline);
    return () => observer.disconnect();
  }, [revealed]);

  return (
    <section className="roadmap">
      <div className="container">
        <span className="eyebrow-tag">
          {t('Geographic rollout', 'Coğrafi yayılım')}
        </span>
        <h2 className="section-title">
          {t('Türkiye today. ', 'Bugün Türkiye. ')}
          <span className="accent">
            {t('The world within six months.', 'Altı ay içinde dünya.')}
          </span>
        </h2>
        <p className="section-lede">
          {t(
            'Region by region. As each goes live, it joins your single dashboard.',
            'Bütün dünya... Tek panelde.',
          )}
        </p>

        <div className="world-illu" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/world.svg" alt="" />
        </div>

        <div
          ref={timelineRef}
          className="timeline"
          data-revealed={revealed ? 'true' : 'false'}
        >
          {STOPS.map((s, i) => (
            <div
              key={i}
              className={`stop${s.now ? ' now' : ''}`}
              style={
                {
                  '--stop-reveal-delay': `${i * 140}ms`,
                } as React.CSSProperties
              }
            >
              <div className="pin">
                {s.liveDot && <span className="live-dot" />}
                {t(s.pinEn, s.pinTr)}
              </div>
              <h4>{t(s.titleEn, s.titleTr)}</h4>
              <div className="country">{t(s.countryEn, s.countryTr)}</div>
              <div className="banks">
                {s.banks.map((b) => (
                  <span key={b} className="bank-chip">
                    {b}
                  </span>
                ))}
                {s.hasMore && (
                  <span className="bank-chip more">
                    {t('+ more', '+ daha fazlası')}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="banks-note">
          {t(
            'Banks shown are illustrative. Full coverage announced with each regional rollout.',
            'Listelenen bankalar örnek niteliğindedir. Tam kapsam, her bölge yayınında duyurulur.',
          )}
        </p>

        <div className="modular-note">
          <div className="icon">
            <GridIcon />
          </div>
          <div>
            <h4>
              {t(
                'You only pay for the regions you use.',
                'Sadece bağladığınız bölgelere ödersiniz.',
              )}
            </h4>
            <p>
              {t(
                'Pricing is modular by region. ',
                'Fiyat bölge bazında modülerdir. ',
              )}
              <strong>
                {t(
                  'Operating only in Türkiye? Pay only for Türkiye.',
                  "Sadece Türkiye'de iseniz, sadece Türkiye'ye ödersiniz.",
                )}
              </strong>{' '}
              {t(
                'Add Europe when you expand. The contract grows with you, not ahead of you.',
                "Avrupa'yı genişlediğinizde eklersiniz. Sözleşmeniz sizi düşünür.",
              )}
            </p>
          </div>
        </div>

        <div className="inline-cta">
          <a href="#waitlist" className="cta on-dark">
            {t('Join the waitlist', 'Bekleme listesine katılın')}
            <ArrowRightSmall />
          </a>
        </div>
      </div>
    </section>
  );
}
