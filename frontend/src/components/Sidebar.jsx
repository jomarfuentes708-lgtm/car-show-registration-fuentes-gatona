import { CarFront } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  ChartNoAxesColumnIncreasing,
  Settings,
  Flag,
  MapPin,
} from "lucide-react";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Registrations", icon: Users },
  { name: "Payments", icon: CreditCard },
  { name: "Reports", icon: ChartNoAxesColumnIncreasing },
  { name: "Settings", icon: Settings },
];

export default function Sidebar({ activePage = "Dashboard", onNavigate, mobile = false }) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex flex-col bg-[#17191e] text-white shadow-2xl ${
        mobile ? "w-72" : "hidden w-64 lg:flex"
      }`}
    >
      {/* Brand */}
      <div className="flex h-36 flex-col items-center justify-center border-b border-white/10">
        <div className="relative mb-2">
          <CarFront size={42} className="text-amber-400" />
        </div>
        <h1 className="text-2xl font-black tracking-tight">
          AutoVista
        </h1>
        <span className="-mt-1 text-lg font-bold text-amber-400">
          Events
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-3 py-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = activePage === item.name;

          return (
            <button
              key={item.name}
              onClick={() => onNavigate?.(item.name)}
              className={`flex w-full items-center gap-4 rounded-lg px-4 py-3.5 text-left text-sm font-semibold transition-all ${
                active
                  ? "bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20"
                  : "text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={21} />
              {item.name}
            </button>
          );
        })}
      </nav>

      {/* Event information */}
      <div className="border-t border-white/10 p-5">
        <div className="mb-5 rounded-xl border border-amber-400/30 bg-gradient-to-br from-amber-400/15 to-transparent p-4">
          <Flag className="mb-3 text-amber-400" size={30} />
          <h3 className="text-lg font-extrabold">
            Car Show <span className="text-amber-400">2027</span>
          </h3>
          <p className="mt-1 text-xs italic text-slate-400">
            Drive. Showcase. Inspire.
          </p>
          <div className="mt-4 h-1 w-full rounded-full bg-amber-400" />
        </div>

        <p className="text-xs font-semibold text-slate-300">
          AutoVista Events
        </p>
        <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
          <MapPin size={13} />
          Sorsogon City Coliseum
        </p>
        <p className="mt-4 text-[10px] text-slate-600">
          © 2027 AutoVista Events
        </p>
      </div>
    </aside>
  );
}