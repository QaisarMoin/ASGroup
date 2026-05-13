import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import AdminLayout from '../../layouts/AdminLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import Badge from '../../components/Badge';

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const fetchTx = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getTransactions({ page, limit: 15 });
      setTransactions(data.transactions || []);
      setPagination({ page: data.page, pages: data.pages, total: data.total });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTx(); }, []);

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.5rem' }}>All Transactions</h1>
        <span style={{ color: 'rgba(251,146,60,0.7)', fontSize: '0.85rem' }}>{pagination.total} records</span>
      </div>
      {loading ? <LoadingSpinner /> : (
        <>
          <div className="table-container">
            <table>
              <thead><tr><th>User</th><th>Type</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx._id}>
                    <td>
                      <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{tx.userId?.fullName || 'N/A'}</p>
                      <p style={{ fontSize: '0.75rem', color: 'rgba(165,180,252,0.5)' }}>{tx.userId?.email}</p>
                    </td>
                    <td><Badge status={tx.transactionType} /></td>
                    <td style={{ fontWeight: 700, color: tx.type === 'credit' ? '#10b981' : '#ef4444' }}>
                      {tx.type === 'credit' ? '+' : '-'}Rs.{tx.amount.toFixed(2)}
                    </td>
                    <td><Badge status={tx.status} /></td>
                    <td style={{ fontSize: '0.85rem', color: 'rgba(226,232,240,0.6)' }}>
                      {new Date(tx.createdAt).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {pagination.pages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
              {[...Array(pagination.pages)].map((_, i) => (
                <button key={i} onClick={() => fetchTx(i + 1)} style={{ width: 36, height: 36, borderRadius: 8, border: '1px solid rgba(239,68,68,0.3)', background: pagination.page === i + 1 ? '#ef4444' : 'transparent', color: '#e2e8f0', cursor: 'pointer', fontWeight: 600 }}>
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
};

export default AdminTransactions;
