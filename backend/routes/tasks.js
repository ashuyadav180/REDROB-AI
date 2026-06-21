const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Correction = require('../models/Correction');

// GET /api/tasks - recent tasks for initial dashboard load
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 }).limit(20);
    const frontendTasks = tasks.map(t => t.toFrontendShape());
    res.json(frontendTasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/tasks/:id/pipeline - full detail view
router.get('/:id/pipeline', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/tasks/metrics/summary - metrics panel
router.get('/metrics/summary', async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const tasksToday = await Task.countDocuments({ createdAt: { $gte: startOfDay } });
    
    // Avg processing time (only for completed tasks)
    const completedTasks = await Task.find({ status: 'Completed', processingTimeMs: { $exists: true } });
    let avgProcessingTime = 0;
    if (completedTasks.length > 0) {
      const totalTime = completedTasks.reduce((sum, t) => sum + t.processingTimeMs, 0);
      avgProcessingTime = (totalTime / completedTasks.length / 1000).toFixed(1); // in seconds
    }

    // Language Distribution
    const langStats = await Task.aggregate([
      { $match: { createdAt: { $gte: startOfDay } } },
      { $group: { _id: "$detectedLangCode", count: { $sum: 1 } } }
    ]);

    res.json({
      tasksToday,
      avgResponseTimeSeconds: avgProcessingTime,
      languageDistribution: langStats,
      totalCorrections: await Correction.countDocuments() // For the learning counter
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/tasks/:id/correct - Manual Label Feedback Loop
router.patch('/:id/correct', async (req, res) => {
  try {
    const { correctedIntent, correctedFields } = req.body;
    const task = await Task.findById(req.params.id);
    
    if (!task) return res.status(404).json({ error: 'Task not found' });

    // Store correction
    const correction = new Correction({
      taskId: task._id,
      workerId: task.workerId,
      langCode: task.detectedLangCode || 'unknown',
      originalIntent: task.intent,
      correctedIntent: correctedIntent,
      originalFields: task.extractedFields,
      correctedFields: correctedFields
    });
    await correction.save();

    // Update Task
    task.intent = correctedIntent;
    if (correctedFields) task.extractedFields = correctedFields;
    task.needsManualReview = false;
    await task.save();

    const io = req.app.get('io');
    io.emit('task:update', task.toFrontendShape());

    // Broadcast metric update to drive the "Learning from N corrections" counter
    const totalCorrections = await Correction.countDocuments();
    io.emit('metrics:update', { totalCorrections });

    res.json(task.toFrontendShape());
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
