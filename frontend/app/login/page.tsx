"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("http://localhost:4000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Login failed");
      return;
    }

    // ✅ STORE LOGIN IN COOKIE (middleware can read this)
    document.cookie = `user=${data.user.email}; path=/`;

    // ✅ REDIRECT TO DASHBOARD
    router.replace("/dashboard");
  }

  return (
    <main 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--accent-light) 100%)'
      }}
    >
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-2xl p-8 shadow-2xl"
        style={{
          background: 'white',
          border: '2px solid var(--primary)'
        }}
      >
        <div className="text-center mb-6">
          <h1 
            className="text-3xl font-bold mb-2"
            style={{
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            🔐 Welcome Back
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Login to your SmartTrade account</p>
        </div>

        {error && (
          <div 
            className="mb-4 p-3 rounded-lg text-sm font-medium"
            style={{
              background: 'var(--danger-light)',
              color: 'var(--danger)',
              border: '1px solid var(--danger)'
            }}
          >
            ⚠️ {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
            📧 Email
          </label>
          <input
            type="email"
            placeholder="your@email.com"
            className="w-full p-3 rounded-lg"
            style={{
              border: '2px solid var(--border)',
              background: 'white'
            }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
            onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
            🔒 Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full p-3 rounded-lg"
            style={{
              border: '2px solid var(--border)',
              background: 'white'
            }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
            onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-lg font-semibold text-white shadow-lg"
          style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(14, 165, 233, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '';
          }}
        >
          🚀 Login to Dashboard
        </button>
      </form>
    </main>
  );
}
