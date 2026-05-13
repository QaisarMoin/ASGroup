import { useState, useEffect } from 'react';
import { teamAPI } from '../../services/api';
import DashboardLayout from '../../layouts/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FiUser } from 'react-icons/fi';

const MyTeam = () => {
  const [team, setTeam] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  const fetchTeam = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await teamAPI.getDirect({ page, limit: 15 });
      setTeam(data.users || []);
      setPagination({ page: data.page, pages: data.pages, total: data.total });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTeam(); }, []);

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.5rem' }}>My Team</h1>
        <div style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 20, padding: '6px 14px', fontSize: '0.85rem', color: '#a5b4fc' }}>
          {pagination.total} Direct Referrals
        </div>
      </div>

      {loading ? <LoadingSpinner /> : (
        <>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Joining Amt</th>
                  <th>Status</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {team.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: 60, color: 'rgba(165,180,252,0.4)' }}>
                      <FiUser size={40} style={{ margin: '0 auto 12px', display: 'block', opacity: 0.4 }} />
                      No team members yet. Share your referral link!
                    </td>
                  </tr>
                ) : team.map((m) => (
                  <tr key={m._id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                          {m.fullName?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{m.fullName}</p>
                          <p style={{ fontSize: '0.75rem', color: 'rgba(165,180,252,0.5)' }}>{m.referralCode}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{m.email}</td>
                    <td style={{ fontSize: '0.85rem' }}>{m.phone}</td>
                    <td style={{ fontWeight: 600, color: '#10b981' }}>₹{m.joiningAmount}</td>
                    <td>
                      <span className={m.isActive ? 'badge-success' : 'badge-danger'}>
                        {m.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ color: 'rgba(226,232,240,0.6)', fontSize: '0.85rem' }}>
                      {new Date(m.createdAt).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination.pages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
              {[...Array(pagination.pages)].map((_, i) => (
                <button key={i} onClick={() => fetchTeam(i + 1)}
                  style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid rgba(99,102,241,0.3)', background: pagination.page === i + 1 ? '#6366f1' : 'transparent', color: '#e2e8f0', cursor: 'pointer', fontWeight: 600 }}>
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </DashboardLayout>
  );
};

export default MyTeam;
