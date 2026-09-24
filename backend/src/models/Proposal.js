const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  freelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bidAmount: {
    type: Number,
    required: [true, 'Bid amount is required'],
    min: [5, 'Bid must be at least $5']
  },
  estimatedDays: {
    type: Number,
    required: [true, 'Estimated delivery time in days is required'],
    min: [1, 'Estimated days must be at least 1']
  },
  coverLetter: {
    type: String,
    required: [true, 'Cover letter is required'],
    minlength: [20, 'Cover letter must be at least 20 characters']
  },
  milestones: [{
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    durationDays: { type: Number }
  }],
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
    default: 'pending'
  }
}, {
  timestamps: true
});

proposalSchema.index({ job: 1, freelancer: 1 }, { unique: true });

module.exports = mongoose.model('Proposal', proposalSchema);
