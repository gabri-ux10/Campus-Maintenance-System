import {
  Bell,
  ClipboardPlus,
  LineChart,
  MapPinned,
  ScanSearch,
  Users,
  Wrench,
} from "lucide-react";
import { useScrollReveal } from "./useScrollReveal";

const PRODUCT_STORIES = [
  {
    eyebrow: "Report faster",
    title: "Capture cleaner maintenance requests from the first submission.",
    summary:
      "Students submit the exact location, urgency, description, and photo context teams need to act without back-and-forth clarification.",
    outcomes: [
      "Structured intake standardizes every report across buildings and request types.",
      "Photos and location details reduce ambiguous tickets before they enter the queue.",
      "Students keep a clear status trail after submission.",
    ],
    badge: "Student intake",
    chips: ["Location + urgency", "Photo-ready", "Status timeline"],
    tone: "from-campus-500/14 via-white to-sky-100/70 dark:from-campus-900/30 dark:via-slate-950 dark:to-slate-900",
    renderVisual: () => (
      <div className="landing-product-visual rounded-[1.75rem] border border-gray-200/85 bg-white/94 p-5 dark:border-slate-700/80 dark:bg-slate-900/88">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="landing-kicker">Student report form</p>
            <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">Submit an issue in one pass</p>
          </div>
          <ClipboardPlus size={20} className="text-campus-500" />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="landing-outline-card rounded-[1.2rem] border border-gray-200/80 bg-gray-50/80 p-3.5 dark:border-slate-700/70 dark:bg-slate-950/82">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">Building</p>
            <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">Engineering Block</p>
          </div>
          <div className="landing-outline-card rounded-[1.2rem] border border-gray-200/80 bg-gray-50/80 p-3.5 dark:border-slate-700/70 dark:bg-slate-950/82">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">Urgency</p>
            <p className="mt-2 inline-flex rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">High</p>
          </div>
        </div>

        <div className="mt-3 rounded-[1.2rem] border border-gray-200/80 bg-gray-50/80 p-3.5 dark:border-slate-700/70 dark:bg-slate-950/82">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">Location details</p>
              <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">Lab 2, east wing, second floor</p>
            </div>
            <MapPinned size={18} className="text-campus-500" />
          </div>
        </div>

        <div className="mt-3 grid gap-3 lg:grid-cols-[1fr_0.72fr]">
          <div className="rounded-[1.2rem] border border-gray-200/80 bg-gray-50/80 p-3.5 dark:border-slate-700/70 dark:bg-slate-950/82">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">Issue summary</p>
            <p className="mt-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              Water leak beside the lab entrance. Floor is slippery and needs urgent attention before afternoon classes.
            </p>
          </div>
          <div className="rounded-[1.2rem] border border-dashed border-campus-300/70 bg-campus-50/60 p-3.5 dark:border-campus-700/50 dark:bg-campus-900/20">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-campus-700 dark:text-campus-300">Attachment</p>
            <div className="mt-3 h-24 rounded-xl bg-gradient-to-br from-campus-400/20 via-white to-sky-200/40 dark:from-campus-500/20 dark:via-slate-900 dark:to-slate-800" />
            <p className="mt-2 text-xs text-campus-700 dark:text-campus-300">Photo ready before the ticket enters triage.</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    eyebrow: "Coordinate work clearly",
    title: "Give every maintenance team one live queue instead of scattered requests.",
    summary:
      "Admins review pressure, assign the right crew, and broadcast updates from the same command layer the team uses to execute work.",
    outcomes: [
      "Queue visibility exposes urgency, ownership, and building-level pressure in one place.",
      "Maintenance users receive clear handoffs with notes, timelines, and completion evidence.",
      "Broadcasts keep campus communication tied to the work itself.",
    ],
    badge: "Queue control",
    chips: ["Assignment aware", "Crew notes", "Broadcast-ready"],
    tone: "from-emerald-500/14 via-white to-campus-50/70 dark:from-emerald-900/30 dark:via-slate-950 dark:to-slate-900",
    renderVisual: () => (
      <div className="landing-product-visual rounded-[1.75rem] border border-gray-200/85 bg-white/94 p-5 dark:border-slate-700/80 dark:bg-slate-900/88">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="landing-kicker">Operations queue</p>
            <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">Triage, assign, and update from one view</p>
          </div>
          <ScanSearch size={20} className="text-emerald-500" />
        </div>

        <div className="grid gap-3 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-3">
            <div className="rounded-[1.2rem] border border-gray-200/80 bg-gray-50/80 p-3.5 dark:border-slate-700/70 dark:bg-slate-950/82">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Water leak | Residence Hall</p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Submitted | High urgency</p>
                </div>
                <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">At risk</span>
              </div>
            </div>
            <div className="rounded-[1.2rem] border border-gray-200/80 bg-gray-50/80 p-3.5 dark:border-slate-700/70 dark:bg-slate-950/82">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Lighting fault | Library West</p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Assigned to Electrical Crew</p>
                </div>
                <span className="rounded-full bg-campus-50 px-2.5 py-1 text-[11px] font-semibold text-campus-700 dark:bg-campus-900/30 dark:text-campus-300">In queue</span>
              </div>
            </div>
            <div className="rounded-[1.2rem] border border-gray-200/80 bg-gray-50/80 p-3.5 dark:border-slate-700/70 dark:bg-slate-950/82">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Network issue | Admin Block</p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Crew on-site | Completion evidence pending</p>
                </div>
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">In progress</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="landing-outline-card rounded-[1.2rem] border border-gray-200/80 bg-white/90 p-4 dark:border-slate-700/70 dark:bg-slate-950/82">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">Assignment</p>
                  <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">Electrical Crew | James Mwangi</p>
                </div>
                <Users size={18} className="text-campus-500" />
              </div>
              <p className="mt-3 text-xs leading-relaxed text-gray-600 dark:text-gray-300">
                Notes, ownership, and timeline stay attached through approval, work in progress, and completion.
              </p>
            </div>
            <div className="landing-outline-card rounded-[1.2rem] border border-gray-200/80 bg-gray-950 p-4 text-white dark:border-slate-700/70">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-300">Campus notice</p>
                  <p className="mt-2 text-sm font-semibold">Broadcast scheduled for affected residence blocks</p>
                </div>
                <Bell size={18} className="text-emerald-300" />
              </div>
            </div>
            <div className="landing-outline-card rounded-[1.2rem] border border-gray-200/80 bg-gray-50/80 p-4 dark:border-slate-700/70 dark:bg-slate-950/82">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">Completion evidence</p>
                  <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">Work note and after-photo uploaded</p>
                </div>
                <Wrench size={18} className="text-emerald-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    eyebrow: "Measure operational performance",
    title: "Turn maintenance activity into signals leadership can act on.",
    summary:
      "Analytics, SLA pressure, and resolution pace stay visible so operations teams can allocate staff, respond earlier, and defend service quality.",
    outcomes: [
      "See active pressure before breaches spread across buildings and teams.",
      "Monitor throughput, trendlines, and average resolution without exporting raw records first.",
      "Use visible performance to guide staffing and service decisions.",
    ],
    badge: "Performance insight",
    chips: ["SLA health", "Trend visibility", "Building pressure"],
    tone: "from-sky-500/14 via-white to-emerald-100/70 dark:from-sky-900/30 dark:via-slate-950 dark:to-slate-900",
    renderVisual: () => (
      <div className="landing-product-visual rounded-[1.75rem] border border-gray-200/85 bg-white/94 p-5 dark:border-slate-700/80 dark:bg-slate-900/88">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="landing-kicker">Performance visibility</p>
            <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">Read health before you export reports</p>
          </div>
          <LineChart size={20} className="text-sky-500" />
        </div>

        <div className="grid gap-3 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="rounded-[1.35rem] border border-gray-200/80 bg-gray-950 px-4 py-4 text-white dark:border-slate-700/70">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-300">SLA coverage</p>
            <p className="mt-3 text-4xl font-semibold text-emerald-300">84%</p>
            <p className="mt-2 text-sm text-gray-300">Healthy tickets still inside operational target</p>
            <div className="mt-4 h-2 rounded-full bg-white/10">
              <div className="h-full w-[84%] rounded-full bg-gradient-to-r from-emerald-400 via-campus-400 to-sky-400" />
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-[1.2rem] border border-gray-200/80 bg-gray-50/80 p-4 dark:border-slate-700/70 dark:bg-slate-950/82">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Resolution trend</p>
                <span className="rounded-full bg-campus-50 px-2.5 py-1 text-[11px] font-semibold text-campus-700 dark:bg-campus-900/30 dark:text-campus-300">Last 7 days</span>
              </div>
              <div className="grid grid-cols-7 items-end gap-2">
                {[34, 44, 58, 49, 67, 74, 61].map((height, index) => (
                  <div key={height} className="space-y-2 text-center">
                    <div className="flex h-24 items-end justify-center">
                      <div
                        className={`w-5 rounded-t-md bg-gradient-to-t ${
                          index > 4 ? "from-emerald-500 to-emerald-300" : "from-campus-600 to-sky-400"
                        }`}
                        style={{ height: `${height}px` }}
                      />
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-gray-400 dark:text-gray-500">
                      {["M", "T", "W", "T", "F", "S", "S"][index]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[1.15rem] border border-gray-200/80 bg-white/90 px-4 py-3 dark:border-slate-700/70 dark:bg-slate-900/82">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">At risk</p>
                <p className="mt-2 text-xl font-semibold text-amber-600 dark:text-amber-300">12</p>
              </div>
              <div className="rounded-[1.15rem] border border-gray-200/80 bg-white/90 px-4 py-3 dark:border-slate-700/70 dark:bg-slate-900/82">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">Breached</p>
                <p className="mt-2 text-xl font-semibold text-red-600 dark:text-red-300">4</p>
              </div>
              <div className="rounded-[1.15rem] border border-gray-200/80 bg-white/90 px-4 py-3 dark:border-slate-700/70 dark:bg-slate-900/82">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">Buildings</p>
                <p className="mt-2 text-xl font-semibold text-sky-600 dark:text-sky-300">7</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
  },
];

export const FeaturesSection = () => {
  const [ref, visible] = useScrollReveal(0.12);

  return (
    <section id="product" className="landing-section landing-section-muted relative py-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_8%_24%,_rgba(14,165,233,0.08),_transparent_30%),radial-gradient(circle_at_92%_18%,_rgba(16,185,129,0.07),_transparent_28%)]" />

      <div
        ref={ref}
        className={`relative z-10 mx-auto max-w-7xl px-5 transition-all duration-700 sm:px-6 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        <div className="mx-auto max-w-3xl text-center">
          <p className="landing-kicker">Product walkthrough</p>
          <h2 className="mt-2 text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
            A maintenance platform built for operational clarity.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-gray-300">
            CampusFix is strongest when the product story is seen through the work itself: better intake,
            cleaner coordination, and visible performance signals for campus leadership.
          </p>
        </div>

        <div className="mt-16 space-y-8">
          {PRODUCT_STORIES.map((story, index) => (
            <article
              key={story.title}
              className={`landing-product-story grid gap-8 rounded-[2rem] border border-gray-200/80 bg-gradient-to-br ${story.tone} p-6 shadow-[0_24px_50px_-38px_rgba(15,23,42,0.32)] dark:border-slate-700/70 lg:grid-cols-[0.92fr_1.08fr] lg:items-center lg:p-8 ${
                index % 2 === 1 ? "lg:[&>div:first-child]:order-2" : ""
              }`}
            >
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-gray-200/80 bg-white/86 px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm dark:border-slate-700/70 dark:bg-slate-900/80 dark:text-gray-200">
                  {story.badge}
                </div>
                <p className="landing-kicker mt-6">{story.eyebrow}</p>
                <h3 className="mt-2 text-3xl font-bold leading-tight text-gray-950 dark:text-white">
                  {story.title}
                </h3>
                <p className="mt-4 text-base leading-relaxed text-gray-700 dark:text-gray-300">
                  {story.summary}
                </p>

                <ul className="mt-6 space-y-3">
                  {story.outcomes.map((outcome) => (
                    <li key={outcome} className="flex gap-3">
                      <span className="mt-2 inline-flex h-2 w-2 rounded-full bg-campus-500" />
                      <span className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{outcome}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 flex flex-wrap gap-2">
                  {story.chips.map((chip) => (
                    <span key={chip} className="rounded-full border border-gray-200/80 bg-white/82 px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm dark:border-slate-700/70 dark:bg-slate-900/82 dark:text-gray-200">
                      {chip}
                    </span>
                  ))}
                </div>
              </div>

              <div>{story.renderVisual()}</div>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-[1.8rem] border border-gray-200/80 bg-gray-950 px-6 py-5 text-white shadow-[0_24px_50px_-36px_rgba(15,23,42,0.45)] dark:border-slate-700/70">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="max-w-2xl">
              <p className="landing-kicker text-emerald-300">Trust note</p>
              <p className="mt-2 text-lg font-semibold">
                Built to replace unclear maintenance workflows with one accountable operating layer.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-gray-300">
              <span className="rounded-full border border-white/15 px-3 py-1.5">Role-based security</span>
              <span className="rounded-full border border-white/15 px-3 py-1.5">Broadcast-aware</span>
              <span className="rounded-full border border-white/15 px-3 py-1.5">SLA visible</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
