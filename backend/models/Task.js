const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  workerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Worker', required: true },
  workerName: { type: String, required: true },
  audioUrl: { type: String, required: true },
  transcript: { type: String },
  detectedLangCode: { type: String },
  intent: { 
    type: String, 
    enum: ['COMPLAINT', 'DELIVERY', 'REPORT', 'DELIVERY_EXCEPTION', 'UNKNOWN'] 
  },
  extractedFields: { type: mongoose.Schema.Types.Mixed }, // taskType, customerName, reason, summary
  confidence: { type: Number },
  needsManualReview: { type: Boolean, default: false },
  isEscalation: { type: Boolean, default: false },
  
  // Feature 1: Code Switching Awareness
  codeSwitchSpans: [{
    text: String,
    startCharIndex: Number,
    endCharIndex: Number,
    switchedToLanguage: String
  }],
  boundaryConfidence: { type: Number },
  
  // Feature 2: Tiered Model Routing
  modelTier: { type: String, enum: ['simple', 'standard', 'complex'] },
  
  // Feature 4: Offline-first Sync
  recordedAt: { type: Date },

  status: { 
    type: String, 
    enum: ['Processing', 'Routed', 'Completed'], 
    default: 'Processing' 
  },
  pipelineStage: { type: Number, default: 0 }, // 0 to 4
  ttsAudioUrl: { type: String },
  processingTimeMs: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

taskSchema.methods.toFrontendShape = function() {
  const timeStr = this.createdAt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  return {
    id: this._id,
    worker: this.workerName,
    transcript: this.transcript || 'Processing audio...',
    intent: this.intent || 'PROCESSING',
    status: this.status,
    time: timeStr,
    codeSwitchSpans: this.codeSwitchSpans || [],
    boundaryConfidence: this.boundaryConfidence,
    modelTier: this.modelTier,
    recordedAt: this.recordedAt,
    needsManualReview: this.needsManualReview,
    isEscalation: this.isEscalation,
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model('Task', taskSchema);
