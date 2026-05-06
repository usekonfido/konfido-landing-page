'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useT } from '@/components/i18n/LanguageProvider';
import { ChevronLeft, ChevronRight } from '@/components/Icons';

type Voice = {
  initials: string;
  name: string;
  quoteEn: string;
  quoteTr: string;
  roleEn: string;
  roleTr: string;
};

const VOICES: Voice[] = [
  {
    initials: 'MA',
    name: 'M. Aydın',
    quoteEn:
      '"Two days every month go into consolidating eight banks by hand: Türkiye and Germany. The day Konfido brings them all onto one screen, a new chapter begins for me."',
    quoteTr:
      '"Her ay iki günüm sekiz bankayı elle birleştirmeye gidiyor: Türkiye ve Almanya. Konfido bunları tek ekrana indirdiği gün, benim için yeni bir dönem başlayacak."',
    roleEn: 'CFO · Mid-market manufacturing · 8 entities, TR + DE',
    roleTr: 'CFO · Orta ölçekli üretim · 8 şirket, TR + DE',
  },
  {
    initials: 'SH',
    name: 'Sarah H.',
    quoteEn:
      "\"I'm working closely with the Konfido team on the visibility module. Their vision is what convinced even me...\"",
    quoteTr:
      '"Görünürlük modülü için Konfido ekibiyle dirsek temasındayım. Vizyonları beni bile ikna etti..."',
    roleEn: 'VP Finance · B2B SaaS · 5 countries',
    roleTr: 'VP Finance · B2B SaaS · 5 ülke',
  },
  {
    initials: 'EK',
    name: 'E. Karaca',
    quoteEn:
      '"Wrangling bank accounts was a burden of its own — the finance team carried it together. Now we\'re handing it to Konfido :)"',
    quoteTr:
      '"Banka hesaplarıyla uğraşmak başlı başına bir yüktü, bu yükü finans ekibi paylaşıyordu, artık Konfido\'ya emanet :)"',
    roleEn: 'Finance Director · Distribution · 12 entities',
    roleTr: 'Finans Direktörü · Dağıtım · 12 şirket',
  },
  {
    initials: 'DV',
    name: 'D. Volkan',
    quoteEn:
      "\"I evaluated four enterprise TMS vendors. Year-long rollouts, six-figure setup fees. Konfido came in right on time, saying 'very soon.'\"",
    quoteTr:
      "\"Dört enterprise TMS sağlayıcısı baktım. Hepsi yıllık kurulum, altı haneli setup ücreti istedi. Konfido tam zamanında 'çok yakında' dedi.\"",
    roleEn: 'Group Treasurer · Industrial group · 15+ entities',
    roleTr: 'Grup Hazinecisi · Sanayi grubu · 15+ şirket',
  },
];

export function Voices() {
  const t = useT();
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [edges, setEdges] = useState({ atStart: true, atEnd: false });

  const cardStep = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;
    const cards = track.querySelectorAll<HTMLElement>('.voice');
    if (cards.length < 2) return cards[0]?.offsetWidth ?? 0;
    return cards[1].offsetLeft - cards[0].offsetLeft;
  }, []);

  const update = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const step = cardStep();
    setActiveIndex(step ? Math.round(track.scrollLeft / step) : 0);
    setEdges({
      atStart: track.scrollLeft <= 4,
      atEnd: track.scrollLeft + track.clientWidth >= track.scrollWidth - 4,
    });
  }, [cardStep]);

  useEffect(() => {
    update();
    const track = trackRef.current;
    if (!track) return;
    let timeout: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(update, 60);
    };
    const onResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(update, 100);
    };
    track.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onResize);
    return () => {
      track.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      clearTimeout(timeout);
    };
  }, [update]);

  const scrollBy = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: dir * cardStep(), behavior: 'smooth' });
  };

  const scrollTo = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: cardStep() * i, behavior: 'smooth' });
  };

  return (
    <section className="voices">
      <div className="container">
        <div className="voices-head">
          <div className="head-text">
            <span className="eyebrow-tag">
              {t('Early users', 'Erken kullanıcılar')}
            </span>
            <h2 className="section-title">
              {t(
                'The first finance teams ',
                'Bizimle tasarım partneri olanlar ',
              )}
              <span className="accent">{t('on board.', 'ne diyor?')}</span>
            </h2>
          </div>
          <div className="carousel-controls" aria-label="Carousel controls">
            <button
              className="carousel-btn"
              type="button"
              aria-label="Previous"
              onClick={() => scrollBy(-1)}
              disabled={edges.atStart}
            >
              <ChevronLeft />
            </button>
            <button
              className="carousel-btn"
              type="button"
              aria-label="Next"
              onClick={() => scrollBy(1)}
              disabled={edges.atEnd}
            >
              <ChevronRight />
            </button>
          </div>
        </div>

        <div className="voice-track" ref={trackRef}>
          {VOICES.map((v) => (
            <article key={v.initials} className="voice">
              <blockquote>{t(v.quoteEn, v.quoteTr)}</blockquote>
              <div className="voice-author">
                <div className="voice-avatar">{v.initials}</div>
                <div className="voice-meta">
                  <div className="name">{v.name}</div>
                  <div className="role">{t(v.roleEn, v.roleTr)}</div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="carousel-dots" aria-hidden="true">
          {VOICES.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`carousel-dot${i === activeIndex ? ' active' : ''}`}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => scrollTo(i)}
            />
          ))}
        </div>

        <p className="voices-disclaimer">
          {t(
            "Names abbreviated and company specifics generalized at our early users' request, until launch.",
            'Lansmana kadar erken kullanıcılarımızın talebiyle isimler kısaltıldı ve şirket detayları genelleştirildi.',
          )}
        </p>
      </div>
    </section>
  );
}
