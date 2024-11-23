
import Link from 'next/link';

export default function Navigation() {
  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="font-bold text-xl">
            Project Manager
          </Link>
          <div className="space-x-4">
            <Link href="/" className="hover:text-blue-500">
              Projects
            </Link>
            <Link href="/upload" className="hover:text-blue-500">
              Upload
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}