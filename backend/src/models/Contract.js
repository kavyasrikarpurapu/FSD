const mongoose = require('mongoose');

const contractSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  proposal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Proposal',
    required: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  freelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'submitted', 'completed', 'cancelled'],
    default: 'active'
  },
  milestones: [{
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'submitted', 'paid'],
      default: 'pending'
    }
  }],
  submissionNotes: {
    type: String,
    default: ''
  },
  submissionLink: {
    type: String,
    default: ''
  },
  submittedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  },
  clientReviewed: {
    type: Boolean,
    default: false
  },
  freelancerReviewed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Contract', contractSchema);
