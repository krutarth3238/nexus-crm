const express = require('express');

const asyncHandler = require('../utils/asyncHandler');
const { authenticate } = require('../middleware/auth');
const controller = require('../controllers/analytics.controller');

const router = express.Router();

router.get(
  '/stats',
  authenticate,
  asyncHandler(controller.stats)
);

module.exports = router;
