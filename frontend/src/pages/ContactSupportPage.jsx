import { zodResolver } from "@hookform/resolvers/zod";
import { LifeBuoy, Mail, MessageSquareText, Send, ShieldAlert } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import { AuthShell } from "../components/Auth/AuthShell.jsx";
import { TurnstileWidget } from "../components/Auth/TurnstileWidget.jsx";
import { turnstileEnabled } from "../components/Auth/turnstileConfig.js";
import { useSupportCategoriesQuery } from "../queries/catalogQueries.js";
import { supportService } from "../services/supportService";

const supportSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name."),
  email: z.string().trim().email("Enter a valid email address."),
  supportCategoryId: z.string().trim().min(1, "Select a support category."),
  subject: z.string().trim().min(3, "Enter a short subject."),
  message: z.string().trim().min(20, "Message should be at least 20 characters."),
  captchaToken: turnstileEnabled ? z.string().min(1, "Complete the verification challenge.") : z.string().optional(),
});

const fieldClass = (hasError) =>
  `mt-2 w-full rounded-[1.35rem] border bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 dark:bg-slate-950 dark:text-white ${
    hasError
      ? "border-rose-300 ring-4 ring-rose-100/80 dark:border-rose-500/60 dark:ring-rose-500/10"
      : "border-slate-200 hover:border-slate-300 focus:border-campus-500 focus:ring-4 focus:ring-campus-100/80 dark:border-slate-700 dark:hover:border-campus-500/70 dark:focus:ring-campus-500/10"
  }`;

export const ContactSupportPage = () => {
  const supportCategoriesQuery = useSupportCategoriesQuery();
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState("");
  const [captchaRenderKey, setCaptchaRenderKey] = useState(0);

  const supportCategories = useMemo(() => supportCategoriesQuery.data ?? [], [supportCategoriesQuery.data]);
  const categoriesLoading = supportCategoriesQuery.isLoading;
  const categoriesError = supportCategoriesQuery.error?.response?.data?.message || "";

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(supportSchema),
    defaultValues: {
      fullName: "",
      email: "",
      supportCategoryId: "",
      subject: "",
      message: "",
      captchaToken: "",
    },
  });

  useEffect(() => {
    if (supportCategories.length === 0) {
      return;
    }
    setValue("supportCategoryId", String(supportCategories[0].id), {
      shouldValidate: false,
      shouldDirty: false,
    });
  }, [setValue, supportCategories]);

  const onCaptchaVerify = useCallback(
    (token) => setValue("captchaToken", token || "", { shouldValidate: true }),
    [setValue]
  );

  const onSubmit = async (values) => {
    setSubmitError("");
    setSuccess("");

    try {
      const response = await supportService.submit({
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        supportCategoryId: Number(values.supportCategoryId),
        subject: values.subject.trim(),
        message: values.message.trim(),
        captchaToken: values.captchaToken || "",
      });
      setSuccess(response?.message || "Support request submitted. Our team will reply by email.");
      reset({
        fullName: "",
        email: "",
        supportCategoryId: String(supportCategories[0]?.id || ""),
        subject: "",
        message: "",
        captchaToken: "",
      });
      setCaptchaRenderKey((current) => current + 1);
    } catch (error) {
      setSubmitError(error?.response?.data?.message || "Failed to submit support request. Please try again.");
      setValue("captchaToken", "", { shouldValidate: false });
      setCaptchaRenderKey((current) => current + 1);
    }
  };

  const supportAside = (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-slate-900 dark:text-white">Support channels</p>
        <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
          Tell us what happened and we’ll reply by email.
        </p>
      </div>

      <div className="space-y-3">
        <div className="rounded-[1.35rem] border border-slate-200/80 bg-white/78 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/60">
          <div className="flex items-start gap-3">
            <Mail size={16} className="mt-0.5 text-campus-700 dark:text-campus-300" />
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Email</p>
              <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">campusfixsystems@gmail.com</p>
            </div>
          </div>
        </div>
        <div className="rounded-[1.35rem] border border-slate-200/80 bg-white/78 px-4 py-3 dark:border-slate-800 dark:bg-slate-950/60">
          <div className="flex items-start gap-3">
            <MessageSquareText size={16} className="mt-0.5 text-campus-700 dark:text-campus-300" />
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Support window</p>
              <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">Requests are reviewed between 8:00 AM and 5:00 PM.</p>
            </div>
          </div>
        </div>
        <div className="rounded-[1.35rem] border border-amber-200/80 bg-amber-50 px-4 py-3 dark:border-amber-500/20 dark:bg-amber-500/10">
          <div className="flex items-start gap-3">
            <ShieldAlert size={16} className="mt-0.5 text-amber-700 dark:text-amber-200" />
            <div>
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-100">Privacy note</p>
              <p className="mt-1 text-sm leading-6 text-amber-700 dark:text-amber-200">Do not include passwords, one-time codes, or sensitive credentials in your message.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <AuthShell
      sectionLabel="Support"
      heading="Contact support"
      description="Tell us what happened and we’ll reply by email."
      aside={supportAside}
      taskIcon={LifeBuoy}
      layout="wide"
      documentTitle="Contact support"
      footer={(
        <div className="flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-300 sm:flex-row sm:items-center sm:justify-between">
          <p>Need the main site instead?</p>
          <Link to="/" className="font-semibold text-campus-700 no-underline hover:text-campus-800 dark:text-campus-300 dark:hover:text-campus-200">
            Back home
          </Link>
        </div>
      )}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Full name</span>
            <input
              type="text"
              {...register("fullName")}
              className={fieldClass(Boolean(errors.fullName))}
              placeholder="Enter your full name"
            />
            {errors.fullName ? <p className="mt-2 text-sm font-medium text-rose-600 dark:text-rose-300">{errors.fullName.message}</p> : null}
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Email</span>
            <input
              type="email"
              {...register("email")}
              autoComplete="email"
              autoCapitalize="none"
              spellCheck={false}
              className={fieldClass(Boolean(errors.email))}
              placeholder="you@example.com"
            />
            {errors.email ? <p className="mt-2 text-sm font-medium text-rose-600 dark:text-rose-300">{errors.email.message}</p> : null}
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Category</span>
          <select
            {...register("supportCategoryId")}
            className={fieldClass(Boolean(errors.supportCategoryId))}
            disabled={categoriesLoading || supportCategories.length === 0}
          >
            {supportCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
          {categoriesLoading ? <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Loading support categories...</p> : null}
          {categoriesError ? <p className="mt-2 text-sm font-medium text-rose-600 dark:text-rose-300">{categoriesError}</p> : null}
          {errors.supportCategoryId ? <p className="mt-2 text-sm font-medium text-rose-600 dark:text-rose-300">{errors.supportCategoryId.message}</p> : null}
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Subject</span>
          <input
            type="text"
            {...register("subject")}
            className={fieldClass(Boolean(errors.subject))}
            placeholder="Brief summary of your issue"
          />
          {errors.subject ? <p className="mt-2 text-sm font-medium text-rose-600 dark:text-rose-300">{errors.subject.message}</p> : null}
        </label>

        <label className="block">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Message</span>
          <textarea
            {...register("message")}
            className={`${fieldClass(Boolean(errors.message))} min-h-40 resize-y`}
            placeholder="Share the steps you took, what you expected, and what happened instead."
          />
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Do not include passwords, one-time codes, or other sensitive credentials.</p>
          {errors.message ? <p className="mt-2 text-sm font-medium text-rose-600 dark:text-rose-300">{errors.message.message}</p> : null}
        </label>

        <div>
          <p className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-200">Verification</p>
          <TurnstileWidget key={captchaRenderKey} onVerify={onCaptchaVerify} className="min-h-[65px]" />
          {errors.captchaToken ? <p className="mt-2 text-sm font-medium text-rose-600 dark:text-rose-300">{errors.captchaToken.message}</p> : null}
        </div>

        {submitError ? (
          <div className="rounded-[1.35rem] border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-200">
            {submitError}
          </div>
        ) : null}
        {success ? (
          <div className="rounded-[1.35rem] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200">
            {success}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting || categoriesLoading || supportCategories.length === 0}
          className="inline-flex w-full items-center justify-center gap-2 rounded-[1.35rem] bg-[linear-gradient(135deg,#102033,#1d63ed)] px-4 py-3.5 text-sm font-semibold text-white shadow-[0_20px_40px_-24px_rgba(16,32,51,0.55)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
        >
          <Send size={16} />
          {isSubmitting ? "Submitting..." : "Submit support request"}
        </button>
      </form>
    </AuthShell>
  );
};
