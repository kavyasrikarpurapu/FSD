const Review = require('../models/Review');
const Contract = require('../models/Contract');
const User = require('../models/User');

// @desc    Add review for a completed contract
// @route   POST /api/reviews
// @access  Private
exports.createReview = async (req, res) => {
  try {
    const { contractId, rating, comment } = req.body;

    const contract = await Contract.findById(contractId);
    if (!contract) {
      return res.status(404).json({ success: false, message: 'Contract not found' });
    }

    if (contract.status !== 'completed') {
      return res.status(400).json({ success: false, message: 'Can only review completed contracts' });
    }

    const isClient = contract.client.toString() === req.user._id.toString();
    const isFreelancer = contract.freelancer.toString() === req.user._id.toString();

    if (!isClient && !isFreelancer) {
      return res.status(403).json({ success: false, message: 'Not authorized to review this contract' });
    }

    const revieweeId = isClient ? contract.freelancer : contract.client;
    const role = isClient ? 'client_to_freelancer' : 'freelancer_to_client';

    // Check if user already reviewed
    const existing = await Review.findOne({
      contract: contractId,
      reviewer: req.user._id
    });

    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this contract' });
    }

    const review = await Review.create({
      contract: contractId,
      job: contract.job,
      reviewer: req.user._id,
      reviewee: revieweeId,
      rating: Number(rating),
      comment,
      role
    });

    if (isClient) {
      contract.clientReviewed = true;
    } else {
      contract.freelancerReviewed = true;
    }
    await contract.save();

    // Recalculate reviewee average rating
    const allReviews = await Review.find({ reviewee: revieweeId });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await User.findByIdAndUpdate(revieweeId, {
      rating: {
        average: parseFloat(avgRating.toFixed(1)),
        count: allReviews.length
      }
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully!',
      review
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get reviews for a user
// @route   GET /api/reviews/user/:userId
// @access  Public
exports.getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ reviewee: req.params.userId })
      .populate('reviewer', 'name avatar companyName role')
      .populate('job', 'title category')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
