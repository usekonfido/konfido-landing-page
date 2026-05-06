import { NextResponse } from 'next/server';
import { whitepaperSchema } from '@/lib/schemas';
import { getSupabaseServer } from '@/lib/supabase-server';
import { hashIp } from '@/lib/ip-hash';

export const runtime = 'nodejs';

const SIGNED_URL_TTL_SECONDS = 60 * 15;

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

  const bucket = process.env.WHITEPAPER_BUCKET ?? 'whitepapers';
  const objectName =
    process.env.WHITEPAPER_OBJECT_EN ?? 'konfido-whitepaper-en.pdf';

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

    const { data: signed, error: signError } = await supabase.storage
      .from(bucket)
      .createSignedUrl(objectName, SIGNED_URL_TTL_SECONDS);

    if (signError || !signed?.signedUrl) {
      console.error('whitepaper sign error', signError);
      return NextResponse.json(
        { ok: false, error: 'Could not generate download link' },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true, url: signed.signedUrl });
  } catch (err) {
    console.error('whitepaper route error', err);
    return NextResponse.json(
      { ok: false, error: 'Server not configured' },
      { status: 500 },
    );
  }
}
