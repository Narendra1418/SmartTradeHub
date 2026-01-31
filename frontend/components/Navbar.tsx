import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center gap-6 px-6 py-4 border-b">
      <Link href="/" className="font-bold text-lg">
        SmartTrade
      </Link>

      <Link href="/dashboard" className="text-gray-600 hover:text-black">
        Dashboard
      </Link>
    </nav>
  );
}
