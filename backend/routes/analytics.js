const express = require('express');
const {
  getSummary,
  getByCategory,
  getMonthly
} = require('../controllers/analyticsController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/summary', getSummary);
router.get('/by-category', getByCategory);
router.get('/monthly', getMonthly);

module.exports = router;
