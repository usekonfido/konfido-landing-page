'use client';

import { useEffect, useRef, useState } from 'react';
import { useT } from '@/components/i18n/LanguageProvider';

const PipeIcon = ({ children }: { children: React.ReactNode }) => (
  <span className="pi-icon">{children}</span>
);

type FieldParticle = {
  sx: number; sy: number;     // start (% of field)
  mx1: number; my1: number;   // approach waypoint
  mx2: number; my2: number;   // exit waypoint
  ex: number; ey: number;     // end (% of field)
  size: number;
  delay: number;
  duration: number;
  opacity: number;
};

// Deterministic pseudo-random in [0,1) — keeps SSR + client renders identical.
function rand(seed: number, salt: number): number {
  const x = Math.sin(seed * 9301 + salt * 49297 + 1543) * 10000;
  return x - Math.floor(x);
}

const FIELD_COUNT = 70;

function makeField(): FieldParticle[] {
  const out: FieldParticle[] = [];
  for (let i = 0; i < FIELD_COUNT; i++) {
    // Start anywhere on the left half (incl. above / below the row).
    const sx = rand(i, 1) * 38;
    const sy = -12 + rand(i, 2) * 124;
    // End anywhere on the right half (incl. above / below).
    const ex = 62 + rand(i, 3) * 38;
    const ey = -12 + rand(i, 4) * 124;
    // Curved waypoints — pull toward the agent zone, jittered for organic feel.
    const mx1 = sx + (50 - sx) * 0.55 + (rand(i, 5) - 0.5) * 14;
    const my1 = sy + (50 - sy) * 0.5 + (rand(i, 6) - 0.5) * 32;
    const mx2 = 50 + (ex - 50) * 0.45 + (rand(i, 7) - 0.5) * 14;
    const my2 = 50 + (ey - 50) * 0.5 + (rand(i, 8) - 0.5) * 32;
    out.push({
      sx, sy, mx1, my1, mx2, my2, ex, ey,
      size: 1.6 + rand(i, 9) * 3.6,
      delay: rand(i, 10) * 9,
      duration: 6 + rand(i, 11) * 4.5,
      opacity: 0.4 + rand(i, 12) * 0.55,
    });
  }
  return out;
}

const FIELD: FieldParticle[] = makeField();

function BankIcon() {
  return (
    <PipeIcon>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="6" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M8 2L3 6h10L8 2z" stroke="currentColor" strokeWidth="1.4" fill="none" />
      </svg>
    </PipeIcon>
  );
}
function ErpIcon() {
  return (
    <PipeIcon>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="2.5" y="2.5" width="11" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M2.5 6h11M6 2.5v11" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    </PipeIcon>
  );
}
function RulesIcon() {
  return (
    <PipeIcon>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M3 5h10M3 8h10M3 11h6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    </PipeIcon>
  );
}
function ClockIcon() {
  return (
    <PipeIcon>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4" />
        <path d="M8 4v4l2.5 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    </PipeIcon>
  );
}
function TrendIcon() {
  return (
    <PipeIcon>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2 12l3-4 3 2 5-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 4h4v4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </PipeIcon>
  );
}
function DiamondIcon() {
  return (
    <PipeIcon>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M3 6l5-3 5 3v5l-5 3-5-3V6z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M8 3v10" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    </PipeIcon>
  );
}

export function Solution() {
  const t = useT();
  const pipelineRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const pipeline = pipelineRef.current;
    if (!pipeline || revealed) return;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    );
    if (prefersReducedMotion.matches) return;

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
      { threshold: 0.28 },
    );

    observer.observe(pipeline);
    return () => observer.disconnect();
  }, [revealed]);

  return (
    <section className="solution">
      <div className="container">
        <span className="eyebrow-tag">{t('How it works', 'Nasıl çalışır')}</span>
        <h2 className="section-title">
          {t('One agent. ', 'Tek agent. ')}
          <span className="accent">{t('All the data work.', 'Veri işinin tamamı.')}</span>
        </h2>
        <p className="section-lede">
          {t(
            'The agent watches, joins, forecasts, and flags. Your team decides and acts.',
            'Agent izler, birleştirir, tahmin yapar, sinyal verir. Karar ve aksiyon ekipte kalır.',
          )}
        </p>

        <div
          ref={pipelineRef}
          className="pipeline"
          data-revealed={revealed ? 'true' : 'false'}
        >
          <div className="pipe-field" aria-hidden="true">
            {FIELD.map((p, i) => (
              <span
                key={i}
                className="data-particle"
                style={
                  {
                    width: `${p.size}px`,
                    height: `${p.size}px`,
                    animationDelay: `${p.delay}s`,
                    animationDuration: `${p.duration}s`,
                    '--sx': `${p.sx}%`,
                    '--sy': `${p.sy}%`,
                    '--mx1': `${p.mx1}%`,
                    '--my1': `${p.my1}%`,
                    '--mx2': `${p.mx2}%`,
                    '--my2': `${p.my2}%`,
                    '--ex': `${p.ex}%`,
                    '--ey': `${p.ey}%`,
                    '--op': p.opacity,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>
          <div className="pipe-col">
            <div className="pipe-col-title">{t('Inputs', 'Girdiler')}</div>
            <div
              className="pipe-item"
              data-reveal="left"
              style={{ '--reveal-delay': '220ms' } as React.CSSProperties}
            >
              <BankIcon />
              <div>
                <div className="pi-text">{t('Bank APIs', "Banka API'leri")}</div>
                <div className="pi-sub">{t('Live balances and transactions', 'Anlık bakiye ve işlem')}</div>
              </div>
            </div>
            <div
              className="pipe-item"
              data-reveal="left"
              style={{ '--reveal-delay': '380ms' } as React.CSSProperties}
            >
              <ErpIcon />
              <div>
                <div className="pi-text">{t('ERP data', 'ERP verisi')}</div>
                <div className="pi-sub">AR · AP · GL</div>
              </div>
            </div>
            <div
              className="pipe-item"
              data-reveal="left"
              style={{ '--reveal-delay': '540ms' } as React.CSSProperties}
            >
              <RulesIcon />
              <div>
                <div className="pi-text">{t('Operating rules', 'İş kuralları')}</div>
                <div className="pi-sub">{t('Risk and approval limits', 'Risk ve onay limitleri')}</div>
              </div>
            </div>
          </div>

          <div className="pipe-spacer" aria-hidden="true" />

          <div className="pipe-center">
            <div className="pc-mark">
              <svg viewBox="0 0 44 44" width="36" height="36" fill="none" role="img" aria-label="Konfido symbol">
                <ellipse cx="22" cy="32" rx="16" ry="6" fill="#4A5568" />
                <ellipse cx="22" cy="24" rx="16" ry="6" fill="#A0AEC0" />
                <ellipse cx="22" cy="16" rx="16" ry="6" fill="#FFFFFF" />
              </svg>
            </div>
            <h4>Konfido Agent</h4>
            <p className="pc-sub">
              {t('monitor · forecast', 'izle · tahmin et')}
              <br />
              {t('reconcile · suggest', 'mutabık ol · öner')}
            </p>
          </div>

          <div className="pipe-spacer" aria-hidden="true" />

          <div className="pipe-col">
            <div className="pipe-col-title">{t('Outputs', 'Çıktılar')}</div>
            <div
              className="pipe-item"
              data-reveal="right"
              style={{ '--reveal-delay': '220ms' } as React.CSSProperties}
            >
              <ClockIcon />
              <div>
                <div className="pi-text">{t('Live cash position', 'Canlı nakit pozisyonu')}</div>
                <div className="pi-sub">{t('Always current', 'Her an güncel')}</div>
              </div>
            </div>
            <div
              className="pipe-item"
              data-reveal="right"
              style={{ '--reveal-delay': '380ms' } as React.CSSProperties}
            >
              <TrendIcon />
              <div>
                <div className="pi-text">{t('Liquidity forecasts', 'Likidite tahminleri')}</div>
                <div className="pi-sub">{t('13 weeks ahead', '13 hafta ileriye')}</div>
              </div>
            </div>
            <div
              className="pipe-item"
              data-reveal="right"
              style={{ '--reveal-delay': '540ms' } as React.CSSProperties}
            >
              <DiamondIcon />
              <div>
                <div className="pi-text">{t('Allocation suggestions', 'Tahsis önerileri')}</div>
                <div className="pi-sub">{t('You decide and act', 'Karar ve aksiyon sizde')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
