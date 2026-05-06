'use client';

import { useT } from '@/components/i18n/LanguageProvider';

type Card = {
  num: string;
  titleEn: string;
  titleTr: string;
  bodyEn: string;
  bodyTr: string;
  statEn: string;
  statTr: string;
  featured?: boolean;
};

const CARDS: Card[] = [
  {
    num: '01',
    titleEn: 'Cash sits idle',
    titleTr: 'Nakit atıl olarak kalır',
    bodyEn:
      'No live view across banks. Cash in checking accounts earns next to nothing.',
    bodyTr:
      'Bankalar arasında görünümün olmaması cari hesaplardaki paranın getirisiz hale gelmesine sebep olur.',
    statEn: '#2 obstacle for treasurers — Strategic Treasurer 2025',
    statTr: 'Hazinecilerin 2 numaralı engeli — Strategic Treasurer 2025',
  },
  {
    num: '02',
    titleEn: 'Funding comes late',
    titleTr: 'Finansman ihtiyacı sonradan ortaya çıkar',
    bodyEn:
      'Shortfalls show up after the cleanup. You borrow in panic, at a worse rate.',
    bodyTr:
      'Finansman açığı ancak iki haftanın sonunda ortaya çıkar. Borçlanma maliyetlerinizin artması olasıdır.',
    statEn: '#1 challenge in corporate treasury — Strategic Treasurer 2025',
    statTr: 'Kurumsal hazinede 1 numaralı zorluk — Strategic Treasurer 2025',
  },
  {
    num: '03',
    titleEn: 'FX hits before you see it',
    titleTr: 'Kur, fark etmeden vurur',
    bodyEn:
      'Cross-currency positions stay invisible until books close. The damage is already done.',
    bodyTr:
      'Çapraz kur pozisyonu defter kapanana kadar saklı kalır. Zarar çoktan yazılmıştır.',
    statEn: 'Fragmented tech — #1 obstacle, NeuGroup / HighRadius',
    statTr: 'Parçalı teknoloji — 1 numaralı engel, NeuGroup / HighRadius',
    featured: true,
  },
];

export function Problems() {
  const t = useT();
  return (
    <section className="problem">
      <div className="container">
        <div className="problem-quote-wrap">
          <h2 className="problem-quote">
            {t('"Where will our cash be ', '"On üç hafta sonra ')}
            <span className="accent">
              {t('in 13 weeks?"', 'nakit akışımız ne halde olacak?"')}
            </span>
          </h2>
          <p className="problem-sub">
            {t(
              'Two weeks to answer. By then, three things have already gone wrong.',
              'Sorunun cevabına ulaşmak iki hafta sürer ve o sırada üç şey ters gitmiştir.',
            )}
          </p>
        </div>

        <div className="problem-grid">
          {CARDS.map((c) => (
            <div
              key={c.num}
              className={`problem-card${c.featured ? ' featured' : ''}`}
            >
              <div className="num">{c.num}</div>
              <h3>{t(c.titleEn, c.titleTr)}</h3>
              <p>{t(c.bodyEn, c.bodyTr)}</p>
              <div className="stat">{t(c.statEn, c.statTr)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
