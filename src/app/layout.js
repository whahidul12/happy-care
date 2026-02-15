import './globals.css';
import Link from "next/link";
import Providers from './providers';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <nav className="p-5 border-b border-gray-300 flex gap-4">
            <Link href="/" className="text-blue-600 hover:underline">Home</Link>
            <Link href="/my-bookings" className="text-blue-600 hover:underline">My Bookings</Link>
            <Link href="/login" className="text-blue-600 hover:underline">Login</Link>
          </nav>
          {children}
        </Providers>
      </body>
    </html>
  )
}