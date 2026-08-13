const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/profile.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.get('/', protect, getProfile);
router.put('/', protect, authorize('student'), updateProfile);

module.exports = router;
