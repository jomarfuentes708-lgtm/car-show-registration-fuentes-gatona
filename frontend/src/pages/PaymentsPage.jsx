import { useEffect, useMemo, useState } from 'react';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5205').replace(/\/$/, '');
const PAYMENT_FILTERS = ['All', 'Paid', 'Partial', 'Unpaid'];

const money = (value) =>
  '₱' +
  Number(value ?? 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

function formatPercent(value) {
  const numeric = Number(value ?? 0);
  if (!Number.isFinite(numeric)) return '0.00%';
  return `${numeric.toFixed(2)}%`;
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
}

function summarizeStats(summary) {
  const totalFees = Number(summary?.totalFees ?? 0);
  const totalPayments = Number(summary?.totalPayments ?? 0);
  const uncollected = Number(summary?.uncollectedPayments ?? 0);
  const collectionRate = totalFees > 0 ? (totalPayments / totalFees) * 100 : 0;

  return {
    totalFees,
    totalPayments,
    uncollected,
    collectionRate,
  };
}

export default function PaymentsPage() {
  const [summary, setSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadSummary = async () => {
      try {
        const data = await fetchJson(`${API_URL}/api/registrations/summary`);
        if (active) setSummary(data);
      } catch {
        if (active) setError('Cannot reach the API.');
      } finally {
        if (active) setLoadingSummary(false);
      }
    };

    const loadItems = async () => {
      try {
        const params = new URLSearchParams({ page: '1', pageSize: '20' });
        const data = await fetchJson(`${API_URL}/api/registrations?${params.toString()}`);
        if (active) setItems(Array.isArray(data.items) ? data.items : []);
      } catch {
        if (active) setError('Cannot reach the API.');
      } finally {
        if (active) setLoadingItems(false);
      }
    };

    loadSummary();
    loadItems();

    return () => {
      active = false;
    };
  }, []);

  const filteredItems = useMemo(() => {
    if (paymentFilter === 'All') return items;
    return items.filter((item) => item.paymentStatus === paymentFilter);
  }, [items, paymentFilter]);

  const stats = useMemo(() => summarizeStats(summary), [summary]);

  const cards = [
    { label: 'Total Fees', value: money(stats.totalFees), tone: 'border-l-[#4e73df] text-[#4e73df]' },
    { label: 'Total Collected', value: money(stats.totalPayments), tone: 'border-l-[#1cc88a] text-[#1cc88a]' },
    { label: 'Uncollected', value: money(stats.uncollected), tone: 'border-l-[#e74a3b] text-[#e74a3b]' },
    { label: 'Collection Rate', value: formatPercent(stats.collectionRate), tone: 'border-l-[#36b9cc] text-[#36b9cc]' },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded bg-white shadow-[0_.15rem_1.75rem_0_rgba(58,59,69,.15)]">
        <header className="border-b border-slate-200 px-5 py-4">
          <h2 className="text-base font-bold text-[#4e73df]">Payments</h2>
        </header>

        {error ? (
          <div className="px-6 py-16 text-center text-sm text-red-600">{error}</div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 xl:grid-cols-4">
              {cards.map(({ label, value, tone }) => (
                <div key={label} className={`rounded border-l-4 bg-white px-5 py-4 shadow-[0_.15rem_1.75rem_0_rgba(58,59,69,.15)] ${tone}`}>
                  <p className="text-xs font-bold uppercase tracking-wide text-[#858796]">{label}</p>
                  {loadingSummary ? (
                    <div className="mt-2 h-7 w-28 animate-pulse rounded bg-slate-200" />
                  ) : (
                    <p className="mt-2 text-2xl font-bold text-[#5a5c69]">{value}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 px-5 py-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="text-sm font-bold text-[#5a5c69]">Payment Breakdown</div>
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="rounded border border-slate-300 bg-white px-3 py-2 text-sm text-[#5a5c69] focus:border-[#4e73df] focus:outline-none"
                >
                  {PAYMENT_FILTERS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] border-collapse text-left text-sm text-[#858796]">
                  <thead>
                    <tr className="border-b-2 border-slate-200 bg-[#f8f9fc] text-xs uppercase tracking-wide text-[#5a5c69]">
                      <th className="px-4 py-3 font-bold">Registration</th>
                      <th className="px-4 py-3 font-bold">Participant</th>
                      <th className="px-4 py-3 font-bold">Type</th>
                      <th className="px-4 py-3 font-bold text-right">Fee</th>
                      <th className="px-4 py-3 font-bold text-right">Paid</th>
                      <th className="px-4 py-3 font-bold text-right">Balance</th>
                      <th className="px-4 py-3 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingItems
                      ? Array.from({ length: 5 }).map((_, index) => (
                          <tr key={index} className="border-b border-slate-100">
                            {Array.from({ length: 7 }).map((__, col) => (
                              <td key={col} className="px-4 py-4">
                                <div className="h-4 w-full max-w-[120px] animate-pulse rounded bg-slate-200" />
                              </td>
                            ))}
                          </tr>
                        ))
                      : filteredItems.map((item) => {
                          const balance = Number(item.registrationFee ?? 0) - Number(item.amountPaid ?? 0);
                          return (
                            <tr key={item.id} className="border-b border-slate-100 hover:bg-[#f8f9fc]">
                              <td className="px-4 py-3 font-bold text-[#4e73df]">{item.registrationNumber}</td>
                              <td className="px-4 py-3">
                                <div className="font-bold text-[#5a5c69]">{item.participantName}</div>
                                <div className="text-xs">{item.email}</div>
                              </td>
                              <td className="px-4 py-3">{item.registrationType}</td>
                              <td className="px-4 py-3 text-right">{money(item.registrationFee)}</td>
                              <td className="px-4 py-3 text-right">{money(item.amountPaid)}</td>
                              <td className="px-4 py-3 text-right">{money(Math.max(balance, 0))}</td>
                              <td className="px-4 py-3">
                                <span
                                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ring-inset ${
                                    item.paymentStatus === 'Paid'
                                      ? 'bg-emerald-100 text-emerald-800 ring-emerald-200'
                                      : item.paymentStatus === 'Partial'
                                        ? 'bg-amber-100 text-amber-800 ring-amber-200'
                                        : 'bg-rose-100 text-rose-800 ring-rose-200'
                                  }`}
                                >
                                  {item.paymentStatus}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
