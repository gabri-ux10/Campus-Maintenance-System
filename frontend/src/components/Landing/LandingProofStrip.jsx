import {
  Activity,
  CheckCheck,
  RefreshCw,
  ShieldCheck,
  TimerReset,
} from "lucide-react";
import { useScrollReveal } from "./useScrollReveal";

const numberFormat = new Intl.NumberFormat("en-US");

const formatMetric = (value, suffix = "") => {
  if (value == null) return "--";
  return `${numberFormat.format(value)}${suffix}`;
};

const formatSync = (value, loading) => {
  if (loading) return "Syncing";
  if (!value) return "Waiting for sync";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "Waiting for sync";
  return parsed.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export const LandingProofStrip = ({ stats, loading, error }) => {
  const [ref, visible] = useScrollReveal(0.18);
  const items = [
    {
      label: "Resolved issues",
      value: formatMetric(stats.resolvedTickets),
      helper: "Historical completed work",
      icon: CheckCheck,
      tone: "text-emerald-600 dark:text-emerald-300",
    },
    {
      label: "Open queue",
      value: formatMetric(stats.openTickets),
      helper: "Current unresolved load",
      icon: Activity,
      tone: "text-amber-600 dark:text-amber-300",
    },
    {
      label: "Resolved today",
      value: formatMetric(stats.resolvedToday),
      helper: "Closed in the current day",
      icon: ShieldCheck,
      tone: "text-campus-600 dark:text-campus-300",
    },
    {
      label: "Average resolution",
      value: stats.averageResolutionHours == null ? "--" : `${stats.averageResolutionHours.toFixed(1)}h`,
      helper: "Mean time to resolve",
      icon: TimerReset,
      tone: "text-sky-600 dark:text-sky-300",
    },
    {
      label: "Last sync",
      value: formatSync(stats.lastUpdatedAt, loading),
      helper: "Public analytics refresh",
      icon: RefreshCw,
      tone: "text-gray-700 dark:text-gray-200",
    },
  ];

  return (
    <section className="landing-section relative z-20 -mt-10 px-5 pb-8 sm:px-6 lg:-mt-12">
      <div
        ref={ref}
        className={`mx-auto max-w-7xl transition-all duration-700 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
      >
        <div className="landing-proof-strip rounded-[2rem] border border-gray-200/85 bg-white/94 p-4 shadow-[0_24px_60px_-38px_rgba(15,23,42,0.48)] backdrop-blur-xl dark:border-slate-700/70 dark:bg-slate-950/88 sm:p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 px-1">
            <div>
              <p className="landing-kicker">Operational proof</p>
              <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
                Live signals that reinforce the platform story
              </h2>
            </div>
            <p className="max-w-md text-sm text-gray-600 dark:text-gray-300">
              Public metrics update from the live system so operations teams can quickly assess workload,
              throughput, and response pace.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.label} className="landing-proof-card rounded-[1.5rem] border border-gray-200/85 bg-white/92 p-4 dark:border-slate-700/80 dark:bg-slate-900/88">
                  <div className="flex items-center justify-between gap-3">
                    <div className="landing-proof-icon inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gray-900 text-white dark:bg-white dark:text-slate-900">
                      <Icon size={18} />
                    </div>
                    <span className={`text-2xl font-semibold ${item.tone}`}>{item.value}</span>
                  </div>
                  <p className="mt-4 text-sm font-semibold text-gray-900 dark:text-white">{item.label}</p>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500 dark:text-gray-400">{item.helper}</p>
                </article>
              );
            })}
          </div>

          {error && (
            <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm text-amber-700 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-300">
              {error}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};
