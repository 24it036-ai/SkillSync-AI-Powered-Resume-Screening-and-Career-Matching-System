const express = require('express');
const router = express.Router();
const {
  getJobs,
  getJobById,
  saveJob,
  unsaveJob,
  getSavedJobs
} = require('../controllers/job.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// Saved jobs endpoints (protected for student)
router.get('/saved', protect, authorize('student'), getSavedJobs);
router.post('/:id/save', protect, authorize('student'), saveJob);
router.delete('/:id/save', protect, authorize('student'), unsaveJob);

// Public / Protected job listing & details
router.get('/', protect, getJobs);
router.get('/:id', protect, getJobById);

module.exports = router;
