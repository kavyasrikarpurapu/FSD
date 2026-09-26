const Proposal = require('../models/Proposal');
const Job = require('../models/Job');
const Contract = require('../models/Contract');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Submit a proposal for a job
// @route   POST /api/proposals
// @access  Private (Freelancer)
exports.submitProposal = async (req, res) => {
  try {
    const { jobId, bidAmount, estimatedDays, coverLetter, milestones } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.status !== 'open') {
      return res.status(400).json({ success: false, message: 'This job is no longer accepting proposals' });
    }

    if (job.client.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot bid on your own job' });
    }

    const existingProposal = await Proposal.findOne({ job: jobId, freelancer: req.user._id });
    if (existingProposal) {
      return res.status(400).json({ success: false, message: 'You have already submitted a proposal for this job' });
    }

    const proposal = await Proposal.create({
      job: jobId,
      freelancer: req.user._id,
      client: job.client,
      bidAmount: Number(bidAmount),
      estimatedDays: Number(estimatedDays),
      coverLetter,
      milestones: milestones || []
    });

    // Increment proposal count on job
    job.proposalsCount = (job.proposalsCount || 0) + 1;
    await job.save();

    // Create notification for job client
    await Notification.create({
      user: job.client,
      title: 'New Proposal Received',
      message: `${req.user.name} submitted a bid of ₹${bidAmount} on "${job.title}"`,
      link: `/jobs/${job._id}`,
      type: 'proposal'
    });

    const populatedProposal = await Proposal.findById(proposal._id)
      .populate('freelancer', 'name avatar title hourlyRate rating skills')
      .populate('job', 'title budget status');

    res.status(201).json({
      success: true,
      message: 'Proposal submitted successfully!',
      proposal: populatedProposal
    });
  } catch (error) {
    console.error('Submit proposal error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all proposals for a job (Client only)
// @route   GET /api/proposals/job/:jobId
// @access  Private
exports.getProposalsForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    // Only client who posted or admin or freelancer who submitted can access
    if (job.client.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view all proposals for this job' });
    }

    const proposals = await Proposal.find({ job: req.params.jobId })
      .populate('freelancer', 'name email avatar title bio hourlyRate skills rating earnings completedProjectsCount location badge portfolio')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: proposals.length,
      proposals
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user's submitted proposals (Freelancer)
// @route   GET /api/proposals/my-proposals
// @access  Private (Freelancer)
exports.getMyProposals = async (req, res) => {
  try {
    const proposals = await Proposal.find({ freelancer: req.user._id })
      .populate({
        path: 'job',
        select: 'title category budget budgetType experienceLevel status client',
        populate: { path: 'client', select: 'name companyName location' }
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: proposals.length,
      proposals
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Accept proposal and start contract
// @route   PUT /api/proposals/:id/accept
// @access  Private (Client only)
exports.acceptProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id)
      .populate('job')
      .populate('freelancer');

    if (!proposal) {
      return res.status(404).json({ success: false, message: 'Proposal not found' });
    }

    const job = await Job.findById(proposal.job._id);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to accept proposals for this job' });
    }

    if (job.status !== 'open') {
      return res.status(400).json({ success: false, message: 'Job is not open for hiring' });
    }

    // Update proposal status
    proposal.status = 'accepted';
    await proposal.save();

    // Reject all other proposals for this job
    await Proposal.updateMany(
      { job: job._id, _id: { $ne: proposal._id }, status: 'pending' },
      { status: 'rejected' }
    );

    // Create contract
    const contractMilestones = proposal.milestones && proposal.milestones.length > 0 
      ? proposal.milestones.map(m => ({ title: m.title, amount: m.amount, status: 'pending' }))
      : [{ title: 'Full Project Milestone', amount: proposal.bidAmount, status: 'pending' }];

    const contract = await Contract.create({
      job: job._id,
      proposal: proposal._id,
      client: req.user._id,
      freelancer: proposal.freelancer._id,
      amount: proposal.bidAmount,
      status: 'active',
      milestones: contractMilestones
    });

    // Update job status and hiredFreelancer
    job.status = 'in_progress';
    job.hiredFreelancer = proposal.freelancer._id;
    job.contract = contract._id;
    await job.save();

    // Notify freelancer
    await Notification.create({
      user: proposal.freelancer._id,
      title: 'Proposal Accepted! 🎉',
      message: `Congratulations! ${req.user.name} accepted your proposal on "${job.title}" for ₹${proposal.bidAmount}.`,
      link: `/contracts/${contract._id}`,
      type: 'contract'
    });

    res.json({
      success: true,
      message: 'Proposal accepted and contract initiated!',
      contractId: contract._id,
      proposal
    });
  } catch (error) {
    console.error('Accept proposal error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reject proposal
// @route   PUT /api/proposals/:id/reject
// @access  Private (Client only)
exports.rejectProposal = async (req, res) => {
  try {
    const proposal = await Proposal.findById(req.params.id).populate('job');
    if (!proposal) {
      return res.status(404).json({ success: false, message: 'Proposal not found' });
    }

    if (proposal.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    proposal.status = 'rejected';
    await proposal.save();

    res.json({
      success: true,
      message: 'Proposal rejected',
      proposal
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
