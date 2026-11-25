import { useEffect, useState } from 'react';
import KpiCards from '../components/KpiCards';
import RegistrationTable from '../components/RegistrationTable';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5205').replace(/\/$/, '');
const TYPES = ['All', 'Exhibitor', 'Competitor', 'VIP'];
const STATUSES = ['All', 'Pending', 'Confirmed', 'CheckedIn', 'Cancelled'];
const PAGE_SIZES = [5, 10, 20];

const fieldClass =
  'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-200';

function pageWindow(current, total) {
  const size = 5;
  let start = Math.max(1, current - 2);
  const end = Math.min(total, start + size - 1);
  start = Math.max(1, end - size + 1);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
}

export default function DashboardPage({ showKpis = true }) {
  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(true);

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [type, setType] = useState('All');
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [data, setData] = useState({ items: [], page: 1, pageSize: 10, totalCount: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Debounce the name search (~400ms) and go back to page 1.
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  // KPI summary
  useEffect(() => {
    const controller = new AbortController();
    setSummaryLoading(true);

    fetchJson(`${API_URL}/api/registrations/summary`, { signal: controller.signal })
      .then((json) => {
        setSummary({
          totalRegistrations: Number(json.totalRegistrations ?? json.TotalRegistrations ?? 0),
          totalPayments: Number(json.totalPayments ?? json.TotalPayments ?? 0),
          uncollectedPayments: Number(json.uncollectedPayments ?? json.UncollectedPayments ?? 0),
          confirmed: Number(json.confirmed ?? json.Confirmed ?? 0),
          checkedIn: Number(json.checkedIn ?? json.CheckedIn ?? 0),
        });
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setSummary(null);
      })
      .finally(() => {
        if (!controller.signal.aborted) setSummaryLoading(false);
      });

    return () => controller.abort();
  }, []);

  // Registrations list
  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams();
    const trimmedSearch = search.trim();

    if (trimmedSearch) params.set('participantName', trimmedSearch);
    if (type !== 'All') params.set('type', type);
    if (status !== 'All') params.set('status', status);
    params.set('page', String(page));
    params.set('pageSize', String(pageSize));

    setLoading(true);
    setError(false);

    fetchJson(`${API_URL}/api/registrations?${params.toString()}`, { signal: controller.signal })
      .then((json) => {
        setData({
          items: Array.isArray(json.items) ? json.items : (Array.isArray(json.Items) ? json.Items : []),
          page: Number(json.page ?? json.Page) || 1,
          pageSize: Number(json.pageSize ?? json.PageSize) || pageSize,
          totalCount: Number(json.totalCount ?? json.TotalCount) || 0,
          totalPages: Number(json.totalPages ?? json.TotalPages) || 0,
        });
      })
      .catch((err) => {
        if (err.name === 'AbortError') return;
        setError(true);
        setData({ items: [], page: 1, pageSize, totalCount: 0, totalPages: 0 });
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [search, type, status, page, pageSize]);

  const clearFilters = () => {
    setSearchInput('');
    setSearch('');
    setType('All');
    setStatus('All');
    setPage(1);
  };

  const retry = () => setReloadKey((k) => k + 1);

  const { totalCount, totalPages } = data;
  const from = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalCount);
  const prevDisabled = loading || page <= 1;
  const nextDisabled = loading || page >= totalPages || totalPages === 0;

  const pageBtn =
    'min-w-[2.25rem] rounded-md border px-3 py-1.5 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300';

  return (
    <div className="space-y-6">
      {showKpis && <KpiCards summary={summary} loading={summaryLoading} />}

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <header className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">Registrations</h2>
            <p className="mt-0.5 text-xs text-slate-500">Manage event participants and payment status</p>
          </div>
        </header>

        {/* Filters */}
        <div className="grid grid-cols-1 gap-3 border-b border-slate-200 bg-slate-50/60 px-5 py-4 md:grid-cols-[1fr_12rem_12rem_auto]">
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search participant name..."
            aria-label="Search participant name"
            className={fieldClass}
          />
          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setPage(1);
            }}
            aria-label="Registration type"
            className={fieldClass}
          >
            {TYPES.map((t) => (
              <option key={t} value={t}>
                {t === 'All' ? 'All types' : t}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            aria-label="Status"
            className={fieldClass}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s === 'All' ? 'All statuses' : s === 'CheckedIn' ? 'Checked In' : s}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          >
            Clear filters
          </button>
        </div>

        <RegistrationTable
          items={data.items ?? []}
          loading={loading}
          error={error}
          pageSize={pageSize}
          onRetry={retry}
          onClearFilters={clearFilters}
        />

        {/* Footer */}
        {!error && (
          <footer className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 text-sm text-slate-500 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-4">
              <span>
                Showing {from}–{to} of {totalCount.toLocaleString('en-US')}
              </span>
              <label className="flex items-center gap-2">
                <span>Rows per page</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                  className="rounded-md border border-slate-300 bg-white px-2 py-1 text-sm text-slate-700 focus:border-slate-500 focus:outline-none"
                >
                  {PAGE_SIZES.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <nav className="flex flex-wrap items-center gap-1" aria-label="Pagination">
              <button
                type="button"
                disabled={prevDisabled}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className={`${pageBtn} border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white`}
              >
                Previous
              </button>
              {totalPages > 0 &&
                pageWindow(page, totalPages).map((n) => (
                  <button
                    key={n}
                    type="button"
                    disabled={loading}
                    onClick={() => setPage(n)}
                    aria-current={n === page ? 'page' : undefined}
                    className={`${pageBtn} disabled:cursor-not-allowed ${
                      n === page
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              <button
                type="button"
                disabled={nextDisabled}
                onClick={() => setPage((p) => p + 1)}
                className={`${pageBtn} border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white`}
              >
                Next
              </button>
            </nav>
          </footer>
        )}
      </section>
    </div>
  );
}