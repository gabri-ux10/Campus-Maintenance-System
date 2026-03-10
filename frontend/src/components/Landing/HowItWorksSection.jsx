import {
  BellRing,
  ChartSpline,
  ClipboardCheck,
  GraduationCap,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { useScrollReveal } from "./useScrollReveal";

const ROLE_CARDS = [
  {
    eyebrow: "Students",
    title: "Submit issues with enough context for faster action.",
    summary:
      "Students report the problem once, attach useful detail, and follow the timeline without chasing updates manually.",
    icon: GraduationCap,
    accent: "from-campus-500 to-sky-400",
    bullets: [
      "Structured intake for location, urgency, and attachments.",
      "Clear ticket status from submission to completion.",
      "A single place to review request history and outcomes.",
    ],
    signals: [
      { label: "What they see", value: "Guided report form" },
      { label: "What improves", value: "Less ambiguity" },
    ],
  },
  {
    eyebrow: "Maintenance teams",
    title: "Work the queue from one operational surface.",
    summary:
      "Maintenance staff receive clear handoffs, add work notes, upload completion evidence, and resolve jobs without losing context.",
    icon: Wrench,
    accent: "from-emerald-500 to-teal-400",
    bullets: [
      "Assigned work orders with urgency and building context.",
      "Note-taking and after-photo evidence within the workflow.",
      "Resolved history stays attached for review and accountability.",
    ],
    signals: [
      { label: "What they see", value: "Live focus queue" },
      { label: "What improves", value: "Cleaner handoffs" },
    ],
  },
  {
    eyebrow: "Administrators",
    title: "See backlog, SLA risk, staff load, and communication in one command layer.",
    summary:
      "Leadership gets the operating picture they need to coordinate campus maintenance instead of stitching it together from separate tools.",
    icon: ChartSpline,
    accent: "from-slate-900 to-campus-600",
    bullets: [
      "Visible queue health, trends, and building pressure.",
      "Staff onboarding, user visibility, and ticket operations in one place.",
      "Broadcasts and exports without leaving the operational surface.",
    ],
    signals: [
      { label: "What they see", value: "Command dashboard" },
      { label: "What improves", value: "Service visibility" },
    ],
  },
];

const AccentSignal = ({ label, value }) => (
  <div className="rounded-[1.1rem] border border-gray-200/80 bg-white/90 px-4 py-3 dark:border-slate-700/70 dark:bg-slate-900/82">
    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">{label}</p>
    <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">{value}</p>
  </div>
);

export const HowItWorksSection = () => {
  const [ref, visible] = useScrollReveal(0.12);

  return (
    <section id="roles" className="landing-section bg-white py-24 dark:bg-slate-900">
      <div
        ref={ref}
        className={`mx-auto max-w-7xl px-5 transition-all duration-700 sm:px-6 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
      >
        <div className="mx-auto max-w-3xl text-center">
          <p className="landing-kicker">Role-based workflow</p>
          <h2 className="mt-2 text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
            The same system serves every role without flattening their needs.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-gray-300">
            CampusFix works because each role sees the part of the workflow they need, while operations
            leadership keeps the full picture in view.
          </p>
        </div>

        <div className="mt-14 grid gap-6 xl:grid-cols-3">
          {ROLE_CARDS.map((role) => {
            const Icon = role.icon;
            return (
              <article key={role.eyebrow} className="landing-role-card rounded-[2rem] border border-gray-200/80 bg-white/92 p-6 shadow-[0_22px_44px_-34px_rgba(15,23,42,0.3)] dark:border-slate-700/70 dark:bg-slate-900/86">
                <div className={`inline-flex h-14 w-14 items-center justify-center rounded-[1.35rem] bg-gradient-to-br ${role.accent} text-white shadow-lg shadow-gray-900/10`}>
                  <Icon size={24} />
                </div>

                <p className="landing-kicker mt-6">{role.eyebrow}</p>
                <h3 className="mt-2 text-2xl font-bold leading-tight text-gray-950 dark:text-white">
                  {role.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                  {role.summary}
                </p>

                <ul className="mt-6 space-y-3">
                  {role.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3">
                      <ClipboardCheck size={16} className="mt-0.5 shrink-0 text-campus-500" />
                      <span className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">{bullet}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {role.signals.map((signal) => (
                    <AccentSignal key={signal.label} label={signal.label} value={signal.value} />
                  ))}
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <div className="landing-outline-card rounded-[1.5rem] border border-gray-200/80 bg-gray-50/80 px-5 py-4 dark:border-slate-700/70 dark:bg-slate-950/82">
            <div className="flex items-center gap-3">
              <ShieldCheck size={18} className="text-campus-500" />
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Role-based access keeps data scoped correctly.</p>
            </div>
          </div>
          <div className="landing-outline-card rounded-[1.5rem] border border-gray-200/80 bg-gray-50/80 px-5 py-4 dark:border-slate-700/70 dark:bg-slate-950/82">
            <div className="flex items-center gap-3">
              <BellRing size={18} className="text-emerald-500" />
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Broadcasts and ticket updates stay tied to the actual workflow.</p>
            </div>
          </div>
          <div className="landing-outline-card rounded-[1.5rem] border border-gray-200/80 bg-gray-50/80 px-5 py-4 dark:border-slate-700/70 dark:bg-slate-950/82">
            <div className="flex items-center gap-3">
              <ChartSpline size={18} className="text-sky-500" />
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Leadership gets visible service signals before building reports.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
