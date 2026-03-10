import { AlertCircle, CheckCircle2, Circle } from "lucide-react";

const strengthMeta = (level) => {
  if (level === "high") {
    return {
      label: "Ready",
      badge: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200",
      bar: "bg-[linear-gradient(135deg,#0f9d8a,#1d63ed)]",
    };
  }

  if (level === "medium") {
    return {
      label: "Improving",
      badge: "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200",
      bar: "bg-[linear-gradient(135deg,#d9a441,#1d63ed)]",
    };
  }

  return {
    label: "Needs work",
    badge: "border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
    bar: "bg-[linear-gradient(135deg,#d9a441,#c43d3d)]",
  };
};

export const PasswordChecklist = ({
  passwordState,
  show = false,
  emphasizeInvalid = false,
  title = "Create a strong password",
}) => {
  if (!show) {
    return null;
  }

  const requirements = passwordState.requirements || [];
  const unmetRequirements = requirements.filter((item) => !item.met);
  const metChecks = requirements.length - unmetRequirements.length;
  const totalChecks = requirements.length;
  const allMet = unmetRequirements.length === 0;
  const strength = strengthMeta(passwordState.level);
  const progress = totalChecks > 0 ? Math.max(8, Math.min(100, (metChecks / totalChecks) * 100)) : 0;
  const statusLabel = allMet
    ? "All required checks are complete."
    : `${unmetRequirements.length} ${unmetRequirements.length === 1 ? "requirement" : "requirements"} left.`;

  return (
    <section
      aria-live="polite"
      className="rounded-[1.35rem] border border-slate-200/80 bg-slate-50/92 px-4 py-4 dark:border-slate-800 dark:bg-slate-950/78 sm:px-5"
      data-password-checklist="true"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-900 dark:text-white">{title}</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{statusLabel}</p>
        </div>
        <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold shadow-sm ${strength.badge}`}>
          {strength.label}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-300 ${strength.bar}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
          {metChecks}/{totalChecks}
        </span>
      </div>

      {allMet ? (
        <div className="mt-4 flex items-start gap-3 rounded-[1rem] border border-emerald-200 bg-emerald-50/90 px-4 py-3 dark:border-emerald-500/20 dark:bg-emerald-500/10">
          <CheckCircle2 size={18} className="mt-0.5 text-emerald-600 dark:text-emerald-300" />
          <div>
            <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-100">Password is ready to use.</p>
            <p className="mt-1 text-xs leading-5 text-emerald-700 dark:text-emerald-200">
              Use the show password button if you want to verify it before continuing.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-4 rounded-[1rem] border border-white/70 bg-white/88 px-4 py-3 dark:border-slate-800 dark:bg-slate-900/72">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
            Still needed
          </p>
          <ul className="mt-3 space-y-2.5">
            {unmetRequirements.map((item) => (
              <li
                key={item.id}
                className="flex items-start gap-2.5"
                data-requirement-id={item.id}
                data-met="false"
              >
                <span className={emphasizeInvalid ? "text-rose-500 dark:text-rose-300" : "text-slate-400 dark:text-slate-500"}>
                  {emphasizeInvalid ? <AlertCircle size={16} /> : <Circle size={16} />}
                </span>
                <span className={`text-sm leading-5 ${emphasizeInvalid ? "text-rose-700 dark:text-rose-200" : "text-slate-700 dark:text-slate-200"}`}>
                  {item.label}
                </span>
              </li>
            ))}
          </ul>
          {metChecks > 0 && (
            <p className="mt-3 text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {metChecks} {metChecks === 1 ? "check is" : "checks are"} already satisfied.
            </p>
          )}
        </div>
      )}
    </section>
  );
};
