import { useState } from "react";
import {
  Menu,
  Bell,
  UserCircle,
  MapPin,
  CarFront,
  X,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import KpiCards from "../components/KpiCards";
import RegistrationTable from "../components/RegistrationTable";
import { registrations } from "../data/registrations";

export default function DashboardPage() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <div className="min-h-screen bg-[#f3f5f9] text-slate-900">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />

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
                setActivePage(page);
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

        <div className="space-y-6 p-4 md:p-7">
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
                  Car Show{" "}
                  <span className="text-amber-400">2027</span> — Registration Dashboard
                </h1>

                <p className="mt-3 flex items-center gap-2 text-sm font-medium text-slate-300 md:text-base">
                  <MapPin size={18} className="text-amber-400" />
                  AutoVista Events • Sorsogon City Coliseum
                </p>
              </div>
            </div>
          </section>

          <KpiCards />

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

            <RegistrationTable data={registrations} />
          </section>

          <footer className="flex flex-col justify-between gap-2 border-t border-slate-200 py-5 text-xs text-slate-500 sm:flex-row">
            <p>© 2027 AutoVista Events. All rights reserved.</p>
            <p>Car Show Registration Management System</p>
          </footer>
        </div>
      </main>
    </div>
  );
}