import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, title, value, subtitle, color = 'indigo', trend }) => {
  const colorMap = {
    indigo: { bg: 'rgba(99,102,241,0.15)', text: '#6366f1', glow: 'rgba(99,102,241,0.3)', border: 'rgba(99,102,241,0.3)' },
    purple: { bg: 'rgba(139,92,246,0.15)', text: '#8b5cf6', glow: 'rgba(139,92,246,0.3)', border: 'rgba(139,92,246,0.3)' },
    cyan: { bg: 'rgba(6,182,212,0.15)', text: '#06b6d4', glow: 'rgba(6,182,212,0.3)', border: 'rgba(6,182,212,0.3)' },
    green: { bg: 'rgba(16,185,129,0.15)', text: '#10b981', glow: 'rgba(16,185,129,0.3)', border: 'rgba(16,185,129,0.3)' },
    yellow: { bg: 'rgba(245,158,11,0.15)', text: '#f59e0b', glow: 'rgba(245,158,11,0.3)', border: 'rgba(245,158,11,0.3)' },
    red: { bg: 'rgba(239,68,68,0.15)', text: '#ef4444', glow: 'rgba(239,68,68,0.3)', border: 'rgba(239,68,68,0.3)' },
  };
  const c = colorMap[color] || colorMap.indigo;

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: `0 12px 40px ${c.glow}` }}
      className="stat-card"
      style={{ borderColor: c.border }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p style={{ color: 'rgba(226,232,240,0.6)', fontSize: '0.85rem', fontWeight: 500, marginBottom: 8 }}>{title}</p>
          <p style={{ fontSize: '1.8rem', fontWeight: 800, color: '#e2e8f0', marginBottom: 4 }}>{value}</p>
          {subtitle && <p style={{ color: 'rgba(226,232,240,0.5)', fontSize: '0.8rem' }}>{subtitle}</p>}
          {trend && (
            <p style={{ color: trend > 0 ? '#10b981' : '#ef4444', fontSize: '0.8rem', marginTop: 6, fontWeight: 600 }}>
              {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% this month
            </p>
          )}
        </div>
        <div style={{ background: c.bg, borderRadius: 12, padding: 12, border: `1px solid ${c.border}` }}>
          <Icon style={{ color: c.text, fontSize: 24 }} />
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
