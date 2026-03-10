import { Clock, ExternalLink, Shield, TrendingUp } from "lucide-react";
import { useScrollReveal } from "./useScrollReveal";

const DiscordIcon = ({ className = "" }) => (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
        <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028 14.09 14.09 0 001.226-1.994.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z" />
    </svg>
);

export const AboutSection = () => {
    const [ref, visible] = useScrollReveal();

    return (
        <section id="about" className="landing-section relative bg-white py-24 dark:bg-slate-900">
            <div
                ref={ref}
                className={`mx-auto max-w-7xl px-5 transition-all duration-700 sm:px-6 ${visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                    }`}
            >
                <div className="mx-auto max-w-3xl text-center">
                    <h2 className="mt-2 text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">Built by students, aligned with operations teams</h2>
                    <p className="mt-6 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                        CampusFix started as a response to delayed maintenance updates on campus. The platform is designed to improve visibility, accountability, and response speed for everyone involved in fixing campus issues.
                    </p>
                </div>

                <div className="mx-auto mt-12 grid max-w-4xl gap-4 sm:grid-cols-3">
                    <div
                        className={`landing-surface-card rounded-2xl border border-gray-200 bg-gray-50 p-5 text-center transition-all duration-700 dark:border-slate-700 dark:bg-slate-800/70 ${visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                            }`}
                        style={{ transitionDelay: "70ms" }}
                    >
                        <Clock size={22} className="mx-auto text-campus-500" />
                        <h3 className="mt-3 text-base font-bold text-gray-900 dark:text-white">Faster response visibility</h3>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Tickets move through clear, trackable statuses.</p>
                    </div>
                    <div
                        className={`landing-surface-card rounded-2xl border border-gray-200 bg-gray-50 p-5 text-center transition-all duration-700 dark:border-slate-700 dark:bg-slate-800/70 ${visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                            }`}
                        style={{ transitionDelay: "140ms" }}
                    >
                        <Shield size={22} className="mx-auto text-campus-500" />
                        <h3 className="mt-3 text-base font-bold text-gray-900 dark:text-white">Role-based security</h3>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Access is controlled by user roles and authentication policy.</p>
                    </div>
                    <div
                        className={`landing-surface-card rounded-2xl border border-gray-200 bg-gray-50 p-5 text-center transition-all duration-700 dark:border-slate-700 dark:bg-slate-800/70 ${visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                            }`}
                        style={{ transitionDelay: "210ms" }}
                    >
                        <TrendingUp size={22} className="mx-auto text-campus-500" />
                        <h3 className="mt-3 text-base font-bold text-gray-900 dark:text-white">Continuous improvement</h3>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Operational metrics guide future feature updates.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export const CommunitySection = () => {
    const [ref, visible] = useScrollReveal();

    return (
        <section id="community" className="landing-section landing-section-muted relative overflow-hidden bg-gray-50 py-24 dark:bg-slate-950">
            <div className="absolute -right-24 top-0 h-96 w-96 rounded-full bg-campus-300/10 blur-3xl" />

            <div
                ref={ref}
                className={`relative z-10 mx-auto max-w-7xl px-5 transition-all duration-700 sm:px-6 ${visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                    }`}
            >
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="mt-2 text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">Stay connected with CampusFix</h2>
                    <p className="mt-4 text-base text-gray-600 dark:text-gray-300 sm:text-lg">
                        Join our channel to share feedback, report product issues, and follow release updates.
                    </p>

                    <a
                        href="https://discord.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group mt-8 inline-flex items-center gap-3 rounded-2xl border border-[#5865F2]/70 bg-[#5865F2] px-8 py-4 text-base font-semibold text-white no-underline shadow-xl shadow-[#5865F2]/35 transition hover:-translate-y-0.5 hover:shadow-[#5865F2]/55"
                    >
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/30">
                            <DiscordIcon className="h-5 w-5" />
                        </span>
                        Join Our Discord
                        <ExternalLink size={16} className="transition-transform group-hover:translate-x-1" />
                    </a>
                </div>
            </div>
        </section>
    );
};
