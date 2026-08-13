const express = require('express');
const router = express.Router();
const { getCourses, getRecommendedCourses } = require('../controllers/course.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', protect, getCourses);
router.get('/recommended', protect, getRecommendedCourses);

module.exports = router;
