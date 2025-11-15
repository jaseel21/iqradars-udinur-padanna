import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  address: String,
  mapEmbed: String,
  lat: Number,
  lng: Number,
});

export default mongoose.models.Location || mongoose.model('Location', locationSchema);