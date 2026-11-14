import { useEffect, useState } from "react";
import {
  Menu,
  Bell,
  UserCircle,
  MapPin,
  CarFront,
  X,
  Settings as SettingsIcon,
  CreditCard,
  BarChart3,
  Users,
} from "lucide-react";

import Sidebar from "./components/Sidebar";
import KpiCards from "./components/KpiCards";
import RegistrationTable from "./components/RegistrationTable";
import { getRegistrations, getSummary } from "./api/sample-data";

const mapRegistrationToTableRow = (item) => ({
  id: item.registrationNumber ?? item.id ?? "",
  date: item.registrationDate
    ? new Date(item.registrationDate).toLocaleString("en-PH", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : item.date ?? "",
  name: item.participantName ?? item.name ?? "",
  contact: item.contactNumber ?? item.contact ?? "",
  car: item.carMakeModel ?? item.car ?? "",
  plate: item.plateNumber ?? item.plate ?? "",
  type: item.registrationType ?? item.type ?? "",
  status: item.status ?? "",
  fee: Number(item.registrationFee ?? item.fee ?? 0),
  paid: Number(item.amountPaid ?? item.paid ?? 0),
});

function useRegistrationData() {
  const [registrations, setRegistrations] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const regData = await getRegistrations();
        const summaryData = await getSummary();
        const list = Array.isArray(regData?.items)
          ? regData.items
          : Array.isArray(regData)
            ? regData
            : [];

        setRegistrations(list.map(mapRegistrationToTableRow));
        setSummary(summaryData);
      } catch (error) {
        console.error("Error fetching page data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { registrations, summary, loading };
}

function PageShell({ activePage, onNavigate, title, subtitle, children }) {
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <div className="min-h-screen bg-[#f3f5f9] text-slate-900">
      <Sidebar activePage={activePage} onNavigate={onNavigate} />

      {mobileMenu && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileMenu(false)}
            aria-label="Close navigation"
          />

          <div className="relative h-full w-72">
            <button
              onClick={() => setMobileMenu(false)}
              className="absolute right-3 top-3 z-50 rounded-lg bg-white/10 p-2 text-white"
              aria-label="Close menu"
            >
              <X size={22} />
            </button>

            <Sidebar
              activePage={activePage}
              mobile={true}
              onNavigate={(page) => {
                onNavigate?.(page);
                setMobileMenu(false);
              }}
            />
          </div>
        </div>
      )}

      <main className="min-h-screen lg:ml-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-5 shadow-sm backdrop-blur md:px-8">
          <button
            onClick={() => setMobileMenu(true)}
            className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 lg:hidden"
            aria-label="Open navigation"
          >
            <Menu size={24} />
          </button>

          <div className="hidden text-sm font-semibold text-slate-500 lg:block">
            AutoVista Events / {activePage}
          </div>

          <div className="ml-auto flex items-center gap-5">
            <button
              className="relative rounded-full p-2 text-slate-600 hover:bg-slate-100"
              aria-label="Notifications"
            >
              <Bell size={21} />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>

            <div className="flex items-center gap-2">
              <UserCircle size={31} className="text-slate-700" />
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-slate-800">Admin</p>
                <p className="text-[11px] text-slate-500">Event Administrator</p>
              </div>
            </div>
          </div>
        </header>

        <div className="space-y-6 p-4 md:p-7">{children}</div>
      </main>
    </div>
  );
}

function DashboardContent({ activePage, onNavigate }) {
  const { registrations, summary, loading } = useRegistrationData();

  return (
    <PageShell activePage={activePage} onNavigate={onNavigate}>
      <section className="relative isolate min-h-[180px] overflow-hidden rounded-2xl bg-gradient-to-r from-[#111318] via-[#24272c] to-[#6a4a0c] shadow-xl md:min-h-[190px]">
        <div className="absolute inset-0 -z-10 opacity-20">
          <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_30%,#fbbf24_100%)]" />
          <div className="absolute right-0 top-0 h-full w-1/2 bg-[repeating-linear-gradient(135deg,transparent_0px,transparent_8px,#ffffff15_9px,#ffffff15_10px)]" />
        </div>

        <div className="absolute -right-8 bottom-[-35px] text-amber-300/15 md:right-12">
          <CarFront size={240} strokeWidth={1} className="md:h-[280px] md:w-[280px]" />
        </div>

        <div className="absolute right-0 top-0 h-full w-2 bg-amber-400" />

        <div className="relative z-10 flex min-h-[180px] items-center px-6 py-7 md:px-10">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-1 w-10 rounded-full bg-amber-400" />
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-amber-400">
                AutoVista Events
              </span>
            </div>

            <h1 className="max-w-3xl text-2xl font-black leading-tight text-white md:text-4xl">
              Car Show <span className="text-amber-400">2027</span> — Registration Dashboard
            </h1>

            <p className="mt-3 flex items-center gap-2 text-sm font-medium text-slate-300 md:text-base">
              <MapPin size={18} className="text-amber-400" />
              AutoVista Events • Sorsogon City Coliseum
            </p>
          </div>
        </div>
      </section>

      {!loading && <KpiCards summary={summary} />}

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Registration Management</h2>
            <p className="mt-1 text-sm text-slate-500">Manage and monitor all event participants.</p>
          </div>

          <span className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-800">
            CAR SHOW 2027
          </span>
        </div>

        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
            Naglo-load ng data mula sa database...
          </div>
        ) : (
          <RegistrationTable data={registrations} />
        )}
      </section>
    </PageShell>
  );
}

function SharedTablePage({ activePage, onNavigate, title, subtitle, icon: Icon }) {
  const { registrations, summary, loading } = useRegistrationData();

  return (
    <PageShell activePage={activePage} onNavigate={onNavigate}>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-amber-100 p-3 text-amber-700">
            <Icon size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">{title}</h1>
            <p className="text-sm text-slate-500">{subtitle}</p>
          </div>
        </div>

        {!loading && <KpiCards summary={summary} />}

        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600 shadow-sm">
            Naglo-load ng data mula sa database...
          </div>
        ) : (
          <div className="mt-6">
            <RegistrationTable data={registrations} />
          </div>
        )}
      </section>
    </PageShell>
  );
}

function SettingsPage({ activePage, onNavigate }) {
  return (
    <PageShell activePage={activePage} onNavigate={onNavigate}>
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-amber-100 p-3 text-amber-700">
            <SettingsIcon size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Settings</h1>
            <p className="text-sm text-slate-500">Manage event configuration and preferences.</p>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {[
            { label: "Event Name", value: "AutoVista Events" },
            { label: "Venue", value: "Sorsogon City Coliseum" },
            { label: "Registration Window", value: "Nov 1 - Nov 30" },
            { label: "Check-in Start", value: "08:00 AM" },
            { label: "Payment Method", value: "Cash / GCash / Card" },
            { label: "Auto Confirmation", value: "Enabled" },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{item.label}</p>
              <p className="mt-2 text-lg font-bold text-slate-900">{item.value}</p>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}

function App() {
  const [activePage, setActivePage] = useState("Dashboard");

  switch (activePage) {
    case "Dashboard":
      return <DashboardContent activePage={activePage} onNavigate={setActivePage} />;
    case "Registrations":
      return (
        <SharedTablePage
          activePage={activePage}
          onNavigate={setActivePage}
          title="Registrations"
          subtitle="Manage all event participants and registration data."
          icon={Users}
        />
      );
    case "Payments":
      return (
        <SharedTablePage
          activePage={activePage}
          onNavigate={setActivePage}
          title="Payments"
          subtitle="Track collection status, fees, and outstanding balances."
          icon={CreditCard}
        />
      );
    case "Reports":
      return (
        <SharedTablePage
          activePage={activePage}
          onNavigate={setActivePage}
          title="Reports"
          subtitle="Event analytics, dashboard summaries, and participant trends."
          icon={BarChart3}
        />
      );
    case "Settings":
      return <SettingsPage activePage={activePage} onNavigate={setActivePage} />;
    default:
      return <DashboardContent activePage={activePage} onNavigate={setActivePage} />;
  }
}

export default App;