const mongoose = require('mongoose');

const correctionSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true },
  langCode: { type: String, required: true },
  originalIntent: { type: String },
  correctedIntent: { type: String, required: true },
  originalFields: { type: mongoose.Schema.Types.Mixed },
  correctedFields: { type: mongoose.Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Correction', correctionSchema);
