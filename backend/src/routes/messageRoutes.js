const express = require('express');
const router = express.Router();
const { sendMessage, getMessagesWithUser, getConversationsList } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', sendMessage);
router.get('/conversations/list', getConversationsList);
router.get('/:userId', getMessagesWithUser);

module.exports = router;
