const Complaint = require('../models/Complaint');

// @desc    Get dashboard summary stats
// @route   GET /api/analytics/summary
// @access  Private (Admin)
exports.getSummary = async (req, res, next) => {
  try {
    const total = await Complaint.countDocuments();
    const resolved = await Complaint.countDocuments({ status: 'Resolved' });
    const pending = await Complaint.countDocuments({ status: 'Pending' });
    const escalated = await Complaint.countDocuments({ isEscalated: true });

    // Calculate average resolution rating
    const ratedComplaints = await Complaint.find({ rating: { $exists: true } });
    const avgRating = ratedComplaints.length > 0
      ? (ratedComplaints.reduce((acc, c) => acc + c.rating, 0) / ratedComplaints.length).toFixed(1)
      : 0;

    res.status(200).json({
      success: true,
      data: {
        total,
        resolved,
        pending,
        escalated,
        avgRating,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get complaints by category
// @route   GET /api/analytics/by-category
// @access  Private (Admin)
exports.getByCategory = async (req, res, next) => {
  try {
    const data = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// @desc    Get monthly complaint trends
// @route   GET /api/analytics/monthly
// @access  Private (Admin)
exports.getMonthly = async (req, res, next) => {
  try {
    const data = await Complaint.aggregate([
      { 
        $group: { 
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
