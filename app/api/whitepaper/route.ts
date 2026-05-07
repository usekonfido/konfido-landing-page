import { NextResponse } from 'next/server';
import { whitepaperSchema } from '@/lib/schemas';
import { getSupabaseServer } from '@/lib/supabase-server';
import { hashIp } from '@/lib/ip-hash';
import { signWhitepaperToken } from '@/lib/whitepaper-token';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Invalid JSON' },
      { status: 400 },
    );
  }

  const parsed = whitepaperSchema.safeParse(body);
  if (!parsed.success) {
    console.warn('whitepaper validation failed', parsed.error.issues);
    const first = parsed.error.issues[0];
    const field = first?.path?.join('.') || 'input';
    return NextResponse.json(
      { ok: false, error: `Invalid ${field}: ${first?.message ?? 'invalid'}` },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const ip_hash = hashIp(req.headers);
  const user_agent = req.headers.get('user-agent')?.slice(0, 500) ?? null;

  try {
    const supabase = getSupabaseServer();

    const { error: insertError } = await supabase
      .from('whitepaper_requests')
      .insert({
        name: data.name,
        email: data.email,
        company: data.company ?? null,
        language: data.language ?? null,
        user_agent,
        ip_hash,
      });
    if (insertError) {
      console.error('whitepaper insert error', insertError);
      return NextResponse.json(
        { ok: false, error: 'Storage error' },
        { status: 500 },
      );
    }

    const lang = data.language === 'tr' ? 'tr' : 'en';
    const token = signWhitepaperToken(lang);
    return NextResponse.json({
      ok: true,
      url: `/api/whitepaper/file?t=${token}`,
    });
  } catch (err) {
    console.error('whitepaper route error', err);
    return NextResponse.json(
      { ok: false, error: 'Server not configured' },
      { status: 500 },
    );
  }
}
