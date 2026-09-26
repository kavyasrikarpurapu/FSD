const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Job description is required']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'Web Development',
      'Mobile Development',
      'UI/UX Design',
      'AI & Machine Learning',
      'DevOps & Cloud',
      'Content & Copywriting',
      'Digital Marketing & SEO',
      'Data Analytics & BI',
      'Cybersecurity & Network',
      'Other'
    ],
    default: 'Web Development'
  },
  skillsRequired: [{
    type: String,
    trim: true
  }],
  budgetType: {
    type: String,
    enum: ['fixed', 'hourly'],
    default: 'fixed'
  },
  budget: {
    type: Number,
    required: [true, 'Budget amount is required'],
    min: [5, 'Budget must be at least ₹5']
  },
  experienceLevel: {
    type: String,
    enum: ['Entry Level', 'Intermediate', 'Expert'],
    default: 'Intermediate'
  },
  projectDuration: {
    type: String,
    enum: ['Less than 1 week', '1 to 4 weeks', '1 to 3 months', '3 to 6 months', 'More than 6 months'],
    default: '1 to 4 weeks'
  },
  deadline: {
    type: Date
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'completed', 'closed'],
    default: 'open'
  },
  proposalsCount: {
    type: Number,
    default: 0
  },
  hiredFreelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  contract: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contract'
  },
  featured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

jobSchema.index({ title: 'text', description: 'text', skillsRequired: 'text' });

module.exports = mongoose.model('Job', jobSchema);
