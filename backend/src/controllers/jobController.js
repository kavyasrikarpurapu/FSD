const Job = require('../models/Job');
const Proposal = require('../models/Proposal');
const User = require('../models/User');
const Contract = require('../models/Contract');

// @desc    Get all jobs with filters, search, pagination
// @route   GET /api/jobs
// @access  Public
exports.getJobs = async (req, res) => {
  try {
    const { search, category, experienceLevel, budgetType, minBudget, maxBudget, status, sort, page = 1, limit = 12 } = req.query;

    let query = {};

    if (status) {
      query.status = status;
    } else {
      query.status = 'open';
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (experienceLevel && experienceLevel !== 'All') {
      query.experienceLevel = experienceLevel;
    }

    if (budgetType && budgetType !== 'All') {
      query.budgetType = budgetType;
    }

    if (minBudget || maxBudget) {
      query.budget = {};
      if (minBudget) query.budget.$gte = Number(minBudget);
      if (maxBudget) query.budget.$lte = Number(maxBudget);
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { skillsRequired: { $in: [searchRegex] } },
        { category: searchRegex }
      ];
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === 'budget-high') sortOption = { budget: -1 };
    if (sort === 'budget-low') sortOption = { budget: 1 };
    if (sort === 'proposals') sortOption = { proposalsCount: -1 };
    if (sort === 'views') sortOption = { views: -1 };

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .populate('client', 'name avatar companyName location rating')
      .populate('hiredFreelancer', 'name avatar')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      count: jobs.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      jobs
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate('client', 'name email avatar companyName bio location rating spent joinedAt createdAt')
      .populate('hiredFreelancer', 'name email avatar title rating')
      .populate('contract');

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Increment view count
    job.views = (job.views || 0) + 1;
    await job.save({ validateBeforeSave: false });

    res.json({
      success: true,
      job
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new job posting
// @route   POST /api/jobs
// @access  Private (Client only)
exports.createJob = async (req, res) => {
  try {
    const { title, description, category, skillsRequired, budgetType, budget, experienceLevel, projectDuration, deadline, featured } = req.body;

    const parsedSkills = Array.isArray(skillsRequired) 
      ? skillsRequired 
      : (typeof skillsRequired === 'string' ? skillsRequired.split(',').map(s => s.trim()).filter(Boolean) : []);

    const job = await Job.create({
      client: req.user._id,
      title,
      description,
      category: category || 'Web Development',
      skillsRequired: parsedSkills,
      budgetType: budgetType || 'fixed',
      budget: Number(budget),
      experienceLevel: experienceLevel || 'Intermediate',
      projectDuration: projectDuration || '1 to 4 weeks',
      deadline: deadline ? new Date(deadline) : undefined,
      featured: Boolean(featured)
    });

    const populatedJob = await Job.findById(job._id).populate('client', 'name avatar companyName');

    res.status(201).json({
      success: true,
      message: 'Job posted successfully!',
      job: populatedJob
    });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a job posting
// @route   PUT /api/jobs/:id
// @access  Private (Client only - job owner)
exports.updateJob = async (req, res) => {
  try {
    let job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.client.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this job' });
    }

    const { title, description, category, skillsRequired, budgetType, budget, experienceLevel, projectDuration, deadline, status, featured } = req.body;

    if (title) job.title = title;
    if (description) job.description = description;
    if (category) job.category = category;
    if (skillsRequired) {
      job.skillsRequired = Array.isArray(skillsRequired) ? skillsRequired : skillsRequired.split(',').map(s => s.trim()).filter(Boolean);
    }
    if (budgetType) job.budgetType = budgetType;
    if (budget !== undefined) job.budget = Number(budget);
    if (experienceLevel) job.experienceLevel = experienceLevel;
    if (projectDuration) job.projectDuration = projectDuration;
    if (deadline) job.deadline = new Date(deadline);
    if (status) job.status = status;
    if (featured !== undefined) job.featured = featured;

    await job.save();

    res.json({
      success: true,
      message: 'Job updated successfully',
      job
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a job posting
// @route   DELETE /api/jobs/:id
// @access  Private (Client only - job owner)
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.client.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this job' });
    }

    // Delete associated proposals
    await Proposal.deleteMany({ job: job._id });
    await Job.findByIdAndDelete(job._id);

    res.json({
      success: true,
      message: 'Job and associated proposals deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get client's posted jobs
// @route   GET /api/jobs/client/my-jobs
// @access  Private (Client)
exports.getMyPostedJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ client: req.user._id })
      .populate('hiredFreelancer', 'name avatar title email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: jobs.length,
      jobs
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get categories with counts
// @route   GET /api/jobs/categories/stats
// @access  Public
exports.getCategoryStats = async (req, res) => {
  try {
    const stats = await Job.aggregate([
      { $match: { status: 'open' } },
      { $group: { _id: '$category', count: { $sum: 1 }, avgBudget: { $avg: '$budget' } } },
      { $sort: { count: -1 } }
    ]);
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
