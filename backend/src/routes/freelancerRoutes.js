const express = require('express');
const router = express.Router();
const {
  getFreelancers,
  getFreelancerById,
  getFeaturedFreelancers
} = require('../controllers/freelancerController');

router.get('/featured/top', getFeaturedFreelancers);
router.get('/', getFreelancers);
router.get('/:id', getFreelancerById);

module.exports = router;
