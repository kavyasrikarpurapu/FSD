const User = require('../models/User');
const Review = require('../models/Review');
const Contract = require('../models/Contract');

// @desc    Get all freelancers with filters, search & pagination
// @route   GET /api/freelancers
// @access  Public
exports.getFreelancers = async (req, res) => {
  try {
    const { search, category, minRate, maxRate, minRating, skill, badge, sort, page = 1, limit = 12 } = req.query;

    let query = { role: 'freelancer' };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (badge && badge !== 'All') {
      query.badge = badge;
    }

    if (minRate || maxRate) {
      query.hourlyRate = {};
      if (minRate) query.hourlyRate.$gte = Number(minRate);
      if (maxRate) query.hourlyRate.$lte = Number(maxRate);
    }

    if (minRating) {
      query['rating.average'] = { $gte: Number(minRating) };
    }

    if (skill) {
      query.skills = { $in: [new RegExp(skill, 'i')] };
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: searchRegex },
        { title: searchRegex },
        { bio: searchRegex },
        { skills: { $in: [searchRegex] } },
        { location: searchRegex }
      ];
    }

    let sortOption = { 'rating.average': -1, completedProjectsCount: -1 };
    if (sort === 'rate-low') sortOption = { hourlyRate: 1 };
    if (sort === 'rate-high') sortOption = { hourlyRate: -1 };
    if (sort === 'projects') sortOption = { completedProjectsCount: -1 };
    if (sort === 'newest') sortOption = { createdAt: -1 };

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await User.countDocuments(query);
    const freelancers = await User.find(query)
      .select('-password')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      count: freelancers.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      freelancers
    });
  } catch (error) {
    console.error('Get freelancers error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single freelancer profile with reviews & history
// @route   GET /api/freelancers/:id
// @access  Public
exports.getFreelancerById = async (req, res) => {
  try {
    const freelancer = await User.findOne({ _id: req.params.id, role: 'freelancer' }).select('-password');
    if (!freelancer) {
      return res.status(404).json({ success: false, message: 'Freelancer profile not found' });
    }

    // Get public reviews for this freelancer
    const reviews = await Review.find({ reviewee: freelancer._id })
      .populate('reviewer', 'name avatar companyName')
      .populate('job', 'title category')
      .sort({ createdAt: -1 });

    // Get completed contracts
    const completedContracts = await Contract.find({ freelancer: freelancer._id, status: 'completed' })
      .populate('job', 'title category')
      .populate('client', 'name avatar companyName location')
      .select('amount completedAt job client')
      .sort({ completedAt: -1 });

    res.json({
      success: true,
      freelancer,
      reviews,
      completedContracts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get top featured talent for homepage
// @route   GET /api/freelancers/featured/top
// @access  Public
exports.getFeaturedFreelancers = async (req, res) => {
  try {
    const featured = await User.find({ role: 'freelancer' })
      .select('-password')
      .sort({ 'rating.average': -1, completedProjectsCount: -1, earnings: -1 })
      .limit(8);

    res.json({
      success: true,
      featured
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
