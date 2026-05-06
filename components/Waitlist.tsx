'use client';

import { useState } from 'react';
import { useLanguage, useT } from '@/components/i18n/LanguageProvider';
import { ArrowRightSmall, Check } from '@/components/Icons';

type Path = 'customer' | 'partner' | 'investor';

type Status =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'error'; message: string }
  | { kind: 'success' };

type CustomerForm = {
  name: string;
  company: string;
  email: string;
  phone: string;
  entities: '' | '1' | '2-5' | '6-15' | '16+';
};
type PartnerForm = {
  name: string;
  company: string;
  email: string;
  phone: string;
  partner_type: '' | 'erp' | 'bank' | 'distribution' | 'advisory' | 'other';
};
type InvestorForm = {
  name: string;
  fund: string;
  email: string;
  phone: string;
  stage: '' | 'angel' | 'seed' | 'series_a' | 'exploring';
};

const EMPTY_CUSTOMER: CustomerForm = {
  name: '',
  company: '',
  email: '',
  phone: '',
  entities: '',
};
const EMPTY_PARTNER: PartnerForm = {
  name: '',
  company: '',
  email: '',
  phone: '',
  partner_type: '',
};
const EMPTY_INVESTOR: InvestorForm = {
  name: '',
  fund: '',
  email: '',
  phone: '',
  stage: '',
};

function PathIcon({ path }: { path: Path }) {
  if (path === 'customer') {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M3 17c0-3.5 3-6 7-6s7 2.5 7 6"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (path === 'partner') {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M3 12l4-4 4 4 6-6"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M13 6h4v4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M10 3l2.5 5 5.5.8-4 3.9.9 5.5L10 15.5l-4.9 2.7.9-5.5-4-3.9 5.5-.8L10 3z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Waitlist() {
  const t = useT();
  const { lang } = useLanguage();
  const [path, setPath] = useState<Path>('customer');
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [customer, setCustomer] = useState<CustomerForm>(EMPTY_CUSTOMER);
  const [partner, setPartner] = useState<PartnerForm>(EMPTY_PARTNER);
  const [investor, setInvestor] = useState<InvestorForm>(EMPTY_INVESTOR);

  const switchPath = (p: Path) => {
    if (status.kind === 'success') setStatus({ kind: 'idle' });
    setPath(p);
  };

  async function submit<T extends object>(form_type: Path, payload: T) {
    setStatus({ kind: 'submitting' });
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form_type, language: lang, ...payload }),
      });
      const data = (await res.json().catch(() => null)) as
        | { ok: true }
        | { ok: false; error?: string }
        | null;
      if (!res.ok || !data || !('ok' in data) || !data.ok) {
        throw new Error(
          (data && 'error' in data && data.error) ||
            `Request failed (${res.status})`,
        );
      }
      setStatus({ kind: 'success' });
    } catch (err) {
      setStatus({
        kind: 'error',
        message: err instanceof Error ? err.message : 'Something went wrong.',
      });
    }
  }

  const submitting = status.kind === 'submitting';
  const showError = status.kind === 'error';

  return (
    <section className="waitlist" id="waitlist">
      <div className="waitlist-inner">
        <div className="waitlist-header">
          <span className="eyebrow-tag">
            {t('Join the waitlist', 'Bekleme listesine katılın')}
          </span>
          <h2 className="section-title">
            {t('Be in the first cohort. ', 'İlk erişenlerden biri olun. ')}
            <span className="accent">
              {t(
                'Shape what we ship.',
                'Bir sonraki özelliğe birlikte karar verelim.',
              )}
            </span>
          </h2>
          <p className="section-lede">
            {t(
              'Pick your path. We respond within 48 hours.',
              'Formu doldurun, 48 saatte iletişime geçelim.',
            )}
          </p>
        </div>

        <div className="path-picker" role="tablist">
          {(['customer', 'partner', 'investor'] as const).map((p) => (
            <button
              key={p}
              className={`path-card${path === p ? ' active' : ''}`}
              type="button"
              onClick={() => switchPath(p)}
            >
              <div className="pc-icon">
                <PathIcon path={p} />
              </div>
              <div className="pc-text">
                <h4>
                  {p === 'customer' && t('Customer', 'Müşteri')}
                  {p === 'partner' && t('Partner', 'Partner')}
                  {p === 'investor' && t('Investor', 'Yatırımcı')}
                </h4>
                <p>
                  {p === 'customer' &&
                    t(
                      'Use Konfido at my company',
                      "Konfido'yu şirketimde kullanırım",
                    )}
                  {p === 'partner' &&
                    t('ERP, banking, or distribution', 'ERP, banka veya dağıtım')}
                  {p === 'investor' &&
                    t('Learn about the round', 'Yatırım turu hakkında bilgi')}
                </p>
              </div>
            </button>
          ))}
        </div>

        <div className="form-wrap">
          {status.kind !== 'success' && path === 'customer' && (
            <form
              className="form active"
              onSubmit={(e) => {
                e.preventDefault();
                submit('customer', customer);
              }}
              noValidate
            >
              <div className="form-row">
                <div className="field">
                  <label htmlFor="c_name">
                    {t('Full name', 'Ad soyad')} <span className="req">*</span>
                  </label>
                  <input
                    id="c_name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    value={customer.name}
                    onChange={(e) =>
                      setCustomer({ ...customer, name: e.target.value })
                    }
                  />
                </div>
                <div className="field">
                  <label htmlFor="c_company">
                    {t('Company', 'Şirket')} <span className="req">*</span>
                  </label>
                  <input
                    id="c_company"
                    name="company"
                    type="text"
                    required
                    autoComplete="organization"
                    value={customer.company}
                    onChange={(e) =>
                      setCustomer({ ...customer, company: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="field">
                  <label htmlFor="c_email">
                    {t('Work email', 'İş e-postası')}{' '}
                    <span className="req">*</span>
                  </label>
                  <input
                    id="c_email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={customer.email}
                    onChange={(e) =>
                      setCustomer({ ...customer, email: e.target.value })
                    }
                  />
                </div>
                <div className="field">
                  <label htmlFor="c_phone">
                    {t('Phone', 'Telefon')} <span className="req">*</span>
                  </label>
                  <input
                    id="c_phone"
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="+90 5xx xxx xx xx"
                    value={customer.phone}
                    onChange={(e) =>
                      setCustomer({ ...customer, phone: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="field">
                <label htmlFor="c_entities">
                  {t('Number of entities', 'Şirket sayısı')}{' '}
                  <span className="req">*</span>
                </label>
                <select
                  id="c_entities"
                  name="entities"
                  required
                  value={customer.entities}
                  onChange={(e) =>
                    setCustomer({
                      ...customer,
                      entities: e.target.value as CustomerForm['entities'],
                    })
                  }
                >
                  <option value="" disabled>
                    —
                  </option>
                  <option value="1">1</option>
                  <option value="2-5">2–5</option>
                  <option value="6-15">6–15</option>
                  <option value="16+">16+</option>
                </select>
              </div>
              {showError && (
                <p className="form-error" role="alert">
                  {status.message}
                </p>
              )}
              <div className="form-submit-row">
                <button
                  type="submit"
                  className="cta submit-cta"
                  disabled={submitting}
                >
                  {submitting
                    ? t('Sending…', 'Gönderiliyor…')
                    : t('Join the waitlist', 'Bekleme listesine katılın')}
                  <ArrowRightSmall />
                </button>
                <p className="form-fineprint">
                  {t(
                    '48-hour response. No newsletters.',
                    '48 saat içinde dönüş. Bülten yok.',
                  )}
                </p>
              </div>
            </form>
          )}

          {status.kind !== 'success' && path === 'partner' && (
            <form
              className="form active"
              onSubmit={(e) => {
                e.preventDefault();
                submit('partner', partner);
              }}
              noValidate
            >
              <div className="form-row">
                <div className="field">
                  <label htmlFor="p_name">
                    {t('Full name', 'Ad soyad')} <span className="req">*</span>
                  </label>
                  <input
                    id="p_name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    value={partner.name}
                    onChange={(e) =>
                      setPartner({ ...partner, name: e.target.value })
                    }
                  />
                </div>
                <div className="field">
                  <label htmlFor="p_company">
                    {t('Company', 'Şirket')} <span className="req">*</span>
                  </label>
                  <input
                    id="p_company"
                    name="company"
                    type="text"
                    required
                    autoComplete="organization"
                    value={partner.company}
                    onChange={(e) =>
                      setPartner({ ...partner, company: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="field">
                  <label htmlFor="p_email">
                    {t('Work email', 'İş e-postası')}{' '}
                    <span className="req">*</span>
                  </label>
                  <input
                    id="p_email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={partner.email}
                    onChange={(e) =>
                      setPartner({ ...partner, email: e.target.value })
                    }
                  />
                </div>
                <div className="field">
                  <label htmlFor="p_phone">
                    {t('Phone', 'Telefon')} <span className="req">*</span>
                  </label>
                  <input
                    id="p_phone"
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="+90 5xx xxx xx xx"
                    value={partner.phone}
                    onChange={(e) =>
                      setPartner({ ...partner, phone: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="field">
                <label htmlFor="p_type">
                  {t('Partner type', 'Partner tipi')}{' '}
                  <span className="req">*</span>
                </label>
                <select
                  id="p_type"
                  name="partner_type"
                  required
                  value={partner.partner_type}
                  onChange={(e) =>
                    setPartner({
                      ...partner,
                      partner_type: e.target
                        .value as PartnerForm['partner_type'],
                    })
                  }
                >
                  <option value="" disabled>
                    —
                  </option>
                  <option value="erp">
                    {t('ERP integrator', 'ERP entegratörü')}
                  </option>
                  <option value="bank">{t('Bank', 'Banka')}</option>
                  <option value="distribution">
                    {t('Distribution / reseller', 'Dağıtım / bayi')}
                  </option>
                  <option value="advisory">
                    {t('Advisory / consulting', 'Danışmanlık')}
                  </option>
                  <option value="other">{t('Other', 'Diğer')}</option>
                </select>
              </div>
              {showError && (
                <p className="form-error" role="alert">
                  {status.message}
                </p>
              )}
              <div className="form-submit-row">
                <button
                  type="submit"
                  className="cta submit-cta"
                  disabled={submitting}
                >
                  {submitting
                    ? t('Sending…', 'Gönderiliyor…')
                    : t('Become a partner', 'Partner olun')}
                  <ArrowRightSmall />
                </button>
                <p className="form-fineprint">
                  {t(
                    '48-hour response. No newsletters.',
                    '48 saat içinde dönüş. Bülten yok.',
                  )}
                </p>
              </div>
            </form>
          )}

          {status.kind !== 'success' && path === 'investor' && (
            <form
              className="form active"
              onSubmit={(e) => {
                e.preventDefault();
                submit('investor', investor);
              }}
              noValidate
            >
              <div className="form-row">
                <div className="field">
                  <label htmlFor="i_name">
                    {t('Full name', 'Ad soyad')} <span className="req">*</span>
                  </label>
                  <input
                    id="i_name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    value={investor.name}
                    onChange={(e) =>
                      setInvestor({ ...investor, name: e.target.value })
                    }
                  />
                </div>
                <div className="field">
                  <label htmlFor="i_fund">
                    {t('Fund / firm', 'Fon / şirket')}{' '}
                    <span className="req">*</span>
                  </label>
                  <input
                    id="i_fund"
                    name="fund"
                    type="text"
                    required
                    autoComplete="organization"
                    value={investor.fund}
                    onChange={(e) =>
                      setInvestor({ ...investor, fund: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="field">
                  <label htmlFor="i_email">
                    {t('Email', 'E-posta')} <span className="req">*</span>
                  </label>
                  <input
                    id="i_email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={investor.email}
                    onChange={(e) =>
                      setInvestor({ ...investor, email: e.target.value })
                    }
                  />
                </div>
                <div className="field">
                  <label htmlFor="i_phone">
                    {t('Phone', 'Telefon')} <span className="req">*</span>
                  </label>
                  <input
                    id="i_phone"
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    inputMode="tel"
                    placeholder="+90 5xx xxx xx xx"
                    value={investor.phone}
                    onChange={(e) =>
                      setInvestor({ ...investor, phone: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="field">
                <label htmlFor="i_stage">
                  {t('Stage of interest', 'İlgilendiğiniz tur')}{' '}
                  <span className="req">*</span>
                </label>
                <select
                  id="i_stage"
                  name="stage"
                  required
                  value={investor.stage}
                  onChange={(e) =>
                    setInvestor({
                      ...investor,
                      stage: e.target.value as InvestorForm['stage'],
                    })
                  }
                >
                  <option value="" disabled>
                    —
                  </option>
                  <option value="angel">
                    {t('Angel ($600K, current)', 'Angel ($600K, açık)')}
                  </option>
                  <option value="seed">
                    {t('Seed (next round)', 'Seed (sonraki tur)')}
                  </option>
                  <option value="series_a">
                    {t('Series A (later)', 'Series A (ileride)')}
                  </option>
                  <option value="exploring">
                    {t('Just exploring', 'Şimdilik keşif')}
                  </option>
                </select>
              </div>
              {showError && (
                <p className="form-error" role="alert">
                  {status.message}
                </p>
              )}
              <div className="form-submit-row">
                <button
                  type="submit"
                  className="cta submit-cta"
                  disabled={submitting}
                >
                  {submitting
                    ? t('Sending…', 'Gönderiliyor…')
                    : t('Get the deck', 'Sunumu isteyin')}
                  <ArrowRightSmall />
                </button>
                <p className="form-fineprint">
                  {t(
                    '48-hour response with the angel deck attached.',
                    '48 saat içinde angel sunumuyla dönüş.',
                  )}
                </p>
              </div>
            </form>
          )}

          {status.kind === 'success' && (
            <div className="form-success shown">
              <div className="checkmark">
                <Check />
              </div>
              <h3>{t("You're on the list.", 'Listedesiniz.')}</h3>
              <p>
                {t(
                  "We'll be in touch within 48 hours. The whitepaper is the best read in the meantime.",
                  '48 saat içinde size döneceğiz. Bu arada en iyi okuma whitepaper.',
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
