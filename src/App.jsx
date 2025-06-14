import React, { useEffect, useState } from "react";
import FinanceTracker from "./components/FinanceTracker";
import OnboardingTour from "./components/OnboardingTour";
import { AuthProvider, useAuth } from "./components/AuthContext";
import AuthForm from "./components/AuthForm";
import AnalyticsCharts from "./components/AnalyticsCharts";
import BudgetManager from "./components/BudgetManager";
import DataImportExport from "./components/DataImportExport";
import AboutHelp from "./components/AboutHelp";
import "./styles/FinanceTracker.css";
import SavingsGoals from "./components/SavingsGoals";

function MainApp() {
  const [dark, setDark] = useState(() => localStorage.getItem("darkMode") === "true");
  const [section, setSection] = useState("dashboard");
  useEffect(() => {
    document.body.classList.toggle("dark", dark);
    localStorage.setItem("darkMode", dark);
  }, [dark]);
  const { user } = useAuth();
  return (
    <div className="App">
      <OnboardingTour />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
        <h1>Finance Tracker</h1>
        <button onClick={() => setDark((d) => !d)} style={{ marginLeft: 16 }}>
          {dark ? "\ud83c\udf19 Dark" : "\u2600\ufe0f Light"}
        </button>
      </div>
      {user ? (
        <>
          <nav style={{ display: 'flex', gap: 12, justifyContent: 'center', margin: '16px 0' }}>
            <button className={section === 'dashboard' ? 'active' : ''} onClick={() => setSection('dashboard')}>Dashboard</button>
            <button className={section === 'transaction' ? 'active' : ''} onClick={() => setSection('transaction')}>Transaction Manager</button>
            <button className={section === 'history' ? 'active' : ''} onClick={() => setSection('history')}>History</button>
            <button className={section === 'budgets' ? 'active' : ''} onClick={() => setSection('budgets')}>Budgets</button>
            <button className={section === 'savings' ? 'active' : ''} onClick={() => setSection('savings')}>Savings Goals</button>
            <button className={section === 'profile' ? 'active' : ''} onClick={() => setSection('profile')}>Profile</button>
            <button className={section === 'importexport' ? 'active' : ''} onClick={() => setSection('importexport')}>Export CSV</button>
            <button className={section === 'about' ? 'active' : ''} onClick={() => setSection('about')}>About/Help</button>
          </nav>
          {section === 'dashboard' && <FinanceTracker only="dashboard" />}
          {section === 'transaction' && <FinanceTracker only="transaction" />}
          {section === 'history' && <FinanceTracker only="history" />}
          {section === 'budgets' && <BudgetManagerWrapper />}
          {section === 'savings' && <SavingsGoalWrapper />}
          {section === 'profile' && <ProfileSection />}
          {section === 'importexport' && <DataImportExportWrapper />}
          {section === 'about' && <AboutHelp />}
        </>
      ) : <AuthForm />}
    </div>
  );
}

function BudgetManagerWrapper() {
  const tx = JSON.parse(localStorage.getItem("transactions") || "[]");
  const budgets = JSON.parse(localStorage.getItem("budgets") || "{}" );
  const categories = JSON.parse(localStorage.getItem("categories") || '["Food","Rent","Salary","Shopping","Bills","Other"]');
  return <BudgetManager budgets={budgets} setBudgets={()=>{}} categories={categories} transactions={tx} />;
}
function DataImportExportWrapper() {
  const [transactions] = useState(() => JSON.parse(localStorage.getItem("transactions") || "[]"));
  return <DataImportExport transactions={transactions} />;
}
function ProfileSection() {
  const { user, logout } = useAuth();
  const [loggedOut, setLoggedOut] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetPwd, setResetPwd] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");

  useEffect(() => {
    if (loggedOut) {
      window.location.reload(); // Forces re-render to show login page
    }
  }, [loggedOut]);

  // Reset balance handler
  const handleResetBalance = () => {
    setResetError("");
    setResetSuccess("");
    // Get user from localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const found = users.find(u => u.email === user.email && u.password === resetPwd);
    if (!found) {
      setResetError("Incorrect password.");
      return;
    }
    // Reset all balances
    localStorage.setItem("salary", "0");
    localStorage.setItem("walletBalance", "0");
    localStorage.setItem("transactions", "[]");
    setResetSuccess("Balance reset successfully!");
    setTimeout(() => setShowReset(false), 1200);
  };

  return (
    <div style={{ textAlign: 'center', margin: 32 }}>
      <h2>Profile</h2>
      <p><strong>Name:</strong> {user?.name || '-'}</p>
      <p><strong>Email:</strong> {user?.email}</p>
      <p><strong>Work:</strong> {user?.work || '-'}</p>
      <p><strong>Address:</strong> {user?.address || '-'}</p>
      <button onClick={() => { logout(); setLoggedOut(true); }}>Logout</button>
      <button style={{ marginLeft: 16, background: '#f1c40f', color: '#222', border: 'none', borderRadius: 6, padding: '6px 16px', cursor: 'pointer' }} onClick={() => setShowReset(true)}>
        Reset Balance
      </button>
      {showReset && (
        <div style={{ background: '#fff', color: '#222', border: '1.5px solid #2d8cf0', borderRadius: 10, padding: 24, margin: '24px auto', maxWidth: 320, boxShadow: '0 2px 12px rgba(45,140,240,0.08)', position: 'relative', zIndex: 10 }}>
          <h3>Reset Balance</h3>
          <p>Enter your password to confirm:</p>
          <input
            type="password"
            value={resetPwd}
            onChange={e => setResetPwd(e.target.value)}
            placeholder="Password"
            style={{ width: '90%', marginBottom: 8 }}
          />
          <div>
            <button onClick={handleResetBalance} style={{ background: '#2d8cf0', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 16px', marginRight: 8 }}>Confirm</button>
            <button onClick={() => setShowReset(false)} style={{ background: '#eee', color: '#222', border: 'none', borderRadius: 6, padding: '6px 16px' }}>Cancel</button>
          </div>
          {resetError && <div style={{ color: '#e74c3c', marginTop: 8 }}>{resetError}</div>}
          {resetSuccess && <div style={{ color: '#2ecc71', marginTop: 8 }}>{resetSuccess}</div>}
        </div>
      )}
    </div>
  );
}
function SavingsGoalWrapper() {
  const [goals, setGoals] = useState(() => JSON.parse(localStorage.getItem("savingsGoals") || "[]"));
  useEffect(() => { localStorage.setItem("savingsGoals", JSON.stringify(goals)); }, [goals]);
  return <SavingsGoals goals={goals} setGoals={setGoals} />;
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
