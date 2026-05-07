'use client';

import { useState } from 'react';
import { useLanguage, useT } from '@/components/i18n/LanguageProvider';
import { ArrowRightSmall, Check } from '@/components/Icons';

type Status =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'error'; message: string }
  | { kind: 'success' };

export function Whitepaper() {
  const t = useT();
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [form, setForm] = useState({ name: '', email: '', company: '' });

  const close = () => {
    setOpen(false);
    if (status.kind === 'success') {
      setStatus({ kind: 'idle' });
      setForm({ name: '', email: '', company: '' });
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ kind: 'submitting' });
    try {
      const res = await fetch('/api/whitepaper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, language: lang }),
      });
      const data = (await res.json().catch(() => null)) as
        | { ok: true; url: string }
        | { ok: false; error?: string }
        | null;

      if (!res.ok || !data || !('ok' in data) || !data.ok) {
        throw new Error(
          (data && 'error' in data && data.error) ||
            `Request failed (${res.status})`,
        );
      }
      setStatus({ kind: 'success' });
      window.open(data.url, '_blank', 'noopener,noreferrer');
    } catch (err) {
      setStatus({
        kind: 'error',
        message: err instanceof Error ? err.message : 'Something went wrong.',
      });
    }
  };

  return (
    <>
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
              <button
                type="button"
                className="cta on-dark"
                onClick={() => setOpen(true)}
              >
                {t('Read the whitepaper', 'Kılavuzu okuyun')}
                <ArrowRightSmall />
              </button>
            </div>
          </div>
        </div>
      </section>

      {open && (
        <div
          className="wp-modal-backdrop"
          role="dialog"
          aria-modal="true"
          aria-labelledby="wp-modal-title"
          onClick={close}
        >
          <div className="wp-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="wp-modal-close"
              aria-label={t('Close', 'Kapat')}
              onClick={close}
            >
              ×
            </button>
            {status.kind === 'success' ? (
              <div
                className="form-success shown"
                style={{ border: 0, padding: 0, boxShadow: 'none' }}
              >
                <div className="checkmark">
                  <Check />
                </div>
                <h3 id="wp-modal-title">
                  {t('Sent. Opening now…', 'Gönderildi. Açılıyor…')}
                </h3>
                <p>
                  {t(
                    "If a new tab didn't open, check your popup blocker.",
                    'Yeni sekme açılmadıysa popup engelleyicinizi kontrol edin.',
                  )}
                </p>
              </div>
            ) : (
              <>
                <h3 id="wp-modal-title" className="wp-modal-title">
                  {t('Get the whitepaper', 'Kılavuzu alın')}
                </h3>
                <p className="wp-modal-sub">
                  {t(
                    'Tell us where to send it. The PDF opens in a new tab.',
                    'Bilgilerinizi bırakın. PDF yeni sekmede açılır.',
                  )}
                </p>
                <form className="form active" onSubmit={submit} noValidate>
                  <div className="field">
                    <label htmlFor="wp_name">
                      {t('Full name', 'Ad soyad')}{' '}
                      <span className="req">*</span>
                    </label>
                    <input
                      id="wp_name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="wp_email">
                      {t('Work email', 'İş e-postası')}{' '}
                      <span className="req">*</span>
                    </label>
                    <input
                      id="wp_email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="wp_company">
                      {t('Company', 'Şirket')}
                    </label>
                    <input
                      id="wp_company"
                      name="company"
                      type="text"
                      autoComplete="organization"
                      value={form.company}
                      onChange={(e) =>
                        setForm({ ...form, company: e.target.value })
                      }
                    />
                  </div>
                  {status.kind === 'error' && (
                    <p className="form-error" role="alert">
                      {status.message}
                    </p>
                  )}
                  <div className="form-submit-row">
                    <button
                      type="submit"
                      className="cta submit-cta"
                      disabled={status.kind === 'submitting'}
                    >
                      {status.kind === 'submitting'
                        ? t('Sending…', 'Gönderiliyor…')
                        : t('Send me the PDF', "PDF'yi bana gönder")}
                      <ArrowRightSmall />
                    </button>
                    <p className="form-fineprint">
                      {t(
                        'No newsletters. We use this only to track readership.',
                        'Bülten yok. Sadece okur takibi için kullanılır.',
                      )}
                    </p>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
