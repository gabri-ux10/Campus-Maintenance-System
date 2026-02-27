import { useMemo, useState } from "react";
import {
  Armchair,
  Building2,
  Droplets,
  GripVertical,
  Laptop,
  LayoutGrid,
  Search,
  ShieldAlert,
  Sparkles,
  Table2,
  Wind,
  Wrench,
  Zap,
} from "lucide-react";
import { UserAvatar } from "../Common/UserAvatar.jsx";
import { CATEGORIES, URGENCY_LEVELS } from "../../utils/constants";
import { titleCase } from "../../utils/helpers";

const KANBAN_COLUMNS = ["SUBMITTED", "APPROVED", "ASSIGNED", "IN_PROGRESS", "RESOLVED"];

const STATUS_META = {
  SUBMITTED: {
    border: "border-slate-500",
    pill: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  },
  APPROVED: {
    border: "border-cyan-500",
    pill: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
  },
  ASSIGNED: {
    border: "border-indigo-500",
    pill: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
  },
  IN_PROGRESS: {
    border: "border-amber-500",
    pill: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  },
  RESOLVED: {
    border: "border-emerald-500",
    pill: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  },
};

const URGENCY_BADGES = {
  HIGH: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  CRITICAL: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
};

const CATEGORY_ICONS = {
  PLUMBING: Droplets,
  ELECTRICAL: Zap,
  HVAC: Wind,
  CLEANING: Sparkles,
  IT: Laptop,
  FURNITURE: Armchair,
  STRUCTURAL: Building2,
  SAFETY: ShieldAlert,
  OTHER: Wrench,
};

const SAMPLE_TICKETS = [
  {
    id: 1024,
    title: "Leaking Pipe",
    status: "SUBMITTED",
    category: "PLUMBING",
    urgency: "HIGH",
    assignee: { fullName: "Ops Intake", username: "ops.intake", avatarPreset: "campus" },
  },
  {
    id: 1031,
    title: "Flickering Corridor Lights",
    status: "SUBMITTED",
    category: "ELECTRICAL",
    urgency: "MEDIUM",
    assignee: { fullName: "Ops Intake", username: "ops.intake", avatarPreset: "campus" },
  },
  {
    id: 1028,
    title: "Server Room Cooling Check",
    status: "APPROVED",
    category: "HVAC",
    urgency: "CRITICAL",
    assignee: { fullName: "Miriam N.", username: "miriam.n", avatarPreset: "zen" },
  },
  {
    id: 1019,
    title: "Lab Workstation Reimage",
    status: "ASSIGNED",
    category: "IT",
    urgency: "LOW",
    assignee: { fullName: "Kevin O.", username: "kevin.o", avatarPreset: "fjord" },
  },
  {
    id: 1012,
    title: "Damaged Stair Rail",
    status: "IN_PROGRESS",
    category: "SAFETY",
    urgency: "HIGH",
    assignee: { fullName: "Aisha R.", username: "aisha.r", avatarPreset: "campus" },
  },
  {
    id: 1007,
    title: "Classroom Chairs Replaced",
    status: "RESOLVED",
    category: "FURNITURE",
    urgency: "MEDIUM",
    assignee: { fullName: "Daniel P.", username: "daniel.p", avatarPreset: "zen" },
  },
];

const DEFAULT_FILTERS = { status: "", category: "", urgency: "", search: "" };

export const TicketManagementKanbanBoard = ({
  tickets = SAMPLE_TICKETS,
  view,
  onViewChange,
  onApproveTicket,
  onRejectTicket,
}) => {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [internalView, setInternalView] = useState("KANBAN");
  const currentView = view || internalView;

  const handleViewChange = (nextView) => {
    setInternalView(nextView);
    onViewChange?.(nextView);
  };

  const filteredTickets = useMemo(() => {
    const query = filters.search.trim().toLowerCase();
    return tickets.filter((ticket) => {
      if (!KANBAN_COLUMNS.includes(ticket.status)) return false;
      if (filters.status && ticket.status !== filters.status) return false;
      if (filters.category && ticket.category !== filters.category) return false;
      if (filters.urgency && ticket.urgency !== filters.urgency) return false;
      if (!query) return true;

      const searchable = [
        `T-${ticket.id}`,
        ticket.title,
        ticket.category,
        ticket.urgency,
        ticket.assignee?.fullName,
        ticket.assignee?.username,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [filters.category, filters.search, filters.status, filters.urgency, tickets]);

  const groupedTickets = useMemo(
    () =>
      KANBAN_COLUMNS.reduce((acc, status) => {
        acc[status] = filteredTickets.filter((ticket) => ticket.status === status);
        return acc;
      }, {}),
    [filteredTickets]
  );

  return (
    <section className="space-y-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-900">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Ticket Management</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">Track workflow from submission to resolution.</p>
        </div>

        <div className="inline-flex rounded-lg border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-700 dark:bg-slate-800">
          <button
            type="button"
            onClick={() => handleViewChange("TABLE")}
            aria-pressed={currentView === "TABLE"}
            className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${
              currentView === "TABLE"
                ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                : "text-slate-600 hover:bg-slate-100 active:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700 dark:active:bg-slate-600"
            }`}
          >
            <Table2 size={16} />
            Table
          </button>
          <button
            type="button"
            onClick={() => handleViewChange("KANBAN")}
            aria-pressed={currentView === "KANBAN"}
            className={`inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition ${
              currentView === "KANBAN"
                ? "bg-indigo-600 text-white dark:bg-indigo-500"
                : "text-slate-600 hover:bg-slate-100 active:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700 dark:active:bg-slate-600"
            }`}
          >
            <LayoutGrid size={16} />
            Kanban
          </button>
        </div>
      </header>

      <div className="grid gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm md:grid-cols-4 dark:border-slate-700 dark:bg-slate-800">
        <label className="space-y-1">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Status</span>
          <select
            value={filters.status}
            onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-indigo-900/40"
          >
            <option value="">All Statuses</option>
            {KANBAN_COLUMNS.map((status) => (
              <option key={status} value={status}>
                {titleCase(status)}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Category</span>
          <select
            value={filters.category}
            onChange={(event) => setFilters((prev) => ({ ...prev, category: event.target.value }))}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-indigo-900/40"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {titleCase(category)}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Urgency</span>
          <select
            value={filters.urgency}
            onChange={(event) => setFilters((prev) => ({ ...prev, urgency: event.target.value }))}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-indigo-900/40"
          >
            <option value="">All Urgency</option>
            {URGENCY_LEVELS.map((urgency) => (
              <option key={urgency} value={urgency}>
                {titleCase(urgency)}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-1">
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Search</span>
          <span className="flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 shadow-sm focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 dark:border-slate-600 dark:bg-slate-900 dark:focus-within:ring-indigo-900/40">
            <Search size={16} className="text-slate-400" />
            <input
              value={filters.search}
              onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
              placeholder="Search ticket, title, assignee..."
              className="w-full bg-transparent pl-2 text-sm text-slate-700 outline-none dark:text-slate-100"
            />
          </span>
        </label>
      </div>

      {currentView === "TABLE" ? (
        <div className="rounded-xl border border-slate-200 bg-white p-6 text-center text-sm text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
          Table view is selected. Use the same filter state in your table component.
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {KANBAN_COLUMNS.map((status) => (
            <section
              key={status}
              aria-label={`${titleCase(status)} tickets`}
              className="min-h-[520px] min-w-[290px] flex-1 rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
            >
              <header className={`rounded-t-xl border-t-4 px-4 py-3 ${STATUS_META[status].border}`}>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-200">
                    {titleCase(status)}
                  </h3>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_META[status].pill}`}>
                    {groupedTickets[status].length}
                  </span>
                </div>
              </header>

              <div className="space-y-3 p-3">
                {groupedTickets[status].length === 0 && (
                  <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-center text-xs text-slate-500 dark:border-slate-600 dark:bg-slate-900/40 dark:text-slate-400">
                    No tickets in this stage.
                  </div>
                )}

                {groupedTickets[status].map((ticket) => {
                  const CategoryIcon = CATEGORY_ICONS[ticket.category] || Wrench;
                  const showUrgency = ticket.urgency === "HIGH" || ticket.urgency === "CRITICAL";
                  const assigneeName = ticket.assignee?.fullName || "Unassigned";

                  return (
                    <article
                      key={ticket.id}
                      draggable
                      aria-grabbed="false"
                      className="cursor-grab rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition hover:border-indigo-300 hover:shadow-md active:cursor-grabbing dark:border-slate-700 dark:bg-slate-900"
                    >
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {`T-${ticket.id}: ${ticket.title}`}
                        </h4>
                        <GripVertical size={16} className="mt-0.5 shrink-0 text-slate-400" />
                      </div>

                      <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                        <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2 py-1 dark:bg-slate-800">
                          <CategoryIcon size={14} />
                          {titleCase(ticket.category)}
                        </span>
                        {showUrgency && (
                          <span className={`inline-flex rounded-full px-2.5 py-1 font-semibold ${URGENCY_BADGES[ticket.urgency]}`}>
                            {titleCase(ticket.urgency)}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 rounded-md bg-slate-50 px-2.5 py-2 dark:bg-slate-800/60">
                        <UserAvatar
                          fullName={assigneeName}
                          username={ticket.assignee?.username}
                          avatarPreset={ticket.assignee?.avatarPreset}
                          avatarType={ticket.assignee?.avatarType}
                          avatarImage={ticket.assignee?.avatarImage}
                          size={28}
                          className="rounded-lg"
                        />
                        <p className="text-xs font-medium text-slate-700 dark:text-slate-200">{assigneeName}</p>
                      </div>

                      {status === "SUBMITTED" && (
                        <div className="mt-3 space-y-2">
                          <button
                            type="button"
                            onClick={() => onApproveTicket?.(ticket)}
                            className="w-full rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 active:bg-indigo-800"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => onRejectTicket?.(ticket)}
                            className="w-full rounded-lg border border-red-300 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 active:bg-red-100 dark:border-red-600 dark:text-red-300 dark:hover:bg-red-900/20 dark:active:bg-red-900/30"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      )}
    </section>
  );
};

