const express = require('express');
const router = express.Router();
const {
  getMyContracts,
  getContractById,
  submitWork,
  approveAndComplete
} = require('../controllers/contractController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, getMyContracts);
router.get('/:id', protect, getContractById);
router.put('/:id/submit', protect, authorize('freelancer', 'admin'), submitWork);
router.put('/:id/approve', protect, authorize('client', 'admin'), approveAndComplete);

module.exports = router;
