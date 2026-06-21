const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  lang: { type: String, required: true }, // e.g., "🇮🇳 Hindi"
  langCode: { type: String, enum: ['hi', 'ta', 'mr', 'te'], required: true },
  status: { type: String, enum: ['active', 'idle', 'offline'], default: 'offline' },
  lastActiveAt: { type: Date, default: Date.now }
});

workerSchema.methods.toFrontendShape = function() {
  const now = new Date();
  const diffMs = now - this.lastActiveAt;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMins / 60);

  let lastActive = 'Just now';
  if (diffHrs >= 1) lastActive = `${diffHrs}h ago`;
  else if (diffMins >= 1) lastActive = `${diffMins}m ago`;

  return {
    id: this._id,
    name: this.name,
    lang: this.lang,
    status: this.status,
    lastActive: lastActive
  };
};

module.exports = mongoose.model('Worker', workerSchema);
