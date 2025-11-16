import mongoose from 'mongoose';

const committeeSchema = new mongoose.Schema({
  wing: { type: String, required: true }, // e.g., "Youth Wing", "Women's Circle"
  members: [{
    name: { type: String, required: true },
    position: { type: String, required: true },
    photo: { type: String, required: true },
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Committee || mongoose.model('Committee', committeeSchema);

