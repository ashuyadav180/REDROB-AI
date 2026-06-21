const express = require('express');
const router = express.Router();
const Worker = require('../models/Worker');

// GET /api/workers
router.get('/', async (req, res) => {
  try {
    const workers = await Worker.find();
    res.json(workers.map(w => w.toFrontendShape()));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/workers
router.post('/', async (req, res) => {
  try {
    const worker = new Worker(req.body);
    await worker.save();
    res.status(201).json(worker.toFrontendShape());
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH /api/workers/:id/status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const worker = await Worker.findByIdAndUpdate(
      req.params.id, 
      { status, lastActiveAt: Date.now() }, 
      { new: true }
    );
    if (!worker) return res.status(404).json({ error: 'Worker not found' });
    
    const io = req.app.get('io');
    io.emit('worker:status', worker.toFrontendShape());
    
    res.json(worker.toFrontendShape());
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
