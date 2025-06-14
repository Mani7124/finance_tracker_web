import React, { useState, useEffect } from "react";

const TransactionForm = ({ addTransaction, editTx, updateTransaction, cancelEdit, categories }) => {
  const [text, setText] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(categories[0] || "");
  const [note, setNote] = useState("");
  const [isRecurring, setIsRecurring] = useState(false);
  const [tags, setTags] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [error, setError] = useState("");

  useEffect(() => {
    if (editTx) {
      setText(editTx.text);
      setAmount(editTx.amount);
      setCategory(editTx.category || categories[0]);
      setNote(editTx.note || "");
      setIsRecurring(editTx.isRecurring || false);
      setTags(editTx.tags ? editTx.tags.join(", ") : "");
      setDate(editTx.date || new Date().toISOString().slice(0, 10));
    } else {
      setText("");
      setAmount("");
      setCategory(categories[0]);
      setNote("");
      setIsRecurring(false);
      setTags("");
      setDate(new Date().toISOString().slice(0, 10));
    }
  }, [editTx, categories]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!text || !amount) {
      setError("Description and amount are required.");
      return;
    }
    let amt = amount;
    let txType = 'expense';
    if (typeof amt === 'string') {
      amt = amt.trim();
      if (amt.startsWith('+')) {
        txType = 'income';
        amt = amt.replace('+', '');
      } else {
        txType = 'expense';
      }
    }
    if (isNaN(amt) || Number(amt) === 0) {
      setError("Amount must be a non-zero number.");
      return;
    }
    if (!date) {
      setError("Date is required.");
      return;
    }
    const tx = {
      id: editTx ? editTx.id : Date.now(),
      text,
      amount: txType === 'income' ? Math.abs(parseFloat(amt)) : -Math.abs(parseFloat(amt)),
      category,
      note,
      isRecurring,
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
      date,
      type: txType,
    };
    if (editTx) {
      updateTransaction(tx);
    } else {
      addTransaction(tx);
    }
    setText("");
    setAmount("");
    setCategory(categories[0]);
    setNote("");
    setIsRecurring(false);
    setTags("");
    setDate(new Date().toISOString().slice(0, 10));
  };

  return (
    <form className="transaction-form" onSubmit={handleSubmit} aria-label="Transaction form">
      <label htmlFor="desc">Description</label>
      <input
        id="desc"
        type="text"
        placeholder="Description"
        aria-label="Description"
        value={text}
        onChange={(e) => setText(e.target.value)}
        required
      />
      <label htmlFor="amount">Amount</label>
      <input
        id="amount"
        type="number"
        placeholder="Amount (+ for income, - for expense)"
        aria-label="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <label htmlFor="category">Category</label>
      <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Category">
        {categories.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      <label htmlFor="date">Date</label>
      <input
        id="date"
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
        required
      />
      <label htmlFor="note">Note (optional)</label>
      <input
        id="note"
        type="text"
        placeholder="Note (optional)"
        aria-label="Note"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <label htmlFor="tags">Tags (comma separated)</label>
      <input
        id="tags"
        type="text"
        placeholder="Tags (comma separated)"
        aria-label="Tags"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <label style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <input
          type="checkbox"
          checked={isRecurring}
          onChange={(e) => setIsRecurring(e.target.checked)}
          aria-label="Recurring transaction"
        />
        Recurring
      </label>
      {error && <div style={{ color: "#e74c3c" }}>{error}</div>}
      <button type="submit" aria-label={editTx ? "Update transaction" : "Add transaction"}>{editTx ? "Update" : "Add"} Transaction</button>
      {editTx && <button type="button" onClick={cancelEdit} aria-label="Cancel edit">Cancel</button>}
    </form>
  );
};

export default TransactionForm;
