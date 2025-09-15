const { validationResult } = require('express-validator');
const Task = require('../models/Task');

async function listTasks(req, res, next) {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (e) { next(e); }
}

async function createTask(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { title } = req.body;
    const task = await Task.create({ userId: req.user.id, title });
    res.status(201).json(task);
  } catch (e) { next(e); }
}

async function updateTask(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { id } = req.params;
    const updates = {};
    if (typeof req.body.title === 'string' && req.body.title.trim()) updates.title = req.body.title.trim();
    if (typeof req.body.completed === 'boolean') updates.completed = req.body.completed;
    const task = await Task.findOneAndUpdate({ _id: id, userId: req.user.id }, updates, { new: true });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (e) { next(e); }
}

async function deleteTask(req, res, next) {
  try {
    const { id } = req.params;
    const task = await Task.findOneAndDelete({ _id: id, userId: req.user.id });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.status(204).send();
  } catch (e) { next(e); }
}

module.exports = { listTasks, createTask, updateTask, deleteTask };


