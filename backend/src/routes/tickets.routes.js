const express = require('express');

const asyncHandler = require('../utils/asyncHandler');
const { authenticate } = require('../middleware/auth');
const controller = require('../controllers/tickets.controller');

const router = express.Router();

router.use(authenticate);

router.get('/', asyncHandler(controller.list));

router.post('/', asyncHandler(controller.create));

router.get('/:id', asyncHandler(controller.getOne));

router.patch(
  '/:id/status',
  asyncHandler(controller.updateStatus)
);

router.post(
  '/:id/notes',
  asyncHandler(controller.addNote)
);

module.exports = router;
