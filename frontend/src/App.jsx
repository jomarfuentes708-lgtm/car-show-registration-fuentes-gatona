import { useState } from 'react';
import Sidebar, { NAV_ITEMS } from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import PaymentsPage from './pages/PaymentsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';

function ComingSoon({ title }) {
  return (
    <div className="rounded bg-white px-6 py-16 text-center shadow-[0_.15rem_1.75rem_0_rgba(58,59,69,.15)]">
      <p className="text-base font-bold text-[#5a5c69]">{title}</p>
      <p className="mt-1 text-sm text-slate-500">This page isn’t built yet.</p>
    </div>
  );
}

export default function App() {
  const [active, setActive] = useState('dashboard');
  const [open, setOpen] = useState(false);

  const go = (id) => {
    setActive(id);
    setOpen(false);
  };

  const current = NAV_ITEMS.find((n) => n.id === active);
  const title =
    active === 'dashboard' ? 'Car Show 2027 — Registration Dashboard' : `Car Show 2027 — ${current.label}`;

  return (
    <div className="min-h-screen bg-[#f8f9fc] font-['Nunito',ui-sans-serif,system-ui,sans-serif] text-[#5a5c69]">
      <Sidebar active={active} onNavigate={go} open={open} onClose={() => setOpen(false)} />

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 bg-white px-4 shadow-[0_.15rem_1.75rem_0_rgba(58,59,69,.15)] sm:px-6">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="rounded p-2 text-[#4e73df] hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4e73df] lg:hidden"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <h1 className="min-w-0 flex-1 truncate text-base font-bold text-[#5a5c69] sm:text-lg">{title}</h1>

          <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
            <span className="hidden text-sm font-semibold text-[#858796] sm:inline">Admin</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#4e73df] text-sm font-bold text-white">
              A
            </span>
          </div>
        </header>

        <main className="p-4 sm:p-6">
          {active === 'dashboard' && <DashboardPage showKpis />}
          {active === 'registrations' && <DashboardPage showKpis={false} />}
          {active === 'payments' && <PaymentsPage />}
          {active === 'reports' && <ReportsPage />}
          {active === 'settings' && <SettingsPage />}
        </main>
      </div>
    </div>
  );
}