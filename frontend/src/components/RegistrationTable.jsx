import StatusBadge from './StatusBadge';
import PaymentBadge from './PaymentBadge';
import { peso } from './KpiCards';

const TYPE_STYLES = {
  Exhibitor: 'bg-indigo-100 text-indigo-700 ring-indigo-200',
  Competitor: 'bg-sky-100 text-sky-700 ring-sky-200',
  VIP: 'bg-fuchsia-100 text-fuchsia-700 ring-fuchsia-200',
};

const dateFmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const timeFmt = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' });

function formatDate(value) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return `${dateFmt.format(d)} ${timeFmt.format(d)}`;
}

function TypeBadge({ type }) {
  const style = TYPE_STYLES[type] ?? 'bg-slate-100 text-slate-700 ring-slate-200';
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold ring-1 ring-inset ${style}`}>
      {type}
    </span>
  );
}

const HEADERS = [
  { label: 'Reg. No.' },
  { label: 'Date' },
  { label: 'Participant' },
  { label: 'Car' },
  { label: 'Type' },
  { label: 'Status' },
  { label: 'Fee / Paid', right: true },
  { label: 'Payment' },
];

function Message({ title, children, action, onAction, tone = 'text-[#5a5c69]' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <p className={`text-base font-bold ${tone}`}>{title}</p>
      {children && <p className="max-w-md text-sm text-slate-500">{children}</p>}
      <button
        type="button"
        onClick={onAction}
        className="rounded bg-[#4e73df] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2e59d9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4e73df] focus-visible:ring-offset-2"
      >
        {action}
      </button>
    </div>
  );
}

export default function RegistrationTable({ items, loading, error, pageSize, onRetry, onClearFilters }) {
  if (error) {
    return (
      <Message title="Cannot reach the API" tone="text-[#e74a3b]" action="Try again" onAction={onRetry}>
        Cannot reach the API. Check that the server is running and VITE_API_URL is correct, then try again.
      </Message>
    );
  }

  if (!loading && items.length === 0) {
    return (
      <Message title="No registrations match your filters" action="Clear filters" onAction={onClearFilters}>
        Try a different name, type, or status.
      </Message>
    );
  }

  return (
    <div className="overflow-x-auto" aria-busy={loading}>
      <table className="w-full min-w-[960px] border-collapse text-left text-sm text-[#858796]">
        <thead>
          <tr className="border-b-2 border-slate-200 bg-[#f8f9fc] text-xs uppercase tracking-wide text-[#5a5c69]">
            {HEADERS.map((h) => (
              <th key={h.label} className={`px-4 py-3 font-bold ${h.right ? 'text-right' : ''}`}>
                {h.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading
            ? Array.from({ length: pageSize }).map((_, i) => (
                <tr key={i} className="border-b border-slate-100">
                  {HEADERS.map((h) => (
                    <td key={h.label} className="px-4 py-4">
                      <div className="h-4 w-full max-w-[120px] animate-pulse rounded bg-slate-200" />
                    </td>
                  ))}
                </tr>
              ))
            : items.map((r) => (
                <tr key={r.id} className="border-b border-slate-100 transition hover:bg-[#f8f9fc]">
                  <td className="whitespace-nowrap px-4 py-3 font-bold text-[#4e73df]">{r.registrationNumber}</td>
                  <td className="whitespace-nowrap px-4 py-3">{formatDate(r.registrationDate)}</td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-[#5a5c69]">{r.participantName}</div>
                    <div className="text-xs">{r.contactNumber}</div>
                    <div className="text-xs">{r.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-[#5a5c69]">{r.carMakeModel}</div>
                    <div className="text-xs">{r.plateNumber}</div>
                  </td>
                  <td className="px-4 py-3">
                    <TypeBadge type={r.registrationType} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <div className="font-bold text-[#5a5c69]">{peso(r.registrationFee)}</div>
                    <div className="text-xs">Paid: {peso(r.amountPaid)}</div>
                  </td>
                  <td className="px-4 py-3">
                    <PaymentBadge paymentStatus={r.paymentStatus} />
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}