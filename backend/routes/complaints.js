const express = require('express');
const {
  createComplaint,
  getComplaints,
  getComplaint,
  assignComplaint,
  updateStatus,
  resolveComplaint,
  rateComplaint
} = require('../controllers/complaintsController');

const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.route('/')
  .post(protect, authorize('student'), upload.array('photos', 3), createComplaint)
  .get(protect, getComplaints);

router.route('/:id')
  .get(protect, getComplaint);

router.patch('/:id/assign', protect, authorize('authority', 'admin'), assignComplaint);
router.patch('/:id/status', protect, authorize('authority', 'admin'), updateStatus);
router.patch('/:id/resolve', protect, authorize('authority'), upload.single('resolutionPhoto'), resolveComplaint);
router.patch('/:id/rate', protect, authorize('student'), rateComplaint);

module.exports = router;
