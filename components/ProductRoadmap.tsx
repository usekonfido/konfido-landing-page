'use client';

import { useT } from '@/components/i18n/LanguageProvider';

type Step = {
  state: 'active' | 'next' | 'later';
  whenEn: string;
  whenTr: string;
  titleEn: string;
  titleTr: string;
  bullets: { en: string; tr: string }[];
};

const STEPS: Step[] = [
  {
    state: 'active',
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
    state: 'next',
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
    state: 'later',
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
    state: 'later',
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

export function ProductRoadmap() {
  const t = useT();
  return (
    <section className="product-rm">
      <div className="container">
        <span className="eyebrow-tag">{t('The vision', 'Vizyon')}</span>
        <h2 className="section-title">
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

        <div className="product-track">
          {STEPS.map((s, i) => (
            <div
              key={i}
              className={`step${s.state === 'active' ? ' active' : s.state === 'next' ? ' next' : ''}`}
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
