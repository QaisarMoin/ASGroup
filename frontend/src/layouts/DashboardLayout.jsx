import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  FiHome, FiUser, FiDollarSign, FiList, FiUsers, FiGitBranch,
  FiShield, FiLogOut, FiMenu, FiX, FiTrendingUp, FiArrowDownCircle,
  FiChevronRight, FiSettings
} from 'react-icons/fi';

const navItems = [
  { path: '/dashboard', icon: FiHome, label: 'Dashboard' },
  { path: '/dashboard/profile', icon: FiUser, label: 'My Profile' },
  { path: '/dashboard/wallet', icon: FiHome, label: 'Wallet' },
  { path: '/dashboard/transactions', icon: FiList, label: 'Transactions' },
  { path: '/dashboard/team', icon: FiUsers, label: 'My Team' },
  { path: '/dashboard/tree', icon: FiGitBranch, label: 'MLM Tree' },
  { path: '/dashboard/kyc', icon: FiShield, label: 'KYC' },
  { path: '/dashboard/earnings', icon: FiTrendingUp, label: 'Earnings' },
  { path: '/dashboard/withdrawals', icon: FiArrowDownCircle, label: 'Withdrawals' },
];

const adminItems = [
  { path: '/admin', icon: FiSettings, label: 'Admin Panel' },
];

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f0f23' }}>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 105 }}
            className="lg-hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`sidebar ${sidebarOpen ? 'open' : ''}`}
        style={{
          width: 260, flexShrink: 0, display: 'flex', flexDirection: 'column',
          position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 110,
        }}
        initial={false}
      >
        {/* Logo */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="gradient-bg" style={{ width: 40, height: 40, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18 }}>
              AS
            </div>
            <div>
              <p style={{ fontWeight: 800, fontSize: '1rem', fontFamily: 'Outfit, sans-serif' }}>AS Group</p>
              <p style={{ fontSize: '0.75rem', color: 'rgba(165,180,252,0.7)' }}>MLM Platform</p>
            </div>
          </div>
          <button 
            className="lg-hidden" 
            onClick={() => setSidebarOpen(false)}
            style={{ background: 'none', border: 'none', color: 'rgba(226,232,240,0.5)', cursor: 'pointer', padding: 4 }}
          >
            <FiX size={20} />
          </button>
        </div>

        {/* User info */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(99,102,241,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>
              {user?.fullName?.[0]?.toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '0.85rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.fullName}</p>
              <p style={{ fontSize: '0.7rem', color: 'rgba(165,180,252,0.6)' }}>Ref: {user?.referralCode}</p>
            </div>
          </div>
        </div>

        {/* Nav items */}
        <nav style={{ flex: 1, padding: '12px 12px', overflowY: 'auto' }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`sidebar-item ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
                style={{ textDecoration: 'none', marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <item.icon size={18} />
                  <span style={{ fontSize: '0.9rem' }}>{item.label}</span>
                </div>
                {isActive && <FiChevronRight size={14} style={{ color: '#6366f1' }} />}
              </Link>
            );
          })}

          {user?.role === 'admin' && (
            <>
              <div style={{ padding: '20px 12px 8px', fontSize: '0.7rem', fontWeight: 700, color: 'rgba(165,180,252,0.4)', textTransform: 'uppercase', letterSpacing: 1 }}>Admin</div>
              {adminItems.map((item) => {
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`sidebar-item ${isActive ? 'active' : ''}`}
                    onClick={() => setSidebarOpen(false)}
                    style={{ textDecoration: 'none', marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <item.icon size={18} />
                      <span style={{ fontSize: '0.9rem' }}>{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </>
          )}
        </nav>

        {/* Logout */}
        <div style={{ padding: '12px' }}>
          <button
            onClick={handleLogout}
            className="sidebar-item"
            style={{ width: '100%', border: 'none', background: 'rgba(239,68,68,0.1)', color: '#ef4444', cursor: 'pointer' }}
          >
            <FiLogOut size={18} />
            <span style={{ fontSize: '0.9rem' }}>Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Main content */}
      <div style={{ flex: 1, marginLeft: 260, display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', maxWidth: '100%', overflowX: 'hidden' }} className="responsive-main">
        {/* Top bar */}
        <header style={{ background: 'rgba(15,15,35,0.9)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(99,102,241,0.15)', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 30 }}>
          <button
            className="lg-hidden"
            onClick={() => setSidebarOpen(true)}
            style={{ background: 'none', border: 'none', color: '#e2e8f0', cursor: 'pointer', padding: 8 }}
          >
            <FiMenu size={22} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginLeft: 'auto' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user?.fullName}</p>
              <p style={{ fontSize: '0.75rem', color: 'rgba(165,180,252,0.6)' }}>
                Balance: ₹{user?.walletBalance?.toFixed(2) || '0.00'}
              </p>
            </div>
          </div>
        </header>

        <main style={{ flex: 1, padding: '16px', overflowY: 'auto' }}>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {children}
          </motion.div>
        </main>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .responsive-main { margin-left: 0 !important; }
          aside { transform: ${sidebarOpen ? 'translateX(0)' : 'translateX(-100%)'}; transition: transform 0.3s ease; }
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
