const User = require('../models/User');

// @desc    Get all users (Filterable)
// @route   GET /api/users
// @access  Private (Authority/Admin)
exports.getUsers = async (req, res, next) => {
  try {
    let queryArgs = {};
    
    // Support filtering by role and department
    if (req.query.role) queryArgs.role = req.query.role;
    if (req.query.department) queryArgs.department = req.query.department;

    // Authorities can only see workers in their own department
    if (req.user.role === 'authority') {
      queryArgs.department = req.user.department;
    }

    const users = await User.find(queryArgs).populate('department', 'name');

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private (Admin)
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate('department', 'name');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update user
// @route   PATCH /api/users/:id
// @access  Private (Admin)
exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};
