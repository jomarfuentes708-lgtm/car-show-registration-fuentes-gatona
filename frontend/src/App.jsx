import { useState } from 'react';
import Sidebar, { NAV_ITEMS } from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import PaymentsPage from './pages/PaymentsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  const [active, setActive] = useState('dashboard');
  const [open, setOpen] = useState(false);

  const go = (id) => {
    setActive(id);
    setOpen(false);
  };

  const current = NAV_ITEMS.find((n) => n.id === active);
  const title = active === 'dashboard' ? 'Registration Dashboard' : `${current?.label || 'Dashboard'}`;

  return (
    <div className="min-h-screen bg-[#f7f8fa] font-['Inter','Segoe_UI',sans-serif] text-slate-700">
      <Sidebar active={active} onNavigate={go} open={open} onClose={() => setOpen(false)} />

      <div className="lg:pl-60">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-slate-200/80 bg-white px-4 sm:px-6">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            className="rounded-md p-2 text-slate-600 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 lg:hidden"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <h1 className="min-w-0 flex-1 truncate text-[15px] font-semibold text-slate-900 sm:text-base">{title}</h1>

          <div className="flex items-center gap-1.5 border-l border-[#e2e8f0] pl-3 sm:gap-2 sm:pl-4">
            <button
              type="button"
              aria-label="Notifications"
              className="relative flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                <path d="M10 21h4" />
              </svg>
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-slate-700 ring-2 ring-white" />
            </button>

            <button
              type="button"
              aria-label="Open user profile"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-700 transition hover:border-slate-300 hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="3.5" />
                <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
              </svg>
            </button>
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