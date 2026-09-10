const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const { authenticate } = require('../middleware/auth');
const controller = require('../controllers/auth.controller');

const router = express.Router();

router.post('/login', asyncHandler(controller.login));
router.post('/firebase-login', asyncHandler(controller.firebaseLogin));
router.get('/me', authenticate, asyncHandler(controller.me));

module.exports = router;
