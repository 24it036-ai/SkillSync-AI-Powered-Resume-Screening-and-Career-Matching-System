const Job = require('../models/Job.model');
const SavedJob = require('../models/SavedJob.model');

// @desc    Get all active jobs
// @route   GET /api/jobs
// @access  Public / Private
exports.getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ isActive: true }).sort({ createdAt: -1 });

    // Check if user is logged in to mark saved jobs
    let savedJobIds = [];
    if (req.user) {
      const savedJobs = await SavedJob.find({ user: req.user.id }).select('job');
      savedJobIds = savedJobs.map((sj) => sj.job.toString());
    }

    const jobsWithSavedFlag = jobs.map((job) => ({
      ...job.toObject(),
      isSaved: savedJobIds.includes(job._id.toString())
    }));

    res.status(200).json({
      success: true,
      count: jobsWithSavedFlag.length,
      jobs: jobsWithSavedFlag
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching jobs'
    });
  }
};

// @desc    Get single job by ID
// @route   GET /api/jobs/:id
// @access  Public / Private
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    let isSaved = false;
    if (req.user) {
      const existingSaved = await SavedJob.findOne({ user: req.user.id, job: job._id });
      isSaved = !!existingSaved;
    }

    res.status(200).json({
      success: true,
      job: {
        ...job.toObject(),
        isSaved
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching job details'
    });
  }
};

// @desc    Save job
// @route   POST /api/jobs/:id/save
// @access  Private (Student)
exports.saveJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    const existing = await SavedJob.findOne({ user: req.user.id, job: jobId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Job is already saved'
      });
    }

    const savedJob = await SavedJob.create({
      user: req.user.id,
      job: jobId
    });

    res.status(201).json({
      success: true,
      message: 'Job saved successfully',
      savedJob
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error saving job'
    });
  }
};

// @desc    Remove saved job
// @route   DELETE /api/jobs/:id/save
// @access  Private (Student)
exports.unsaveJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const deleted = await SavedJob.findOneAndDelete({ user: req.user.id, job: jobId });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Saved job not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Job removed from saved list'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error removing saved job'
    });
  }
};

// @desc    Get user's saved jobs
// @route   GET /api/jobs/saved
// @access  Private (Student)
exports.getSavedJobs = async (req, res) => {
  try {
    const savedJobs = await SavedJob.find({ user: req.user.id })
      .populate('job')
      .sort({ savedAt: -1 });

    const jobs = savedJobs
      .filter((sj) => sj.job !== null)
      .map((sj) => ({
        ...sj.job.toObject(),
        savedAt: sj.savedAt,
        savedJobId: sj._id,
        isSaved: true
      }));

    res.status(200).json({
      success: true,
      count: jobs.length,
      savedJobs: jobs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching saved jobs'
    });
  }
};
