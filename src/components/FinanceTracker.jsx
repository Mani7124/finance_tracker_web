import React, { useState, useEffect } from "react";
import TransactionForm from "./TransactionForm";
import TransactionList from "./TransactionList";
import BalanceSummary from "./BalanceSummary";
import AnalyticsCharts from "./AnalyticsCharts";
import BudgetManager from "./BudgetManager";
import DataImportExport from "./DataImportExport";
import SavingsGoals from "./SavingsGoals";

const defaultCategories = [
  "Food",
  "Rent",
  "Salary",
  "Shopping",
  "Bills",
  "Other",
];

const FinanceTracker = ({ only }) => {
  const [accounts, setAccounts] = useState(() => {
    const saved = localStorage.getItem("accounts");
    return saved ? JSON.parse(saved) : [{ id: "main", name: "Main Account" }, { id: "wallet", name: "Wallet" }];
  });
  const [selectedAccount, setSelectedAccount] = useState(accounts[0].id);
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("transactions");
    return saved ? JSON.parse(saved) : [];
  });
  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem("budgets");
    return saved ? JSON.parse(saved) : {};
  });
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem("categories");
    return saved ? JSON.parse(saved) : defaultCategories;
  });
  const [editTx, setEditTx] = useState(null);
  const [newCategory, setNewCategory] = useState("");
  const [undoStack, setUndoStack] = useState([]);
  const [salary, setSalary] = useState(() => {
    const saved = localStorage.getItem("salary");
    return saved ? JSON.parse(saved) : 0;
  });
  const [salaryLocked, setSalaryLocked] = useState(() => {
    const saved = localStorage.getItem("salaryLocked");
    return saved ? JSON.parse(saved) : false;
  });
  // Track wallet balance
  const [wallet, setWallet] = useState(() => {
    const saved = localStorage.getItem("walletBalance");
    return saved ? JSON.parse(saved) : 0;
  });
  useEffect(() => {
    localStorage.setItem("walletBalance", JSON.stringify(wallet));
  }, [wallet]);

  // Get savings goals
  const [savingsGoals, setSavingsGoals] = useState(() => {
    const saved = localStorage.getItem("savingsGoals");
    return saved ? JSON.parse(saved) : [];
  });
  useEffect(() => {
    localStorage.setItem("savingsGoals", JSON.stringify(savingsGoals));
  }, [savingsGoals]);

  // Track if user has set salary for the first time
  const [firstSalarySet, setFirstSalarySet] = useState(() => {
    const saved = localStorage.getItem("firstSalarySet");
    return saved ? JSON.parse(saved) : false;
  });
  // Ensure salary changes trigger dashboard update by using a key
  const [salaryKey, setSalaryKey] = useState(0);
  useEffect(() => {
    if (salary > 0) {
      if (!firstSalarySet) {
        setFirstSalarySet(true);
      }
      localStorage.setItem("firstSalarySet", "true");
    } else {
      setFirstSalarySet(false);
      localStorage.setItem("firstSalarySet", "false");
    }
    setSalaryKey(k => k + 1); // force re-render on salary change
  }, [salary, firstSalarySet]);

  useEffect(() => {
    localStorage.setItem("accounts", JSON.stringify(accounts));
  }, [accounts]);
  useEffect(() => {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }, [transactions]);
  useEffect(() => {
    localStorage.setItem("budgets", JSON.stringify(budgets));
  }, [budgets]);
  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [categories]);
  useEffect(() => {
    localStorage.setItem("salary", JSON.stringify(salary));
  }, [salary]);
  useEffect(() => {
    localStorage.setItem("salaryLocked", JSON.stringify(salaryLocked));
  }, [salaryLocked]);

  const [toast, setToast] = useState("");

  // Toast auto-hide
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(""), 2200);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const addTransaction = (transaction) => {
    setTransactions([{ ...transaction, account: selectedAccount }, ...transactions]);
    setToast("Transaction added!");
  };

  const updateTransaction = (updatedTx) => {
    setTransactions(transactions.map((t) => (t.id === updatedTx.id ? updatedTx : t)));
    setEditTx(null);
    setToast("Transaction updated!");
  };

  const handleSalaryChange = (val) => {
    if (val < 0) {
      setToast("Salary cannot be negative.");
      return;
    }
    setSalary(val);
    setToast("Salary updated!");
  };

  const deleteTransaction = (id) => {
    const tx = transactions.find((t) => t.id === id);
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      setUndoStack([{ type: "delete", tx }, ...undoStack]);
      setTransactions(transactions.filter((t) => t.id !== id));
    }
  };

  const undo = () => {
    if (undoStack.length === 0) return;
    const last = undoStack[0];
    if (last.type === "delete") {
      setTransactions([last.tx, ...transactions]);
    }
    setUndoStack(undoStack.slice(1));
  };

  const startEditTransaction = (tx) => setEditTx(tx);

  // Filter transactions for selected account
  const filteredTx = transactions.filter((t) => t.account === selectedAccount);

  // Add category
  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory("");
    }
  };
  const handleRemoveCategory = (cat) => {
    if (transactions.some(t => t.category === cat)) {
      if (!window.confirm("This category is used in transactions. Remove anyway?")) return;
    }
    setCategories(categories.filter((c) => c !== cat));
  };

  // Calculate current month only for salary and balance
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const monthTx = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });
  const totalIncome = monthTx.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0);
  const totalExpense = monthTx.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0);
  const salaryBalance = salary + totalIncome - totalExpense;

  // Dashboard content: summary and charts only
  if (only === "dashboard") {
    return (
      <div className="finance-tracker" key={salaryKey}>
        {firstSalarySet ? (
          <>
            <BalanceSummary transactions={filteredTx} />
            <div style={{ margin: '16px 0', fontSize: 18, fontWeight: 600 }}>
              Wallet Balance: <span style={{ color: '#2d8cf0' }}>₹{wallet}</span>
            </div>
            <AnalyticsCharts transactions={filteredTx} />
          </>
        ) : (
          <div style={{ fontSize: 18, color: '#888', margin: '32px 0' }}>
            Please set your salary to start tracking your finances.
          </div>
        )}
      </div>
    );
  }

  // Transaction Manager: add/edit transactions
  if (only === "transaction") {
    return (
      <div className="finance-tracker">
        {toast && <div className="toast-message">{toast}</div>}
        <div className="salary-setter" style={{ marginBottom: 24 }}>
          <label htmlFor="salary-input"><strong>Set Monthly Salary:</strong></label>
          <input
            id="salary-input"
            type="number"
            min="0"
            value={salary}
            onChange={e => handleSalaryChange(Number(e.target.value))}
            style={{ marginLeft: 8, width: 120 }}
            disabled={salaryLocked}
          />
          <button
            className="salary-lock-btn"
            style={{ marginLeft: 8, padding: '2px 10px', fontSize: 14, borderRadius: 6, border: '1px solid #2d8cf0', background: salaryLocked ? '#2d8cf0' : '#fff', color: salaryLocked ? '#fff' : '#2d8cf0', cursor: 'pointer', transition: 'all 0.2s' }}
            onClick={() => setSalaryLocked(l => !l)}
            aria-label={salaryLocked ? 'Unlock salary input' : 'Lock salary input'}
            title={salaryLocked ? 'Unlock salary input' : 'Lock salary input'}
          >
            {salaryLocked ? '🔒' : '🔓'}
          </button>
          <div style={{ marginTop: 8, fontSize: 15 }}>
            <span>Salary: <strong>₹{salary}</strong></span> | <span>Income: <strong style={{ color: '#2d8cf0' }}>₹{totalIncome}</strong></span> | <span>Spent: <strong style={{ color: '#e74c3c' }}>₹{totalExpense}</strong></span> | <span>Balance: <strong style={{ color: '#2ecc71' }}>₹{salaryBalance}</strong></span>
          </div>
        </div>
        {/* Salary spent bar only in transaction manager */}
        {firstSalarySet && (
          <div style={{ margin: '12px 0 24px 0' }}>
            <div style={{ fontSize: 15, marginBottom: 4 }}>Salary Spent This Month</div>
            <div className="salary-spent-bar">
              <div
                className="salary-spent-bar-fill"
                style={{ width: `${Math.min(100, (totalExpense / (salary + totalIncome)) * 100)}%` }}
              />
              <span style={{ position: 'absolute', left: 8, top: -2, fontSize: 13, color: '#e74c3c' }}>
                ₹{totalExpense} / ₹{salary + totalIncome}
              </span>
            </div>
          </div>
        )}
        <TransactionForm
          addTransaction={addTransaction}
          editTx={editTx}
          updateTransaction={updateTransaction}
          cancelEdit={() => setEditTx(null)}
          categories={categories}
        />
        <div style={{ marginTop: 24 }}>
          <label htmlFor="account-select">Account: </label>
          <select
            id="account-select"
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
          >
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>{acc.name}</option>
            ))}
          </select>
        </div>
        <div style={{ marginTop: 16 }}>
          <label>Categories: </label>
          {categories.map((cat) => (
            <span key={cat} style={{ marginRight: 8 }}>
              {cat} <button onClick={() => handleRemoveCategory(cat)} style={{ fontSize: 10 }}>x</button>
            </span>
          ))}
          <input
            type="text"
            placeholder="Add category"
            value={newCategory}
            onChange={e => setNewCategory(e.target.value)}
            style={{ marginLeft: 8 }}
          />
          <button onClick={handleAddCategory} style={{ fontSize: 12 }}>Add</button>
        </div>
      </div>
    );
  }

  // History: only transaction history
  if (only === "history") {
    return (
      <div className="finance-tracker">
        <TransactionList
          transactions={filteredTx}
          deleteTransaction={deleteTransaction}
          startEditTransaction={startEditTransaction}
        />
        <div style={{ marginBottom: 8, textAlign: "right" }}>
          <button onClick={undo} disabled={undoStack.length === 0} style={{ background: '#f1c40f', color: '#222', border: 'none', borderRadius: 4, padding: '4px 12px', cursor: 'pointer' }}>Undo Delete</button>
        </div>
      </div>
    );
  }

  // fallback: show dashboard
  return (
    <div className="finance-tracker">
      <BalanceSummary transactions={filteredTx} />
      <AnalyticsCharts transactions={filteredTx} />
    </div>
  );
};

export default FinanceTracker;
