import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  FiHome, FiUsers, FiShield, FiList, FiSettings, FiDollarSign,
  FiLogOut, FiMenu, FiArrowDownCircle, FiBarChart2, FiChevronRight
} from 'react-icons/fi';

const adminNavItems = [
  { path: '/admin', icon: FiHome, label: 'Dashboard' },
  { path: '/admin/users', icon: FiUsers, label: 'Users' },
  { path: '/admin/kyc', icon: FiShield, label: 'KYC Management' },
  { path: '/admin/transactions', icon: FiList, label: 'Transactions' },
  { path: '/admin/withdrawals', icon: FiArrowDownCircle, label: 'Withdrawals' },
  { path: '/admin/wallet', icon: FiDollarSign, label: 'Wallet Mgmt' },
  { path: '/admin/commission', icon: FiSettings, label: 'Commission' },
  { path: '/admin/reports', icon: FiBarChart2, label: 'Reports' },
];

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a1a' }}>
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 40 }}
            className="lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        style={{
          width: 260, flexShrink: 0, background: 'rgba(10,10,26,0.97)', backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(99,102,241,0.15)', display: 'flex', flexDirection: 'column',
          position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 50,
        }}
      >
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(99,102,241,0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#ef4444,#f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16 }}>
              ADM
            </div>
            <div>
              <p style={{ fontWeight: 800, fontSize: '1rem', fontFamily: 'Outfit, sans-serif' }}>Admin Panel</p>
              <p style={{ fontSize: '0.75rem', color: 'rgba(251,146,60,0.7)' }}>AS Group MLM</p>
            </div>
          </div>
        </div>

        <div style={{ padding: '12px 20px', borderBottom: '1px solid rgba(99,102,241,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#ef4444,#f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>
              {user?.fullName?.[0]?.toUpperCase()}
            </div>
            <div>
              <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user?.fullName}</p>
              <span className="badge-danger" style={{ fontSize: '0.65rem' }}>Administrator</span>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '12px' }}>
          {adminNavItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                style={{
                  textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12,
                  padding: '11px 14px', borderRadius: 12, marginBottom: 4, fontWeight: 500,
                  fontSize: '0.9rem', transition: 'all 0.3s',
                  background: isActive ? 'rgba(239,68,68,0.15)' : 'transparent',
                  color: isActive ? '#f87171' : 'rgba(226,232,240,0.7)',
                  border: isActive ? '1px solid rgba(239,68,68,0.3)' : '1px solid transparent',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </div>
                {isActive && <FiChevronRight size={14} style={{ color: '#ef4444' }} />}
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: '12px' }}>
          <button
            onClick={handleLogout}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 12, border: 'none', background: 'rgba(239,68,68,0.1)', color: '#ef4444', cursor: 'pointer', fontWeight: 500, fontSize: '0.9rem' }}
          >
            <FiLogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <div style={{ flex: 1, marginLeft: 260, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <header style={{ background: 'rgba(10,10,26,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(239,68,68,0.15)', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 30 }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background: 'none', border: 'none', color: '#e2e8f0', cursor: 'pointer' }} className="lg:hidden">
            <FiMenu size={22} />
          </button>
          <h1 style={{ fontWeight: 700, fontSize: '1.1rem', fontFamily: 'Outfit, sans-serif', color: '#f87171', marginLeft: 'auto' }}>
            AS Group MLM — Admin
          </h1>
        </header>

        <main style={{ flex: 1, padding: 24 }}>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
