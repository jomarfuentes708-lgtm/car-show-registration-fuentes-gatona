const STATUS_STYLES = {
  Pending: 'bg-amber-100 text-amber-800 ring-1 ring-inset ring-amber-200',
  Confirmed: 'bg-emerald-100 text-emerald-800 ring-1 ring-inset ring-emerald-200',
  CheckedIn: 'bg-sky-100 text-sky-800 ring-1 ring-inset ring-sky-200',
  Cancelled: 'bg-rose-100 text-rose-800 ring-1 ring-inset ring-rose-200'
};

export default function StatusBadge({ status = 'Pending', className = '' }) {
  const badgeClass = STATUS_STYLES[status] || 'bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200';

  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide',
        badgeClass,
        className
      ].join(' ')}
    >
      {status}
    </span>
  );
}
