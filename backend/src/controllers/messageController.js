const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Send a message to another user
// @route   POST /api/messages
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, text, jobId, contractId } = req.body;

    if (!receiverId || !text) {
      return res.status(400).json({ success: false, message: 'Receiver and message text are required' });
    }

    const message = await Message.create({
      sender: req.user._id,
      receiver: receiverId,
      text,
      job: jobId || undefined,
      contract: contractId || undefined
    });

    const populated = await Message.findById(message._id)
      .populate('sender', 'name avatar role')
      .populate('receiver', 'name avatar role');

    res.status(201).json({
      success: true,
      message: populated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get conversation between logged-in user and another user
// @route   GET /api/messages/:userId
// @access  Private
exports.getMessagesWithUser = async (req, res) => {
  try {
    const otherUserId = req.params.userId;

    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: otherUserId },
        { sender: otherUserId, receiver: req.user._id }
      ]
    })
      .populate('sender', 'name avatar role')
      .populate('receiver', 'name avatar role')
      .sort({ createdAt: 1 });

    // Mark unread messages as read
    await Message.updateMany(
      { sender: otherUserId, receiver: req.user._id, read: false },
      { read: true }
    );

    res.json({
      success: true,
      count: messages.length,
      messages
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get active conversations list for logged-in user
// @route   GET /api/messages/conversations/list
// @access  Private
exports.getConversationsList = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all distinct participants
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }]
    })
      .sort({ createdAt: -1 })
      .populate('sender', 'name avatar role title')
      .populate('receiver', 'name avatar role title');

    const conversationMap = new Map();

    messages.forEach(msg => {
      if (!msg.sender || !msg.receiver) return;
      const otherUser = msg.sender._id.toString() === userId.toString() ? msg.receiver : msg.sender;
      if (!otherUser || !otherUser._id) return;
      const otherId = otherUser._id.toString();

      if (!conversationMap.has(otherId)) {
        conversationMap.set(otherId, {
          user: otherUser,
          lastMessage: msg.text,
          lastMessageDate: msg.createdAt,
          unread: msg.receiver._id.toString() === userId.toString() && !msg.read
        });
      }
    });

    const conversations = Array.from(conversationMap.values());

    res.json({
      success: true,
      conversations
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
