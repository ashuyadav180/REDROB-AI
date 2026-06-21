const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { runVoicePipeline } = require('../orchestrator/pipeline');

// Configure Multer for audio uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'))
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed!'), false);
    }
  }
});

router.post('/process', upload.single('audio'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No audio file provided.' });
  }

  const { workerId } = req.body;
  if (!workerId) {
    return res.status(400).json({ error: 'workerId is required.' });
  }

  const io = req.app.get('io');

  // Run pipeline asynchronously, do not await here.
  runVoicePipeline({
    audioFilePath: req.file.path,
    workerId,
    io
  });

  // Respond immediately acknowledging receipt
  res.status(202).json({ message: 'Audio received, pipeline started.' });
});

module.exports = router;
