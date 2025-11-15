import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  url: String,
  category: { type: String, enum: ['events', 'architecture', 'other'], default: 'events' },
  alt: String,
  uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Gallery || mongoose.model('Gallery', gallerySchema);