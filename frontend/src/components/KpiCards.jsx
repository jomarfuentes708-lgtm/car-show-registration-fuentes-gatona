export const peso = (value) =>
  '₱' +
  Number(value ?? 0).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const iconProps = {
  className: 'h-8 w-8',
  fill: 'none',
  viewBox: '0 0 24 24',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

const ClipboardIcon = () => (
  <svg {...iconProps}>
    <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
    <rect x="9" y="3" width="6" height="4" rx="1" />
    <path d="M9 12h6M9 16h4" />
  </svg>
);
const CashIcon = () => (
  <svg {...iconProps}>
    <rect x="3" y="6" width="18" height="12" rx="2" />
    <circle cx="12" cy="12" r="2.5" />
    <path d="M6.5 9.5v.01M17.5 14.5v.01" />
  </svg>
);
const AlertIcon = () => (
  <svg {...iconProps}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v6M12 16.5v.01" />
  </svg>
);
const CheckIcon = () => (
  <svg {...iconProps}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8.5 12.5 2.5 2.5 4.5-5" />
  </svg>
);
const TicketIcon = () => (
  <svg {...iconProps}>
    <path d="M3 9a2 2 0 0 0 0 6v2a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-2a2 2 0 0 1 0-6V7a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1Z" />
    <path d="M14 6v12" strokeDasharray="2 2.5" />
  </svg>
);

// Full class names so Tailwind can detect them.
const CARDS = [
  { key: 'totalRegistrations', label: 'Total Registrations', border: 'border-l-[#4e73df]', text: 'text-[#4e73df]', icon: ClipboardIcon },
  { key: 'totalPayments', label: 'Total Payments Collected', border: 'border-l-[#1cc88a]', text: 'text-[#1cc88a]', icon: CashIcon, money: true },
  { key: 'uncollectedPayments', label: 'Uncollected Payments', border: 'border-l-[#e74a3b]', text: 'text-[#e74a3b]', icon: AlertIcon, money: true },
  { key: 'confirmed', label: 'Confirmed', border: 'border-l-[#36b9cc]', text: 'text-[#36b9cc]', icon: CheckIcon },
  { key: 'checkedIn', label: 'Checked In', border: 'border-l-[#f6c23e]', text: 'text-[#f6c23e]', icon: TicketIcon },
];

export default function KpiCards({ summary, loading }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {CARDS.map(({ key, label, border, text, icon: Icon, money }) => {
        const raw = summary?.[key];
        const display = raw == null ? '—' : money ? peso(raw) : Number(raw).toLocaleString('en-US');
        return (
          <div
            key={key}
            className={`flex items-center justify-between rounded border-l-4 bg-white px-5 py-4 shadow-[0_.15rem_1.75rem_0_rgba(58,59,69,.15)] ${border}`}
          >
            <div className="min-w-0">
              <p className={`text-xs font-bold uppercase tracking-wide ${text}`}>{label}</p>
              {loading && !summary ? (
                <div className="mt-2 h-7 w-24 animate-pulse rounded bg-slate-200" />
              ) : (
                <p className="mt-1 truncate text-xl font-bold text-[#5a5c69]">{display}</p>
              )}
            </div>
            <div className="ml-3 shrink-0 text-slate-300">
              <Icon />
            </div>
          </div>
        );
      })}
    </div>
  );
}