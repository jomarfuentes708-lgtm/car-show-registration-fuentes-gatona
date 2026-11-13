import { useEffect, useState } from 'react';
import { getSummary } from '../api/sample-data';
import KpiCards from '../components/KpiCards';
import RegistrationTable from '../components/RegistrationTable';

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadSummary() {
      const result = await getSummary();
      if (isMounted) {
        setSummary(result);
      }
    }

    loadSummary();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">Car Show 2027</p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Registration Dashboard</h1>
            </div>

            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-300">
              {summary ? `${summary.totalRegistrations} total registrations` : 'Loading summary...'}
            </div>
          </div>
        </header>

        <div className="mb-6">
          <KpiCards />
        </div>

        <RegistrationTable />
      </div>
    </div>
  );
}
