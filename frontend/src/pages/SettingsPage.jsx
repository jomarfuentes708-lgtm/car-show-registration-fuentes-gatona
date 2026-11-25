import { useMemo, useState } from 'react';

const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5205').replace(/\/$/, '');
const EVENT_CONFIG = [
  { label: 'Event Name', value: 'Car Show 2027' },
  { label: 'Venue', value: 'Sorsogon City Coliseum' },
  { label: 'Exhibitor Fee', value: '₱1,500' },
  { label: 'Competitor Fee', value: '₱2,500' },
  { label: 'VIP Fee', value: '₱5,000' },
];

async function testApiConnection() {
  const response = await fetch(`${API_URL}/api/registrations/summary`);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
}

export default function SettingsPage() {
  const [status, setStatus] = useState('Not tested');
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const apiUrl = useMemo(() => import.meta.env.VITE_API_URL || 'http://localhost:5205', []);

  const handleTest = async () => {
    try {
      setTesting(true);
      setError('');
      const json = await testApiConnection();
      setResult(json);
      setStatus('Connected');
    } catch {
      setStatus('Offline');
      setError('Connection failed. Please check VITE_API_URL and the backend server.');
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-lg border border-[#e2e8f0] bg-white">
        <header className="border-b border-[#e2e8f0] px-5 py-4">
          <h2 className="text-base font-semibold text-slate-900">Settings</h2>
        </header>

        <div className="grid grid-cols-1 gap-5 p-5 lg:grid-cols-2">
          <div className="rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-5">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">Event Configuration</h3>
            <div className="space-y-3">
              {EVENT_CONFIG.map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between gap-3 border-b border-slate-200 pb-2 last:border-b-0 last:pb-0">
                  <span className="text-sm font-medium text-slate-500">{label}</span>
                  <span className="text-sm font-semibold text-slate-900">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-5">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">API Connection Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-slate-500">API URL</span>
                <span className="text-sm font-semibold text-slate-900 break-all">{apiUrl}</span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-slate-500">Status</span>
                <span
                  className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${
                    status === 'Connected'
                      ? 'bg-emerald-100 text-emerald-800 ring-emerald-200'
                      : status === 'Offline'
                        ? 'bg-red-100 text-red-800 ring-red-200'
                        : 'bg-slate-200 text-slate-700 ring-slate-300'
                  }`}
                >
                  {status}
                </span>
              </div>

              {result && (
                <div className="rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
                  Summary connected: {result.totalRegistrations} registrations / {result.confirmed} confirmed
                </div>
              )}

              {error && <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{error}</div>}

              <button
                type="button"
                onClick={handleTest}
                disabled={testing}
                className="mt-2 rounded-md bg-[#1e293b] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
              >
                {testing ? 'Testing...' : 'Test Connection'}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
