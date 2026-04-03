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

router.use(authenticate);

router.get('/',       requireRole('viewer'),  getAllRecords);
router.get('/:id',    requireRole('viewer'),  getRecordById);
router.post('/',      requireRole('analyst'), createRecord);
router.patch('/:id',  requireRole('analyst'), updateRecord);
router.delete('/:id', requireRole('admin'),   deleteRecord);

module.exports = router; 