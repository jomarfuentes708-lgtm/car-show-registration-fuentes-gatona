export const peso = (value) =>
  '₱' + Number(value ?? 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const iconProps = { className: 'h-5 w-5', fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round' };
const Icons = {
  registrations: () => <svg {...iconProps}><path d="M8 3h8v4H8z" /><rect x="5" y="5" width="14" height="16" rx="2" /><path d="M9 12h6M9 16h4" /></svg>,
  payments: () => <svg {...iconProps}><rect x="3" y="6" width="18" height="12" rx="2" /><circle cx="12" cy="12" r="2.5" /><path d="M6.5 9.5v.01M17.5 14.5v.01" /></svg>,
  alert: () => <svg {...iconProps}><circle cx="12" cy="12" r="9" /><path d="M12 7v6M12 16.5v.01" /></svg>,
  check: () => <svg {...iconProps}><circle cx="12" cy="12" r="9" /><path d="m8.5 12.5 2.5 2.5 4.5-5" /></svg>,
  ticket: () => <svg {...iconProps}><path d="M3 9a2 2 0 0 0 0 6v2a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-2a2 2 0 0 1 0-6V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1Z" /></svg>,
};

const CARDS = [
  { key: 'totalRegistrations', label: 'Total registrations', icon: Icons.registrations, accent: 'text-slate-700' },
  { key: 'totalPayments', label: 'Payments collected', icon: Icons.payments, money: true, accent: 'text-emerald-700' },
  { key: 'uncollectedPayments', label: 'Uncollected', icon: Icons.alert, money: true, accent: 'text-amber-700' },
  { key: 'confirmed', label: 'Confirmed', icon: Icons.check, accent: 'text-sky-700' },
  { key: 'checkedIn', label: 'Checked in', icon: Icons.ticket, accent: 'text-slate-700' },
];

export default function KpiCards({ summary, loading }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
      {CARDS.map(({ key, label, icon: Icon, money, accent }) => {
        const raw = summary?.[key];
        const display = raw == null ? '—' : money ? peso(raw) : Number(raw).toLocaleString('en-US');
        return (
          <div key={key} className="flex min-h-28 items-center justify-between rounded-lg border border-slate-200 bg-white px-5 py-4">
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-500">{label}</p>
              {loading && !summary ? <div className="mt-3 h-7 w-24 animate-pulse rounded bg-slate-100" /> : <p className="mt-2 truncate text-2xl font-semibold tracking-tight text-slate-900">{display}</p>}
            </div>
            <div className={`ml-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-slate-200 bg-slate-50 ${accent}`}><Icon /></div>
          </div>
        );
      })}
    </div>
  );
}