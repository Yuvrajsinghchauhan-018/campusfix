const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a complaint title'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      minlength: [20, 'Description must be at least 20 characters'],
    },
    category: {
      type: String,
      enum: ['Electrical', 'Furniture', 'Plumbing', 'Computer', 'AC', 'Carpentry', 'Other'],
      required: [true, 'Please select a category'],
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      required: [true, 'Please select priority'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Assigned', 'In Progress', 'Resolved', 'Rejected'],
      default: 'Pending',
    },
    roomNumber: {
      type: String,
      required: [true, 'Please add a room number'],
    },
    block: {
      type: String,
      required: [true, 'Please specify block/building'],
    },
    floor: {
      type: String,
      required: [true, 'Please specify floor'],
    },
    photos: {
      type: [String],
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
    },
    deadline: {
      type: Date,
    },
    resolvedAt: {
      type: Date,
    },
    resolutionNote: {
      type: String,
    },
    resolutionPhoto: {
      type: String,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    feedback: {
      type: String,
    },
    isEscalated: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Complaint', complaintSchema);
