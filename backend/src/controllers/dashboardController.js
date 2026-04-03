const {
  getDashboardSummary,
  getCategoryTotals,
  getRecentActivity,
  getMonthlyTrends,
  getWeeklyTrends,
} = require('../services/dashboardService');

// GET /api/dashboard/summary
const summary = (req, res) => {
  const data = getDashboardSummary();
  res.json({ success: true, data });
};

// GET /api/dashboard/categories
const categories = (req, res) => {
  const data = getCategoryTotals();
  res.json({ success: true, data });
};

// GET /api/dashboard/recent?limit=5
const recent = (req, res) => {
  const limit = parseInt(req.query.limit) || 5;
  if (limit < 1 || limit > 50)
    return res.status(400).json({
      success: false,
      message: 'limit must be between 1 and 50',
    });
  const data = getRecentActivity(limit);
  res.json({ success: true, count: data.length, data });
};

// GET /api/dashboard/trends/monthly
const monthly = (req, res) => {
  const data = getMonthlyTrends();
  res.json({ success: true, count: data.length, data });
};

// GET /api/dashboard/trends/weekly
const weekly = (req, res) => {
  const data = getWeeklyTrends();
  res.json({ success: true, count: data.length, data });
};

module.exports = { summary, categories, recent, monthly, weekly };