
import {
  Users,
  PhilippinePeso,
  AlertCircle,
  CheckCircle2,
  CarFront,
} from "lucide-react";

const stats = [
  {
    title: "Total Registrations",
    value: "25",
    icon: Users,
    color: "border-amber-400",
    iconBg: "bg-amber-100 text-amber-600",
  },
  {
    title: "Total Payments Collected",
    value: "₱42,000.00",
    icon: PhilippinePeso,
    color: "border-green-500",
    iconBg: "bg-green-100 text-green-700",
  },
  {
    title: "Uncollected Payments",
    value: "₱19,500.00",
    icon: AlertCircle,
    color: "border-red-500",
    iconBg: "bg-red-100 text-red-600",
  },
  {
    title: "Confirmed",
    value: "10",
    icon: CheckCircle2,
    color: "border-blue-500",
    iconBg: "bg-blue-100 text-blue-700",
  },
  {
    title: "Checked In",
    value: "6",
    icon: CarFront,
    color: "border-purple-500",
    iconBg: "bg-purple-100 text-purple-700",
  },
];

export default function KpiCards() {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.title}
            className={`flex min-w-0 items-center gap-4 rounded-xl border border-slate-200 border-b-4 ${item.color} bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg`}
          >
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${item.iconBg}`}
            >
              <Icon size={27} strokeWidth={2.5} />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-600">
                {item.title}
              </p>
              <h3 className="mt-1 whitespace-nowrap text-xl font-extrabold tracking-tight text-slate-900">
                {item.value}
              </h3>
            </div>
          </div>
        );
      })}
    </section>
  );
}