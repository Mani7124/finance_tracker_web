import React from "react";

const categoryColors = [
  "#2d8cf0", "#2ecc71", "#e74c3c", "#f1c40f", "#9b59b6", "#fd7e14", "#34495e"
];

const getCategoryColor = (cat, dark) => {
  let hash = 0;
  for (let i = 0; i < cat.length; i++) hash += cat.charCodeAt(i);
  const color = categoryColors[hash % categoryColors.length];
  // Use dark text for yellow/light backgrounds in light mode
  if (!dark && (color === '#f1c40f' || color === '#fd7e14')) return '#222';
  return color;
};

const TransactionList = ({ transactions, deleteTransaction, startEditTransaction }) => {
  const dark = document.body.classList.contains('dark');
  return (
    <div className="transaction-list" role="region" aria-label="Transaction list">
      <h2>Transactions</h2>
      <ul>
        {transactions.length === 0 && <li>No transactions yet.</li>}
        {transactions.map((t) => (
          <li key={t.id} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 16, minWidth: 320 }}>
            <span style={{ minWidth: 90, color: '#888', fontSize: '0.98em' }}>{t.date}</span>
            <span style={{ flex: 1, fontWeight: 500 }}>{t.text}</span>
            <span style={{ background: getCategoryColor(t.category, dark), color: dark ? '#fff' : '#222', borderRadius: 4, padding: '2px 8px', fontWeight: 500, marginRight: 8, minWidth: 70, textAlign: 'center' }}>{t.category}</span>
            <span style={{ fontWeight: 700, fontSize: '1.2em', color: t.amount >= 0 ? '#2ecc71' : '#e74c3c', minWidth: 70, textAlign: 'right', letterSpacing: 1 }}>
              {t.amount >= 0 ? "+" : "-"}₹{Math.abs(t.amount)}
            </span>
            {t.isRecurring && <span style={{ color: "#2d8cf0", fontSize: 13, marginLeft: 8 }}>(Recurring)</span>}
            {t.tags && t.tags.length > 0 && (
              <span style={{ fontSize: "0.95em", color: "#2d8cf0", marginLeft: 8, display: 'flex', gap: 4 }}>
                {t.tags.map(tag => (
                  <span key={tag} style={{ background: '#e3fcec', color: '#2d8cf0', borderRadius: 4, padding: '2px 6px', marginRight: 2 }}>{tag}</span>
                ))}
              </span>
            )}
            {t.note && <span style={{ fontSize: "0.95em", color: "#555", marginLeft: 8 }}>Note: {t.note}</span>}
            <button onClick={() => startEditTransaction(t)} style={{ marginLeft: 12 }} aria-label={`Edit transaction ${t.text}`}>Edit</button>
            <button onClick={() => deleteTransaction(t.id)} aria-label={`Delete transaction ${t.text}`}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionList;
