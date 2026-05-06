'use client';

import { useT } from '@/components/i18n/LanguageProvider';
import { ArrowRight } from '@/components/Icons';

const PipeIcon = ({ children }: { children: React.ReactNode }) => (
  <span className="pi-icon">{children}</span>
);

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

        <div className="pipeline">
          <div className="pipe-col">
            <div className="pipe-col-title">{t('Inputs', 'Girdiler')}</div>
            <div className="pipe-item">
              <BankIcon />
              <div>
                <div className="pi-text">{t('Bank APIs', "Banka API'leri")}</div>
                <div className="pi-sub">{t('Live balances and transactions', 'Anlık bakiye ve işlem')}</div>
              </div>
            </div>
            <div className="pipe-item">
              <ErpIcon />
              <div>
                <div className="pi-text">{t('ERP data', 'ERP verisi')}</div>
                <div className="pi-sub">AR · AP · GL</div>
              </div>
            </div>
            <div className="pipe-item">
              <RulesIcon />
              <div>
                <div className="pi-text">{t('Operating rules', 'İş kuralları')}</div>
                <div className="pi-sub">{t('Risk and approval limits', 'Risk ve onay limitleri')}</div>
              </div>
            </div>
          </div>

          <div className="pipe-arrow" aria-hidden="true">
            <ArrowRight />
          </div>

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

          <div className="pipe-arrow" aria-hidden="true">
            <ArrowRight />
          </div>

          <div className="pipe-col">
            <div className="pipe-col-title">{t('Outputs', 'Çıktılar')}</div>
            <div className="pipe-item">
              <ClockIcon />
              <div>
                <div className="pi-text">{t('Live cash position', 'Canlı nakit pozisyonu')}</div>
                <div className="pi-sub">{t('Always current', 'Her an güncel')}</div>
              </div>
            </div>
            <div className="pipe-item">
              <TrendIcon />
              <div>
                <div className="pi-text">{t('Liquidity forecasts', 'Likidite tahminleri')}</div>
                <div className="pi-sub">{t('13 weeks ahead', '13 hafta ileriye')}</div>
              </div>
            </div>
            <div className="pipe-item">
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
