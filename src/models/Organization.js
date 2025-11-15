import mongoose from 'mongoose';

const orgSchema = new mongoose.Schema({
  name: String,
  desc: String,
  image: String, // Optional logo
});

export default mongoose.models.Organization || mongoose.model('Organization', orgSchema);