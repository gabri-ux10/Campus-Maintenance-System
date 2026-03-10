import { ChevronDown } from "lucide-react";
import { useScrollReveal } from "./useScrollReveal";

const FAQS = [
    {
        question: "Is CampusFix built only for students?",
        answer:
            "No. Students report issues, maintenance teams work assigned jobs, and administrators coordinate queue health, SLA pressure, users, and broadcasts.",
    },
    {
        question: "What does the platform give campus operations leaders?",
        answer:
            "Operations leaders get backlog visibility, assignment control, SLA awareness, reporting scope, and communication tools in one command layer.",
    },
    {
        question: "Can maintenance teams update work directly from their queue?",
        answer:
            "Yes. Assigned staff can review context, add work notes, upload after-work photos, and update ticket status as repairs progress.",
    },
    {
        question: "How does CampusFix help reduce unclear handoffs?",
        answer:
            "Structured intake, assignment context, status history, and completion evidence keep the full workflow attached to the same ticket record.",
    },
    {
        question: "How often do the public landing metrics refresh?",
        answer: "The public landing analytics sync automatically every 20 seconds when backend data is available.",
    },
    {
        question: "Who can see analytics and administrative controls?",
        answer:
            "Administrative analytics and management controls are restricted by role-based access, while students see their own request history and progress.",
    },
    {
        question: "How is platform and user data handled?",
        answer:
            "Data is used for account management, support operations, and ticket workflows. Only authorized users can access protected records.",
    },
    {
        question: "How do I contact the CampusFix team?",
        answer:
            "Use the Contact Support page to submit rollout, support, or product questions with enough operational context for a complete response.",
    },
];

export const FAQSection = () => {
    const [ref, visible] = useScrollReveal();

    return (
        <section id="faq" className="landing-section bg-white py-24 dark:bg-slate-900">
            <div
                ref={ref}
                className={`mx-auto max-w-4xl px-5 transition-all duration-700 sm:px-6 ${visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                    }`}
            >
                <div className="text-center">
                    <p className="landing-kicker">FAQ</p>
                    <h2 className="mt-2 text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">Frequently asked questions</h2>
                    <p className="mx-auto mt-4 max-w-2xl text-base text-gray-600 dark:text-gray-300 sm:text-lg">
                        Common questions from campus operations teams evaluating how CampusFix works.
                    </p>
                </div>

                <div className="mt-10 space-y-3">
                    {FAQS.map((faq) => (
                        <details key={faq.question} className="landing-surface-card group rounded-2xl border border-gray-200 bg-white p-5 shadow-sm open:border-campus-300 open:bg-campus-50/40 dark:border-slate-700 dark:bg-slate-900 dark:open:border-campus-700 dark:open:bg-campus-900/15">
                            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-base font-semibold text-gray-900 dark:text-white">
                                {faq.question}
                                <ChevronDown size={18} className="shrink-0 transition-transform group-open:rotate-180" />
                            </summary>
                            <p className="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{faq.answer}</p>
                        </details>
                    ))}
                </div>
            </div>
        </section>
    );
};
