import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  description: { type: String, default: 'Demo description...' },
  goals: { type: String, default: 'Demo goals...' },
  mission: { type: String, default: 'Demo mission...' },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  hours: { type: String, default: '' },
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