import { useMemo, useState } from "react";
import { Search, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";

const peso = (amount) =>
  new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount);

function Badge({ value, category }) {
  const styles = {
    type: {
      Competitor: "bg-red-100 text-red-700",
      Exhibitor: "bg-blue-100 text-blue-700",
      VIP: "bg-amber-100 text-amber-800",
    },
    status: {
      Confirmed: "bg-green-100 text-green-800",
      CheckedIn: "bg-purple-100 text-purple-800",
      Pending: "bg-amber-100 text-amber-800",
      Cancelled: "bg-slate-200 text-slate-700",
    },
    payment: {
      Paid: "bg-green-600 text-white",
      Partial: "bg-amber-500 text-white",
      Unpaid: "bg-red-600 text-white",
    },
  };

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold ${
        styles[category][value]
      }`}
    >
      {value}
    </span>
  );
}

export default function RegistrationTable({ data }) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredData = useMemo(() => {
    const items = Array.isArray(data) ? data : [];

    return items.filter((item) => {
      const query = search.toLowerCase();
      const name = String(item?.name ?? item?.participantName ?? "").toLowerCase();
      const id = String(item?.id ?? item?.registrationNumber ?? "").toLowerCase();
      const car = String(item?.car ?? item?.carMakeModel ?? "").toLowerCase();
      const plate = String(item?.plate ?? item?.plateNumber ?? "").toLowerCase();

      const matchesSearch =
        name.includes(query) ||
        id.includes(query) ||
        car.includes(query) ||
        plate.includes(query);

      const typeValue = item?.type ?? item?.registrationType ?? "";
      const statusValue = item?.status ?? "";

      const matchesType = type === "All" || typeValue === type;
      const matchesStatus = status === "All" || statusValue === status;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [data, search, type, status]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const safePage = Math.min(page, Math.max(totalPages, 1));

  const startIndex = (safePage - 1) * pageSize;
  const currentData = filteredData.slice(
    startIndex,
    startIndex + pageSize
  );

  const getPaymentStatus = (item) => {
    const fee = Number(item?.fee ?? item?.registrationFee ?? 0);
    const paid = Number(item?.paid ?? item?.amountPaid ?? 0);

    if (paid === 0) return "Unpaid";
    if (paid < fee) return "Partial";
    return "Paid";
  };

  const clearFilters = () => {
    setSearch("");
    setType("All");
    setStatus("All");
    setPage(1);
  };

  const changePage = (newPage) => {
    setPage(Math.max(1, Math.min(newPage, totalPages)));
  };

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

      {/* Toolbar */}
      <div className="flex flex-col gap-4 border-b border-slate-200 p-4 xl:flex-row xl:items-center">
        <div className="relative flex-1">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
            size={20}
          />
          <input
            type="text"
            placeholder="Search participant name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-lg border border-slate-300 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="text-sm font-semibold text-slate-700">
            Registration Type:
          </label>

          <select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setPage(1);
            }}
            className="min-w-36 rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-amber-400"
          >
            <option value="All">All</option>
            <option value="Competitor">Competitor</option>
            <option value="Exhibitor">Exhibitor</option>
            <option value="VIP">VIP</option>
          </select>

          <label className="text-sm font-semibold text-slate-700">
            Status:
          </label>

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="min-w-36 rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-amber-400"
          >
            <option value="All">All</option>
            <option value="Confirmed">Confirmed</option>
            <option value="CheckedIn">CheckedIn</option>
            <option value="Pending">Pending</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <button
            onClick={clearFilters}
            className="flex items-center justify-center gap-2 rounded-lg bg-amber-400 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-amber-300 active:scale-95"
          >
            <RefreshCw size={16} />
            Clear filters
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] border-collapse text-left">
          <thead className="bg-[#191c22] text-white">
            <tr>
              {[
                "Registration No.",
                "Date & Time",
                "Participant",
                "Car Make & Model",
                "Type",
                "Status",
                "Fee / Paid",
                "Payment",
              ].map((heading) => (
                <th
                  key={heading}
                  className={`whitespace-nowrap px-4 py-4 text-xs font-bold uppercase tracking-wide ${
                    heading === "Fee / Paid" ? "text-right" : ""
                  }`}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            {currentData.map((item) => (
              <tr
                key={item.id}
                className="transition-colors hover:bg-amber-50/60 even:bg-slate-50/60"
              >
                <td className="whitespace-nowrap px-4 py-4 text-sm font-bold text-slate-800">
                  {item.id}
                </td>

                <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">
                  {item.date}
                </td>

                <td className="px-4 py-4">
                  <p className="whitespace-nowrap text-sm font-bold text-slate-900">
                    {item.name}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {item.contact}
                  </p>
                </td>

                <td className="px-4 py-4">
                  <p className="whitespace-nowrap text-sm font-bold text-slate-900">
                    {item.car}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {item.plate}
                  </p>
                </td>

                <td className="px-4 py-4">
                  <Badge value={item.type} category="type" />
                </td>

                <td className="px-4 py-4">
                  <Badge value={item.status} category="status" />
                </td>

                <td className="whitespace-nowrap px-4 py-4 text-right">
                  <p className="text-sm font-bold text-slate-900">
                    {peso(item.fee)}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Paid: {peso(item.paid)}
                  </p>
                </td>

                <td className="px-4 py-4">
                  <Badge
                    value={getPaymentStatus(item)}
                    category="payment"
                  />
                </td>
              </tr>
            ))}

            {currentData.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-16 text-center text-sm text-slate-500"
                >
                  <Search size={30} className="mx-auto mb-3 text-slate-300" />
                  No registrations found.
                  <p className="mt-1 text-xs">
                    Try changing your search or filters.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col justify-between gap-4 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center">
        <div className="flex flex-wrap items-center gap-4">
          <p className="text-sm font-semibold text-slate-700">
            Showing{" "}
            {filteredData.length === 0 ? 0 : startIndex + 1}
            {"–"}
            {Math.min(startIndex + pageSize, filteredData.length)}
            {" of "}
            {filteredData.length}
          </p>

          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none focus:border-amber-400"
          >
            <option value={5}>5 rows</option>
            <option value={10}>10 rows</option>
            <option value={20}>20 rows</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            disabled={safePage <= 1 || totalPages === 0}
            onClick={() => changePage(safePage - 1)}
            className="flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={16} />
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .map((number) => (
              <button
                key={number}
                onClick={() => changePage(number)}
                className={`h-9 min-w-9 rounded-lg border px-3 text-sm font-bold transition ${
                  safePage === number
                    ? "border-amber-400 bg-amber-400 text-slate-950 shadow-sm"
                    : "border-slate-300 bg-white text-slate-700 hover:bg-amber-50"
                }`}
              >
                {number}
              </button>
            ))}

          <button
            disabled={safePage >= totalPages || totalPages === 0}
            onClick={() => changePage(safePage + 1)}
            className="flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}