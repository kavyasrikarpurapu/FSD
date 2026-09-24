const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '30d'
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, title, bio, hourlyRate, skills, category, location, phone, companyName } = req.body;

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    // Default avatar generation based on name
    const avatar = req.body.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: role || 'freelancer',
      avatar,
      title: title || (role === 'freelancer' ? 'Professional Freelancer' : 'Project Owner'),
      bio: bio || '',
      hourlyRate: Number(hourlyRate) || 0,
      skills: Array.isArray(skills) ? skills : (skills ? skills.split(',').map(s => s.trim()) : []),
      category: category || 'Web Development',
      location: location || 'Remote',
      phone: phone || '',
      companyName: companyName || '',
      badge: role === 'freelancer' ? 'New' : undefined
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        title: user.title,
        bio: user.bio,
        hourlyRate: user.hourlyRate,
        skills: user.skills,
        category: user.category,
        location: user.location,
        rating: user.rating,
        badge: user.badge,
        earnings: user.earnings,
        spent: user.spent,
        portfolio: user.portfolio,
        companyName: user.companyName
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error during registration' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        title: user.title,
        bio: user.bio,
        hourlyRate: user.hourlyRate,
        skills: user.skills,
        category: user.category,
        location: user.location,
        rating: user.rating,
        badge: user.badge,
        earnings: user.earnings,
        spent: user.spent,
        portfolio: user.portfolio,
        companyName: user.companyName,
        githubUrl: user.githubUrl,
        linkedinUrl: user.linkedinUrl,
        websiteUrl: user.websiteUrl
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error during login' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({
      success: true,
      user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const {
      name,
      avatar,
      title,
      bio,
      hourlyRate,
      skills,
      category,
      location,
      phone,
      companyName,
      portfolio,
      githubUrl,
      linkedinUrl,
      websiteUrl
    } = req.body;

    if (name) user.name = name;
    if (avatar) user.avatar = avatar;
    if (title !== undefined) user.title = title;
    if (bio !== undefined) user.bio = bio;
    if (hourlyRate !== undefined) user.hourlyRate = Number(hourlyRate);
    if (skills !== undefined) {
      user.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (category) user.category = category;
    if (location !== undefined) user.location = location;
    if (phone !== undefined) user.phone = phone;
    if (companyName !== undefined) user.companyName = companyName;
    if (portfolio !== undefined) user.portfolio = portfolio;
    if (githubUrl !== undefined) user.githubUrl = githubUrl;
    if (linkedinUrl !== undefined) user.linkedinUrl = linkedinUrl;
    if (websiteUrl !== undefined) user.websiteUrl = websiteUrl;

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
