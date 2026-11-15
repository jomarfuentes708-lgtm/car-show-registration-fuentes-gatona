import { useEffect, useState } from 'react';
import KpiCards from '../components/KpiCards';
import NewRegistrationModal from '../components/NewRegistrationModal';
import RegistrationTable from '../components/RegistrationTable';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5205').replace(/\/$/, '');
const TYPES = ['All', 'Exhibitor', 'Competitor', 'VIP'];
const STATUSES = ['All', 'Pending', 'Confirmed', 'CheckedIn', 'Cancelled'];
const PAGE_SIZES = [5, 10, 20];

const fieldClass =
  'w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-[#5a5c69] focus:border-[#4e73df] focus:outline-none focus:ring-2 focus:ring-[#4e73df]/30';

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
  const [reloadKey, setReloadKey] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

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
  }, [reloadKey]);

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
          items: Array.isArray(json.items) ? json.items : [],
          page: Number(json.page) || 1,
          pageSize: Number(json.pageSize) || pageSize,
          totalCount: Number(json.totalCount) || 0,
          totalPages: Number(json.totalPages) || 0,
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
  }, [search, type, status, page, pageSize, reloadKey]);

  const clearFilters = () => {
    setSearchInput('');
    setSearch('');
    setType('All');
    setStatus('All');
    setPage(1);
  };

  const retry = () => setReloadKey((k) => k + 1);
  const refreshAll = () => setReloadKey((k) => k + 1);

  const { totalCount, totalPages } = data;
  const from = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalCount);
  const prevDisabled = loading || page <= 1;
  const nextDisabled = loading || page >= totalPages || totalPages === 0;

  const pageBtn =
    'min-w-[2.25rem] rounded border px-3 py-1.5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4e73df]';

  return (
    <div className="space-y-6">
      <NewRegistrationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onCreated={refreshAll} />

      {showKpis && <KpiCards summary={summary} loading={summaryLoading} />}

      <section className="rounded bg-white shadow-[0_.15rem_1.75rem_0_rgba(58,59,69,.15)]">
        <header className="flex items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-bold text-[#4e73df]">Registrations</h2>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="rounded bg-[#4e73df] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2e59d9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4e73df]"
          >
            + New Registration
          </button>
        </header>

        {/* Filters */}
        <div className="grid grid-cols-1 gap-3 border-b border-slate-200 bg-[#f8f9fc] px-5 py-4 md:grid-cols-[1fr_12rem_12rem_auto]">
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
            className="rounded border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-[#5a5c69] transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4e73df]"
          >
            Clear Filters
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
          <footer className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 text-sm text-[#858796] lg:flex-row lg:items-center lg:justify-between">
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
                  className="rounded border border-slate-300 bg-white px-2 py-1 text-sm text-[#5a5c69] focus:border-[#4e73df] focus:outline-none"
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
                className={`${pageBtn} border-slate-300 bg-white text-[#5a5c69] hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white`}
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
                        ? 'border-[#4e73df] bg-[#4e73df] text-white'
                        : 'border-slate-300 bg-white text-[#4e73df] hover:bg-slate-100'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              <button
                type="button"
                disabled={nextDisabled}
                onClick={() => setPage((p) => p + 1)}
                className={`${pageBtn} border-slate-300 bg-white text-[#5a5c69] hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white`}
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