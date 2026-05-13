import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import AdminLayout from '../../layouts/AdminLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { FiSave } from 'react-icons/fi';

const CommissionSettings = () => {
  const [form, setForm] = useState({ '1': 20, '2': 10, '3': 5, '4': 3, '5': 2 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminAPI.getCommission()
      .then(({ data }) => {
        if (data.settings?.levelWiseCommission) {
          const map = {};
          Object.entries(data.settings.levelWiseCommission).forEach(([k, v]) => { map[k] = v; });
          setForm(map);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminAPI.updateCommission({ levelWiseCommission: form });
      toast.success('Commission settings updated!');
    } catch {
      toast.error('Failed to update');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <AdminLayout><LoadingSpinner /></AdminLayout>;

  return (
    <AdminLayout>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.5rem', marginBottom: 24 }}>Commission Settings</h1>
      <div className="card" style={{ maxWidth: 540 }}>
        {[1, 2, 3, 4, 5].map((lvl) => (
          <div key={lvl} style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <div style={{ width: 110, flexShrink: 0 }}>
              <p style={{ fontWeight: 600 }}>Level {lvl}</p>
              <p style={{ fontSize: '0.75rem', color: 'rgba(165,180,252,0.5)' }}>{lvl === 1 ? 'Direct Referrer' : `${lvl} levels up`}</p>
            </div>
            <div style={{ flex: 1, position: 'relative' }}>
              <input type="number" value={form[String(lvl)] || 0} min="0" max="100"
                onChange={(e) => setForm({ ...form, [String(lvl)]: parseFloat(e.target.value) || 0 })}
                className="input" style={{ paddingRight: 40 }} />
              <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(165,180,252,0.5)' }}>%</span>
            </div>
          </div>
        ))}
        <button onClick={handleSave} disabled={saving} className="btn-primary" style={{ width: '100%', justifyContent: 'center', background: 'linear-gradient(135deg,#ef4444,#f97316)', marginTop: 8 }}>
          {saving ? <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : <><FiSave /> Save</>}
        </button>
      </div>
    </AdminLayout>
  );
};

export default CommissionSettings;
