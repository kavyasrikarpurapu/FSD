const Contract = require('../models/Contract');
const Job = require('../models/Job');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Get all contracts for logged-in user
// @route   GET /api/contracts
// @access  Private
exports.getMyContracts = async (req, res) => {
  try {
    const query = req.user.role === 'client' 
      ? { client: req.user._id }
      : { freelancer: req.user._id };

    const contracts = await Contract.find(query)
      .populate('job', 'title category budget budgetType status')
      .populate('client', 'name email avatar companyName location')
      .populate('freelancer', 'name email avatar title rating')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: contracts.length,
      contracts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get contract by ID
// @route   GET /api/contracts/:id
// @access  Private
exports.getContractById = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id)
      .populate('job')
      .populate('client', 'name email avatar companyName location rating')
      .populate('freelancer', 'name email avatar title rating skills hourlyRate')
      .populate('proposal');

    if (!contract) {
      return res.status(404).json({ success: false, message: 'Contract not found' });
    }

    // Verify user is either the client or the freelancer
    const isClient = contract.client._id.toString() === req.user._id.toString();
    const isFreelancer = contract.freelancer._id.toString() === req.user._id.toString();

    if (!isClient && !isFreelancer && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this contract' });
    }

    res.json({
      success: true,
      contract
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit deliverable/work (Freelancer)
// @route   PUT /api/contracts/:id/submit
// @access  Private (Freelancer)
exports.submitWork = async (req, res) => {
  try {
    const { submissionNotes, submissionLink } = req.body;
    const contract = await Contract.findById(req.params.id).populate('job');

    if (!contract) {
      return res.status(404).json({ success: false, message: 'Contract not found' });
    }

    if (contract.freelancer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only the assigned freelancer can submit work' });
    }

    contract.status = 'submitted';
    contract.submissionNotes = submissionNotes || '';
    contract.submissionLink = submissionLink || '';
    contract.submittedAt = new Date();
    await contract.save();

    // Notify client
    await Notification.create({
      user: contract.client,
      title: 'Work Submitted for Review',
      message: `${req.user.name} submitted work for "${contract.job.title}". Please review and approve payment.`,
      link: `/contracts/${contract._id}`,
      type: 'contract'
    });

    res.json({
      success: true,
      message: 'Work submitted for client review successfully!',
      contract
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve work and complete contract / release payment (Client)
// @route   PUT /api/contracts/:id/approve
// @access  Private (Client)
exports.approveAndComplete = async (req, res) => {
  try {
    const contract = await Contract.findById(req.params.id).populate('job');

    if (!contract) {
      return res.status(404).json({ success: false, message: 'Contract not found' });
    }

    if (contract.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only the client can approve this contract' });
    }

    contract.status = 'completed';
    contract.completedAt = new Date();
    if (contract.milestones && contract.milestones.length > 0) {
      contract.milestones.forEach(m => m.status = 'paid');
    }
    await contract.save();

    // Update job status
    await Job.findByIdAndUpdate(contract.job._id, { status: 'completed' });

    // Update freelancer earnings and completed projects
    await User.findByIdAndUpdate(contract.freelancer, {
      $inc: {
        earnings: contract.amount,
        completedProjectsCount: 1
      }
    });

    // Update client total spent
    await User.findByIdAndUpdate(contract.client, {
      $inc: { spent: contract.amount }
    });

    // Notify freelancer
    await Notification.create({
      user: contract.freelancer,
      title: 'Payment Released! 💰',
      message: `Client approved your work for "${contract.job.title}". ₹${contract.amount} has been credited to your earnings.`,
      link: `/contracts/${contract._id}`,
      type: 'payment'
    });

    res.json({
      success: true,
      message: 'Contract approved and payment released successfully!',
      contract
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
