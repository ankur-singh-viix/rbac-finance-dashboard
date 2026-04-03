const {
  getDashboardSummary,
  getCategoryTotals,
  getRecentActivity,
  getMonthlyTrends,
  getWeeklyTrends,
} = require('../services/dashboardService');

const summary = async (req, res) => {
  const data = await getDashboardSummary();
  res.json({ success: true, data });
};

const categories = async (req, res) => {
  const data = await getCategoryTotals();
  res.json({ success: true, data });
};

const recent = async (req, res) => {
  const limit = parseInt(req.query.limit) || 5;
  if (limit < 1 || limit > 50)
    return res.status(400).json({ success: false, message: 'limit must be between 1 and 50' });
  const data = await getRecentActivity(limit);
  res.json({ success: true, count: data.length, data });
};

const monthly = async (req, res) => {
  const data = await getMonthlyTrends();
  res.json({ success: true, count: data.length, data });
};

const weekly = async (req, res) => {
  const data = await getWeeklyTrends();
  res.json({ success: true, count: data.length, data });
};

module.exports = { summary, categories, recent, monthly, weekly };