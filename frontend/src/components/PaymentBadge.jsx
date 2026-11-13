const PAYMENT_STYLES = {
  Unpaid: 'bg-rose-100 text-rose-800 ring-1 ring-inset ring-rose-200',
  Partial: 'bg-amber-100 text-amber-800 ring-1 ring-inset ring-amber-200',
  Paid: 'bg-emerald-100 text-emerald-800 ring-1 ring-inset ring-emerald-200'
};

export default function PaymentBadge({ status = 'Unpaid', className = '' }) {
  const badgeClass = PAYMENT_STYLES[status] || 'bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200';

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
