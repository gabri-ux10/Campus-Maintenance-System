import { useMemo, useRef, useState } from "react";
import { CalendarDays, ChevronDown } from "lucide-react";

const PRESETS = [
    { label: "Last 7 days", days: 7 },
    { label: "Last 30 days", days: 30 },
    { label: "Last 90 days", days: 90 },
    { label: "This month", days: "month" },
    { label: "All time", days: null },
];

function startOfMonth() {
    const d = new Date();
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
}

function daysAgo(n) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    d.setHours(0, 0, 0, 0);
    return d;
}

function formatShort(date) {
    if (!date) return "";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/**
 * @param {{ value: { from: Date|null, to: Date|null }, onChange: (range: { from: Date|null, to: Date|null }) => void, className?: string }} props
 */
export const DateRangePicker = ({ value, onChange, className = "" }) => {
    const [open, setOpen] = useState(false);
    const [customMode, setCustomMode] = useState(false);
    const [customFrom, setCustomFrom] = useState("");
    const [customTo, setCustomTo] = useState("");
    const timeoutRef = useRef(null);

    const handleBlur = () => {
        timeoutRef.current = setTimeout(() => { setOpen(false); setCustomMode(false); }, 200);
    };
    const handleFocus = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    const selectPreset = (preset) => {
        if (preset.days === null) {
            onChange({ from: null, to: null });
        } else if (preset.days === "month") {
            onChange({ from: startOfMonth(), to: new Date() });
        } else {
            onChange({ from: daysAgo(preset.days), to: new Date() });
        }
        setOpen(false);
        setCustomMode(false);
    };

    const applyCustom = () => {
        if (customFrom && customTo) {
            onChange({
                from: new Date(customFrom),
                to: new Date(customTo + "T23:59:59"),
            });
            setOpen(false);
            setCustomMode(false);
        }
    };

    const displayLabel = useMemo(() => {
        if (!value?.from && !value?.to) return "All time";
        if (value.from && value.to) return `${formatShort(value.from)} – ${formatShort(value.to)}`;
        return "Custom range";
    }, [value]);

    return (
        <div
            className={`relative ${className}`}
            onBlur={handleBlur}
            onFocus={handleFocus}
        >
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:border-campus-400 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-200 dark:hover:border-campus-500"
            >
                <CalendarDays size={15} className="text-gray-400" />
                <span className="max-w-[180px] truncate">{displayLabel}</span>
                <ChevronDown size={14} className="text-gray-400" />
            </button>

            {open && (
                <div className="absolute left-0 top-full z-50 mt-1.5 min-w-[220px] animate-fade-in rounded-xl border border-gray-200 bg-white py-1.5 shadow-lg dark:border-slate-700 dark:bg-slate-900">
                    {PRESETS.map((preset) => (
                        <button
                            key={preset.label}
                            type="button"
                            onClick={() => selectPreset(preset)}
                            className="flex w-full items-center px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-slate-800"
                        >
                            {preset.label}
                        </button>
                    ))}
                    <div className="mx-3 my-1.5 border-t border-gray-100 dark:border-slate-700" />
                    {!customMode ? (
                        <button
                            type="button"
                            onClick={() => setCustomMode(true)}
                            className="flex w-full items-center px-4 py-2 text-sm font-medium text-campus-600 transition hover:bg-gray-50 dark:text-campus-400 dark:hover:bg-slate-800"
                        >
                            Custom range…
                        </button>
                    ) : (
                        <div className="space-y-2 px-4 py-2">
                            <input
                                type="date"
                                value={customFrom}
                                onChange={(e) => setCustomFrom(e.target.value)}
                                className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-gray-200"
                            />
                            <input
                                type="date"
                                value={customTo}
                                onChange={(e) => setCustomTo(e.target.value)}
                                className="w-full rounded-lg border border-gray-200 px-2.5 py-1.5 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-gray-200"
                            />
                            <button
                                type="button"
                                onClick={applyCustom}
                                disabled={!customFrom || !customTo}
                                className="w-full rounded-lg bg-campus-500 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-campus-600 disabled:opacity-50"
                            >
                                Apply
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
