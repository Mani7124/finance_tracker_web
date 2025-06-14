import React, { useState, useEffect } from "react";

const BudgetManager = ({ budgets, setBudgets, categories, transactions }) => {
  const [category, setCategory] = useState(categories[0] || "");
  const [amount, setAmount] = useState("");
  const [alert, setAlert] = useState("");

  useEffect(() => {
    // Alert if budget exceeded
    const spent = transactions.filter(t => t.category === category && t.amount < 0).reduce((a, t) => a + Math.abs(t.amount), 0);
    if (budgets[category] && spent > budgets[category]) {
      setAlert(`Budget exceeded for ${category}!`);
    } else {
      setAlert("");
    }
  }, [budgets, category, transactions]);

  const handleSetBudget = (e) => {
    e.preventDefault();
    if (!category || !amount) return;
    setBudgets({ ...budgets, [category]: parseFloat(amount) });
    setAmount("");
  };

  return (
    <div style={{ margin: "32px 0" }}>
      <h2>Budgeting</h2>
      <form onSubmit={handleSetBudget} style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <select value={category} onChange={e => setCategory(e.target.value)}>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <input
          type="number"
          placeholder="Budget Amount"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />
        <button type="submit">Set Budget</button>
      </form>
      <ul style={{ marginTop: 12 }}>
        {Object.entries(budgets).map(([cat, amt]) => (
          <li key={cat}>
            {cat}: ${amt.toFixed(2)}
            <BudgetBar
              spent={transactions.filter(t => t.category === cat && t.amount < 0).reduce((a, t) => a + Math.abs(t.amount), 0)}
              budget={amt}
            />
          </li>
        ))}
      </ul>
      {alert && <div style={{ color: "#e74c3c", marginTop: 8 }}>{alert}</div>}
    </div>
  );
};

const BudgetBar = ({ spent, budget }) => {
  const percent = Math.min(100, (spent / budget) * 100);
  return (
    <div style={{ background: "#eee", borderRadius: 6, height: 12, margin: "4px 0", width: 200 }}>
      <div style={{ width: `${percent}%`, background: percent > 100 ? "#e74c3c" : "#2ecc71", height: "100%", borderRadius: 6 }} />
    </div>
  );
};

export default BudgetManager;
