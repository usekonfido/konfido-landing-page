import { NextResponse } from 'next/server';
import { leadSchema } from '@/lib/schemas';
import { getSupabaseServer } from '@/lib/supabase-server';
import { hashIp } from '@/lib/ip-hash';

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

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    console.warn('leads validation failed', parsed.error.issues);
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

  const row: Record<string, unknown> = {
    form_type: data.form_type,
    name: data.name,
    email: data.email,
    phone: data.phone,
    language: data.language ?? null,
    user_agent,
    ip_hash,
  };
  if (data.form_type === 'customer') {
    row.company = data.company;
    row.entities = data.entities;
  } else if (data.form_type === 'partner') {
    row.company = data.company;
    row.partner_type = data.partner_type;
  } else {
    row.fund = data.fund;
    row.stage = data.stage;
  }

  try {
    const supabase = getSupabaseServer();
    const { error } = await supabase.from('leads').insert(row);
    if (error) {
      console.error('leads insert error', error);
      return NextResponse.json(
        { ok: false, error: 'Storage error' },
        { status: 500 },
      );
    }
  } catch (err) {
    console.error('leads route error', err);
    return NextResponse.json(
      { ok: false, error: 'Server not configured' },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
