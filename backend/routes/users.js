const express = require('express');
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser
} = require('../controllers/usersController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(authorize('authority', 'admin'), getUsers);

router.route('/:id')
  .get(authorize('admin'), getUser)
  .patch(authorize('admin'), updateUser)
  .delete(authorize('admin'), deleteUser);

module.exports = router;
