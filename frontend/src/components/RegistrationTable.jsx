import { useEffect, useMemo, useState } from 'react';
import { getRegistrations } from '../api/sample-data';
import PaymentBadge from './PaymentBadge';
import StatusBadge from './StatusBadge';

const formatPeso = (value) =>
  new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 2
  }).format(value);

export default function RegistrationTable() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [data, setData] = useState({ items: [], page: 1, pageSize: 10, totalCount: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadRegistrations() {
      setLoading(true);
      try {
        const response = await getRegistrations({
          participantName: search,
          type: typeFilter,
          status: statusFilter,
          page,
          pageSize: 10
        });

        if (active) {
          setData(response);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadRegistrations();

    return () => {
      active = false;
    };
  }, [search, typeFilter, statusFilter, page]);

  const totalPages = useMemo(() => Math.max(1, data.totalPages), [data.totalPages]);

  const summaryText = useMemo(() => {
    if (loading) {
      return 'Loading registrations...';
    }

    if (data.totalCount === 0) {
      return 'No registrations found for the current filters.';
    }

    const first = (data.page - 1) * data.pageSize + 1;
    const last = Math.min(data.page * data.pageSize, data.totalCount);
    return `Showing ${first}-${last} of ${data.totalCount} registrations`;
  }, [data, loading]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50">Registration List</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">{summaryText}</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              value={search}
              onChange={(event) => {
                setPage(1);
                setSearch(event.target.value);
              }}
              placeholder="Search participant..."
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 sm:w-64 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-900"
            />

            <select
              value={typeFilter}
              onChange={(event) => {
                setPage(1);
                setTypeFilter(event.target.value);
              }}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-900"
            >
              <option value="">All Types</option>
              <option value="Exhibitor">Exhibitor</option>
              <option value="Competitor">Competitor</option>
              <option value="VIP">VIP</option>
            </select>

            <select
              value={statusFilter}
              onChange={(event) => {
                setPage(1);
                setStatusFilter(event.target.value);
              }}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-sky-400 dark:focus:ring-sky-900"
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="CheckedIn">Checked In</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm dark:divide-slate-800">
          <thead className="bg-slate-50 dark:bg-slate-950/40">
            <tr>
              <th className="px-5 py-3 font-semibold text-slate-600 dark:text-slate-300">Registration Number</th>
              <th className="px-5 py-3 font-semibold text-slate-600 dark:text-slate-300">Participant Name</th>
              <th className="px-5 py-3 font-semibold text-slate-600 dark:text-slate-300">Car Make/Model</th>
              <th className="px-5 py-3 font-semibold text-slate-600 dark:text-slate-300">Plate Number</th>
              <th className="px-5 py-3 font-semibold text-slate-600 dark:text-slate-300">Type</th>
              <th className="px-5 py-3 font-semibold text-slate-600 dark:text-slate-300">Status</th>
              <th className="px-5 py-3 font-semibold text-slate-600 dark:text-slate-300">Payment Status</th>
              <th className="px-5 py-3 font-semibold text-slate-600 dark:text-slate-300">Fee</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
            {loading ? (
              <tr>
                <td colSpan="8" className="px-5 py-10 text-center text-slate-500 dark:text-slate-400">
                  Loading registrations...
                </td>
              </tr>
            ) : data.items.length === 0 ? (
              <tr>
                <td colSpan="8" className="px-5 py-10 text-center text-slate-500 dark:text-slate-400">
                  No records available.
                </td>
              </tr>
            ) : (
              data.items.map((registration) => (
                <tr key={registration.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                  <td className="px-5 py-3 font-medium text-slate-800 dark:text-slate-100">{registration.registrationNumber}</td>
                  <td className="px-5 py-3 text-slate-700 dark:text-slate-200">
                    <div className="font-medium">{registration.participantName}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{registration.email}</div>
                  </td>
                  <td className="px-5 py-3 text-slate-700 dark:text-slate-200">{registration.carMakeModel}</td>
                  <td className="px-5 py-3 text-slate-700 dark:text-slate-200">{registration.plateNumber}</td>
                  <td className="px-5 py-3 text-slate-700 dark:text-slate-200">{registration.registrationType}</td>
                  <td className="px-5 py-3">
                    <StatusBadge status={registration.status} />
                  </td>
                  <td className="px-5 py-3">
                    <PaymentBadge status={registration.paymentStatus} />
                  </td>
                  <td className="px-5 py-3 font-semibold text-slate-800 dark:text-slate-100">{formatPeso(registration.registrationFee)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Page <span className="font-semibold text-slate-700 dark:text-slate-200">{data.page}</span> of <span className="font-semibold text-slate-700 dark:text-slate-200">{totalPages}</span>
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={data.page <= 1 || loading}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            disabled={data.page >= totalPages || loading}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
