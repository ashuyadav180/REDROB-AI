const mongoose = require('mongoose');
const Worker = require('./models/Worker');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/voiceops';

const initialWorkers = [
  { name: 'Raju', phone: '+919876543210', lang: '🇮🇳 Hindi', langCode: 'hi', status: 'active' },
  { name: 'Priya', phone: '+919876543211', lang: '🇮🇳 Tamil', langCode: 'ta', status: 'idle' },
  { name: 'Mohan', phone: '+919876543212', lang: '🇮🇳 Marathi', langCode: 'mr', status: 'offline' }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB.');

    await Worker.deleteMany({});
    console.log('Cleared existing workers.');

    await Worker.insertMany(initialWorkers);
    console.log('Inserted initial workers.');

    console.log('Seed complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
