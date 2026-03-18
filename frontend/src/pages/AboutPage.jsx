import { ArrowLeft, ArrowRight, CheckCircle2, ClipboardList, Wrench } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Footer } from "../components/Landing/Footer";
import { Navbar } from "../components/Landing/Navbar";

const PRODUCT_POINTS = [
  "One place to report campus maintenance problems like broken lights, leaks, damaged furniture, or internet issues.",
  "Students can submit a ticket with location and details, then track progress from start to finish.",
  "Maintenance teams and admins can coordinate faster so issues are solved with fewer delays.",
];

const WORKFLOW_STEPS = [
  {
    title: "1. Report",
    description: "A student creates a ticket and includes what is wrong, where it is, and how urgent it is.",
  },
  {
    title: "2. Assign",
    description: "The request is sent to the right maintenance team or staff member.",
  },
  {
    title: "3. Fix",
    description: "Maintenance staff update progress while working on the issue.",
  },
  {
    title: "4. Resolve",
    description: "When the issue is fixed, the ticket is marked complete and stored for tracking.",
  },
];

const FAQS = [
  {
    question: "Who can use this system?",
    answer: "Any student can report issues, and campus maintenance or admin staff manage and resolve them.",
  },
  {
    question: "What types of issues can I report?",
    answer: "Any campus facility issue, such as plumbing, electricity, internet, furniture, classrooms, or residence hall problems.",
  },
  {
    question: "Can I check what is happening with my ticket?",
    answer: "Yes. You can follow status updates so you know if your request is new, in progress, or completed.",
  },
  {
    question: "Why was this system created?",
    answer: "To reduce confusion and delays by keeping reports, assignments, updates, and completion in one clear workflow.",
  },
];

export const AboutPage = () => {
  useEffect(() => {
    document.title = "About | CampusFix";
  }, []);

  return (
    <div className="landing-canvas min-h-screen bg-white dark:bg-slate-900">
      <Navbar
        links={[
          { label: "Product", href: "#product" },
          { label: "Workflow", href: "#workflow" },
          { label: "FAQs", href: "#faq" },
        ]}
      />

      <main className="mx-auto max-w-5xl px-5 pb-16 pt-28 sm:px-6">
        <div className="mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white/90 px-3 py-2 text-sm font-semibold text-gray-700 no-underline shadow-sm transition hover:border-campus-300 hover:text-campus-600 dark:border-slate-700 dark:bg-slate-900/80 dark:text-gray-200 dark:hover:border-campus-500 dark:hover:text-campus-300"
          >
            <ArrowLeft size={15} />
            Back to Landing
          </Link>
        </div>

        <section id="product" className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/80 sm:p-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-campus-50 px-3 py-1 text-xs font-semibold text-campus-700 dark:bg-campus-900/30 dark:text-campus-300">
            <ClipboardList size={14} />
            Product
          </div>
          <h1 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">About Campus Maintenance System</h1>
          <p className="mt-3 text-base leading-relaxed text-gray-700 dark:text-gray-300">
            Campus Maintenance System is a simple platform that helps everyone on campus report and solve maintenance issues in a clear, organized way.
          </p>
          <ul className="mt-4 space-y-3">
            {PRODUCT_POINTS.map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-300 sm:text-base">
                <CheckCircle2 size={16} className="mt-1 shrink-0 text-campus-500" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </section>

        <section id="workflow" className="mt-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/80 sm:p-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-campus-50 px-3 py-1 text-xs font-semibold text-campus-700 dark:bg-campus-900/30 dark:text-campus-300">
            <Wrench size={14} />
            Workflow
          </div>
          <h2 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">How the Workflow Works</h2>
          <p className="mt-3 text-base leading-relaxed text-gray-700 dark:text-gray-300">
            Every ticket follows the same basic lifecycle so students and staff always know what happens next.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {WORKFLOW_STEPS.map((step) => (
              <article key={step.title} className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-950/70">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">{step.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-gray-700 dark:text-gray-300">{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="faq" className="mt-8 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900/80 sm:p-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-campus-50 px-3 py-1 text-xs font-semibold text-campus-700 dark:bg-campus-900/30 dark:text-campus-300">
            FAQs
          </div>
          <h2 className="mt-3 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">Frequently Asked Questions</h2>
          <div className="mt-5 space-y-3">
            {FAQS.map((item) => (
              <details key={item.question} className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-950/70">
                <summary className="cursor-pointer list-none text-base font-semibold text-gray-900 dark:text-white">{item.question}</summary>
                <p className="mt-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300">{item.answer}</p>
              </details>
            ))}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <article id="terms-and-conditions" className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-950/70">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">Terms and Conditions</h3>
              <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                Use the system responsibly, submit accurate reports, and follow campus conduct guidelines.
              </p>
            </article>
            <article id="privacy-policy" className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-950/70">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white">Privacy Policy</h3>
              <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                Your account and ticket details are used only for campus maintenance operations and support.
              </p>
            </article>
          </div>
        </section>

        <div className="mt-8 flex justify-center">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-2xl bg-gray-950 px-6 py-3.5 text-sm font-semibold text-white no-underline shadow-xl shadow-gray-950/15 transition hover:-translate-y-0.5 hover:bg-gray-900 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100"
          >
            Get Started
            <ArrowRight size={16} />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
