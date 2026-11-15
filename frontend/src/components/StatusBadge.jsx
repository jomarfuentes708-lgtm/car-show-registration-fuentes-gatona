const STYLES = {
  Pending: 'bg-amber-100 text-amber-800 ring-amber-200',
  Confirmed: 'bg-cyan-100 text-cyan-800 ring-cyan-200',
  CheckedIn: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
  Cancelled: 'bg-slate-200 text-slate-700 ring-slate-300',
};

const LABELS = { CheckedIn: 'Checked In' };

export default function StatusBadge({ status }) {
  const style = STYLES[status] ?? 'bg-slate-100 text-slate-700 ring-slate-200';
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ring-inset ${style}`}
    >
      {LABELS[status] ?? status}
    </span>
  );
}