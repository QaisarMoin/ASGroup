import { useState, useEffect } from 'react';
import { walletAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#06b6d4', '#8b5cf6'];

const Earnings = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    walletAPI.getTransactions({ limit: 50 })
      .then(({ data }) => setTransactions(data.transactions || []))
      .finally(() => setLoading(false));
  }, []);

  const credits = transactions.filter((t) => t.type === 'credit');
  const byType = credits.reduce((acc, t) => {
    acc[t.transactionType] = (acc[t.transactionType] || 0) + t.amount;
    return acc;
  }, {});
  const pieData = Object.entries(byType).map(([name, value]) => ({ name: name.replace(/_/g, ' '), value }));

  const barData = [...credits].slice(0, 10).reverse().map((t) => ({
    date: new Date(t.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    amount: t.amount,
  }));

  if (loading) return <DashboardLayout><LoadingSpinner /></DashboardLayout>;

  return (
    <DashboardLayout>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.5rem', marginBottom: 24 }}>Earnings Analytics</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total Earnings', value: `Rs.${user?.totalEarnings?.toFixed(2) || '0'}`, color: '#6366f1' },
          { label: 'Wallet Balance', value: `Rs.${user?.walletBalance?.toFixed(2) || '0'}`, color: '#10b981' },
          { label: 'Direct Referrals', value: user?.directReferralsCount || 0, color: '#06b6d4' },
        ].map((s) => (
          <div key={s.label} className="card" style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '1.8rem', fontWeight: 800, color: s.color, fontFamily: 'Outfit' }}>{s.value}</p>
            <p style={{ color: 'rgba(226,232,240,0.6)', fontSize: '0.85rem', marginTop: 4 }}>{s.label}</p>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: '0.95rem' }}>Recent Earnings (Bar)</h3>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.1)" />
                <XAxis dataKey="date" stroke="rgba(165,180,252,0.5)" fontSize={11} />
                <YAxis stroke="rgba(165,180,252,0.5)" fontSize={11} />
                <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 10, color: '#e2e8f0' }} />
                <Bar dataKey="amount" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p style={{ color: 'rgba(165,180,252,0.4)', textAlign: 'center', padding: 40 }}>No data yet</p>}
        </div>
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: '0.95rem' }}>Earnings by Type</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 10, color: '#e2e8f0' }} formatter={(v) => `Rs.${v.toFixed(2)}`} />
                <Legend formatter={(v) => <span style={{ color: 'rgba(226,232,240,0.7)', fontSize: '0.8rem' }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          ) : <p style={{ color: 'rgba(165,180,252,0.4)', textAlign: 'center', padding: 40 }}>No earnings yet</p>}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Earnings;
