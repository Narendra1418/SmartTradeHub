"use client";

export default function HomePage() {
  return (
    <main className="min-h-screen p-10">
      <div className="max-w-4xl mx-auto">
        <div 
          className="text-center py-20 px-8 rounded-3xl shadow-lg"
          style={{
            background: 'linear-gradient(135deg, var(--primary-light) 0%, var(--accent-light) 100%)',
            border: '2px solid var(--primary)'
          }}
        >
          <h1 
            className="text-6xl font-bold mb-6"
            style={{
              background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            ⚡ SmartTrade Hub
          </h1>
          <p 
            className="text-xl font-medium"
            style={{ color: 'var(--text-secondary)' }}
          >
            Learn trading with virtual portfolios and AI insights.
          </p>
          <div className="flex gap-4 justify-center mt-8">
            <button 
              className="px-8 py-3 rounded-xl font-semibold text-white shadow-lg"
              style={{ background: 'var(--primary)' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--primary-dark)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'var(--primary)'}
            >
              🚀 Get Started
            </button>
            <button 
              className="px-8 py-3 rounded-xl font-semibold shadow-lg"
              style={{ 
                background: 'white',
                color: 'var(--primary)',
                border: '2px solid var(--primary)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--primary)';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.color = 'var(--primary)';
              }}
            >
              📚 Learn More
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <FeatureCard 
            icon="📊"
            title="Real-time Data"
            description="Track markets with live updates"
          />
          <FeatureCard 
            icon="🤖"
            title="AI Insights"
            description="Smart recommendations powered by AI"
          />
          <FeatureCard 
            icon="💼"
            title="Virtual Portfolio"
            description="Practice trading risk-free"
          />
        </div>
      </div>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div 
      className="p-6 rounded-2xl shadow-md text-center"
      style={{
        background: 'white',
        border: '2px solid var(--border)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.borderColor = 'var(--primary)';
        e.currentTarget.style.boxShadow = '0 10px 30px rgba(14, 165, 233, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      <div className="text-5xl mb-3">{icon}</div>
      <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--primary)' }}>{title}</h3>
      <p style={{ color: 'var(--text-muted)' }}>{description}</p>
    </div>
  );
}
