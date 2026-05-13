import { useState } from 'react';
import { adminAPI } from '../../services/api';
import AdminLayout from '../../layouts/AdminLayout';
import toast from 'react-hot-toast';
import { FiDollarSign, FiPhone } from 'react-icons/fi';

const WalletManagement = () => {
  const [form, setForm] = useState({ phone: '', amount: '', type: 'credit', description: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.phone || !form.amount) { toast.error('Phone number and amount required'); return; }
    setLoading(true);
    try {
      const { data } = await adminAPI.adjustWallet({ ...form, amount: parseFloat(form.amount) });
      toast.success(data.message);
      setForm({ phone: '', amount: '', type: 'credit', description: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Adjustment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.5rem', marginBottom: 24 }}>Wallet Management</h1>
      <div className="card" style={{ maxWidth: 500 }}>
        <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 20 }}>Manual Wallet Adjustment</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', fontWeight: 600 }}>User Phone Number</label>
            <div style={{ position: 'relative' }}>
              <FiPhone style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(165,180,252,0.5)' }} />
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input" placeholder="Enter user's registered phone" style={{ paddingLeft: 40 }} />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', fontWeight: 600 }}>Amount (₹)</label>
            <div style={{ position: 'relative' }}>
              <FiDollarSign style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(165,180,252,0.5)' }} />
              <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="input" placeholder="e.g. 500" style={{ paddingLeft: 40 }} min="1" step="1" />
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 8, fontSize: '0.85rem', fontWeight: 600 }}>Action Type</label>
            <div style={{ display: 'flex', gap: 12 }}>
              {['credit', 'debit'].map((t) => (
                <button key={t} type="button" onClick={() => setForm({ ...form, type: t })} style={{ flex: 1, padding: '12px', borderRadius: 12, border: `2px solid ${form.type === t ? (t === 'credit' ? 'rgba(16,185,129,0.5)' : 'rgba(239,68,68,0.5)') : 'rgba(99,102,241,0.2)'}`, background: form.type === t ? (t === 'credit' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)') : 'transparent', color: form.type === t ? (t === 'credit' ? '#10b981' : '#ef4444') : 'rgba(226,232,240,0.6)', cursor: 'pointer', fontWeight: 700, textTransform: 'capitalize' }}>
                  {t === 'credit' ? '+ Add Money' : '- Deduct Money'}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', fontWeight: 600 }}>Description</label>
            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input" placeholder="Reason for adjustment (optional)" />
          </div>
          <button type="submit" disabled={loading} className="btn-primary" style={{ justifyContent: 'center', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', marginTop: 4 }}>
            {loading ? <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : 'Execute Transaction'}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
};

export default WalletManagement;
