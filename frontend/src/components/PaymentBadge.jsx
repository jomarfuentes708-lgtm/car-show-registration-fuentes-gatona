const PAYMENT_STYLES = {
  Unpaid: 'border-slate-300 bg-slate-100 text-slate-700',
  Partial: 'border-amber-200 bg-amber-50 text-amber-700',
  Paid: 'border-slate-300 bg-slate-100 text-slate-700',
};

export default function PaymentBadge({ status, paymentStatus, className = '' }) {
  const badgeValue = paymentStatus ?? status ?? 'Unpaid';
  const badgeClass = PAYMENT_STYLES[badgeValue] || 'border-slate-200 bg-slate-50 text-slate-700';

  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${badgeClass} ${className}`}
    >
      {badgeValue}
    </span>
  );
}
