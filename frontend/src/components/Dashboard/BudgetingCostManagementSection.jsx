import { useMemo, useState } from "react";
import {
  CalendarDays,
  CircleDollarSign,
  Download,
  PiggyBank,
  ReceiptText,
  TrendingUp,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const PIE_COLORS = ["#4F46E5", "#0EA5E9", "#14B8A6", "#F59E0B", "#EF4444", "#64748B", "#0F766E"];

const DEFAULT_EXPENSES = [
  {
    ticketId: "T-0941",
    title: "Boiler Pump Replacement",
    building: "Engineering Block",
    category: "HVAC",
    completedAt: "2025-03-12",
    materialCost: 4200,
    laborCost: 1680,
    type: "REACTIVE",
  },
  {
    ticketId: "T-0963",
    title: "Main Panel Preventive Service",
    building: "Library East",
    category: "ELECTRICAL",
    completedAt: "2025-04-08",
    materialCost: 1350,
    laborCost: 940,
    type: "PREVENTIVE",
  },
  {
    ticketId: "T-0970",
    title: "Water Line Leak Repair",
    building: "Dormitory A",
    category: "PLUMBING",
    completedAt: "2025-04-24",
    materialCost: 1880,
    laborCost: 1110,
    type: "REACTIVE",
  },
  {
    ticketId: "T-0988",
    title: "Generator Routine Inspection",
    building: "Administration",
    category: "ELECTRICAL",
    completedAt: "2025-05-15",
    materialCost: 790,
    laborCost: 1380,
    type: "PREVENTIVE",
  },
  {
    ticketId: "T-1004",
    title: "Air Handler Coil Cleaning",
    building: "Science Center",
    category: "HVAC",
    completedAt: "2025-06-05",
    materialCost: 980,
    laborCost: 1450,
    type: "PREVENTIVE",
  },
  {
    ticketId: "T-1011",
    title: "Parking Lot Lighting Upgrade",
    building: "Sports Complex",
    category: "ELECTRICAL",
    completedAt: "2025-06-27",
    materialCost: 2610,
    laborCost: 1870,
    type: "REACTIVE",
  },
  {
    ticketId: "T-1027",
    title: "Cooling Tower Valve Assembly",
    building: "Engineering Block",
    category: "HVAC",
    completedAt: "2025-07-18",
    materialCost: 3170,
    laborCost: 1320,
    type: "REACTIVE",
  },
  {
    ticketId: "T-1034",
    title: "Washroom Plumbing Fixture Tune-up",
    building: "Dormitory B",
    category: "PLUMBING",
    completedAt: "2025-08-03",
    materialCost: 950,
    laborCost: 780,
    type: "PREVENTIVE",
  },
  {
    ticketId: "T-1046",
    title: "Server Room UPS Maintenance",
    building: "IT Annex",
    category: "IT",
    completedAt: "2025-09-14",
    materialCost: 2220,
    laborCost: 1180,
    type: "PREVENTIVE",
  },
  {
    ticketId: "T-1055",
    title: "Steam Line Emergency Isolation",
    building: "Engineering Block",
    category: "SAFETY",
    completedAt: "2025-10-02",
    materialCost: 1980,
    laborCost: 1590,
    type: "REACTIVE",
  },
  {
    ticketId: "T-1073",
    title: "Lecture Hall Ventilation Retrofit",
    building: "Science Center",
    category: "HVAC",
    completedAt: "2025-11-21",
    materialCost: 3580,
    laborCost: 2010,
    type: "REACTIVE",
  },
  {
    ticketId: "T-1089",
    title: "Hydrant Compliance Test",
    building: "Administration",
    category: "SAFETY",
    completedAt: "2025-12-10",
    materialCost: 1220,
    laborCost: 1050,
    type: "PREVENTIVE",
  },
  {
    ticketId: "T-1102",
    title: "Smart Meter Replacement",
    building: "Library East",
    category: "ELECTRICAL",
    completedAt: "2026-01-07",
    materialCost: 1860,
    laborCost: 1190,
    type: "REACTIVE",
  },
  {
    ticketId: "T-1115",
    title: "Drainage Blockage Removal",
    building: "Dormitory A",
    category: "PLUMBING",
    completedAt: "2026-01-22",
    materialCost: 870,
    laborCost: 630,
    type: "REACTIVE",
  },
  {
    ticketId: "T-1124",
    title: "Filter Replacement Program",
    building: "Science Center",
    category: "HVAC",
    completedAt: "2026-02-05",
    materialCost: 1040,
    laborCost: 910,
    type: "PREVENTIVE",
  },
  {
    ticketId: "T-1132",
    title: "Chemical Storage Room Exhaust Repair",
    building: "Chemistry Wing",
    category: "SAFETY",
    completedAt: "2026-02-18",
    materialCost: 2520,
    laborCost: 1740,
    type: "REACTIVE",
  },
];

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const formatCurrency = (value) => currencyFormatter.format(value || 0);

const toInputDate = (date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const parseInputDate = (value, endOfDay = false) => {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  if (endOfDay) return new Date(year, month - 1, day, 23, 59, 59, 999);
  return new Date(year, month - 1, day, 0, 0, 0, 0);
};

const safeDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date;
};

const makeCsvCell = (value) => `"${String(value ?? "").replace(/"/g, "\"\"")}"`;

const SummaryCard = ({ icon, title, value, caption, tone = "base" }) => {
  const IconComponent = icon;

  const toneClasses = {
    base: "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800",
    success: "border-emerald-200 bg-emerald-50 dark:border-emerald-800/50 dark:bg-emerald-950/30",
    info: "border-indigo-200 bg-indigo-50 dark:border-indigo-800/50 dark:bg-indigo-950/30",
    warning: "border-amber-200 bg-amber-50 dark:border-amber-800/50 dark:bg-amber-950/30",
  };

  return (
    <article className={`rounded-xl border p-4 shadow-sm ${toneClasses[tone] || toneClasses.base}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{title}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
          {caption && <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{caption}</p>}
        </div>
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200">
          <IconComponent size={18} />
        </span>
      </div>
    </article>
  );
};

export const BudgetingCostManagementSection = ({
  expenses = DEFAULT_EXPENSES,
  annualBudget = 120000,
  onExportCsv,
}) => {
  const today = useMemo(() => new Date(), []);
  const defaultStart = useMemo(() => {
    const start = new Date(today.getFullYear(), today.getMonth() - 11, 1);
    return toInputDate(start);
  }, [today]);
  const defaultEnd = useMemo(() => toInputDate(today), [today]);

  const [dateRange, setDateRange] = useState({ start: defaultStart, end: defaultEnd });

  const normalizedExpenses = useMemo(
    () =>
      expenses
        .map((expense) => {
          const completedDate = safeDate(expense.completedAt);
          if (!completedDate) return null;
          return {
            ...expense,
            completedDate,
            totalCost: Number((expense.materialCost + expense.laborCost).toFixed(2)),
          };
        })
        .filter(Boolean),
    [expenses]
  );

  const filteredExpenses = useMemo(() => {
    const start = parseInputDate(dateRange.start, false);
    const end = parseInputDate(dateRange.end, true);
    return normalizedExpenses.filter((expense) => {
      if (start && expense.completedDate < start) return false;
      if (end && expense.completedDate > end) return false;
      return true;
    });
  }, [dateRange.end, dateRange.start, normalizedExpenses]);

  const totalSpend = useMemo(
    () => filteredExpenses.reduce((sum, expense) => sum + expense.totalCost, 0),
    [filteredExpenses]
  );

  const remainingBudget = annualBudget - totalSpend;

  const averageCostPerTicket = filteredExpenses.length > 0 ? totalSpend / filteredExpenses.length : 0;

  const preventiveSpend = useMemo(
    () =>
      filteredExpenses
        .filter((expense) => expense.type === "PREVENTIVE")
        .reduce((sum, expense) => sum + expense.totalCost, 0),
    [filteredExpenses]
  );

  const reactiveSpend = useMemo(
    () =>
      filteredExpenses
        .filter((expense) => expense.type === "REACTIVE")
        .reduce((sum, expense) => sum + expense.totalCost, 0),
    [filteredExpenses]
  );

  const roiPercent = reactiveSpend > 0 ? ((reactiveSpend - preventiveSpend) / reactiveSpend) * 100 : 0;

  const buildingSpendData = useMemo(() => {
    const byBuilding = filteredExpenses.reduce((acc, expense) => {
      const key = expense.building;
      acc[key] = (acc[key] || 0) + expense.totalCost;
      return acc;
    }, {});

    return Object.entries(byBuilding)
      .map(([building, cost]) => ({
        building,
        cost: Number(cost.toFixed(0)),
      }))
      .sort((a, b) => b.cost - a.cost)
      .slice(0, 5);
  }, [filteredExpenses]);

  const monthlyTrendData = useMemo(() => {
    const endDate = parseInputDate(dateRange.end, false) || today;
    const months = [];
    for (let index = 11; index >= 0; index -= 1) {
      const current = new Date(endDate.getFullYear(), endDate.getMonth() - index, 1);
      months.push({
        key: `${current.getFullYear()}-${current.getMonth()}`,
        month: current.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
        total: 0,
      });
    }

    const monthIndex = new Map(months.map((month, index) => [month.key, index]));
    filteredExpenses.forEach((expense) => {
      const key = `${expense.completedDate.getFullYear()}-${expense.completedDate.getMonth()}`;
      const targetIndex = monthIndex.get(key);
      if (typeof targetIndex !== "number") return;
      months[targetIndex].total += expense.totalCost;
    });

    return months.map((month) => ({
      ...month,
      total: Number(month.total.toFixed(0)),
    }));
  }, [dateRange.end, filteredExpenses, today]);

  const spendByCategoryData = useMemo(() => {
    const grouped = filteredExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.totalCost;
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([category, value]) => ({ category, value: Number(value.toFixed(0)) }))
      .sort((a, b) => b.value - a.value);
  }, [filteredExpenses]);

  const recentExpenses = useMemo(
    () =>
      [...filteredExpenses]
        .sort((a, b) => b.completedDate.getTime() - a.completedDate.getTime())
        .slice(0, 8),
    [filteredExpenses]
  );

  const exportCsv = () => {
    const headers = [
      "Ticket ID",
      "Title",
      "Building",
      "Category",
      "Completed At",
      "Material Cost",
      "Labor Cost",
      "Total Cost",
    ];

    const rows = recentExpenses.map((expense) =>
      [
        makeCsvCell(expense.ticketId),
        makeCsvCell(expense.title),
        makeCsvCell(expense.building),
        makeCsvCell(expense.category),
        makeCsvCell(expense.completedDate.toLocaleDateString("en-US")),
        makeCsvCell(expense.materialCost.toFixed(2)),
        makeCsvCell(expense.laborCost.toFixed(2)),
        makeCsvCell(expense.totalCost.toFixed(2)),
      ].join(",")
    );

    const csv = [headers.map(makeCsvCell).join(","), ...rows].join("\n");
    onExportCsv?.(csv);

    if (typeof window === "undefined") return;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = window.document.createElement("a");
    link.href = url;
    link.setAttribute("download", `maintenance-expenses-${dateRange.start}-to-${dateRange.end}.csv`);
    window.document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  const roiTone = roiPercent >= 0 ? "success" : "warning";

  return (
    <section className="space-y-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-900">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Budgeting & Cost Management</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">Track maintenance spend, efficiency, and budget utilization.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <CalendarDays size={14} />
            Date Range
          </span>
          <input
            type="date"
            value={dateRange.start}
            onChange={(event) => setDateRange((prev) => ({ ...prev, start: event.target.value }))}
            className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-indigo-900/40"
          />
          <span className="text-xs text-slate-500 dark:text-slate-400">to</span>
          <input
            type="date"
            value={dateRange.end}
            onChange={(event) => setDateRange((prev) => ({ ...prev, end: event.target.value }))}
            className="rounded-md border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-indigo-900/40"
          />
        </div>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={CircleDollarSign}
          title="Total Maintenance Spend (YTD)"
          value={formatCurrency(totalSpend)}
          caption={`${filteredExpenses.length} completed tickets in selected range`}
          tone="base"
        />
        <SummaryCard
          icon={PiggyBank}
          title="Remaining Budget"
          value={formatCurrency(remainingBudget)}
          caption={`Annual budget target: ${formatCurrency(annualBudget)}`}
          tone={remainingBudget >= 0 ? "success" : "warning"}
        />
        <SummaryCard
          icon={ReceiptText}
          title="Average Cost per Ticket"
          value={formatCurrency(averageCostPerTicket)}
          caption="Material + labor blended average"
          tone="info"
        />
        <SummaryCard
          icon={TrendingUp}
          title="Preventive vs Reactive ROI"
          value={`${roiPercent >= 0 ? "+" : ""}${roiPercent.toFixed(1)}%`}
          caption={`Preventive ${formatCurrency(preventiveSpend)} vs Reactive ${formatCurrency(reactiveSpend)}`}
          tone={roiTone}
        />
      </div>

      <section className="grid gap-4 xl:grid-cols-3">
        <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm xl:col-span-2 dark:border-slate-700 dark:bg-slate-800">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">Maintenance Costs by Building</h3>
          <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">Top 5 most expensive buildings in selected range</p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={buildingSpendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b833" />
                <XAxis dataKey="building" tick={{ fontSize: 11 }} interval={0} angle={-15} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{ borderRadius: 10, borderColor: "#cbd5e1" }}
                />
                <Bar dataKey="cost" radius={[8, 8, 0, 0]} fill="#4F46E5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm xl:row-span-2 dark:border-slate-700 dark:bg-slate-800">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">Spend by Category</h3>
          <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">Distribution of maintenance expenditure</p>
          <div className="h-[560px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={spendByCategoryData}
                  dataKey="value"
                  nameKey="category"
                  cx="50%"
                  cy="42%"
                  outerRadius={110}
                  innerRadius={58}
                  paddingAngle={2}
                >
                  {spendByCategoryData.map((entry, index) => (
                    <Cell key={`${entry.category}-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend verticalAlign="bottom" height={80} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm xl:col-span-2 dark:border-slate-700 dark:bg-slate-800">
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">Cost Trends</h3>
          <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">Maintenance spend trend over the last 12 months</p>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b833" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(value) => `$${value / 1000}k`} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Line type="monotone" dataKey="total" stroke="#0EA5E9" strokeWidth={3} dot={{ r: 3 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">Recent Expenses</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Most recent completed tickets with material and labor costs</p>
          </div>
          <button
            type="button"
            onClick={exportCsv}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700 active:bg-indigo-800"
          >
            <Download size={14} />
            Export to CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-700">
            <thead className="bg-slate-100/80 dark:bg-slate-900/80">
              <tr className="text-left">
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Ticket</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Building</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Material Cost</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Labor Cost</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Total Cost</th>
                <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Completed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-700 dark:bg-slate-800">
              {recentExpenses.map((expense) => (
                <tr key={expense.ticketId} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/40">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{expense.ticketId}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{expense.title}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{expense.building}</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{formatCurrency(expense.materialCost)}</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{formatCurrency(expense.laborCost)}</td>
                  <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">{formatCurrency(expense.totalCost)}</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                    {expense.completedDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {recentExpenses.length === 0 && (
          <div className="border-t border-slate-200 py-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
            No completed-ticket expense data for the selected date range.
          </div>
        )}
      </section>
    </section>
  );
};
