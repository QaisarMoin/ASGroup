import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import AdminLayout from '../../layouts/AdminLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { FiSearch, FiToggleLeft, FiToggleRight } from 'react-icons/fi';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(null);

  const fetchUsers = async (page = 1, q = search) => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getUsers({ page, limit: 15, search: q });
      setUsers(data.users || []);
      setPagination({ page: data.page, pages: data.pages, total: data.total });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(1, search);
  };

  const handleToggle = async (id) => {
    setToggling(id);
    try {
      const { data } = await adminAPI.toggleUserStatus(id);
      setUsers((prev) => prev.map((u) => u._id === id ? { ...u, isActive: data.user.isActive } : u));
      toast.success(data.message);
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setToggling(null);
    }
  };

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.5rem' }}>Users Management</h1>
        <span style={{ color: 'rgba(251,146,60,0.7)', fontSize: '0.85rem' }}>{pagination.total} total users</span>
      </div>

      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <FiSearch style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(165,180,252,0.5)' }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} className="input" placeholder="Search by name, email, phone or referral code..." style={{ paddingLeft: 40 }} />
        </div>
        <button type="submit" className="btn-primary" style={{ padding: '12px 20px' }}>Search</button>
      </form>

      {loading ? <LoadingSpinner /> : (
        <div className="table-container">
          <table>
            <thead>
              <tr><th>User</th><th>Email</th><th>Phone</th><th>Ref Code</th><th>Referrals</th><th>Balance</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: 'rgba(165,180,252,0.4)' }}>No users found</td></tr>
              ) : users.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{u.fullName}</p>
                      <p style={{ fontSize: '0.75rem', color: 'rgba(165,180,252,0.5)' }}>{new Date(u.createdAt).toLocaleDateString('en-IN')}</p>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>{u.email}</td>
                  <td style={{ fontSize: '0.85rem' }}>{u.phone}</td>
                  <td><span style={{ fontFamily: 'monospace', color: '#a5b4fc', fontSize: '0.85rem' }}>{u.referralCode}</span></td>
                  <td style={{ textAlign: 'center' }}>{u.directReferralsCount}</td>
                  <td style={{ fontWeight: 600, color: '#10b981' }}>Rs.{u.walletBalance?.toFixed(2)}</td>
                  <td>
                    <span className={u.isActive ? 'badge-success' : 'badge-danger'}>{u.isActive ? 'Active' : 'Inactive'}</span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleToggle(u._id)}
                      disabled={toggling === u._id}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: u.isActive ? '#ef4444' : '#10b981', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', fontWeight: 600 }}
                    >
                      {u.isActive ? <FiToggleRight size={20} /> : <FiToggleLeft size={20} />}
                      {u.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {pagination.pages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
          {[...Array(pagination.pages)].map((_, i) => (
            <button key={i} onClick={() => fetchUsers(i + 1)}
              style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid rgba(239,68,68,0.3)', background: pagination.page === i + 1 ? '#ef4444' : 'transparent', color: '#e2e8f0', cursor: 'pointer', fontWeight: 600 }}>
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default UsersManagement;
