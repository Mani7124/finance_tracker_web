import React, { useState } from "react";
import "../styles/FinanceTracker.css";

const SavingsGoals = ({ goals, setGoals }) => {
  const [goalName, setGoalName] = useState("");
  const [target, setTarget] = useState("");
  const [saved, setSaved] = useState("");

  const addGoal = () => {
    if (!goalName || !target || isNaN(target) || Number(target) <= 0) return;
    setGoals([
      ...goals,
      { id: Date.now(), name: goalName, target: Number(target), saved: Number(saved) || 0 },
    ]);
    setGoalName("");
    setTarget("");
    setSaved("");
  };

  const updateSaved = (id, value) => {
    setGoals(goals.map(g => g.id === id ? { ...g, saved: Number(value) } : g));
  };

  const removeGoal = (id) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  return (
    <div className="savings-goals">
      <h2>Savings Goals</h2>
      <div className="savings-goal-form">
        <input
          type="text"
          placeholder="Goal name"
          value={goalName}
          onChange={e => setGoalName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Target amount"
          value={target}
          onChange={e => setTarget(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount saved (optional)"
          value={saved}
          onChange={e => setSaved(e.target.value)}
        />
        <button onClick={addGoal}>Add Goal</button>
      </div>
      <div className="savings-goal-list">
        {goals.length === 0 && <p>No savings goals yet.</p>}
        {goals.map(goal => (
          <div key={goal.id} className="savings-goal-item">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>{goal.name}</strong>
              <button onClick={() => removeGoal(goal.id)} style={{ fontSize: 12, marginLeft: 8 }}>Remove</button>
            </div>
            <div style={{ margin: '8px 0' }}>
              <label>Saved: </label>
              <input
                type="number"
                value={goal.saved}
                min={0}
                max={goal.target}
                onChange={e => updateSaved(goal.id, e.target.value)}
                style={{ width: 80, marginRight: 8 }}
              />
              / {goal.target}
            </div>
            <div className="savings-progress-bar">
              <div
                className="savings-progress"
                style={{ width: `${Math.min(100, (goal.saved / goal.target) * 100)}%` }}
              />
            </div>
            <div style={{ fontSize: 13, color: '#2d8cf0', marginTop: 4 }}>
              {Math.round((goal.saved / goal.target) * 100)}% reached
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavingsGoals;
