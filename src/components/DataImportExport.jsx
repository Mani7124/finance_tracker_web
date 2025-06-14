import React from "react";

function toCSV(transactions) {
  // Reference: typical bank statement columns
  const header = [
    "Date",
    "Description",
    "Category",
    "Amount",
    "Type",
    "Account",
    "Tags",
    "Note",
    "Recurring",
  ];
  const rows = transactions.map((t) => [
    t.date || "",
    t.text || "",
    t.category || "",
    t.amount || "",
    t.type || (t.amount >= 0 ? "Credit" : "Debit"),
    t.account || "",
    t.tags ? t.tags.join(";") : "",
    t.note || "",
    t.isRecurring ? "Yes" : "No",
  ]);
  const csv = [header, ...rows]
    .map((r) => r.map((x) => `"${String(x).replace(/"/g, '""')}"`).join(","))
    .join("\r\n");
  return csv;
}

const DataExportCSV = ({ transactions }) => {
  const handleExportCSV = () => {
    const csv = toCSV(transactions);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ margin: "32px 0" }}>
      <h2>Export CSV</h2>
      <button onClick={handleExportCSV}>Export Transactions as CSV</button>
      <div style={{ fontSize: 13, color: "#888", marginTop: 12 }}>
        The CSV will include: Date, Description, Category, Amount, Type, Account,
        Tags, Note, Recurring.
        <br />
        You can open it in Excel or Google Sheets.
      </div>
    </div>
  );
};

export default DataExportCSV;
