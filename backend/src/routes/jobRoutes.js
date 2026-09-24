const express = require('express');
const router = express.Router();
const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getMyPostedJobs,
  getCategoryStats
} = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/categories/stats', getCategoryStats);
router.get('/client/my-jobs', protect, authorize('client', 'admin'), getMyPostedJobs);

router.route('/')
  .get(getJobs)
  .post(protect, authorize('client', 'admin'), createJob);

router.route('/:id')
  .get(getJobById)
  .put(protect, authorize('client', 'admin'), updateJob)
  .delete(protect, authorize('client', 'admin'), deleteJob);

module.exports = router;
