import { useRef, useState } from "react";
import { Download, FileSpreadsheet, FileText } from "lucide-react";

/**
 * Export dropdown button for CSV and PDF downloads.
 *
 * @param {{ onExport: (format: "csv"|"pdf") => void, disabled?: boolean, className?: string }} props
 */
export const ExportDropdown = ({ onExport, disabled = false, className = "" }) => {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef(null);

  const handleBlur = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 180);
  };

  const handleFocus = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const choose = (format) => {
    setOpen(false);
    onExport(format);
  };

  return (
    <div
      className={`export-dropdown relative ${className}`}
      onBlur={handleBlur}
      onFocus={handleFocus}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-campus-400 hover:text-campus-600 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-gray-200 dark:hover:border-campus-500 dark:hover:text-campus-400"
      >
        <Download size={15} />
        Export
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1.5 min-w-[160px] animate-fade-in rounded-xl border border-gray-200 bg-white py-1.5 shadow-lg dark:border-slate-700 dark:bg-slate-900">
          <button
            type="button"
            onClick={() => choose("csv")}
            className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-slate-800"
          >
            <FileText size={15} className="text-emerald-500" />
            Export CSV
          </button>
          <button
            type="button"
            onClick={() => choose("pdf")}
            className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-slate-800"
          >
            <FileSpreadsheet size={15} className="text-red-500" />
            Export PDF
          </button>
        </div>
      )}
    </div>
  );
};
