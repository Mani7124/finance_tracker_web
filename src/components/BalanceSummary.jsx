import React from "react";

const BalanceSummary = ({ transactions }) => {
  const amounts = transactions.map((t) => t.amount);
  const income = amounts.filter((a) => a > 0).reduce((a, b) => a + b, 0);
  const expense = amounts.filter((a) => a < 0).reduce((a, b) => a + b, 0);
  const balance = income + expense;
  const recent = transactions.slice(0, 5);

  return (
    <div className="balance-summary">
      <h2>Balance: ${balance.toFixed(2)}</h2>
      <div className="summary-details">
        <div className="income">Income: ${income.toFixed(2)}</div>
        <div className="expense">Expense: ${Math.abs(expense).toFixed(2)}</div>
      </div>
      <div style={{ marginTop: 16, textAlign: "left" }}>
        <h3 style={{ fontSize: "1.1em", margin: "8px 0" }}>Recent Transactions</h3>
        <ul style={{ paddingLeft: 16 }}>
          {recent.length === 0 && <li>No recent transactions.</li>}
          {recent.map((t) => (
            <li key={t.id}>
              <span>{t.text} </span>
              <span style={{ color: t.amount >= 0 ? '#2ecc71' : '#e74c3c' }}>
                {t.amount >= 0 ? "+" : "-"}${Math.abs(t.amount)}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BalanceSummary;
