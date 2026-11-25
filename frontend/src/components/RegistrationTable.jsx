import StatusBadge from './StatusBadge';
import PaymentBadge from './PaymentBadge';
import { peso } from './KpiCards';

const TYPE_STYLES = {
  Exhibitor: 'border-slate-300 bg-slate-100 text-slate-700',
  Competitor: 'border-sky-200 bg-sky-50 text-sky-700',
  VIP: 'border-violet-200 bg-violet-50 text-violet-700',
};

const dateFmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const timeFmt = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' });
function formatDate(value) { const d = new Date(value); return Number.isNaN(d.getTime()) ? '—' : `${dateFmt.format(d)} ${timeFmt.format(d)}`; }
function TypeBadge({ type }) { const style = TYPE_STYLES[type] ?? 'border-slate-200 bg-slate-50 text-slate-700'; return <span className={`inline-flex rounded-md border px-2 py-0.5 text-xs font-medium ${style}`}>{type}</span>; }

const HEADERS = [
  { label: 'Reg. no.' }, { label: 'Date' }, { label: 'Participant' }, { label: 'Car' },
  { label: 'Type' }, { label: 'Status' }, { label: 'Fee / paid', right: true }, { label: 'Payment' },
];

function Message({ title, detail, action, onAction, tone = 'text-slate-900' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-6 py-16 text-center">
      <p className={`text-base font-semibold ${tone}`}>{title}</p>
      {detail && <p className="max-w-md text-sm text-slate-500">{detail}</p>}
      {action && <button type="button" onClick={onAction} className="mt-2 rounded-md border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400">{action}</button>}
    </div>
  );
}

export default function RegistrationTable({ items, loading, error, pageSize, onRetry, onClearFilters }) {
  if (error) return <Message title="Cannot reach the API" detail="Check that the server is running and VITE_API_URL is correct." action="Try again" onAction={onRetry} />;
  if (!loading && items.length === 0) return <Message title="No registrations match your filters" detail="Try adjusting or clearing your filters." action="Clear filters" onAction={onClearFilters} />;

  return (
    <div className="overflow-x-auto" aria-busy={loading}>
      {loading && <p className="border-b border-slate-100 px-5 py-2 text-xs font-medium text-slate-500">Loading registrations...</p>}
      <table className="w-full min-w-[980px] border-collapse text-left text-sm text-slate-600">
        <thead><tr className="border-b border-slate-200 bg-slate-50 text-xs font-medium uppercase tracking-wide text-slate-500">{HEADERS.map((h) => <th key={h.label} className={`px-4 py-3 ${h.right ? 'text-right' : ''}`}>{h.label}</th>)}</tr></thead>
        <tbody>
          {loading
            ? Array.from({ length: pageSize }).map((_, i) => <tr key={i} className="border-b border-slate-100">{HEADERS.map((h) => <td key={h.label} className="px-4 py-4"><div className="h-4 w-full max-w-[120px] animate-pulse rounded bg-slate-100" /></td>)}</tr>)
            : items.map((r) => (
                <tr key={r.id} className="border-b border-slate-100 transition hover:bg-slate-50/70">
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-800">{r.registrationNumber}</td>
                  <td className="whitespace-nowrap px-4 py-3">{formatDate(r.registrationDate)}</td>
                  <td className="px-4 py-3"><div className="font-medium text-slate-900">{r.participantName}</div><div className="mt-0.5 text-xs text-slate-500">{r.contactNumber}</div><div className="text-xs text-slate-500">{r.email}</div></td>
                  <td className="px-4 py-3"><div className="font-medium text-slate-900">{r.carMakeModel}</div><div className="mt-0.5 text-xs text-slate-500">{r.plateNumber}</div></td>
                  <td className="px-4 py-3"><TypeBadge type={r.registrationType} /></td>
                  <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  <td className="whitespace-nowrap px-4 py-3 text-right"><div className="font-semibold text-slate-900">{peso(r.registrationFee)}</div><div className="mt-0.5 text-xs text-slate-500">Paid: {peso(r.amountPaid)}</div></td>
                  <td className="px-4 py-3"><PaymentBadge paymentStatus={r.paymentStatus} /></td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}