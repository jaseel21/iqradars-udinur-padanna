import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: String,
    slug: { type: String, unique: true },
    author: { type: String, default: 'Editorial Team' },
    language: { type: String, default: 'English' },
    fontFamily: { type: String, default: 'serif' },
    bannerUrl: String,
    content: { type: String, required: true },
    type: { type: String, enum: ['article', 'poem'], default: 'article' },
    tags: [String],
  },
  { timestamps: true }
);

export default mongoose.models.Article || mongoose.model('Article', articleSchema);

