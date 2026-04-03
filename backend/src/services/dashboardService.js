const { RecordStore } = require('../models/Record');

const getDashboardSummary = () => {
  const records = RecordStore.getAll();

  const totalIncome = records
    .filter((r) => r.type === 'income')
    .reduce((sum, r) => sum + r.amount, 0);

  const totalExpenses = records
    .filter((r) => r.type === 'expense')
    .reduce((sum, r) => sum + r.amount, 0);

  const netBalance = totalIncome - totalExpenses;

  return {
    totalIncome: parseFloat(totalIncome.toFixed(2)),
    totalExpenses: parseFloat(totalExpenses.toFixed(2)),
    netBalance: parseFloat(netBalance.toFixed(2)),
    totalRecords: records.length,
  };
};

const getCategoryTotals = () => {
  const records = RecordStore.getAll();

  const totals = {};

  records.forEach((r) => {
    if (!totals[r.category]) {
      totals[r.category] = { income: 0, expense: 0 };
    }
    totals[r.category][r.type] += r.amount;
  });

  // Round all values
  Object.keys(totals).forEach((cat) => {
    totals[cat].income = parseFloat(totals[cat].income.toFixed(2));
    totals[cat].expense = parseFloat(totals[cat].expense.toFixed(2));
  });

  return totals;
};

const getRecentActivity = (limit = 5) => {
  const records = RecordStore.getAll();

  return [...records]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, limit);
};

const getMonthlyTrends = () => {
  const records = RecordStore.getAll();

  const trends = {};

  records.forEach((r) => {
    const date = new Date(r.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    if (!trends[key]) {
      trends[key] = { month: key, income: 0, expense: 0 };
    }
    trends[key][r.type] += r.amount;
  });

  // Round and sort chronologically
  return Object.values(trends)
    .map((t) => ({
      ...t,
      income: parseFloat(t.income.toFixed(2)),
      expense: parseFloat(t.expense.toFixed(2)),
      net: parseFloat((t.income - t.expense).toFixed(2)),
    }))
    .sort((a, b) => a.month.localeCompare(b.month));
};

const getWeeklyTrends = () => {
  const records = RecordStore.getAll();

  // Get records from last 8 weeks
  const now = new Date();
  const eightWeeksAgo = new Date(now);
  eightWeeksAgo.setDate(now.getDate() - 56);

  const recent = records.filter((r) => new Date(r.date) >= eightWeeksAgo);

  const trends = {};

  recent.forEach((r) => {
    const date = new Date(r.date);
    // Get Monday of the week
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(date.setDate(diff));
    const key = monday.toISOString().split('T')[0];

    if (!trends[key]) {
      trends[key] = { week: key, income: 0, expense: 0 };
    }
    trends[key][r.type] += r.amount;
  });

  return Object.values(trends)
    .map((t) => ({
      ...t,
      income: parseFloat(t.income.toFixed(2)),
      expense: parseFloat(t.expense.toFixed(2)),
      net: parseFloat((t.income - t.expense).toFixed(2)),
    }))
    .sort((a, b) => a.week.localeCompare(b.week));
};

module.exports = {
  getDashboardSummary,
  getCategoryTotals,
  getRecentActivity,
  getMonthlyTrends,
  getWeeklyTrends,
};