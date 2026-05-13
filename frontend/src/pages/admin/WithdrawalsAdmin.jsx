import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import AdminLayout from '../../layouts/AdminLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import Badge from '../../components/Badge';
import toast from 'react-hot-toast';
import { FiCheck, FiX } from 'react-icons/fi';

const WithdrawalsAdmin = () => {
  const [requests, setRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [remark, setRemark] = useState('');
  const [selected, setSelected] = useState(null);

  const fetchWithdrawals = async () => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getWithdrawals({ status: statusFilter, limit: 20 });
      setRequests(data.requests || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWithdrawals(); }, [statusFilter]);

  const handleProcess = async (id, status) => {
    setProcessing(id);
    try {
      await adminAPI.processWithdrawal(id, { status, adminRemark: remark });
      toast.success(`Withdrawal ${status}`);
      setSelected(null);
      setRemark('');
      fetchWithdrawals();
    } catch {
      toast.error('Failed to process withdrawal');
    } finally {
      setProcessing(null);
    }
  };

  return (
    <AdminLayout>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.5rem', marginBottom: 24 }}>Withdrawals</h1>
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['pending', 'approved', 'rejected'].map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)} style={{ padding: '8px 16px', borderRadius: 20, border: `1px solid ${statusFilter === s ? 'rgba(239,68,68,0.5)' : 'rgba(99,102,241,0.2)'}`, background: statusFilter === s ? 'rgba(239,68,68,0.15)' : 'transparent', color: statusFilter === s ? '#f87171' : 'rgba(226,232,240,0.7)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, textTransform: 'capitalize' }}>
            {s}
          </button>
        ))}
      </div>
      {loading ? <LoadingSpinner /> : (
        <div className="table-container">
          <table>
            <thead><tr><th>User</th><th>Amount</th><th>Status</th><th>Remark</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {requests.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'rgba(165,180,252,0.4)' }}>No requests found</td></tr>
              ) : requests.map((r) => (
                <tr key={r._id}>
                  <td>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{r.userId?.fullName}</p>
                    <p style={{ fontSize: '0.75rem', color: 'rgba(165,180,252,0.5)' }}>{r.userId?.email}</p>
                  </td>
                  <td style={{ fontWeight: 700, color: '#f59e0b' }}>Rs.{r.amount.toFixed(2)}</td>
                  <td><Badge status={r.status} /></td>
                  <td style={{ fontSize: '0.85rem', color: 'rgba(226,232,240,0.6)' }}>{r.adminRemark || 'N/A'}</td>
                  <td style={{ fontSize: '0.85rem', color: 'rgba(226,232,240,0.6)' }}>{new Date(r.createdAt).toLocaleDateString('en-IN')}</td>
                  <td>
                    {r.status === 'pending' && (
                      <button onClick={() => setSelected(r)} style={{ padding: '6px 12px', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 8, color: '#a5b4fc', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>
                        Process
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="glass-strong" style={{ borderRadius: 20, padding: 28, maxWidth: 440, width: '100%' }}>
            <h3 style={{ fontWeight: 700, marginBottom: 12 }}>Process Withdrawal</h3>
            <p style={{ marginBottom: 6 }}>User: <strong>{selected.userId?.fullName}</strong></p>
            <p style={{ marginBottom: 16 }}>Amount: <strong style={{ color: '#f59e0b' }}>Rs.{selected.amount.toFixed(2)}</strong></p>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', fontWeight: 600 }}>Admin Remark</label>
              <textarea value={remark} onChange={(e) => setRemark(e.target.value)} className="input" rows={3} placeholder="Optional..." style={{ resize: 'none' }} />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => handleProcess(selected._id, 'approved')} disabled={!!processing} style={{ flex: 1, padding: '12px', background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.4)', borderRadius: 12, color: '#10b981', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <FiCheck /> Approve
              </button>
              <button onClick={() => handleProcess(selected._id, 'rejected')} disabled={!!processing} style={{ flex: 1, padding: '12px', background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 12, color: '#ef4444', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <FiX /> Reject
              </button>
              <button onClick={() => { setSelected(null); setRemark(''); }} style={{ padding: '12px 14px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#e2e8f0', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default WithdrawalsAdmin;
