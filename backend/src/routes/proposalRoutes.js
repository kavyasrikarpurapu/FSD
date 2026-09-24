const express = require('express');
const router = express.Router();
const {
  submitProposal,
  getProposalsForJob,
  getMyProposals,
  acceptProposal,
  rejectProposal
} = require('../controllers/proposalController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('freelancer', 'admin'), submitProposal);
router.get('/my-proposals', protect, authorize('freelancer', 'admin'), getMyProposals);
router.get('/job/:jobId', protect, getProposalsForJob);
router.put('/:id/accept', protect, authorize('client', 'admin'), acceptProposal);
router.put('/:id/reject', protect, authorize('client', 'admin'), rejectProposal);

module.exports = router;
