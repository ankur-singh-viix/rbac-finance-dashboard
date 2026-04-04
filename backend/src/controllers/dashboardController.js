const summary = async (req, res) => {
  try {
    const { getDashboardSummary } = require('../services/dashboardService');
    const data = await getDashboardSummary();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const categories = async (req, res) => {
  try {
    const { getCategoryTotals } = require('../services/dashboardService');
    const data = await getCategoryTotals();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const recent = async (req, res) => {
  try {
    const { getRecentActivity } = require('../services/dashboardService');
    const limit = parseInt(req.query.limit) || 5;
    if (limit < 1 || limit > 50)
      return res.status(400).json({ success: false, message: 'limit must be between 1 and 50' });
    const data = await getRecentActivity(limit);
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const monthly = async (req, res) => {
  try {
    const { getMonthlyTrends } = require('../services/dashboardService');
    const data = await getMonthlyTrends();
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const weekly = async (req, res) => {
  try {
    const { getWeeklyTrends } = require('../services/dashboardService');
    const data = await getWeeklyTrends();
    res.json({ success: true, count: data.length, data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { summary, categories, recent, monthly, weekly };