import connectDB from '@/lib/mongoose';
import Article from '@/models/Article';
import ArticlesShowcase from '@/components/ArticlesShowcase';

export const metadata = {
  title: 'Articles & Poems - Iqra Dars Udinur',
  description: 'Discover curated Islamic articles and soulful poems across languages.',
};

const fallbackArticles = [
  {
    _id: 'fallback-article',
    title: 'Echoes of Devotion',
    subtitle: 'Meditations on faith and community',
    author: 'Editorial Team',
    language: 'English',
    type: 'article',
    bannerUrl: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800',
    content: 'In every gathering of remembrance there is a revival of the soul...',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'fallback-poem',
    title: 'روح کی سرگوشی',
    subtitle: 'An Urdu poem for seekers',
    author: 'Fatimah Noor',
    language: 'Urdu',
    type: 'poem',
    bannerUrl: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&blend=000000',
    content: 'چاندنی شب میں دل کی صدائیں...',
    createdAt: new Date().toISOString(),
  },
];

export default async function ArticlesPage() {
  await connectDB();
  const articles = await Article.find({}).sort({ createdAt: -1 }).lean();
  const serialized = JSON.parse(JSON.stringify(articles));

  return <ArticlesShowcase articles={serialized.length ? serialized : fallbackArticles} />;
}

