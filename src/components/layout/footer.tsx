import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-50">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} NodeX Inc. All rights reserved.</p>
          </div>
          <nav className="flex gap-6 text-sm text-gray-600">
            <Link href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-gray-900 transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-gray-900 transition-colors">Contact Support</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
