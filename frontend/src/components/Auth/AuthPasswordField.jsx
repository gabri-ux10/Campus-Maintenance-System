import { Eye, EyeOff } from "lucide-react";
import { useId, useState } from "react";

export const AuthPasswordField = ({
  label,
  error,
  registration,
  autoComplete,
  placeholder = "Enter password",
}) => {
  const [visible, setVisible] = useState(false);
  const errorId = useId();

  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>
      <div className={`mt-2 flex items-center rounded-2xl border bg-white px-4 py-1 transition dark:bg-slate-950 ${error ? "border-rose-300 ring-4 ring-rose-100/80 dark:border-rose-500/60 dark:ring-rose-500/10" : "border-slate-200 hover:border-campus-300 focus-within:border-campus-500 focus-within:ring-4 focus-within:ring-campus-100/80 dark:border-slate-700 dark:hover:border-campus-500/70 dark:focus-within:ring-campus-500/10"}`}>
        <input
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className="w-full bg-transparent py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
          {...registration}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          title={visible ? "Hide password" : "Show password"}
          className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-900 dark:hover:text-slate-200"
        >
          {visible ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
      {error ? <p id={errorId} className="mt-2 text-sm font-medium text-rose-600 dark:text-rose-300">{error}</p> : null}
    </label>
  );
};
