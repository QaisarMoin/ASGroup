import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiUsers, FiDollarSign, FiShield, FiTrendingUp, FiGitBranch, FiGlobe } from 'react-icons/fi';

const features = [
  { icon: FiUsers, title: 'Referral Network', desc: 'Build your team with multi-level referral commissions up to 5 levels deep.' },
  { icon: FiDollarSign, title: 'Smart Wallet', desc: 'Real-time earnings tracking, instant wallet updates, and withdrawal management.' },
  { icon: FiShield, title: 'KYC Verified', desc: 'Secure KYC verification with Aadhaar & PAN document uploads.' },
  { icon: FiTrendingUp, title: 'Earnings Analytics', desc: 'Detailed income breakdowns with interactive charts and reports.' },
  { icon: FiGitBranch, title: 'MLM Tree View', desc: 'Interactive tree visualization of your entire downline network.' },
  { icon: FiGlobe, title: 'Real-time Updates', desc: 'Commission updates happen instantly when your downline joins.' },
];

const stats = [
  { label: 'Active Members', value: '10,000+' },
  { label: 'Total Payouts', value: '₹50L+' },
  { label: 'MLM Levels', value: '5 Levels' },
  { label: 'Commission Rate', value: 'Up to 20%' },
];

const Home = () => (
  <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg,#0f0f23 0%,#1a1a2e 100%)' }}>
    {/* Nav */}
    <nav style={{ padding: '0 40px', height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(99,102,241,0.1)', position: 'sticky', top: 0, zIndex: 100, background: 'rgba(15,15,35,0.9)', backdropFilter: 'blur(20px)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div className="gradient-bg" style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14, fontFamily: 'Outfit, sans-serif' }}>AS</div>
        <span style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.1rem' }}>AS Group MLM</span>
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <Link to="/login"><button className="btn-secondary" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>Login</button></Link>
        <Link to="/register"><button className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>Get Started</button></Link>
      </div>
    </nav>

    {/* Hero */}
    <section style={{ padding: '100px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '30%', left: '20%', width: 500, height: 500, borderRadius: '50%', background: 'rgba(99,102,241,0.06)', filter: 'blur(100px)' }} />
      <div style={{ position: 'absolute', bottom: '20%', right: '20%', width: 400, height: 400, borderRadius: '50%', background: 'rgba(139,92,246,0.06)', filter: 'blur(80px)' }} />

      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} style={{ position: 'relative' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 20, padding: '6px 16px', marginBottom: 24 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', animation: 'pulse 2s infinite' }} />
          <span style={{ fontSize: '0.85rem', color: 'rgba(165,180,252,0.9)', fontWeight: 500 }}>Live Platform — Join Today</span>
        </div>

        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 1.1, marginBottom: 20 }}>
          Build Your Network,<br />
          <span className="gradient-text">Grow Your Wealth</span>
        </h1>
        <p style={{ fontSize: '1.15rem', color: 'rgba(226,232,240,0.7)', maxWidth: 600, margin: '0 auto 40px', lineHeight: 1.7 }}>
          Join AS Group MLM and earn commissions from your downline network. 
          Multi-level income, instant payouts, and complete transparency.
        </p>

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register">
            <button className="btn-primary" style={{ padding: '16px 32px', fontSize: '1rem', gap: 10 }}>
              Start Earning Today <FiArrowRight />
            </button>
          </Link>
          <Link to="/login">
            <button className="btn-secondary" style={{ padding: '16px 32px', fontSize: '1rem' }}>
              Sign In
            </button>
          </Link>
        </div>
      </motion.div>
    </section>

    {/* Stats */}
    <section style={{ padding: '20px 40px 80px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, maxWidth: 900, margin: '0 auto' }}>
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 + 0.3 }}
            className="glass" style={{ borderRadius: 16, padding: '20px', textAlign: 'center' }}>
            <p style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2rem', fontWeight: 800, color: '#a5b4fc' }}>{s.value}</p>
            <p style={{ color: 'rgba(226,232,240,0.6)', fontSize: '0.85rem', marginTop: 4 }}>{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>

    {/* Features */}
    <section style={{ padding: '60px 40px 100px' }}>
      <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '2rem', textAlign: 'center', marginBottom: 50 }}>
        Everything You Need to <span className="gradient-text">Succeed</span>
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, maxWidth: 1100, margin: '0 auto' }}>
        {features.map((f, i) => (
          <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 + 0.4 }}
            className="card" style={{ textAlign: 'center' }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <f.icon style={{ color: '#6366f1', fontSize: 24 }} />
            </div>
            <h3 style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: 8 }}>{f.title}</h3>
            <p style={{ color: 'rgba(226,232,240,0.6)', fontSize: '0.9rem', lineHeight: 1.6 }}>{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>

    {/* CTA */}
    <section style={{ padding: '60px 40px 100px', textAlign: 'center' }}>
      <div className="gradient-bg" style={{ borderRadius: 24, padding: '60px 40px', maxWidth: 800, margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 900, fontSize: '2.2rem', marginBottom: 12 }}>Ready to Start?</h2>
        <p style={{ fontSize: '1.05rem', opacity: 0.9, marginBottom: 28 }}>Join thousands of members earning with AS Group MLM</p>
        <Link to="/register">
          <button style={{ background: 'white', color: '#4f46e5', border: 'none', padding: '14px 32px', borderRadius: 12, fontSize: '1rem', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            Create Free Account <FiArrowRight />
          </button>
        </Link>
      </div>
    </section>

    {/* Footer */}
    <footer style={{ borderTop: '1px solid rgba(99,102,241,0.1)', padding: '30px 40px', textAlign: 'center', color: 'rgba(226,232,240,0.4)', fontSize: '0.85rem' }}>
      © 2024 AS Group MLM. All rights reserved. | Built with ❤️ for financial success
    </footer>
  </div>
);

export default Home;
