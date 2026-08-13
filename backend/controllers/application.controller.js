const Application = require('../models/Application.model');
const Job = require('../models/Job.model');
const Resume = require('../models/Resume.model');

// @desc    Submit job application
// @route   POST /api/applications
// @access  Private (Student)
exports.createApplication = async (req, res) => {
  try {
    const { jobId, resumeId, notes } = req.body;

    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: 'Job ID is required to apply'
      });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if user already applied
    const existingApp = await Application.findOne({
      student: req.user.id,
      job: jobId
    });

    if (existingApp) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted an application for this job.'
      });
    }

    // Verify resume if provided
    let resumeRef = null;
    if (resumeId) {
      const resume = await Resume.findOne({ _id: resumeId, user: req.user.id });
      if (resume) {
        resumeRef = resume._id;
      }
    } else {
      // Find latest resume of user if available
      const latestResume = await Resume.findOne({ user: req.user.id }).sort({ createdAt: -1 });
      if (latestResume) {
        resumeRef = latestResume._id;
      }
    }

    const application = await Application.create({
      student: req.user.id,
      job: jobId,
      resume: resumeRef,
      status: 'Applied',
      appliedAt: new Date(),
      notes: notes || '',
      timeline: [
        {
          status: 'Applied',
          date: new Date(),
          notes: 'Application submitted successfully'
        }
      ]
    });

    const populatedApp = await Application.findById(application._id).populate('job');

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application: populatedApp
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error submitting application'
    });
  }
};

// @desc    Get user's applications
// @route   GET /api/applications
// @access  Private (Student)
exports.getApplications = async (req, res) => {
  try {
    const applications = await Application.find({ student: req.user.id })
      .populate('job')
      .populate('resume')
      .sort({ appliedAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching applications'
    });
  }
};

// @desc    Get single application details
// @route   GET /api/applications/:id
// @access  Private (Student)
exports.getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('job')
      .populate('resume');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Authorization check
    if (application.student.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this application'
      });
    }

    res.status(200).json({
      success: true,
      application
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching application details'
    });
  }
};
