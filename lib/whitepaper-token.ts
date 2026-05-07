import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';

const TTL_MS = 15 * 60 * 1000;

function getSecret(): string {
  const secret =
    process.env.WHITEPAPER_TOKEN_SECRET ?? process.env.IP_HASH_SALT ?? '';
  if (!secret) {
    throw new Error(
      'Missing WHITEPAPER_TOKEN_SECRET (or IP_HASH_SALT fallback) — set one to sign whitepaper download tokens.',
    );
  }
  return secret;
}

export function signWhitepaperToken(lang: 'en' | 'tr'): string {
  const exp = Date.now() + TTL_MS;
  const data = `${lang}.${exp}`;
  const sig = createHmac('sha256', getSecret()).update(data).digest('hex');
  return Buffer.from(`${data}.${sig}`).toString('base64url');
}

export function verifyWhitepaperToken(
  token: string,
): { lang: 'en' | 'tr' } | null {
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf-8');
    const parts = decoded.split('.');
    if (parts.length !== 3) return null;
    const [lang, expStr, sig] = parts;
    if (lang !== 'en' && lang !== 'tr') return null;
    const exp = Number.parseInt(expStr, 10);
    if (!Number.isFinite(exp) || exp < Date.now()) return null;

    const expected = createHmac('sha256', getSecret())
      .update(`${lang}.${exp}`)
      .digest('hex');
    const a = Buffer.from(sig, 'hex');
    const b = Buffer.from(expected, 'hex');
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

    return { lang };
  } catch {
    return null;
  }
}
