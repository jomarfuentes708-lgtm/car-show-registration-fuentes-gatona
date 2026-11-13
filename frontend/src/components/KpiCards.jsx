import { useEffect, useState } from 'react';
import { getSummary } from '../api/sample-data';
import KpiCard from './KpiCard';

const formatPeso = (value) =>
  new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 2
  }).format(value);

export default function KpiCards() {
  const [summary, setSummary] = useState({
    totalRegistrations: 0,
    totalPayments: 0,
    uncollectedPayments: 0,
    confirmed: 0,
    checkedIn: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadSummary() {
      try {
        const result = await getSummary();
        if (isMounted) {
          setSummary(result);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadSummary();

    return () => {
      isMounted = false;
    };
  }, []);

  const cards = [
    {
      title: 'Total Registrations',
      value: loading ? '—' : summary.totalRegistrations,
      icon: '🚗',
      subtext: 'All submitted vehicle registrations'
    },
    {
      title: 'Total Payments Collected',
      value: loading ? '—' : formatPeso(summary.totalPayments),
      icon: '💰',
      subtext: 'Confirmed and checked-in entries only'
    },
    {
      title: 'Uncollected Payments',
      value: loading ? '—' : formatPeso(summary.uncollectedPayments),
      icon: '⚠️',
      subtext: 'Outstanding balance still due'
    },
    {
      title: 'Confirmed',
      value: loading ? '—' : summary.confirmed,
      icon: '✅',
      subtext: 'Approved registrations'
    },
    {
      title: 'Checked In',
      value: loading ? '—' : summary.checkedIn,
      icon: '🏁',
      subtext: 'Participants already on-site'
    }
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => (
        <KpiCard key={card.title} title={card.title} value={card.value} icon={card.icon} subtext={card.subtext} />
      ))}
    </div>
  );
}
