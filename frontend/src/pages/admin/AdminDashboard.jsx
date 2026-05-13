import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import AdminLayout from '../../layouts/AdminLayout';
import StatCard from '../../components/StatCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FiUsers, FiShield, FiDollarSign, FiTrendingUp, FiClock, FiCheckCircle } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Badge from '../../components/Badge';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getDashboard()
      .then(({ data: d }) => setData(d))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <AdminLayout><LoadingSpinner /></AdminLayout>;

  const { stats, recentTransactions, monthlyGrowth } = data || {};
  const chartData = (monthlyGrowth || []).map((m) => ({
    name: `${m._id.month}/${m._id.year}`,
    users: m.count,
  }));

  return (
    <AdminLayout>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.5rem', marginBottom: 24 }}>Admin Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        <StatCard icon={FiUsers} title="Total Users" value={stats?.totalUsers || 0} color="indigo" />
        <StatCard icon={FiCheckCircle} title="Active Users" value={stats?.activeUsers || 0} color="green" />
        <StatCard icon={FiShield} title="Pending KYC" value={stats?.pendingKYC || 0} color="yellow" />
        <StatCard icon={FiClock} title="Pending Withdrawals" value={stats?.pendingWithdrawals || 0} color="red" />
        <StatCard icon={FiDollarSign} title="Total Payouts" value={`Rs.${(stats?.totalPayouts || 0).toFixed(0)}`} color="purple" />
        <StatCard icon={FiTrendingUp} title="Total Commissions" value={`Rs.${(stats?.totalEarnings || 0).toFixed(0)}`} color="cyan" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Monthly User Growth</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(239,68,68,0.1)" />
              <XAxis dataKey="name" stroke="rgba(251,146,60,0.5)" fontSize={12} />
              <YAxis stroke="rgba(251,146,60,0.5)" fontSize={12} />
              <Tooltip contentStyle={{ background: '#0a0a1a', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, color: '#e2e8f0' }} />
              <Line type="monotone" dataKey="users" stroke="#ef4444" strokeWidth={2} dot={{ fill: '#ef4444', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ gridColumn: 'span 2' }}>
          <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Recent Transactions</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr><th>User</th><th>Type</th><th>Amount</th><th>Status</th><th>Date</th></tr>
              </thead>
              <tbody>
                {(recentTransactions || []).slice(0, 8).map((tx) => (
                  <tr key={tx._id}>
                    <td style={{ fontSize: '0.85rem' }}>{tx.userId?.fullName || 'N/A'}</td>
                    <td><Badge status={tx.transactionType} /></td>
                    <td style={{ fontWeight: 700, color: tx.type === 'credit' ? '#10b981' : '#ef4444' }}>
                      {tx.type === 'credit' ? '+' : '-'}Rs.{tx.amount.toFixed(2)}
                    </td>
                    <td><Badge status={tx.status} /></td>
                    <td style={{ color: 'rgba(226,232,240,0.6)', fontSize: '0.85rem' }}>
                      {new Date(tx.createdAt).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
