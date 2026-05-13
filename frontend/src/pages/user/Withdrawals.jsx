import { useState, useEffect } from 'react';
import { withdrawalAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import Badge from '../../components/Badge';
import toast from 'react-hot-toast';
import { FiArrowDownCircle, FiDollarSign } from 'react-icons/fi';

const Withdrawals = () => {
  const { user } = useAuth();
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [amount, setAmount] = useState('');

  const fetchWithdrawals = async () => {
    try {
      const { data } = await withdrawalAPI.getMy({ limit: 20 });
      setWithdrawals(data.requests || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWithdrawals(); }, []);

  const handleRequest = async (e) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!amt || amt < 100) { toast.error('Minimum withdrawal is Rs.100'); return; }
    if (amt > (user?.walletBalance || 0)) { toast.error('Insufficient balance'); return; }
    setRequesting(true);
    try {
      await withdrawalAPI.create({ amount: amt });
      toast.success('Withdrawal request submitted!');
      setAmount('');
      fetchWithdrawals();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Withdrawal failed');
    } finally {
      setRequesting(false);
    }
  };

  return (
    <DashboardLayout>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.5rem', marginBottom: 24 }}>Withdrawals</h1>
      <div className="card" style={{ maxWidth: 500, marginBottom: 24 }}>
        <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 4 }}>Request Withdrawal</h2>
        <p style={{ color: 'rgba(165,180,252,0.6)', fontSize: '0.85rem', marginBottom: 16 }}>
          Available Balance: <strong style={{ color: '#10b981' }}>Rs.{user?.walletBalance?.toFixed(2) || '0.00'}</strong>
        </p>
        <form onSubmit={handleRequest} style={{ display: 'flex', gap: 12 }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <FiDollarSign style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(165,180,252,0.5)' }} />
            <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="input" placeholder="Enter amount (min 100)" style={{ paddingLeft: 40 }} min="100" step="1" />
          </div>
          <button type="submit" className="btn-primary" disabled={requesting} style={{ flexShrink: 0 }}>
            {requesting ? <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : <><FiArrowDownCircle /> Withdraw</>}
          </button>
        </form>
      </div>
      <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 16 }}>Withdrawal History</h2>
      {loading ? <LoadingSpinner /> : (
        <div className="table-container">
          <table>
            <thead><tr><th>Amount</th><th>Status</th><th>Remark</th><th>Requested</th><th>Processed</th></tr></thead>
            <tbody>
              {withdrawals.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40, color: 'rgba(165,180,252,0.4)' }}>No withdrawals yet</td></tr>
              ) : withdrawals.map((w) => (
                <tr key={w._id}>
                  <td style={{ fontWeight: 700, color: '#f59e0b' }}>Rs.{w.amount.toFixed(2)}</td>
                  <td><Badge status={w.status} /></td>
                  <td style={{ color: 'rgba(226,232,240,0.6)', fontSize: '0.85rem' }}>{w.adminRemark || 'N/A'}</td>
                  <td style={{ color: 'rgba(226,232,240,0.6)', fontSize: '0.85rem' }}>{new Date(w.createdAt).toLocaleDateString('en-IN')}</td>
                  <td style={{ color: 'rgba(226,232,240,0.6)', fontSize: '0.85rem' }}>{w.processedAt ? new Date(w.processedAt).toLocaleDateString('en-IN') : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Withdrawals;
