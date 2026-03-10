import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useScrollReveal } from "./useScrollReveal";

const toPhoneHref = (value) => {
    if (!value) return "";
    const normalized = value.replace(/[^\d+]/g, "");
    return normalized ? `tel:${normalized}` : "";
};

export const ContactSection = ({ config }) => {
    const [ref, visible] = useScrollReveal();
    const supportHours = (config?.supportHours && config.supportHours.trim()) || "Available during campus support hours";
    const supportPhone = (config?.supportPhone && config.supportPhone.trim()) || "+254 747988030";
    const supportTimezone = config?.supportTimezone || "Local campus time";

    return (
        <section id="contact" className="landing-section bg-white pb-8 pt-16 dark:bg-slate-900 sm:pb-10 sm:pt-20">
            <div
                ref={ref}
                className={`mx-auto max-w-5xl px-5 transition-all duration-700 sm:px-6 ${visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                    }`}
            >
                <div className="landing-panel rounded-[2rem] border border-gray-200 bg-gradient-to-br from-white via-campus-50/35 to-blue-50/70 p-7 shadow-xl shadow-campus-500/10 dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-campus-950 sm:p-10">
                    <div className="flex flex-wrap items-start justify-between gap-6">
                        <div className="max-w-2xl">
                            <p className="landing-kicker">Contact the CampusFix team</p>
                            <h2 className="mt-2 text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">Talk through rollout, support, or platform fit.</h2>
                            <p className="mt-3 text-base leading-relaxed text-gray-600 dark:text-gray-300">
                                Use the contact support workflow to ask about campus deployment, operational setup, support flow, or product questions. Include enough context for a complete response path.
                            </p>

                            <div className="mt-6 grid gap-3 sm:grid-cols-3">
                                <div className="rounded-[1.35rem] border border-gray-200/80 bg-white/88 px-4 py-3 dark:border-slate-700/70 dark:bg-slate-900/82">
                                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">Support hours</p>
                                    <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">{supportHours}</p>
                                </div>
                                <div className="rounded-[1.35rem] border border-gray-200/80 bg-white/88 px-4 py-3 dark:border-slate-700/70 dark:bg-slate-900/82">
                                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">Timezone</p>
                                    <p className="mt-2 text-sm font-semibold text-gray-900 dark:text-white">{supportTimezone}</p>
                                </div>
                                <div className="rounded-[1.35rem] border border-gray-200/80 bg-white/88 px-4 py-3 dark:border-slate-700/70 dark:bg-slate-900/82">
                                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">Support line</p>
                                    <a href={toPhoneHref(supportPhone)} className="mt-2 block text-sm font-semibold text-gray-900 no-underline transition hover:text-campus-600 dark:text-white dark:hover:text-campus-300">
                                        {supportPhone}
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="w-full max-w-xs space-y-3">
                            <Link to="/contact-support" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-campus-500 to-campus-600 px-4 py-3 text-sm font-semibold text-white no-underline transition hover:from-campus-600 hover:to-campus-700">
                                Open Contact Support
                                <ArrowRight size={16} />
                            </Link>
                            <a href="mailto:campusfixsystems@gmail.com" className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 no-underline transition hover:border-campus-300 hover:text-campus-600 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-200 dark:hover:border-campus-600 dark:hover:text-campus-300">
                                campusfixsystems@gmail.com
                            </a>
                            <p className="rounded-2xl border border-gray-200/80 bg-white/85 px-4 py-3 text-sm leading-relaxed text-gray-600 dark:border-slate-700/70 dark:bg-slate-900/82 dark:text-gray-300">
                                Best for rollout questions, operations review, and support follow-up.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
