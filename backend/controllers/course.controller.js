const Course = require('../models/Course.model');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Private / Public
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: courses.length,
      courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching courses'
    });
  }
};

// @desc    Get recommended courses
// @route   GET /api/courses/recommended
// @access  Private (Student)
exports.getRecommendedCourses = async (req, res) => {
  try {
    // In Phase 3, fetch courses matching student skills or default featured courses
    const studentSkills = req.user?.skills || [];
    
    let courses;
    if (studentSkills.length > 0) {
      courses = await Course.find({
        skillCovered: { $in: studentSkills.map((s) => new RegExp(s, 'i')) }
      }).limit(10);
    }

    if (!courses || courses.length === 0) {
      courses = await Course.find().limit(10);
    }

    res.status(200).json({
      success: true,
      count: courses.length,
      courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching recommended courses'
    });
  }
};
