import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  description: { type: String, default: 'Demo description...' },
  goals: { type: String, default: 'Demo goals...' },
  mission: { type: String, default: 'Demo mission...' },
  socials: [{
    name: String,
    url: String,
    icon: String,
  }],
  location: {
    address: String,
    mapEmbed: String,
    lat: Number,
    lng: Number,
  },
});

export default mongoose.models.Content || mongoose.model('Content', contentSchema);