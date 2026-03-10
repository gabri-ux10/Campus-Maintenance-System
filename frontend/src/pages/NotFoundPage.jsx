import { ArrowRight, LifeBuoy } from "lucide-react";
import { Link } from "react-router-dom";
import { AuthShell } from "../components/Auth/AuthShell.jsx";

export const NotFoundPage = () => (
  <AuthShell
    sectionLabel="Page not found"
    heading="Page not found"
    description="Check the address or return to a working page."
    taskIcon={LifeBuoy}
    layout="single"
    documentTitle="Page not found"
    footer={(
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          to="/"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-[1.35rem] bg-[linear-gradient(135deg,#102033,#1d63ed)] px-4 py-3 text-sm font-semibold text-white no-underline shadow-[0_20px_40px_-24px_rgba(16,32,51,0.55)] transition hover:-translate-y-0.5"
        >
          Go home
          <ArrowRight size={16} />
        </Link>
        <Link
          to="/contact-support"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-[1.35rem] border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 no-underline transition hover:border-campus-300 hover:text-campus-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:border-campus-500 dark:hover:text-campus-200"
        >
          Contact support
        </Link>
      </div>
    )}
  >
    <div className="rounded-[1.35rem] border border-slate-200/80 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-300">
      The link may be outdated, incomplete, or no longer available.
    </div>
  </AuthShell>
);
