import { FileText, Shield } from "lucide-react";
import { useScrollReveal } from "./useScrollReveal";

const PRIVACY_POINTS = [
    "What we collect: account details, ticket content, attachments, and operational logs.",
    "Why we collect it: authentication, issue resolution, service reliability, and support operations.",
    "Legal basis: processing is tied to service delivery, security, and legitimate operational needs.",
    "Access controls: only authorized personnel can view protected user and ticket records.",
    "Retention: ticket and account data is kept only as long as required for operations and compliance.",
    "Sharing limits: no sale of personal data; third-party processors are limited to core service functions.",
    "Cross-system transfers: data may be processed in secure infrastructure environments with safeguards.",
    "Security practices: encryption in transit, role-based access, and audit logging are used to reduce risk.",
    "User rights: you can request access, correction, deletion, or export of eligible personal data.",
    "Breach response: security incidents are investigated and communicated under applicable obligations.",
    "Children and sensitive data: users should avoid submitting unnecessary sensitive personal information.",
    "Policy updates: material changes are reflected on this page with an updated effective date.",
];

const TERMS_POINTS = [
    "Account responsibility: keep credentials secure and do not share access tokens.",
    "Eligibility and access: accounts can be restricted, suspended, or removed for policy violations.",
    "Acceptable use: no abuse, false reports, spam, or attempts to disrupt platform operations.",
    "Ticket integrity: submissions must be accurate, lawful, and related to real campus maintenance issues.",
    "User content: by submitting ticket content, you grant rights needed to process and resolve issues.",
    "Platform changes: features and workflows may evolve as the system is improved over time.",
    "Third-party services: integrations may be subject to separate terms from external providers.",
    "Service availability: uptime targets are operational goals, not guaranteed uninterrupted service.",
    "Liability limits: the platform is provided as-is, with liability limited as allowed by law.",
    "Indemnity: misuse that causes legal or operational harm may trigger user responsibility.",
    "Termination: severe or repeated policy violations may result in account termination.",
    "Governing terms updates: continued use after updates constitutes acceptance of revised terms.",
];

export const PoliciesSection = () => {
    const [ref, visible] = useScrollReveal();

    return (
        <section id="policies" className="landing-section landing-section-muted bg-gray-50 py-24 dark:bg-slate-950">
            <div
                ref={ref}
                className={`mx-auto grid max-w-7xl gap-6 px-5 transition-all duration-700 sm:px-6 lg:grid-cols-2 ${visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                    }`}
            >
                <article id="privacy-policy" className="landing-surface-card rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-campus-100 text-campus-600 dark:bg-campus-900/40 dark:text-campus-300">
                        <FileText size={20} />
                    </div>
                    <h3 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Privacy Policy</h3>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">How CampusFix handles personal data, access rights, retention, and support usage.</p>
                    <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                        {PRIVACY_POINTS.map((point) => (
                            <li key={point} className="flex gap-2">
                                <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-campus-500" />
                                <span>{point}</span>
                            </li>
                        ))}
                    </ul>
                </article>

                <article id="terms-and-conditions" className="landing-surface-card rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
                    <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-campus-100 text-campus-600 dark:bg-campus-900/40 dark:text-campus-300">
                        <Shield size={20} />
                    </div>
                    <h3 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">Terms and Conditions</h3>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Rules for responsible usage, platform access, and policy update expectations.</p>
                    <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                        {TERMS_POINTS.map((point) => (
                            <li key={point} className="flex gap-2">
                                <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-campus-500" />
                                <span>{point}</span>
                            </li>
                        ))}
                    </ul>
                </article>
            </div>
        </section>
    );
};
