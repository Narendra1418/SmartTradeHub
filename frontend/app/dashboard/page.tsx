"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Summary = {
  portfolioValue: number;
  todaysPL: number;
  holdings: number;
};

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔐 CLIENT-SIDE AUTH CHECK
    const cookies = document.cookie.split(';');
    const userCookie = cookies.find(c => c.trim().startsWith('user='));
    
    if (!userCookie) {
      router.replace("/login");
      return;
    }

    // 📊 FETCH DATA (client-side)
    fetch("http://localhost:3000/api/market/summary", {
      cache: "no-store",
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to load dashboard data");
        return res.json();
      })
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-2xl" style={{ color: 'var(--primary)' }}>⏳ Loading...</div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-2xl" style={{ color: 'var(--danger)' }}>Failed to load data</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 
          className="text-4xl font-bold mb-8"
          style={{
            background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          📊 Your Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DashboardCard
            title="Portfolio Value"
            value={`₹${data.portfolioValue}`}
            icon="💰"
            color="primary"
          />
          <DashboardCard
            title="Today's P&L"
            value={`₹${data.todaysPL}`}
            icon="📈"
            color="success"
          />
          <DashboardCard
            title="Holdings"
            value={`${data.holdings} Stocks`}
            icon="📦"
            color="accent"
          />
        </div>
      </div>
    </main>
  );
}

function DashboardCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string;
  icon: string;
  color: 'primary' | 'success' | 'accent';
}) {
  const colors = {
    primary: { bg: 'var(--primary-light)', border: 'var(--primary)', text: 'var(--primary-dark)' },
    success: { bg: 'var(--success-light)', border: 'var(--success)', text: 'var(--success-dark)' },
    accent: { bg: 'var(--accent-light)', border: 'var(--accent)', text: 'var(--accent-hover)' }
  };
  
  return (
    <div 
      className="rounded-2xl p-6 shadow-md"
      style={{
        background: 'white',
        border: `2px solid ${colors[color].border}`
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = `0 12px 40px rgba(14, 165, 233, 0.3)`;
        e.currentTarget.style.background = colors[color].bg;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '';
        e.currentTarget.style.background = 'white';
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>{title}</p>
        <span className="text-3xl">{icon}</span>
      </div>
      <p className="text-3xl font-bold" style={{ color: colors[color].text }}>{value}</p>
    </div>
  );
}
