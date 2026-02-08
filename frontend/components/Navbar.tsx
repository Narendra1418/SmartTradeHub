"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user cookie exists
    const cookies = document.cookie.split(';');
    const userCookie = cookies.find(c => c.trim().startsWith('user='));
    setIsLoggedIn(!!userCookie);
  }, [pathname]); // Re-check on every route change

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    setIsLoggedIn(false);
    router.replace("/login");
  }

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b shadow-sm" style={{
      borderColor: 'var(--border)',
      backgroundColor: 'var(--card-bg)'
    }}>
      <Link href="/" className="font-bold text-xl tracking-tight" style={{
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        ⚡ SmartTrade
      </Link>

      <div className="flex gap-3 items-center">
        <Link 
          href="/dashboard" 
          className="px-4 py-2 rounded-lg font-medium transition-all duration-200"
          style={{
            color: 'var(--primary)',
            backgroundColor: 'var(--primary-light)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--primary)';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--primary-light)';
            e.currentTarget.style.color = 'var(--primary)';
          }}
        >
          📊 Dashboard
        </Link>

        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg font-medium transition-all duration-200"
            style={{
              color: 'var(--danger)',
              backgroundColor: 'var(--danger-light)',
              border: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--danger)';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--danger-light)';
              e.currentTarget.style.color = 'var(--danger)';
            }}
          >
            🚪 Logout
          </button>
        ) : (
          <Link
            href="/login"
            className="px-4 py-2 rounded-lg font-medium transition-all duration-200"
            style={{
              color: 'var(--primary)',
              backgroundColor: 'var(--primary-light)',
              border: 'none'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--primary)';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--primary-light)';
              e.currentTarget.style.color = 'var(--primary)';
            }}
          >
            🔐 Login
          </Link>
        )}
      </div>
    </nav>
  );
}
