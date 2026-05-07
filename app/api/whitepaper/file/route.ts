import { getSupabaseServer } from '@/lib/supabase-server';
import { verifyWhitepaperToken } from '@/lib/whitepaper-token';

export const runtime = 'nodejs';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get('t');
  if (!token) return new Response('Unauthorized', { status: 401 });

  const payload = verifyWhitepaperToken(token);
  if (!payload) return new Response('Unauthorized', { status: 401 });

  const bucket = process.env.WHITEPAPER_BUCKET ?? 'whitepapers';
  const objectName =
    payload.lang === 'tr'
      ? process.env.WHITEPAPER_OBJECT_TR ?? 'konfido-whitepaper-tr.pdf'
      : process.env.WHITEPAPER_OBJECT_EN ?? 'konfido-whitepaper-en.pdf';

  try {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(objectName);
    if (error || !data) {
      console.error('whitepaper file download error', error);
      return new Response('Not found', { status: 404 });
    }

    const buf = Buffer.from(await data.arrayBuffer());
    return new Response(buf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="konfido-whitepaper-${payload.lang}.pdf"`,
        'Cache-Control': 'private, no-store',
      },
    });
  } catch (err) {
    console.error('whitepaper file route error', err);
    return new Response('Server error', { status: 500 });
  }
}
