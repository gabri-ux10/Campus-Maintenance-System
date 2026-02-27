import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Boxes,
  ClipboardCheck,
  DollarSign,
  Edit3,
  PackagePlus,
  Search,
  ShoppingCart,
} from "lucide-react";

const CATEGORY_OPTIONS = ["PLUMBING", "ELECTRICAL", "CLEANING"];

const STATUS_META = {
  IN_STOCK: {
    label: "In Stock",
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  },
  LOW_STOCK: {
    label: "Low Stock",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  },
  OUT_OF_STOCK: {
    label: "Out of Stock",
    badge: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  },
};

const DEFAULT_ITEMS = [
  {
    id: "INV-PL-001",
    name: "PVC Elbow 2in",
    sku: "PLB-2001",
    category: "PLUMBING",
    quantity: 48,
    reorderLevel: 20,
    unitCost: 4.75,
    monthlyUsage: 110,
    checkedOut: 12,
  },
  {
    id: "INV-PL-002",
    name: "Copper Pipe 1/2in",
    sku: "PLB-1204",
    category: "PLUMBING",
    quantity: 16,
    reorderLevel: 20,
    unitCost: 13.5,
    monthlyUsage: 70,
    checkedOut: 5,
  },
  {
    id: "INV-PL-003",
    name: "Plumber PTFE Tape",
    sku: "PLB-5410",
    category: "PLUMBING",
    quantity: 0,
    reorderLevel: 15,
    unitCost: 2.4,
    monthlyUsage: 85,
    checkedOut: 0,
  },
  {
    id: "INV-EL-001",
    name: "LED Tube Light 18W",
    sku: "ELC-1801",
    category: "ELECTRICAL",
    quantity: 95,
    reorderLevel: 40,
    unitCost: 8.2,
    monthlyUsage: 130,
    checkedOut: 18,
  },
  {
    id: "INV-EL-002",
    name: "Circuit Breaker 20A",
    sku: "ELC-2014",
    category: "ELECTRICAL",
    quantity: 9,
    reorderLevel: 12,
    unitCost: 24.5,
    monthlyUsage: 24,
    checkedOut: 4,
  },
  {
    id: "INV-EL-003",
    name: "Electrical Tape",
    sku: "ELC-7712",
    category: "ELECTRICAL",
    quantity: 34,
    reorderLevel: 25,
    unitCost: 3.1,
    monthlyUsage: 95,
    checkedOut: 10,
  },
  {
    id: "INV-CL-001",
    name: "Disinfectant 5L",
    sku: "CLN-5005",
    category: "CLEANING",
    quantity: 7,
    reorderLevel: 10,
    unitCost: 17.6,
    monthlyUsage: 22,
    checkedOut: 3,
  },
  {
    id: "INV-CL-002",
    name: "Industrial Gloves (Box)",
    sku: "CLN-2240",
    category: "CLEANING",
    quantity: 29,
    reorderLevel: 20,
    unitCost: 11.9,
    monthlyUsage: 50,
    checkedOut: 14,
  },
];

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value || 0);

const titleCase = (value) =>
  value?.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()) || "";

const resolveStatus = (item) => {
  if (item.quantity <= 0) return "OUT_OF_STOCK";
  if (item.quantity <= item.reorderLevel) return "LOW_STOCK";
  return "IN_STOCK";
};

const metricTone = {
  base: "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800",
  info: "border-indigo-200 bg-indigo-50 dark:border-indigo-800/50 dark:bg-indigo-950/30",
  alert: "border-amber-200 bg-amber-50 dark:border-amber-800/50 dark:bg-amber-950/30",
  critical: "border-red-200 bg-red-50 dark:border-red-800/50 dark:bg-red-950/30",
};

const MetricCard = ({ icon, label, value, caption, tone = "base" }) => {
  const IconComponent = icon;

  return (
    <article className={`rounded-xl border p-4 shadow-sm ${metricTone[tone] || metricTone.base}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
          {caption && <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{caption}</p>}
        </div>
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-200">
          <IconComponent size={18} />
        </span>
      </div>
    </article>
  );
};

export const InventorySupplyManagementSection = ({
  items = DEFAULT_ITEMS,
  onAddInventory,
  onEditItem,
  onOrderMore,
  onGeneratePurchaseOrder,
}) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  const enrichedItems = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        status: resolveStatus(item),
      })),
    [items]
  );

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    return enrichedItems.filter((item) => {
      if (category && item.category !== category) return false;
      if (!query) return true;
      return `${item.name} ${item.sku} ${item.category}`.toLowerCase().includes(query);
    });
  }, [category, enrichedItems, search]);

  const totalItemsInStock = useMemo(
    () => enrichedItems.reduce((sum, item) => sum + Math.max(item.quantity, 0), 0),
    [enrichedItems]
  );

  const lowStockItems = useMemo(
    () =>
      enrichedItems
        .filter((item) => item.status === "LOW_STOCK" || item.status === "OUT_OF_STOCK")
        .sort((a, b) => {
          if (a.status === b.status) return a.quantity - b.quantity;
          return a.status === "OUT_OF_STOCK" ? -1 : 1;
        }),
    [enrichedItems]
  );

  const monthlySupplyCost = useMemo(
    () => enrichedItems.reduce((sum, item) => sum + item.unitCost * (item.monthlyUsage || 0), 0),
    [enrichedItems]
  );

  const toolsCheckedOut = useMemo(
    () => enrichedItems.reduce((sum, item) => sum + (item.checkedOut || 0), 0),
    [enrichedItems]
  );

  const lowStockTone = lowStockItems.length >= 4 ? "critical" : lowStockItems.length > 0 ? "alert" : "base";

  return (
    <section className="space-y-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-900">
      <header className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          icon={Boxes}
          label="Total Items in Stock"
          value={totalItemsInStock.toLocaleString("en-US")}
          caption="Across all active inventory categories"
          tone="base"
        />
        <MetricCard
          icon={AlertTriangle}
          label="Low Stock Alerts"
          value={lowStockItems.length.toLocaleString("en-US")}
          caption="Items at or below reorder level"
          tone={lowStockTone}
        />
        <MetricCard
          icon={DollarSign}
          label="Monthly Supply Cost"
          value={formatCurrency(monthlySupplyCost)}
          caption="Projected spend from monthly usage"
          tone="info"
        />
        <MetricCard
          icon={ClipboardCheck}
          label="Tools Checked Out"
          value={toolsCheckedOut.toLocaleString("en-US")}
          caption="Currently assigned to active crews"
          tone="base"
        />
      </header>

      <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm md:grid-cols-[minmax(0,1fr)_240px_auto] dark:border-slate-700 dark:bg-slate-800">
        <label className="flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 shadow-sm focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 dark:border-slate-600 dark:bg-slate-900 dark:focus-within:ring-indigo-900/40">
          <Search size={16} className="text-slate-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search inventory by item, SKU, category..."
            className="w-full bg-transparent pl-2 text-sm text-slate-700 outline-none dark:text-slate-100"
          />
        </label>

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-indigo-900/40"
        >
          <option value="">All Categories</option>
          {CATEGORY_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {titleCase(option)}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => onAddInventory?.()}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:bg-indigo-800"
        >
          <PackagePlus size={16} />
          Add New Inventory
        </button>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-700">
              <thead className="bg-slate-100/80 dark:bg-slate-900/80">
                <tr className="text-left">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Item Name & SKU</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Category</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Quantity in Stock</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Reorder Level</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Unit Cost</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200 bg-white dark:divide-slate-700 dark:bg-slate-800">
                {filteredItems.map((item) => {
                  const isBelowThreshold = item.quantity <= item.reorderLevel;
                  return (
                    <tr key={item.id} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/40">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-900 dark:text-slate-100">{item.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{item.sku}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{titleCase(item.category)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 font-semibold ${
                            isBelowThreshold ? "text-red-600 dark:text-red-400" : "text-slate-800 dark:text-slate-200"
                          }`}
                        >
                          {isBelowThreshold && <AlertTriangle size={14} />}
                          {item.quantity}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{item.reorderLevel}</td>
                      <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{formatCurrency(item.unitCost)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_META[item.status].badge}`}>
                          {STATUS_META[item.status].label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => onEditItem?.(item)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 active:bg-slate-200 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700 dark:active:bg-slate-600"
                          >
                            <Edit3 size={13} />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => onOrderMore?.(item)}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-indigo-700 active:bg-indigo-800"
                          >
                            <ShoppingCart size={13} />
                            Order More
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredItems.length === 0 && (
            <div className="border-t border-slate-200 p-6 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
              No inventory items match the current filters.
            </div>
          )}
        </article>

        <aside className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-300">Low Stock Alerts</h3>
            <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-700 dark:bg-red-900/30 dark:text-red-300">
              {lowStockItems.length}
            </span>
          </div>

          <div className="space-y-3">
            {lowStockItems.length === 0 && (
              <div className="rounded-lg border border-dashed border-emerald-300 bg-emerald-50 p-3 text-sm text-emerald-700 dark:border-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
                All tracked inventory is above reorder thresholds.
              </div>
            )}

            {lowStockItems.map((item) => (
              <article key={item.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/50">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.sku}</p>
                  </div>
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUS_META[item.status].badge}`}>
                    {STATUS_META[item.status].label}
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
                  Remaining: <span className="font-semibold text-red-600 dark:text-red-400">{item.quantity}</span> | Reorder at {item.reorderLevel}
                </p>
                <button
                  type="button"
                  onClick={() => onGeneratePurchaseOrder?.(item)}
                  className="mt-3 w-full rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700 active:bg-indigo-800"
                >
                  Generate Purchase Order
                </button>
              </article>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
};

