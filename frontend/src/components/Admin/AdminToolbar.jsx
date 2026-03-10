import { FileText } from "lucide-react";
import { DateRangePicker } from "../Common/DateRangePicker";
import { ExportDropdown } from "../Common/ExportDropdown";

export const AdminToolbar = ({
  dateRange,
  onDateRangeChange,
  onExport,
  onGenerateReport,
  className = "",
}) => {
  return (
    <div className={`dashboard-toolbar flex flex-wrap items-center justify-between gap-4 ${className}`}>
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
          Date range
        </p>
        <DateRangePicker value={dateRange} onChange={onDateRangeChange} />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {onGenerateReport && (
          <button type="button" onClick={onGenerateReport} className="btn-primary interactive-control">
            <FileText size={16} />
            Generate Report
          </button>
        )}
        <ExportDropdown onExport={onExport} />
      </div>
    </div>
  );
};
