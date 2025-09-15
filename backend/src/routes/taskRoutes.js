const express = require('express');
const { body, param } = require('express-validator');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const controller = require('../controllers/taskController');

const router = express.Router();

router.use(auth);

router.get('/', controller.listTasks);

router.post(
  '/',
  body('title').isString().trim().notEmpty(),
  controller.createTask
);

router.patch(
  '/:id',
  param('id').custom(v => mongoose.isValidObjectId(v)).withMessage('Invalid id'),
  body('title').optional().isString().trim().notEmpty(),
  body('completed').optional().isBoolean(),
  controller.updateTask
);

router.delete(
  '/:id',
  param('id').custom(v => mongoose.isValidObjectId(v)).withMessage('Invalid id'),
  controller.deleteTask
);

module.exports = router;


