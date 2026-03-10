import { CampusFixLogo } from "../Common/CampusFixLogo.jsx";

/**
 * Animated branding panel for the immersive auth layout.
 *
 * Renders a deep-navy gradient panel with floating geometric shapes,
 * a dot-grid overlay, ambient glow orbs, and the CampusFix logo +
 * contextual title/subtitle.
 */
export const AuthBrandPanel = ({
  title = "Welcome to CampusFix",
  subtitle,
  icon: Icon,
}) => {
  return (
    <div className="auth-brand-panel flex h-full flex-col items-center justify-center px-8 py-12 lg:px-10 lg:py-16">
      {/* dot-grid overlay */}
      <div className="auth-grid-overlay auth-grid-drift" />

      {/* ── floating shapes ── */}
      {/* large translucent circle — top-right */}
      <div
        className="auth-float-1 pointer-events-none absolute right-[8%] top-[10%] h-44 w-44 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(29,99,237,0.22) 0%, rgba(29,99,237,0.04) 70%, transparent 100%)",
        }}
      />

      {/* medium teal orb — bottom-left */}
      <div
        className="auth-float-2 pointer-events-none absolute bottom-[14%] left-[10%] h-32 w-32 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(15,157,138,0.24) 0%, rgba(15,157,138,0.04) 70%, transparent 100%)",
        }}
      />

      {/* small amber accent — mid-right */}
      <div
        className="auth-float-3 pointer-events-none absolute right-[18%] top-[55%] h-20 w-20 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(245,158,11,0.2) 0%, transparent 70%)",
        }}
      />

      {/* hexagon shape — decorative, top-left area */}
      <div
        className="auth-float-2 pointer-events-none absolute left-[14%] top-[18%]"
        style={{ animationDelay: "-4s" }}
      >
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          fill="none"
          className="opacity-[0.12]"
        >
          <path
            d="M32 2L58 18V46L32 62L6 46V18L32 2Z"
            stroke="white"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      {/* diamond shape — decorative, bottom-right area */}
      <div
        className="auth-float-3 pointer-events-none absolute bottom-[22%] right-[12%]"
        style={{ animationDelay: "-8s" }}
      >
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          className="opacity-[0.1]"
        >
          <rect
            x="24"
            y="2"
            width="30"
            height="30"
            rx="3"
            transform="rotate(45 24 2)"
            stroke="white"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      {/* circle outline — decorative, mid-left */}
      <div
        className="auth-float-1 pointer-events-none absolute left-[6%] top-[58%]"
        style={{ animationDelay: "-6s" }}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          className="opacity-[0.1]"
        >
          <circle cx="20" cy="20" r="18" stroke="white" strokeWidth="1.5" />
        </svg>
      </div>

      {/* pulsing glow behind the logo */}
      <div className="auth-glow-pulse pointer-events-none absolute h-56 w-56 rounded-full bg-campus-500/15 blur-3xl" />

      {/* ── central content ── */}
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* optional task icon */}
        {Icon ? (
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/80 backdrop-blur-sm">
            <Icon size={24} />
          </div>
        ) : null}

        {/* logo */}
        {!Icon ? (
          <div className="mb-6">
            <CampusFixLogo
              variant="auth"
              motion="subtle"
              size="lg"
            />
          </div>
        ) : null}

        {/* title */}
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-[1.7rem]">
          {title}
        </h2>

        {/* subtitle */}
        {subtitle ? (
          <p className="mt-3 max-w-xs text-sm leading-6 text-slate-300/90">
            {subtitle}
          </p>
        ) : null}

        {/* decorative line */}
        <div className="mt-6 h-px w-16 bg-gradient-to-r from-transparent via-white/25 to-transparent" />

        {/* trust line */}
        <p className="mt-4 text-xs font-medium tracking-wide text-slate-400/70">
          Campus Maintenance System
        </p>
      </div>
    </div>
  );
};
