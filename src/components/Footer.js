import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-green-900 text-white py-8 mt-16">
      <div className="max-w-6xl mx-auto text-center">
        <p>&copy; 2025 Iqra Dars Udinur. All rights reserved.</p>
        <div className="mt-4 space-x-4">
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </div>
      </div>
    </footer>
  );
}