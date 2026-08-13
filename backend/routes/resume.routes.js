const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload.middleware');
const {
  uploadResume,
  getResumes,
  getResumeById,
  deleteResume,
  analyzeResume,
  getResumeAnalysis
} = require('../controllers/resume.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// Wrap upload middleware to handle multer errors gracefully
const handleUpload = (req, res, next) => {
  const uploadSingle = upload.single('resume');
  uploadSingle(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || 'File upload error'
      });
    }
    next();
  });
};

router.use(protect);
router.use(authorize('student'));

router.post('/upload', handleUpload, uploadResume);
router.get('/', getResumes);
router.get('/:id', getResumeById);
router.delete('/:id', deleteResume);

// Phase 4 Analysis Routes
router.post('/:id/analyze', analyzeResume);
router.get('/:id/analysis', getResumeAnalysis);

module.exports = router;
