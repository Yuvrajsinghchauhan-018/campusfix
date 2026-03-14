const Complaint = require('../models/Complaint');

// @desc    Create a new complaint
// @route   POST /api/complaints
// @access  Private (Student)
exports.createComplaint = async (req, res, next) => {
  try {
    const { title, description, category, priority, roomNumber, block, floor } = req.body;

    let photoUrls = [];
    if (req.files && req.files.length > 0) {
      photoUrls = req.files.map(file => `/uploads/${file.filename}`);
    }

    const complaint = await Complaint.create({
      title,
      description,
      category,
      priority,
      roomNumber,
      block,
      floor,
      photos: photoUrls,
      submittedBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      data: complaint,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all complaints
// @route   GET /api/complaints
// @access  Private (Depends on role)
exports.getComplaints = async (req, res, next) => {
  try {
    let query;

    if (req.user.role === 'student') {
      // Student sees only their own complaints
      query = Complaint.find({ submittedBy: req.user.id });
    } else if (req.user.role === 'authority') {
      // Authority sees complaints belonging to their department
      query = Complaint.find({ department: req.user.department });
    } else {
      // Admin sees all
      query = Complaint.find();
    }

    // Populate user and worker data
    query = query
      .populate('submittedBy', 'name email collegeId')
      .populate('assignedTo', 'name')
      .populate('department', 'name')
      .sort('-createdAt');

    const complaints = await query;

    res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single complaint
// @route   GET /api/complaints/:id
// @access  Private
exports.getComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('submittedBy', 'name email collegeId phone')
      .populate('assignedTo', 'name email phone')
      .populate('department', 'name');

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    // Role-based access check
    if (req.user.role === 'student' && complaint.submittedBy._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this complaint' });
    }

    if (req.user.role === 'authority' && complaint.department && complaint.department._id.toString() !== req.user.department.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized for this department' });
    }

    res.status(200).json({
      success: true,
      data: complaint,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Assign complaint to worker and set deadline
// @route   PATCH /api/complaints/:id/assign
// @access  Private (Authority/Admin)
exports.assignComplaint = async (req, res, next) => {
  try {
    let complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    const { assignedTo, deadline } = req.body;

    complaint.assignedTo = assignedTo || complaint.assignedTo;
    complaint.deadline = deadline || complaint.deadline;
    complaint.status = 'Assigned';

    await complaint.save();
    
    // Live update via socket
    req.app.get('io').to(complaint.submittedBy.toString()).emit('complaint_updated', {
      message: `Your complaint "${complaint.title}" has been assigned.`,
      complaintId: complaint._id,
      status: complaint.status
    });

    res.status(200).json({
      success: true,
      data: complaint,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update complaint status
// @route   PATCH /api/complaints/:id/status
// @access  Private (Authority/Admin)
exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    let complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    complaint.status = status;
    await complaint.save();

    // Live update via socket
    req.app.get('io').to(complaint.submittedBy.toString()).emit('complaint_updated', {
      message: `Your complaint "${complaint.title}" status is now ${status}.`,
      complaintId: complaint._id,
      status: complaint.status
    });

    res.status(200).json({
      success: true,
      data: complaint,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Resolve complaint
// @route   PATCH /api/complaints/:id/resolve
// @access  Private (Authority)
exports.resolveComplaint = async (req, res, next) => {
  try {
    const { resolutionNote } = req.body;
    let complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    complaint.status = 'Resolved';
    complaint.resolutionNote = resolutionNote;
    complaint.resolvedAt = Date.now();

    if (req.file) {
      complaint.resolutionPhoto = `/uploads/${req.file.filename}`;
    }

    await complaint.save();

    // Live update via socket
    req.app.get('io').to(complaint.submittedBy.toString()).emit('complaint_updated', {
      message: `Your complaint "${complaint.title}" has been marked as Resolved.`,
      complaintId: complaint._id,
      status: complaint.status
    });

    res.status(200).json({
      success: true,
      data: complaint,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Rate resolved complaint
// @route   PATCH /api/complaints/:id/rate
// @access  Private (Student)
exports.rateComplaint = async (req, res, next) => {
  try {
    const { rating, feedback } = req.body;
    let complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    if (complaint.submittedBy.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    complaint.rating = rating;
    complaint.feedback = feedback;
    await complaint.save();

    res.status(200).json({
      success: true,
      data: complaint,
    });
  } catch (err) {
    next(err);
  }
};
