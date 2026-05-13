import { useState, useEffect } from 'react';
import { kycAPI } from '../../services/api';
import DashboardLayout from '../../layouts/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import Badge from '../../components/Badge';
import toast from 'react-hot-toast';
import { FiUpload, FiCheck, FiAlertCircle } from 'react-icons/fi';

const KYC = () => {
  const [kycStatus, setKycStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    aadhaarNumber: '', panNumber: '', bankName: '', accountNumber: '', ifscCode: '',
    aadhaarImage: null, panImage: null,
  });

  useEffect(() => {
    kycAPI.getStatus()
      .then(({ data }) => setKycStatus(data.kyc))
      .finally(() => setLoading(false));
  }, []);

  const handleFileChange = (field, e) => {
    setForm({ ...form, [field]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const required = ['aadhaarNumber', 'panNumber', 'bankName', 'accountNumber', 'ifscCode'];
    for (const f of required) {
      if (!form[f]) { toast.error(`${f} is required`); return; }
    }
    if (!form.aadhaarImage || !form.panImage) { toast.error('Both ID images required'); return; }

    setUploading(true);
    try {
      const fd = new FormData();
      Object.keys(form).forEach((k) => {
        if (form[k]) fd.append(k, form[k]);
      });
      const { data } = await kycAPI.upload(fd);
      setKycStatus(data.kyc);
      toast.success('KYC submitted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'KYC submission failed');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <DashboardLayout><LoadingSpinner /></DashboardLayout>;

  return (
    <DashboardLayout>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.5rem', marginBottom: 8 }}>KYC Verification</h1>
      <p style={{ color: 'rgba(165,180,252,0.6)', fontSize: '0.85rem', marginBottom: 24 }}>Complete your KYC to enable withdrawals</p>

      {/* Status banner */}
      {kycStatus && (
        <div style={{ marginBottom: 24, padding: '16px 20px', borderRadius: 12, background: kycStatus.status === 'approved' ? 'rgba(16,185,129,0.1)' : kycStatus.status === 'rejected' ? 'rgba(239,68,68,0.1)' : 'rgba(245,158,11,0.1)', border: `1px solid ${kycStatus.status === 'approved' ? 'rgba(16,185,129,0.3)' : kycStatus.status === 'rejected' ? 'rgba(239,68,68,0.3)' : 'rgba(245,158,11,0.3)'}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {kycStatus.status === 'approved' ? <FiCheck style={{ color: '#10b981' }} /> : <FiAlertCircle style={{ color: kycStatus.status === 'rejected' ? '#ef4444' : '#f59e0b' }} />}
            <div>
              <p style={{ fontWeight: 600 }}>KYC Status: <Badge status={kycStatus.status} /></p>
              {kycStatus.adminRemark && <p style={{ fontSize: '0.85rem', marginTop: 4, opacity: 0.8 }}>Remark: {kycStatus.adminRemark}</p>}
            </div>
          </div>
        </div>
      )}

      {(!kycStatus || kycStatus.status === 'rejected') && (
        <div className="card" style={{ maxWidth: 700 }}>
          <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 20 }}>Submit KYC Documents</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { name: 'aadhaarNumber', label: 'Aadhaar Number', placeholder: 'XXXX XXXX XXXX' },
                { name: 'panNumber', label: 'PAN Number', placeholder: 'ABCDE1234F' },
                { name: 'bankName', label: 'Bank Name', placeholder: 'State Bank of India' },
                { name: 'accountNumber', label: 'Account Number', placeholder: 'XXXXXXXXXX' },
                { name: 'ifscCode', label: 'IFSC Code', placeholder: 'SBIN0000001' },
              ].map((f) => (
                <div key={f.name} style={{ gridColumn: f.name === 'bankName' ? 'span 2' : undefined }}>
                  <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', fontWeight: 600, color: 'rgba(226,232,240,0.8)' }}>{f.label}</label>
                  <input
                    type="text" name={f.name} value={form[f.name]} placeholder={f.placeholder}
                    onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                    className="input"
                  />
                </div>
              ))}
            </div>

            {/* File uploads */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { field: 'aadhaarImage', label: 'Aadhaar Card Image' },
                { field: 'panImage', label: 'PAN Card Image' },
              ].map((f) => (
                <div key={f.field}>
                  <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', fontWeight: 600, color: 'rgba(226,232,240,0.8)' }}>{f.label}</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', border: '2px dashed rgba(99,102,241,0.3)', borderRadius: 12, cursor: 'pointer', transition: 'all 0.3s', background: form[f.field] ? 'rgba(16,185,129,0.08)' : 'rgba(99,102,241,0.05)' }}>
                    {form[f.field] ? <FiCheck style={{ color: '#10b981' }} /> : <FiUpload style={{ color: '#6366f1' }} />}
                    <span style={{ fontSize: '0.85rem', color: form[f.field] ? '#10b981' : 'rgba(165,180,252,0.7)' }}>
                      {form[f.field] ? form[f.field].name : 'Click to upload (JPG/PNG/PDF)'}
                    </span>
                    <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileChange(f.field, e)} style={{ display: 'none' }} />
                  </label>
                </div>
              ))}
            </div>

            <button type="submit" className="btn-primary" disabled={uploading} style={{ justifyContent: 'center', padding: '14px', marginTop: 4 }}>
              {uploading ? <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : <><FiUpload /> Submit KYC</>}
            </button>
          </form>
        </div>
      )}
    </DashboardLayout>
  );
};

export default KYC;
