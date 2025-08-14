export default async function Home() {
  const res = await fetch('http://localhost:3000/api/metrics', { cache: 'no-store' });
  const { rows } = await res.json();

  return (
    <main style={{ padding: 24, fontFamily: 'system-ui' }}>
      <h1>Health Copilot</h1>
      <h2>Last 7 days (from Supabase)</h2>
      <ul>
        {rows.map(r => (
          <li key={r.id}>
            {r.date}: sleep {r.sleep_h ?? '-'}h, HRV {r.hrv ?? '-'}, RHR {r.rhr ?? '-'}, steps {r.steps ?? '-'}
          </li>
        ))}
      </ul>
    </main>
  );
}
