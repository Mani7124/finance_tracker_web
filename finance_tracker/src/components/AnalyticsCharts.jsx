import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ["#2d8cf0", "#2ecc71", "#e74c3c", "#f1c40f", "#9b59b6", "#34495e", "#fd7e14", "#00bcd4", "#ff9800", "#8bc34a", "#e91e63", "#607d8b"];

function getCategoryData(transactions) {
  const map = {};
  transactions.forEach(t => {
    if (t.amount < 0) { // Only expenses
      if (!map[t.category]) map[t.category] = 0;
      map[t.category] += Math.abs(t.amount);
    }
  });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}

function getMonthlyData(transactions) {
  const map = {};
  transactions.forEach(t => {
    if (t.amount < 0) { // Only expenses
      const d = new Date(t.date);
      const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2, '0')}`;
      if (!map[key]) map[key] = 0;
      map[key] += Math.abs(t.amount);
    }
  });
  return Object.entries(map).map(([month, value]) => ({ name: month, value }));
}

const renderCategoryLabel = ({ name, value, percent }) => (
  <span style={{ fontSize: 13, color: '#222', fontWeight: 500 }}>
    {name}: ₹{value} ({(percent * 100).toFixed(1)}%)
  </span>
);

const AnalyticsCharts = ({ transactions }) => {
  const categoryData = getCategoryData(transactions);
  const monthlyData = getMonthlyData(transactions);

  return (
    <div style={{ margin: "32px 0" }}>
      <h2>Analytics</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 32 }}>
        <div style={{ flex: 1, minWidth: 260, height: 260 }}>
          <h4>Expenses by Category</h4>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={renderCategoryLabel}
                labelLine={false}
                isAnimationActive={false}
              >
                {categoryData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name, props) => [`₹${value}`, 'Amount']} />
              <Legend layout="vertical" align="right" verticalAlign="middle" iconType="circle" formatter={(value) => <span style={{ fontSize: 13 }}>{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={{ flex: 1, minWidth: 260, height: 260 }}>
          <h4>Monthly Expense Trend</h4>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={monthlyData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, value }) => `${name}: ₹${value}`}
                labelLine={false}
                isAnimationActive={false}
              >
                {monthlyData.map((entry, idx) => (
                  <Cell key={`cell-m-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name, props) => [`₹${value}`, 'Amount']} />
              <Legend layout="vertical" align="right" verticalAlign="middle" iconType="circle" formatter={(value) => <span style={{ fontSize: 13 }}>{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;
