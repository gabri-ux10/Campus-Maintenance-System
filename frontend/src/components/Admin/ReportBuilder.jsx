import { useState } from "react";
import { FileText } from "lucide-react";
import { Modal } from "../Common/Modal";
import { exportToPDF, exportToCSV } from "../../services/exportService";

const REPORT_SECTIONS = [
  { key: "tickets", label: "Ticket Operations" },
  { key: "users", label: "User Directory" },
  { key: "analytics", label: "Analytics Summary" },
  { key: "sla", label: "SLA Compliance" },
  { key: "buildings", label: "Top Buildings" },
  { key: "crew", label: "Crew Performance" },
];

const FORMATS = [
  { key: "pdf", label: "PDF Report" },
  { key: "csv", label: "CSV (Data)" },
];

export const ReportBuilder = ({ open, onClose, dataSource }) => {
  const [sections, setSections] = useState(REPORT_SECTIONS.map((section) => section.key));
  const [format, setFormat] = useState("pdf");
  const [generating, setGenerating] = useState(false);

  const toggle = (key) =>
    setSections((current) => (current.includes(key) ? current.filter((item) => item !== key) : [...current, key]));

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const rows = [];
      const columns = [
        { key: "section", header: "Section" },
        { key: "metric", header: "Metric" },
        { key: "value", header: "Value" },
      ];

      if (sections.includes("tickets") && dataSource.tickets?.length) {
        const total = dataSource.tickets.length;
        const pending = dataSource.tickets.filter((ticket) => !["RESOLVED", "CLOSED", "REJECTED"].includes(ticket.status)).length;
        const resolved = dataSource.tickets.filter((ticket) => ["RESOLVED", "CLOSED"].includes(ticket.status)).length;
        rows.push({ section: "Tickets", metric: "Total", value: total });
        rows.push({ section: "Tickets", metric: "Pending", value: pending });
        rows.push({ section: "Tickets", metric: "Resolved", value: resolved });
      }

      if (sections.includes("users") && dataSource.users?.length) {
        rows.push({ section: "Users", metric: "Total Users", value: dataSource.users.length });
        const admins = dataSource.users.filter((user) => user.role === "ADMIN").length;
        const maintenance = dataSource.users.filter((user) => user.role === "MAINTENANCE").length;
        const students = dataSource.users.filter((user) => user.role === "STUDENT").length;
        rows.push({ section: "Users", metric: "Admins", value: admins });
        rows.push({ section: "Users", metric: "Maintenance Staff", value: maintenance });
        rows.push({ section: "Users", metric: "Students", value: students });
      }

      if (sections.includes("sla") && dataSource.slaOverview) {
        rows.push({ section: "SLA", metric: "Compliance", value: `${dataSource.slaOverview.compliance}%` });
        rows.push({ section: "SLA", metric: "On Track", value: dataSource.slaOverview.onTrack });
        rows.push({ section: "SLA", metric: "At Risk", value: dataSource.slaOverview.atRisk });
        rows.push({ section: "SLA", metric: "Breached", value: dataSource.slaOverview.breached });
      }

      if (sections.includes("buildings") && dataSource.topBuildings?.length) {
        dataSource.topBuildings.forEach((building, index) => {
          rows.push({ section: "Buildings", metric: `#${index + 1} ${building.building}`, value: `${building.totalIssues} issues` });
        });
      }

      if (sections.includes("crew") && dataSource.crewPerformance?.length) {
        dataSource.crewPerformance.forEach((crewMember, index) => {
          rows.push({ section: "Crew", metric: `#${index + 1} ${crewMember.fullName}`, value: `${crewMember.resolvedTickets} resolved` });
        });
      }

      if (sections.includes("analytics") && dataSource.resolution) {
        rows.push({ section: "Analytics", metric: "Avg Resolution", value: `${dataSource.resolution.overallAverageHours}h` });
      }

      const filename = `campusfix-report-${new Date().toISOString().slice(0, 10)}`;

      if (format === "pdf") {
        exportToPDF(rows, columns, filename, "CampusFix - Dashboard Report");
      } else {
        exportToCSV(rows, columns, filename);
      }
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Modal open={open} title="Generate Report" onClose={onClose}>
      <div className="space-y-5">
        <div>
          <h4 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
            Include Sections
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {REPORT_SECTIONS.map((section) => (
              <label key={section.key} className="flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 transition hover:bg-gray-50 dark:hover:bg-slate-800">
                <input
                  type="checkbox"
                  checked={sections.includes(section.key)}
                  onChange={() => toggle(section.key)}
                  className="h-4 w-4 rounded border-gray-300 accent-campus-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-200">{section.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
            Export Format
          </h4>
          <div className="flex gap-2">
            {FORMATS.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setFormat(item.key)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  format === item.key
                    ? "bg-campus-500 text-white shadow-sm"
                    : "border border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-slate-700 dark:text-gray-300 dark:hover:bg-slate-800"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          disabled={generating || sections.length === 0}
          onClick={handleGenerate}
          className="btn-primary interactive-control w-full"
        >
          <FileText size={16} />
          {generating ? "Generating..." : `Generate ${format.toUpperCase()} Report`}
        </button>
      </div>
    </Modal>
  );
};
