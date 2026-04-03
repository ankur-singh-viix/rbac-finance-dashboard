const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');

// All user routes require authentication
router.use(authenticate);

router.get('/',       requireRole('analyst'), getAllUsers);   // analyst+
router.get('/:id',    requireRole('analyst'), getUserById);  // analyst+
router.post('/',      requireRole('admin'),   createUser);   // admin only
router.patch('/:id',  requireRole('admin'),   updateUser);   // admin only
router.delete('/:id', requireRole('admin'),   deleteUser);   // admin only

module.exports = router;