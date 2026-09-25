const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const portfolioItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  link: { type: String },
  imageUrl: { type: String },
  tags: [{ type: String }]
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['client', 'freelancer', 'admin'], default: 'freelancer' },
  avatar: { type: String, default: '' },
  title: { type: String, default: '' }, // e.g., "Full-Stack MERN & AI Specialist"
  bio: { type: String, default: '' },
  hourlyRate: { type: Number, default: 0 },
  skills: [{ type: String, trim: true }],
  category: { type: String, default: 'Web Development' },
  location: { type: String, default: 'Remote' },
  rating: {
    average: { type: Number, default: 5.0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  earnings: { type: Number, default: 0 },
  spent: { type: Number, default: 0 },
  completedProjectsCount: { type: Number, default: 0 },
  portfolio: [portfolioItemSchema],
  githubUrl: { type: String, default: '' },
  linkedinUrl: { type: String, default: '' },
  websiteUrl: { type: String, default: '' },
  phone: { type: String, default: '' },
  companyName: { type: String, default: '' },
  isVerified: { type: Boolean, default: true },
  badge: { type: String, enum: ['Top Rated', 'Rising Talent', 'Expert Pro', 'New'], default: 'New' },
  createdAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
