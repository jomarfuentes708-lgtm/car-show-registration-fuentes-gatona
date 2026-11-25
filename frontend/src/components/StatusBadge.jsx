const STYLES = {
  Pending: 'border-amber-200 bg-amber-50 text-amber-700',
  Confirmed: 'border-sky-200 bg-sky-50 text-sky-700',
  CheckedIn: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Cancelled: 'border-slate-200 bg-slate-100 text-slate-600',
};

const LABELS = { CheckedIn: 'Checked in' };

export default function StatusBadge({ status }) {
  const style = STYLES[status] ?? 'border-slate-200 bg-slate-50 text-slate-700';
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${style}`}
    >
      {LABELS[status] ?? status}
    </span>
  );
}