const Department = require('../models/Department');
const User = require('../models/User');

// @desc    Get all departments
// @route   GET /api/departments
// @access  Public or loosely restricted
exports.getDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find()
      .populate('headUser', 'name email phone')
      .populate('workers', 'name role');

    res.status(200).json({
      success: true,
      count: departments.length,
      data: departments,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new department
// @route   POST /api/departments
// @access  Private (Admin)
exports.createDepartment = async (req, res, next) => {
  try {
    const { name, headUser, workers } = req.body;

    const department = await Department.create({
      name,
      headUser,
      workers: workers || [],
    });

    // Update head user to reference this department
    if (headUser) {
      await User.findByIdAndUpdate(headUser, { department: department._id, role: 'authority' });
    }

    res.status(201).json({
      success: true,
      data: department,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update department
// @route   PATCH /api/departments/:id
// @access  Private (Admin)
exports.updateDepartment = async (req, res, next) => {
  try {
    const department = await Department.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    res.status(200).json({
      success: true,
      data: department,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete department
// @route   DELETE /api/departments/:id
// @access  Private (Admin)
exports.deleteDepartment = async (req, res, next) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);

    if (!department) {
      return res.status(404).json({ success: false, message: 'Department not found' });
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    next(err);
  }
};
