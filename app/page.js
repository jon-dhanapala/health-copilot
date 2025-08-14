'use client';
import { useEffect, useState } from 'react';

export default function Home() {
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState('');

  useEffect(() => {
    fetch('/api/metrics')
      .then(r => r.json())
      .then(d => setRows(d.rows || []))
      .catch(e => setErr(String(e)));
  }, []);

  return (
    <main style={{ padding: 24, fontFamily: 'system-ui' }}>
      <h1>Health Copilot</h1>

      {err && <div style={{ color: 'red' }}>Error: {err}</div>}

      <h2>Last 7 days (from Supabase)</h2>
      <ul>
        {rows.map(r => (
          <li key={r.id}>
            {r.date}: sleep {r.sleep_h ?? '-'}h, HRV {r.hrv ?? '-'}, RHR {r.rhr ?? '-'}, steps {r.steps ?? '-'}
          </li>
        ))}
      </ul>

      {!rows.length && !err && <div>Loading…</div>}
    </main>
  );
}
