import {
  ArrowRight,
  BellRing,
  CheckCircle2,
  Layers3,
  ShieldCheck,
  TimerReset,
  Wrench,
} from "lucide-react";
import { Link } from "react-router-dom";
import { CampusFixLogo } from "./CampusFixLogo";
import { scrollToLandingSection } from "./scrollToLandingSection";

const numberFormat = new Intl.NumberFormat("en-US");

const formatCount = (value, loading) => {
  if (loading) return "Syncing";
  return value == null ? "--" : numberFormat.format(value);
};

const formatHours = (value, loading) => {
  if (loading) return "Syncing";
  return value == null ? "--" : `${value.toFixed(1)}h`;
};

const formatSyncTime = (value, loading) => {
  if (loading) return "Live sync in progress";
  if (!value) return "Waiting for sync";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "Waiting for sync";
  return `Updated ${parsed.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
};

const KPIChip = ({ label }) => (
  <span className="landing-capability-chip inline-flex items-center gap-2 rounded-full border border-gray-200/80 bg-white/82 px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm shadow-gray-900/5 backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/80 dark:text-gray-200">
    <span className="h-1.5 w-1.5 rounded-full bg-campus-500" />
    {label}
  </span>
);

const QueueItem = ({ title, building, status, tone }) => (
  <div className="flex items-center justify-between gap-3 rounded-2xl border border-gray-200/80 bg-white/88 px-4 py-3 dark:border-slate-700/70 dark:bg-slate-900/82">
    <div className="min-w-0">
      <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">{title}</p>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{building}</p>
    </div>
    <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${tone}`}>{status}</span>
  </div>
);

const HeroProductVisual = ({ stats, loading, error }) => {
  const syncLabel = formatSyncTime(stats.lastUpdatedAt, loading);

  return (
    <div className="relative mx-auto w-full max-w-[640px] xl:mx-0">
      <div className="absolute -left-10 top-16 hidden h-40 w-40 rounded-full bg-campus-400/18 blur-3xl lg:block" />
      <div className="absolute -right-8 bottom-6 hidden h-44 w-44 rounded-full bg-emerald-400/18 blur-3xl lg:block" />

      <div className="landing-hero-visual landing-panel relative overflow-hidden rounded-[2rem] border border-gray-200/80 p-5 shadow-[0_32px_80px_-42px_rgba(15,23,42,0.55)] dark:border-slate-700/70 dark:bg-slate-950/88 sm:p-6">
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-r from-campus-500/12 via-transparent to-emerald-400/12" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <CampusFixLogo />
              <div>
                <p className="landing-kicker">Operations command layer</p>
                <h2 className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                  One view for queue, SLA, and team coordination
                </h2>
              </div>
            </div>

            <span className="rounded-full border border-campus-200 bg-campus-50 px-3 py-1 text-xs font-semibold text-campus-700 dark:border-campus-900/50 dark:bg-campus-900/25 dark:text-campus-300">
              {syncLabel}
            </span>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="landing-hero-metric-card rounded-[1.4rem] border border-gray-200/80 bg-white/90 p-4 dark:border-slate-700/70 dark:bg-slate-900/84">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">Open queue</p>
              <p className="mt-2 text-3xl font-semibold text-amber-600 dark:text-amber-300">
                {formatCount(stats.openTickets, loading)}
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Live unresolved backlog</p>
            </div>
            <div className="landing-hero-metric-card rounded-[1.4rem] border border-gray-200/80 bg-white/90 p-4 dark:border-slate-700/70 dark:bg-slate-900/84">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">Resolved today</p>
              <p className="mt-2 text-3xl font-semibold text-emerald-600 dark:text-emerald-300">
                {formatCount(stats.resolvedToday, loading)}
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Completed in the current day</p>
            </div>
            <div className="landing-hero-metric-card rounded-[1.4rem] border border-gray-200/80 bg-white/90 p-4 dark:border-slate-700/70 dark:bg-slate-900/84">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">Average resolution</p>
              <p className="mt-2 text-3xl font-semibold text-sky-600 dark:text-sky-300">
                {formatHours(stats.averageResolutionHours, loading)}
              </p>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Mean time to close maintenance work</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-[1.12fr_0.88fr]">
            <div className="landing-outline-card rounded-[1.55rem] border border-gray-200/80 bg-white/92 p-4 dark:border-slate-700/70 dark:bg-slate-900/84">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="landing-kicker">Active queue</p>
                  <h3 className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                    Prioritize by urgency, location, and SLA risk
                  </h3>
                </div>
                <Layers3 size={18} className="text-campus-500" />
              </div>

              <div className="space-y-3">
                <QueueItem
                  title="Water leak near lecture hall"
                  building="Engineering Block | High urgency"
                  status="At risk"
                  tone="bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                />
                <QueueItem
                  title="Power outlet fault in lab"
                  building="Science Wing | Critical"
                  status="Escalated"
                  tone="bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                />
                <QueueItem
                  title="Dorm corridor lighting"
                  building="Residence Hall | In progress"
                  status="Crew active"
                  tone="bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="landing-outline-card rounded-[1.55rem] border border-gray-200/80 bg-gray-950 px-4 py-4 text-white dark:border-slate-700/70">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-300">SLA watch</p>
                    <p className="mt-2 text-lg font-semibold">Breaches stay visible before they spread.</p>
                  </div>
                  <ShieldCheck size={20} className="text-emerald-300" />
                </div>
                <div className="mt-4 h-2 rounded-full bg-white/10">
                  <div className="h-full w-[76%] rounded-full bg-gradient-to-r from-emerald-400 via-campus-400 to-sky-400" />
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-gray-300">
                  <span>Healthy workflow coverage</span>
                  <span>76%</span>
                </div>
              </div>

              <div className="landing-outline-card rounded-[1.55rem] border border-gray-200/80 bg-white/92 p-4 dark:border-slate-700/70 dark:bg-slate-900/84">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="landing-kicker">Broadcasts</p>
                    <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
                      Keep students informed without leaving the dashboard
                    </p>
                  </div>
                  <BellRing size={18} className="text-campus-500" />
                </div>
                <div className="mt-4 space-y-2.5 text-sm">
                  <div className="rounded-xl border border-gray-200/80 bg-gray-50/80 px-3 py-2.5 text-gray-700 dark:border-slate-700/70 dark:bg-slate-950/75 dark:text-gray-200">
                    Planned outage notice queued for residence halls
                  </div>
                  <div className="rounded-xl border border-gray-200/80 bg-gray-50/80 px-3 py-2.5 text-gray-700 dark:border-slate-700/70 dark:bg-slate-950/75 dark:text-gray-200">
                    Crew assignment updates sent automatically
                  </div>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <p className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-sm text-amber-700 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-300">
              {error}
            </p>
          )}
        </div>
      </div>

      <div className="landing-floating-card pointer-events-none absolute bottom-10 hidden w-[214px] rounded-[1.5rem] border border-gray-200/85 bg-white/95 p-4 shadow-[0_24px_50px_-30px_rgba(15,23,42,0.42)] backdrop-blur dark:border-slate-700/80 dark:bg-slate-950/92 xl:-left-12 xl:block 2xl:-left-20">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-campus-500/12 text-campus-600 dark:text-campus-300">
            <CheckCircle2 size={18} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">Student intake</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Structured report capture</p>
          </div>
        </div>
        <div className="mt-4 space-y-2 text-xs text-gray-600 dark:text-gray-300">
          <div className="rounded-xl bg-gray-50 px-3 py-2 dark:bg-slate-900/80">Building, room, and urgency in one step</div>
          <div className="rounded-xl bg-gray-50 px-3 py-2 dark:bg-slate-900/80">Attachments and context before submission</div>
        </div>
      </div>

      <div className="landing-floating-card pointer-events-none absolute -right-8 top-10 hidden w-[214px] rounded-[1.5rem] border border-gray-200/85 bg-white/95 p-4 shadow-[0_24px_50px_-30px_rgba(15,23,42,0.42)] backdrop-blur dark:border-slate-700/80 dark:bg-slate-950/92 2xl:block">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">Crew handoff</p>
            <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">Notes and proof stay attached</p>
          </div>
          <Wrench size={18} className="text-emerald-500" />
        </div>
        <div className="mt-4 rounded-xl bg-gray-50 px-3 py-2.5 text-xs text-gray-600 dark:bg-slate-900/80 dark:text-gray-300">
          Work note added | after-photo uploaded | status moved to resolved
        </div>
      </div>
    </div>
  );
};

export const HeroSection = ({ stats, loading, error }) => (
  <section className="landing-hero relative overflow-hidden px-5 pb-24 pt-32 sm:px-6 sm:pt-36 lg:pb-28">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_14%_18%,_rgba(14,165,233,0.16),_transparent_34%),radial-gradient(circle_at_86%_12%,_rgba(16,185,129,0.14),_transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.94),rgba(244,248,250,0.84))] dark:bg-[radial-gradient(circle_at_14%_18%,_rgba(14,165,233,0.18),_transparent_34%),radial-gradient(circle_at_86%_12%,_rgba(16,185,129,0.15),_transparent_30%),linear-gradient(180deg,rgba(6,13,21,0.96),rgba(10,19,28,0.9))]" />
    <div className="absolute left-10 top-24 h-72 w-72 rounded-full bg-campus-400/10 blur-3xl hero-glow-orb" />
    <div className="absolute bottom-8 right-6 h-72 w-72 rounded-full bg-emerald-400/12 blur-3xl hero-glow-orb" style={{ animationDelay: "2.5s" }} />

    <div className="relative z-10 mx-auto grid max-w-7xl gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
      <div className="max-w-2xl">
        <p className="landing-kicker">Campus operations platform</p>
        <h1 className="mt-4 text-4xl font-extrabold leading-[1.02] text-gray-950 dark:text-white sm:text-5xl lg:text-[4.1rem]">
          Campus maintenance, managed in one operating system.
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-700 dark:text-gray-300 sm:text-xl">
          CampusFix gives operations leaders one command layer for reporting, assignment, SLA visibility,
          and communication across students, technicians, and administrators.
        </p>

        <div className="mt-6 flex flex-wrap gap-2.5">
          <KPIChip label="Students submit structured issues quickly" />
          <KPIChip label="Maintenance teams work one live queue" />
          <KPIChip label="Admins see backlog and SLA risk early" />
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link
            to="/contact-support"
            className="inline-flex items-center gap-2.5 rounded-2xl bg-gray-950 px-6 py-3.5 text-sm font-semibold text-white no-underline shadow-xl shadow-gray-950/15 transition hover:-translate-y-0.5 hover:bg-gray-900 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
          >
            Contact Support
            <ArrowRight size={16} />
          </Link>

          <button
            type="button"
            onClick={() => scrollToLandingSection("#product")}
            className="inline-flex items-center gap-2.5 rounded-2xl border border-gray-300 bg-white/85 px-6 py-3.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-campus-300 hover:text-campus-600 dark:border-slate-700 dark:bg-slate-900/80 dark:text-gray-200 dark:hover:border-campus-500 dark:hover:text-campus-300"
          >
            See Product Tour
            <Layers3 size={16} />
          </button>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="landing-hero-note rounded-[1.45rem] border border-gray-200/80 bg-white/88 p-4 dark:border-slate-700/70 dark:bg-slate-900/82">
            <ShieldCheck size={18} className="text-campus-500" />
            <p className="mt-3 text-sm font-semibold text-gray-900 dark:text-white">Role-based access</p>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Each group sees the workflow relevant to their job.</p>
          </div>
          <div className="landing-hero-note rounded-[1.45rem] border border-gray-200/80 bg-white/88 p-4 dark:border-slate-700/70 dark:bg-slate-900/82">
            <TimerReset size={18} className="text-emerald-500" />
            <p className="mt-3 text-sm font-semibold text-gray-900 dark:text-white">SLA awareness</p>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Breaches, at-risk tickets, and trendlines stay visible.</p>
          </div>
          <div className="landing-hero-note rounded-[1.45rem] border border-gray-200/80 bg-white/88 p-4 dark:border-slate-700/70 dark:bg-slate-900/82">
            <BellRing size={18} className="text-sky-500" />
            <p className="mt-3 text-sm font-semibold text-gray-900 dark:text-white">Broadcast-ready</p>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Updates reach the campus without leaving the command center.</p>
          </div>
        </div>
      </div>

      <HeroProductVisual stats={stats} loading={loading} error={error} />
    </div>
  </section>
);
