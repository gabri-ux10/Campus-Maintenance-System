import { useId, useMemo, useRef, useState } from "react";

const sanitizeCode = (value, length) => value.replace(/\D/g, "").slice(0, length);

export const OtpCodeField = ({
  label = "Verification code",
  value = "",
  onChange,
  onBlur,
  name,
  error,
  inputRef,
  length = 6,
}) => {
  const fieldId = useId();
  const errorId = useId();
  const localRef = useRef(null);
  const [focused, setFocused] = useState(false);

  const digits = useMemo(
    () => Array.from({ length }, (_, index) => value[index] || ""),
    [length, value]
  );

  const activeIndex = Math.min(value.length, length - 1);
  const focusInput = () => {
    if (localRef.current) {
      localRef.current.focus();
    }
  };

  const setRefs = (node) => {
    localRef.current = node;
    if (typeof inputRef === "function") {
      inputRef(node);
    }
  };

  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>
      <div className="relative mt-2">
        <input
          id={fieldId}
          ref={setRefs}
          name={name}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          enterKeyHint="done"
          value={value}
          onChange={(event) => onChange(sanitizeCode(event.target.value, length))}
          onPaste={(event) => {
            event.preventDefault();
            onChange(sanitizeCode(event.clipboardData.getData("text"), length));
          }}
          onFocus={() => setFocused(true)}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          className="absolute inset-0 z-10 h-full w-full cursor-text rounded-[1.7rem] opacity-0"
        />

        <div
          className={`grid grid-cols-6 gap-2 rounded-[1.7rem] border bg-white/92 p-3 transition dark:bg-slate-950/82 ${
            error
              ? "border-rose-300 ring-4 ring-rose-100/80 dark:border-rose-500/60 dark:ring-rose-500/10"
              : focused
                ? "border-campus-500 ring-4 ring-campus-100/80 dark:border-campus-400 dark:ring-campus-500/10"
                : "border-slate-200 hover:border-campus-300 dark:border-slate-700 dark:hover:border-campus-500/70"
          }`}
          onClick={focusInput}
          data-otp-field="true"
        >
          {digits.map((digit, index) => {
            const highlighted = focused && index === activeIndex;

            return (
              <div
                key={`${fieldId}-${index}`}
                className={`flex h-14 items-center justify-center rounded-2xl border text-lg font-semibold tracking-[0.22em] transition sm:h-16 ${
                  digit
                    ? "border-campus-200 bg-campus-50 text-campus-800 dark:border-campus-500/35 dark:bg-campus-500/10 dark:text-campus-100"
                    : "border-slate-200 bg-slate-50 text-slate-400 dark:border-slate-800 dark:bg-slate-900/78 dark:text-slate-500"
                } ${highlighted ? "shadow-[0_0_0_3px_rgba(29,99,237,0.15)] dark:shadow-[0_0_0_3px_rgba(96,165,250,0.18)]" : ""}`}
                data-otp-slot={index}
                data-filled={Boolean(digit)}
              >
                {digit || ""}
              </div>
            );
          })}
        </div>
      </div>
      {error ? <p id={errorId} className="mt-2 text-sm font-medium text-rose-600 dark:text-rose-300">{error}</p> : null}
    </label>
  );
};
