'use client';

import { useEffect, useRef, useState } from 'react';
import { useT } from '@/components/i18n/LanguageProvider';

type Step = {
  whenEn: string;
  whenTr: string;
  titleEn: string;
  titleTr: string;
  bullets: { en: string; tr: string }[];
};

const STEPS: Step[] = [
  {
    whenEn: 'Q3 2026 · NOW',
    whenTr: 'Q3 2026 · ŞİMDİ',
    titleEn: 'Cash visibility',
    titleTr: 'Nakit görünürlüğü',
    bullets: [
      { en: 'Banks and ERP, joined live', tr: 'Banka ve ERP canlı bağlanır' },
      { en: 'Multi-entity, multi-currency', tr: 'Çoklu şirket, çoklu para birimi' },
      { en: 'Single live dashboard', tr: 'Canlı veri akışının olduğu tek panel' },
    ],
  },
  {
    whenEn: 'Q4 2026 — Q1 2027',
    whenTr: 'Q4 2026 — Q1 2027',
    titleEn: 'Reconciliation + tagging',
    titleTr: 'Mutabakat + etiketleme',
    bullets: [
      { en: 'Bank-to-ERP auto-match', tr: 'Banka-ERP otomatik eşleme' },
      { en: 'Transaction classification', tr: 'İşlem sınıflandırması' },
      { en: 'Audit-ready trail', tr: 'Denetime hazır yapı' },
    ],
  },
  {
    whenEn: '2027',
    whenTr: '2027',
    titleEn: 'Forecasting + investment',
    titleTr: 'Tahminleme + yatırım',
    bullets: [
      { en: 'Pattern-aware forecasting', tr: 'Örüntü duyarlı tahmin' },
      { en: 'Liquidity gap detection', tr: 'Likidite açığı tespiti' },
      { en: 'Brokerage partnership', tr: 'Aracı kurum ortaklığı' },
    ],
  },
  {
    whenEn: '2028+',
    whenTr: '2028+',
    titleEn: 'Full agentic platform',
    titleTr: 'Tam agentic platform',
    bullets: [
      { en: 'Allocation suggestions', tr: 'Tahsis önerileri' },
      { en: 'FX and hedging workflows', tr: 'FX ve hedge iş akışı' },
      { en: 'Embedded financing', tr: 'Gömülü finansman' },
    ],
  },
];

const MARKER_POSITIONS = [12.5, 37.5, 62.5, 87.5];
const TRACK_LINE_START = 8;

export function ProductRoadmap() {
  const t = useT();
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let raf = 0;
    const clamp = (value: number) => Math.min(1, Math.max(0, value));

    const updateProgress = () => {
      const rect = track.getBoundingClientRect();
      const viewportHeight = window.innerHeight || 1;
      const start = viewportHeight * 0.68;
      const end = viewportHeight * 0.26;
      const nextProgress = clamp((start - rect.top) / (start - end));

      setProgress((current) =>
        Math.abs(current - nextProgress) < 0.002 ? current : nextProgress,
      );
    };

    const requestUpdate = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        updateProgress();
      });
    };

    updateProgress();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
    };
  }, []);

  const activeIndex = Math.min(
    STEPS.length - 1,
    Math.floor(progress * STEPS.length),
  );
  const activeDot = MARKER_POSITIONS[activeIndex];
  const trackFill = activeDot - TRACK_LINE_START;

  return (
    <section className="product-rm">
      <div className="container">
        <span className="eyebrow-tag">{t('The vision', 'Vizyon')}</span>
        <h2 className="section-title vision-title">
          {t('Visibility today. ', 'Bugün görünürlük. ')}
          <span className="accent">
            {t('Treasury function tomorrow.', 'Yarın hazinenin tamamı.')}
          </span>
        </h2>
        <p className="section-lede">
          {t(
            'Each release deepens the agent. Same data layer, every layer above it.',
            "Her modül Konfido'yu öne taşır. Adım adım...",
          )}
        </p>

        <div
          ref={trackRef}
          className="product-track"
          style={
            {
              '--vision-fill': `${trackFill}%`,
              '--vision-dot': `${activeDot}%`,
            } as React.CSSProperties
          }
        >
          <div className="vision-active-dot" aria-hidden="true" />
          {STEPS.map((s, i) => (
            <div
              key={i}
              className={`step${i <= activeIndex ? ' active' : ''}`}
            >
              <div className="step-marker" />
              <div className="step-when">{t(s.whenEn, s.whenTr)}</div>
              <h4>{t(s.titleEn, s.titleTr)}</h4>
              <ul>
                {s.bullets.map((b, j) => (
                  <li key={j}>{t(b.en, b.tr)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
