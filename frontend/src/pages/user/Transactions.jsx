import { useState, useEffect } from 'react';
import { walletAPI } from '../../services/api';
import DashboardLayout from '../../layouts/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import Badge from '../../components/Badge';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await walletAPI.getTransactions({ page, limit: 15 });
      setTransactions(data.transactions || []);
      setPagination({ page: data.page, pages: data.pages, total: data.total });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTransactions(); }, []);

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.5rem' }}>Transactions</h1>
        <span style={{ color: 'rgba(165,180,252,0.6)', fontSize: '0.85rem' }}>{pagination.total} total</span>
      </div>

      {loading ? <LoadingSpinner /> : (
        <>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: 40, color: 'rgba(165,180,252,0.4)' }}>No transactions found</td></tr>
                ) : transactions.map((tx) => (
                  <tr key={tx._id}>
                    <td><Badge status={tx.transactionType} /></td>
                    <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tx.description || '—'}</td>
                    <td style={{ fontWeight: 700, color: tx.type === 'credit' ? '#10b981' : '#ef4444' }}>
                      {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toFixed(2)}
                    </td>
                    <td><Badge status={tx.status} /></td>
                    <td style={{ color: 'rgba(226,232,240,0.6)', fontSize: '0.85rem' }}>
                      {new Date(tx.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
              {[...Array(pagination.pages)].map((_, i) => (
                <button key={i} onClick={() => fetchTransactions(i + 1)}
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

export default Transactions;
