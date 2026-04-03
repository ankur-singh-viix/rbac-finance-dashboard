const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const { protect } = require('../middleware/jwtAuth');
const { requireRole } = require('../middleware/rbac');

router.use(protect);

router.get('/',       requireRole('analyst'), getAllUsers);
router.get('/:id',    requireRole('analyst'), getUserById);
router.post('/',      requireRole('admin'),   createUser);
router.patch('/:id',  requireRole('admin'),   updateUser);
router.delete('/:id', requireRole('admin'),   deleteUser);

module.exports = router;