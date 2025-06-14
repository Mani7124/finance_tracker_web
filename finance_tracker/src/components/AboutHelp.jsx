import React from "react";

const FEATURES_DOC = `Finance Tracker - Features & Instructions

Features:
- Modern, responsive finance tracker with glassmorphic UI
- Secure authentication (signup, login, logout)
- Profile with name, email, work, address, and balance reset
- Transaction Manager: add/edit/delete, recurring, multi-account, tags, undo
- Salary management with lock, monthly balance, and spent bar
- Budgets per category with progress and alerts
- Savings goals with progress tracking and wallet transfer
- Analytics: category-wise and monthly pie charts
- Export transactions as CSV (bank statement format)
- Accessible, keyboard-friendly, and mobile-ready

How to Use:
1. Sign Up: Enter your name, email, work, address, and password to create an account.
2. Set Salary: Go to Transaction Manager, enter your monthly salary, and lock it if needed.
3. Add Transactions: Enter description, amount (e.g., 500 for expense, +500 for income), category, and other details. Expenses are subtracted, incomes are added.
4. View Dashboard: See your balance, wallet, and analytics after setting salary.
5. Budgets & Savings: Set budgets per category and savings goals. Savings are moved to wallet at month end.
6. History: View, edit, or delete past transactions in a horizontal, easy-to-scan list.
7. Export CSV: Use the Export CSV button to download your transactions in spreadsheet format.
8. Profile: View your info and reset balances securely with your password.
9. Accessibility: Navigate with keyboard, use ARIA labels, and enjoy high-contrast modes.

All data is stored locally in your browser for privacy.`;

const AboutHelp = () => {
  const handleDownload = () => {
    const blob = new Blob([FEATURES_DOC], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "FinanceTracker_Features_and_Instructions.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 24 }}>
      <h2>About & Help</h2>
      <p>This is a modern finance tracker web application built with React. Use the navigation bar to access features like Dashboard, Transaction Manager, Budgets, Savings Goals, Profile, and Export CSV. For any questions or help, contact the developer.</p>
      <button onClick={handleDownload} style={{ marginTop: 16, padding: '8px 20px', borderRadius: 8, background: '#2d8cf0', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
        Download Features & Instructions
      </button>
    </div>
  );
};

export default AboutHelp;
