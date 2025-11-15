import mongoose from 'mongoose';

const boardSchema = new mongoose.Schema({
  name: String,
  role: String,
  image: String,
  bio: String,
});

export default mongoose.models.Board || mongoose.model('Board', boardSchema);