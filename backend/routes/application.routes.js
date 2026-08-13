const express = require('express');
const router = express.Router();
const {
  createApplication,
  getApplications,
  getApplicationById
} = require('../controllers/application.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

router.use(protect);
router.use(authorize('student'));

router.post('/', createApplication);
router.get('/', getApplications);
router.get('/:id', getApplicationById);

module.exports = router;
