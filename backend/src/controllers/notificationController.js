const Notification = require('../models/Notification');
const Job = require('../models/Job');
const User = require('../models/User');
const Contract = require('../models/Contract');
const Proposal = require('../models/Proposal');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
exports.getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(30);

    const unreadCount = await Notification.countDocuments({ user: req.user._id, read: false });

    res.json({
      success: true,
      unreadCount,
      notifications
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification || notification.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    notification.read = true;
    await notification.save();

    res.json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ user: req.user._id, read: false }, { read: true });
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get platform public stats for landing page & analytics
// @route   GET /api/analytics/platform-stats
// @access  Public
exports.getPlatformStats = async (req, res) => {
  try {
    const totalFreelancers = await User.countDocuments({ role: 'freelancer' });
    const totalClients = await User.countDocuments({ role: 'client' });
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ status: 'open' });
    const completedContracts = await Contract.countDocuments({ status: 'completed' });

    // Calculate total paid volume
    const contracts = await Contract.find({ status: 'completed' }).select('amount');
    const totalVolume = contracts.reduce((acc, c) => acc + (c.amount || 0), 0);

    res.json({
      success: true,
      stats: {
        totalFreelancers,
        totalClients,
        totalJobs,
        activeJobs,
        completedContracts,
        totalVolume
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
