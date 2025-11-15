// Optional: If you want separate model; otherwise use Content.socials
import mongoose from 'mongoose';

const socialSchema = new mongoose.Schema({
  name: String,
  url: String,
  icon: String,
});

export default mongoose.models.Social || mongoose.model('Social', socialSchema);