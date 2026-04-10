import Section from '../components/Section.jsx';

const POSTS = [
  {
    id: 1, category: 'Strategy', emoji: '💳', color: '#7C3AED', featured: true,
    title: 'The 2-Card Wallet: Why Most Americans Are Leaving $2,000/Year on the Table',
    excerpt: 'Using one card for everything sounds simple. But it\'s quietly costing you thousands. Here\'s the exact 2-card combo most people should be using.',
    readTime: '5 min read', date: 'Apr 2026',
  },
  {
    id: 2, category: 'Credit Score', emoji: '📈', color: '#10B981',
    title: 'The 30% Rule: The Single Most Impactful Thing You Can Do For Your Credit Score',
    excerpt: 'Credit utilization makes up 30% of your FICO score. Here\'s how to use it to your advantage.',
    readTime: '4 min read', date: 'Apr 2026',
  },
  {
    id: 3, category: 'Debt Payoff', emoji: '🏔️', color: '#3B82F6',
    title: 'Avalanche vs Snowball: Which Debt Payoff Method Actually Works?',
    excerpt: 'The math says Avalanche. The psychology says Snowball. We analyzed 10,000 payoff scenarios.',
    readTime: '6 min read', date: 'Mar 2026',
  },
  {
    id: 4, category: 'Rewards', emoji: '✈️', color: '#F59E0B',
    title: 'Transfer Partners 101: How to Make Your Points Worth 2x More',
    excerpt: 'Most people redeem points for cash back at 1¢ each. Transfer partners can make them worth 2–3¢.',
    readTime: '7 min read', date: 'Mar 2026',
  },
  {
    id: 5, category: 'Success Story', emoji: '🎉', color: '#10B981',
    title: 'From $18,000 in Debt to Debt-Free: A Real Clavira User Story',
    excerpt: 'How one user eliminated $18,000 in credit card debt in 22 months while improving their credit score by 87 points.',
    readTime: '8 min read', date: 'Mar 2026',
  },
  {
    id: 6, category: 'Strategy', emoji: '🤖', color: '#A78BFA',
    title: 'How Clavira\'s AI Analyzes Your Spending (And What It\'s Looking For)',
    excerpt: 'A behind-the-scenes look at our 7-factor payoff engine and 50-card optimization algorithm.',
    readTime: '5 min read', date: 'Feb 2026',
  },
];

const CATEGORIES = ['All', 'Strategy', 'Credit Score', 'Debt Payoff', 'Rewards', 'Success Story'];

export default function BlogPage({ navigate }) {
  const featured = POSTS.find(p => p.featured);
  const regular = POSTS.filter(p => !p.featured);

  const handlePost = () => {
    window.open('https://clavirafinance.com', '_blank');
  };

  return (
    <div style={{ paddingTop: 90, paddingBottom: 80 }}>
      {/* Hero */}
      <Section>
        <div style={{ marginBottom: 60 }}>
          <h1 style={{ fontSize: 48, fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)', marginBottom: 16 }}>
            Financial Intelligence
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 18, lineHeight: 1.7, maxWidth: 560 }}>
            Strategies, tips, and real stories to help you win with money. No fluff.
          </p>
        </div>
      </Section>

      {/* Featured */}
      {featured && (
        <Section>
          <div
            onClick={handlePost}
            style={{
              background: 'linear-gradient(135deg, #1A0E3A, #0F0D1F)',
              border: '1px solid rgba(124,58,237,0.25)',
              borderRadius: 24, padding: 40, marginBottom: 48,
              cursor: 'pointer', position: 'relative', overflow: 'hidden',
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.5)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.25)'}
          >
            <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: 'rgba(124,58,237,0.15)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ background: featured.color + '20', color: featured.color, border: `1px solid ${featured.color}40`, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999, letterSpacing: '0.05em' }}>
                {featured.category}
              </span>
              <span style={{ background: 'rgba(124,58,237,0.2)', color: '#A78BFA', border: '1px solid rgba(124,58,237,0.3)', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 999 }}>
                ✦ FEATURED
              </span>
            </div>
            <div style={{ fontSize: 40, marginBottom: 16 }}>{featured.emoji}</div>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text)', lineHeight: 1.3, marginBottom: 12, maxWidth: 600 }}>{featured.title}</h2>
            <p style={{ color: 'var(--muted)', fontSize: 15, lineHeight: 1.7, marginBottom: 20, maxWidth: 560 }}>{featured.excerpt}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ color: 'var(--muted)', fontSize: 13 }}>{featured.date}</span>
              <span style={{ color: 'var(--muted)' }}>·</span>
              <span style={{ color: 'var(--muted)', fontSize: 13 }}>{featured.readTime}</span>
              <span style={{ flex: 1 }} />
              <span style={{ color: '#A78BFA', fontSize: 13, fontWeight: 600 }}>Read article →</span>
            </div>
          </div>
        </Section>
      )}

      {/* Grid */}
      <Section>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text)', marginBottom: 24 }}>Latest Articles</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20, marginBottom: 60 }}>
          {regular.map(post => (
            <div
              key={post.id}
              onClick={handlePost}
              style={{
                background: '#0F0D1F', border: '1px solid rgba(124,58,237,0.1)',
                borderRadius: 20, padding: 24, cursor: 'pointer',
                transition: 'border-color 0.2s, transform 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.1)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ width: 52, height: 52, borderRadius: 14, background: post.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, marginBottom: 16 }}>
                {post.emoji}
              </div>
              <span style={{ background: post.color + '20', color: post.color, border: `1px solid ${post.color}40`, fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999, letterSpacing: '0.05em' }}>
                {post.category}
              </span>
              <h3 style={{ color: 'var(--text)', fontWeight: 700, fontSize: 15, lineHeight: 1.5, margin: '12px 0 8px' }}>{post.title}</h3>
              <p style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.7, marginBottom: 16 }}>{post.excerpt}</p>
              <div style={{ display: 'flex', gap: 8, color: 'var(--muted)', fontSize: 12 }}>
                <span>{post.date}</span>
                <span>·</span>
                <span>{post.readTime}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Subscribe */}
      <Section>
        <div style={{
          background: 'linear-gradient(135deg, #1A0E3A, #0F0D1F)',
          border: '1px solid rgba(124,58,237,0.2)',
          borderRadius: 24, padding: 48, textAlign: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(124,58,237,0.15)' }} />
          <h2 style={{ fontSize: 28, fontWeight: 800, color: 'var(--text)', marginBottom: 12 }}>Get new articles first</h2>
          <p style={{ color: 'var(--muted)', fontSize: 15, marginBottom: 28, maxWidth: 400, margin: '0 auto 28px' }}>
            Weekly tips on rewards, credit, and debt strategy. No spam — ever.
          </p>
          <button
            onClick={() => navigate('/register')}
            style={{
              background: 'linear-gradient(135deg, #7C3AED, #8B5CF6)',
              color: '#fff', border: 'none', borderRadius: 12,
              padding: '13px 28px', fontSize: 14, fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Create free account →
          </button>
        </div>
      </Section>
    </div>
  );
}