import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function exportToCSV(data, columns, filename = "export") {
  if (!data?.length) return;

  const header = columns.map((column) => column.header || column.key);
  const rows = data.map((row) =>
    columns.map((column) => {
      const value = typeof column.accessor === "function" ? column.accessor(row) : row[column.key];
      const text = String(value ?? "");
      return text.includes(",") || text.includes('"') ? `"${text.replace(/"/g, '""')}"` : text;
    })
  );

  const csv = [header.join(","), ...rows.map((row) => row.join(","))].join("\n");
  downloadBlob(csv, `${filename}.csv`, "text/csv;charset=utf-8;");
}

export function exportToPDF(data, columns, filename = "export", title = "Report") {
  if (!data?.length) return;

  const doc = new jsPDF({ orientation: "landscape" });

  doc.setFontSize(18);
  doc.setTextColor(14, 165, 233);
  doc.text("CampusFix", 14, 16);

  doc.setFontSize(12);
  doc.setTextColor(51, 65, 85);
  doc.text(title, 14, 26);

  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 32);

  const head = [columns.map((column) => column.header || column.key)];
  const body = data.map((row) =>
    columns.map((column) => {
      const value = typeof column.accessor === "function" ? column.accessor(row) : row[column.key];
      return String(value ?? "");
    })
  );

  autoTable(doc, {
    startY: 38,
    head,
    body,
    styles: {
      fontSize: 8,
      cellPadding: 3,
      lineColor: [226, 232, 240],
      lineWidth: 0.1,
    },
    headStyles: {
      fillColor: [14, 165, 233],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      halign: "left",
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { left: 14, right: 14 },
  });

  doc.save(`${filename}.pdf`);
}

function downloadBlob(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
