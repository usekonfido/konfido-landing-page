import 'server-only';
import { createHash } from 'node:crypto';

function dailySalt(): string {
  const base = process.env.IP_HASH_SALT ?? '';
  const day = new Date().toISOString().slice(0, 10);
  return `${base}|${day}`;
}

export function hashIp(headers: Headers): string | null {
  const fwd =
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    headers.get('x-real-ip')?.trim() ??
    null;
  if (!fwd) return null;
  return createHash('sha256').update(fwd + dailySalt()).digest('hex');
}
