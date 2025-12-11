import './globals.css';
import { Roboto } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Toaster } from 'react-hot-toast';
import FontLoader from '@/components/FontLoader';
import { ThemeProvider } from '@/contexts/ThemeContext';

const roboto = Roboto({ 
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
});


export const metadata = {
  title: "Iqradars Udinur & Padanna",
  description: "IQRA DARS is a traditional Islamic institution in Padanna, Kasaragod, dedicated to providing authentic Ahlus Sunnah Wal Jama’ah–based education",
  keywords: "Iqradars Udinur & Padanna, Dars in Kerala, Islamic Insittion, Dars in kannur, UDSA , religious Institution",
  metadataBase: new URL("https://iqradars-udinur-padanna.in"),
  alternates: {
    canonical: "/",
    languages: {
      'en-US': '/en-US',
    },
  },
  openGraph: {
    title: "Iqradars Udinur & Padanna Islamic Institution",
    description: "IQRA DARS is a traditional Islamic institution in Padanna, Kasaragod, dedicated to providing authentic Ahlus Sunnah Wal Jama’ah–based education",
    url: "https://iqradars-udinur-padanna.in",
    siteName: "Iqradars Udinur & Padanna",
    images: [
      {
        url: "/og-image.jpg", // Make sure to create this image and place it in the public folder
        width: 1200,
        height: 630,
        alt: "AIC Amal",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Iqradars Udinur & Padanna Islamic Institution",
    description: "IQRA DARS is a traditional Islamic institution in Padanna, Kasaragod, dedicated to providing authentic Ahlus Sunnah Wal Jama’ah–based education",
    images: ["/og-image.jpg"], // Make sure to create this image and place it in the public folder
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },
  verification: {
    google: "D22KDDQqMs1z3nyP7JgLY1AEB5OrhZfJR9HxsbSO3-s", // Add your Google verification ID
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", type: "image/png" },
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${roboto.className} bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors`}>
        <ThemeProvider>
          <FontLoader />
          <Header />
          <main>{children}</main>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}