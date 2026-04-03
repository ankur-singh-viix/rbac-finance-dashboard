const express = require('express');
const router = express.Router();
const { summary, categories, recent, monthly, weekly } = require('../controllers/dashboardController');
const { protect } = require('../middleware/jwtAuth');
const { requireRole } = require('../middleware/rbac');

router.use(protect);

router.get('/summary',        requireRole('viewer'), summary);
router.get('/categories',     requireRole('viewer'), categories);
router.get('/recent',         requireRole('viewer'), recent);
router.get('/trends/monthly', requireRole('viewer'), monthly);
router.get('/trends/weekly',  requireRole('viewer'), weekly);

module.exports = router;