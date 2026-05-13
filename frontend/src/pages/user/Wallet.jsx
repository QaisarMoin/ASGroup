import { useState, useEffect } from 'react';
import { walletAPI } from '../../services/api';
import DashboardLayout from '../../layouts/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FiDollarSign, FiTrendingUp, FiArrowUpCircle, FiPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';

const Wallet = () => {
  const [wallet, setWallet] = useState({ walletBalance: 0, totalEarnings: 0 });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchBalance = () => {
    walletAPI.getBalance()
      .then(({ data }) => setWallet(data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBalance();
  }, []);

  const handleDeposit = async () => {
    const amount = prompt('Enter demo amount to deposit (₹):', '5000');
    if (!amount || isNaN(amount)) return;
    
    setActionLoading(true);
    try {
      await walletAPI.deposit(amount);
      toast.success(`₹${amount} deposited successfully!`);
      fetchBalance();
    } catch (err) {
      toast.error('Deposit failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleInvest = async () => {
    const amount = prompt('Enter amount to invest in package (₹):', '1000');
    if (!amount || isNaN(amount)) return;

    if (wallet.walletBalance < amount) {
      toast.error('Insufficient balance! Please deposit first.');
      return;
    }
    
    setActionLoading(true);
    try {
      await walletAPI.invest(amount);
      toast.success('Investment successful! Commissions distributed.');
      fetchBalance();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Investment failed');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <DashboardLayout><LoadingSpinner /></DashboardLayout>;

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.5rem' }}>My Wallet</h1>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={handleDeposit} disabled={actionLoading} className="btn-primary" style={{ background: '#10b981', borderColor: '#10b981', fontSize: '0.85rem' }}>
            <FiPlus /> Deposit Demo
          </button>
          <button onClick={handleInvest} disabled={actionLoading} className="btn-primary" style={{ fontSize: '0.85rem' }}>
            <FiArrowUpCircle /> Invest Package
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 24 }}>
        <div className="card" style={{ background: 'linear-gradient(135deg,rgba(99,102,241,0.25),rgba(139,92,246,0.15))', borderColor: 'rgba(99,102,241,0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ background: 'rgba(99,102,241,0.2)', padding: 10, borderRadius: 12 }}>
              <FiDollarSign size={20} style={{ color: '#a5b4fc' }} />
            </div>
            <p style={{ color: 'rgba(226,232,240,0.7)', fontSize: '0.85rem', fontWeight: 500 }}>Available Balance</p>
          </div>
          <p style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'Outfit, sans-serif' }}>₹{wallet.walletBalance?.toFixed(2)}</p>
          <div style={{ marginTop: 12, fontSize: '0.8rem', color: 'rgba(165,180,252,0.6)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
            Ready for withdrawal or investment
          </div>
        </div>
        <div className="card" style={{ background: 'linear-gradient(135deg,rgba(16,185,129,0.15),rgba(6,182,212,0.1))', borderColor: 'rgba(16,185,129,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ background: 'rgba(16,185,129,0.2)', padding: 10, borderRadius: 12 }}>
              <FiTrendingUp size={20} style={{ color: '#34d399' }} />
            </div>
            <p style={{ color: 'rgba(226,232,240,0.7)', fontSize: '0.85rem', fontWeight: 500 }}>Total Earnings</p>
          </div>
          <p style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'Outfit, sans-serif', color: '#34d399' }}>₹{wallet.totalEarnings?.toFixed(2)}</p>
          <div style={{ marginTop: 12, fontSize: '0.8rem', color: 'rgba(52,211,153,0.6)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399' }} />
            Lifetime commission earnings
          </div>
        </div>
      </div>

      <div className="card" style={{ background: 'rgba(99,102,241,0.03)', border: '1px dashed rgba(99,102,241,0.3)' }}>
        <h4 style={{ fontSize: '0.9rem', marginBottom: 8, color: '#a5b4fc' }}>💡 How it works:</h4>
        <ul style={{ color: 'rgba(165,180,252,0.7)', fontSize: '0.85rem', paddingLeft: 16, lineHeight: 1.6 }}>
          <li>Click <strong>Deposit Demo</strong> to simulate adding money to your wallet.</li>
          <li>Click <strong>Invest Package</strong> to use your balance and buy a business package.</li>
          <li>When you invest, commissions are automatically distributed to your upline (seniors) across 5 levels.</li>
        </ul>
      </div>
    </DashboardLayout>
  );
};

export default Wallet;
