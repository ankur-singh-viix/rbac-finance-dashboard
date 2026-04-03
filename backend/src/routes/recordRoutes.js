const express = require('express');
const router = express.Router();
const {
  getAllRecords,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord,
} = require('../controllers/recordController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');

// All record routes require authentication
router.use(authenticate);

router.get('/',       requireRole('viewer'),  getAllRecords);   // all roles
router.get('/:id',    requireRole('viewer'),  getRecordById);  // all roles
router.post('/',      requireRole('analyst'), createRecord);   // analyst+
router.patch('/:id',  requireRole('analyst'), updateRecord);   // analyst+
router.delete('/:id', requireRole('admin'),   deleteRecord);   // admin only

module.exports = router;