import { NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../lib/supabaseAdmin';

// Quick check in the browser: open /api/ingest and you'll see this
export async function GET() {
  return NextResponse.json({ ok: true, how: 'POST JSON here to save daily metrics' });
}

export async function POST(req) {
  // 1) Simple security: require the secret token header
  const token = req.headers.get('x-ingest-token');
  if (token !== process.env.INGEST_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2) Read the JSON body
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  // Expect: { date:"YYYY-MM-DD", sleep_h:7.6, hrv:52, rhr:58, steps:8123 }
  const { date, sleep_h, hrv, rhr, steps } = body || {};
  if (!date) {
    return NextResponse.json({ error: 'date (YYYY-MM-DD) required' }, { status: 400 });
  }

  // 3) Upsert (insert or update) today’s row by date
  const row = {
    date,
    sleep_h: sleep_h ?? null,
    hrv: hrv ?? null,
    rhr: rhr ?? null,
    steps: steps ?? null
  };

  const { error } = await supabaseAdmin
    .from('metrics_daily')
    .upsert(row, { onConflict: 'date' });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
