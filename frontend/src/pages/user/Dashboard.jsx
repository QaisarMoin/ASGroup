import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { walletAPI, teamAPI, kycAPI } from '../../services/api';
import DashboardLayout from '../../layouts/DashboardLayout';
import StatCard from '../../components/StatCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FiDollarSign, FiUsers, FiTrendingUp, FiShield, FiCopy, FiCheck, FiGitBranch, FiPlus, FiArrowDownCircle } from 'react-icons/fi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

const UserDashboard = () => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState({ walletBalance: 0, totalEarnings: 0 });
  const [transactions, setTransactions] = useState([]);
  const [team, setTeam] = useState({ total: 0 });
  const [kyc, setKyc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const referralLink = `${window.location.origin}/register?ref=${user?.referralCode}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [wRes, tRes, kRes, txRes] = await Promise.allSettled([
          walletAPI.getBalance(),
          teamAPI.getDirect({ limit: 5 }),
          kycAPI.getStatus(),
          walletAPI.getTransactions({ limit: 6 }),
        ]);
        if (wRes.status === 'fulfilled') setWallet(wRes.value.data);
        if (tRes.status === 'fulfilled') setTeam(tRes.value.data);
        if (kRes.status === 'fulfilled') setKyc(kRes.value.data.kyc);
        if (txRes.status === 'fulfilled') setTransactions(txRes.value.data.transactions || []);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const copyReferral = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success('Referral link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  // Build chart data from transactions
  const chartData = [...transactions].reverse().map((tx, i) => ({
    name: new Date(tx.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    amount: tx.type === 'credit' ? tx.amount : 0,
  }));

  if (loading) return <DashboardLayout><LoadingSpinner /></DashboardLayout>;

  return (
    <DashboardLayout>
      {/* Welcome */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.6rem', marginBottom: 4 }}>
          Welcome back, {user?.fullName?.split(' ')[0]}! 👋
        </h1>
        <p style={{ color: 'rgba(165,180,252,0.7)', fontSize: '0.9rem' }}>
          Here's your earnings overview for today
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
        <StatCard icon={FiDollarSign} title="Wallet Balance" value={`₹${wallet.walletBalance?.toFixed(2) || '0.00'}`} color="indigo" />
        <StatCard icon={FiTrendingUp} title="Total Earnings" value={`₹${wallet.totalEarnings?.toFixed(2) || '0.00'}`} color="green" />
        <StatCard icon={FiUsers} title="Direct Referrals" value={user?.directReferralsCount || 0} color="cyan" />
        <StatCard icon={FiShield} title="KYC Status" value={kyc ? kyc.status.toUpperCase() : 'NOT SUBMITTED'} color={kyc?.status === 'approved' ? 'green' : kyc?.status === 'rejected' ? 'red' : 'yellow'} />
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'View Team Tree', icon: FiGitBranch, path: '/dashboard/tree', color: '#6366f1' },
          { label: 'Add Money', icon: FiPlus, path: '/dashboard/wallet', color: '#10b981' },
          { label: 'Submit KYC', icon: FiShield, path: '/dashboard/kyc', color: '#f59e0b' },
          { label: 'Withdraw Cash', icon: FiArrowDownCircle, path: '/dashboard/withdrawals', color: '#ec4899' },
        ].map((action) => (
          <Link key={action.label} to={action.path} className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '20px', textDecoration: 'none', transition: 'transform 0.2s', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ background: `${action.color}20`, padding: 12, borderRadius: 14, color: action.color }}>
              <action.icon size={22} />
            </div>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'rgba(226,232,240,0.8)' }}>{action.label}</span>
          </Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
        {/* Chart */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="card" style={{ gridColumn: 'span 2' }}>
          <h3 style={{ fontWeight: 700, marginBottom: 20, fontSize: '1rem' }}>Recent Earnings</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(99,102,241,0.1)" />
                <XAxis dataKey="name" stroke="rgba(165,180,252,0.5)" fontSize={12} />
                <YAxis stroke="rgba(165,180,252,0.5)" fontSize={12} />
                <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 12, color: '#e2e8f0' }} />
                <Area type="monotone" dataKey="amount" stroke="#6366f1" fill="url(#colorAmount)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(165,180,252,0.4)' }}>
              No earnings data yet
            </div>
          )}
        </motion.div>

        {/* Referral Link */}
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: '1rem' }}>🔗 Your Referral Link</h3>
          <p style={{ color: 'rgba(226,232,240,0.6)', fontSize: '0.85rem', marginBottom: 12 }}>Share this link to earn commissions</p>
          <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 10, padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <p style={{ flex: 1, fontSize: '0.8rem', color: '#a5b4fc', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{referralLink}</p>
            <button onClick={copyReferral} className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem', gap: 6, flexShrink: 0 }}>
              {copied ? <FiCheck /> : <FiCopy />} {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1, background: 'rgba(99,102,241,0.1)', borderRadius: 10, padding: '12px', textAlign: 'center' }}>
              <p style={{ fontSize: '1.5rem', fontWeight: 800 }}>{user?.directReferralsCount || 0}</p>
              <p style={{ fontSize: '0.75rem', color: 'rgba(226,232,240,0.6)' }}>Direct Refs</p>
            </div>
            <div style={{ flex: 1, background: 'rgba(16,185,129,0.1)', borderRadius: 10, padding: '12px', textAlign: 'center' }}>
              <p style={{ fontSize: '1.5rem', fontWeight: 800 }}>{user?.totalTeamCount || 0}</p>
              <p style={{ fontSize: '0.75rem', color: 'rgba(226,232,240,0.6)' }}>Total Team</p>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: '1rem' }}>Recent Transactions</h3>
          {transactions.length === 0 ? (
            <p style={{ color: 'rgba(165,180,252,0.4)', textAlign: 'center', padding: '30px 0', fontSize: '0.9rem' }}>No transactions yet</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {transactions.slice(0, 5).map((tx) => (
                <div key={tx._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: 10 }}>
                  <div>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{tx.transactionType?.replace(/_/g, ' ')}</p>
                    <p style={{ fontSize: '0.75rem', color: 'rgba(226,232,240,0.5)' }}>
                      {new Date(tx.createdAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <span style={{ fontWeight: 700, color: tx.type === 'credit' ? '#10b981' : '#ef4444', fontSize: '0.9rem' }}>
                    {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserDashboard;
