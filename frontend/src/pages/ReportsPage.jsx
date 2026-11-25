import { useEffect, useMemo, useState } from 'react';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5205').replace(/\/$/, '');

const CARD_STYLES = {
  Confirmed: 'border-l-slate-400 text-slate-700',
  CheckedIn: 'border-l-slate-500 text-slate-700',
  Pending: 'border-l-slate-300 text-slate-600',
  Cancelled: 'border-l-slate-300 text-slate-500',
  Exhibitor: 'border-l-slate-700 text-slate-800',
  Competitor: 'border-l-slate-400 text-slate-700',
  VIP: 'border-l-slate-500 text-slate-700',
};

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
}

function exportCsv(rows) {
  if (!rows.length) return;

  const headers = Object.keys(rows[0]);
  const csv = [headers.join(',')]
    .concat(
      rows.map((row) =>
        headers
          .map((header) => {
            const raw = row[header] ?? '';
            const value = String(raw).replace(/"/g, '""');
            return `"${value}"`;
          })
          .join(',')
      )
    )
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'car-show-registrations.csv';
  link.click();
  URL.revokeObjectURL(url);
}

export default function ReportsPage() {
  const [summary, setSummary] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [summaryJson, listJson] = await Promise.all([
          fetchJson(`${API_URL}/api/registrations/summary`),
          fetchJson(`${API_URL}/api/registrations?page=1&pageSize=20`),
        ]);

        if (!active) return;
        setSummary(summaryJson);
        setItems(Array.isArray(listJson.items) ? listJson.items : []);
      } catch {
        if (active) setError('Cannot reach the API.');
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  const statusCards = useMemo(() => {
    const statusBreakdown = {
      Confirmed: Number(summary?.confirmed ?? 0),
      CheckedIn: Number(summary?.checkedIn ?? 0),
      Pending: Number(summary?.pending ?? 0),
      Cancelled: Number(summary?.cancelled ?? 0),
    };

    return Object.entries(statusBreakdown).map(([label, value]) => ({
      label,
      value,
      tone: CARD_STYLES[label],
    }));
  }, [summary]);

  const categoryCards = useMemo(() => {
    const counts = { Exhibitor: 0, Competitor: 0, VIP: 0 };
    items.forEach((item) => {
      if (counts[item.registrationType] !== undefined) counts[item.registrationType] += 1;
    });

    return Object.entries(counts).map(([label, value]) => ({
      label,
      value,
      tone: CARD_STYLES[label],
    }));
  }, [items]);

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-lg border border-[#e2e8f0] bg-white">
        <header className="flex items-center justify-between gap-3 border-b border-[#e2e8f0] px-5 py-4">
          <h2 className="text-base font-semibold text-slate-900">Reports</h2>
          <button
            type="button"
            onClick={() => exportCsv(items)}
            disabled={loading || !items.length}
            className="rounded-md bg-[#1e293b] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
          >
            Export CSV
          </button>
        </header>

        {error ? (
          <div className="px-6 py-16 text-center text-sm text-red-600">{error}</div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 xl:grid-cols-4">
              {statusCards.map(({ label, value, tone }) => (
                <div key={label} className={`rounded border-l-4 bg-white px-5 py-4 shadow-[0_.15rem_1.75rem_0_rgba(58,59,69,.15)] ${tone}`}>
                  <p className="text-xs font-bold uppercase tracking-wide text-[#858796]">{label}</p>
                  {loading ? (
                    <div className="mt-2 h-7 w-20 animate-pulse rounded bg-slate-200" />
                  ) : (
                    <p className="mt-2 text-2xl font-bold text-[#5a5c69]">{value}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 p-5">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-[#5a5c69]">Category Breakdown</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {categoryCards.map(({ label, value, tone }) => (
                  <div key={label} className={`rounded border-l-4 bg-white px-5 py-4 shadow-[0_.15rem_1.75rem_0_rgba(58,59,69,.15)] ${tone}`}>
                    <p className="text-xs font-bold uppercase tracking-wide text-[#858796]">{label}</p>
                    <p className="mt-2 text-2xl font-bold text-[#5a5c69]">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
