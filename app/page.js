import { headers } from 'next/headers';

export default async function Home() {
  // Build an absolute URL for server-side fetch (works locally + on Vercel)
  const h = headers();
  const host = h.get('host');
  const protocol = host && host.includes('localhost') ? 'http' : 'https';

  const res = await fetch(`${protocol}://${host}/api/metrics`, { cache: 'no-store' });
  const { rows } = await res.json();

  return (
    <main style={{ padding: 24, fontFamily: 'system-ui' }}>
      <h1>Health Copilot</h1>
      <h2>Last 7 days (from Supabase)</h2>
      <ul>
        {rows.map((r) => (
          <li key={r.id}>
            {r.date}: sleep {r.sleep_h ?? '-'}h, HRV {r.hrv ?? '-'}, RHR {r.rhr ?? '-'}, steps {r.steps ?? '-'}
          </li>
        ))}
      </ul>
    </main>
  );
}
