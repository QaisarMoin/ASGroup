import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import AdminLayout from '../../layouts/AdminLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import Badge from '../../components/Badge';
import toast from 'react-hot-toast';
import { FiCheck, FiX, FiEye } from 'react-icons/fi';

const KYCManagement = () => {
  const [kycs, setKycs] = useState([]);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [selected, setSelected] = useState(null);
  const [remark, setRemark] = useState('');

  const fetchKYC = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getKYC({ page, limit: 15, status: statusFilter });
      setKycs(data.kycs || []);
      setPagination({ page: data.page, pages: data.pages, total: data.total });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchKYC(); }, [statusFilter]);

  const handleProcess = async (id, status) => {
    setProcessing(id + status);
    try {
      const { data } = await adminAPI.updateKYC(id, { status, adminRemark: remark });
      toast.success(`KYC ${status}`);
      setSelected(null);
      setRemark('');
      fetchKYC();
    } catch (err) {
      toast.error('Failed to update KYC');
    } finally {
      setProcessing(null);
    }
  };

  return (
    <AdminLayout>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.5rem', marginBottom: 24 }}>KYC Management</h1>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['pending', 'approved', 'rejected', ''].map((s) => (
          <button key={s} onClick={() => { setStatusFilter(s); }} style={{ padding: '8px 16px', borderRadius: 20, border: `1px solid ${statusFilter === s ? 'rgba(239,68,68,0.5)' : 'rgba(99,102,241,0.2)'}`, background: statusFilter === s ? 'rgba(239,68,68,0.15)' : 'transparent', color: statusFilter === s ? '#f87171' : 'rgba(226,232,240,0.7)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
            {s || 'All'}
          </button>
        ))}
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="table-container">
          <table>
            <thead>
              <tr><th>User</th><th>Aadhaar</th><th>PAN</th><th>Bank</th><th>Status</th><th>Submitted</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {kycs.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'rgba(165,180,252,0.4)' }}>No KYC requests found</td></tr>
              ) : kycs.map((k) => (
                <tr key={k._id}>
                  <td>
                    <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{k.userId?.fullName}</p>
                    <p style={{ fontSize: '0.75rem', color: 'rgba(165,180,252,0.5)' }}>{k.userId?.email}</p>
                  </td>
                  <td style={{ fontSize: '0.85rem', fontFamily: 'monospace' }}>{k.aadhaarNumber}</td>
                  <td style={{ fontSize: '0.85rem', fontFamily: 'monospace' }}>{k.panNumber}</td>
                  <td style={{ fontSize: '0.85rem' }}>{k.bankName}</td>
                  <td><Badge status={k.status} /></td>
                  <td style={{ fontSize: '0.85rem', color: 'rgba(226,232,240,0.6)' }}>{new Date(k.createdAt).toLocaleDateString('en-IN')}</td>
                  <td>
                    {k.status === 'pending' && (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => setSelected(k)} style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 8, padding: '6px 10px', color: '#a5b4fc', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <FiEye size={14} /> Review
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div className="glass-strong" style={{ borderRadius: 20, padding: 28, maxWidth: 520, width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Review KYC — {selected.userId?.fullName}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              {[
                { l: 'Aadhaar', v: selected.aadhaarNumber },
                { l: 'PAN', v: selected.panNumber },
                { l: 'Bank', v: selected.bankName },
                { l: 'Account', v: selected.accountNumber },
                { l: 'IFSC', v: selected.ifscCode },
              ].map((f) => (
                <div key={f.l} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '10px' }}>
                  <p style={{ fontSize: '0.75rem', color: 'rgba(165,180,252,0.6)' }}>{f.l}</p>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem', fontFamily: 'monospace' }}>{f.v}</p>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              <a href={selected.aadhaarImage} target="_blank" rel="noreferrer" style={{ flex: 1, textAlign: 'center', padding: '10px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 10, color: '#a5b4fc', textDecoration: 'none', fontSize: '0.85rem' }}>View Aadhaar</a>
              <a href={selected.panImage} target="_blank" rel="noreferrer" style={{ flex: 1, textAlign: 'center', padding: '10px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 10, color: '#a5b4fc', textDecoration: 'none', fontSize: '0.85rem' }}>View PAN</a>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', fontWeight: 600 }}>Admin Remark</label>
              <textarea value={remark} onChange={(e) => setRemark(e.target.value)} className="input" rows={3} placeholder="Optional remark..." style={{ resize: 'none' }} />
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => handleProcess(selected._id, 'approved')} disabled={!!processing} style={{ flex: 1, padding: '12px', background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.4)', borderRadius: 12, color: '#10b981', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <FiCheck /> Approve
              </button>
              <button onClick={() => handleProcess(selected._id, 'rejected')} disabled={!!processing} style={{ flex: 1, padding: '12px', background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 12, color: '#ef4444', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <FiX /> Reject
              </button>
              <button onClick={() => { setSelected(null); setRemark(''); }} style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#e2e8f0', cursor: 'pointer', fontWeight: 600 }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default KYCManagement;
