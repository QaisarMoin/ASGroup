import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, PublicRoute } from './routes/ProtectedRoute';

// Public pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// User pages
import UserDashboard from './pages/user/Dashboard';
import Profile from './pages/user/Profile';
import Wallet from './pages/user/Wallet';
import Transactions from './pages/user/Transactions';
import MyTeam from './pages/user/MyTeam';
import MLMTree from './pages/user/MLMTree';
import KYC from './pages/user/KYC';
import Earnings from './pages/user/Earnings';
import Withdrawals from './pages/user/Withdrawals';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UsersManagement from './pages/admin/UsersManagement';
import KYCManagement from './pages/admin/KYCManagement';
import CommissionSettings from './pages/admin/CommissionSettings';
import WithdrawalsAdmin from './pages/admin/WithdrawalsAdmin';
import AdminTransactions from './pages/admin/AdminTransactions';
import WalletManagement from './pages/admin/WalletManagement';

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1a2e',
            color: '#e2e8f0',
            border: '1px solid rgba(99,102,241,0.3)',
            borderRadius: '12px',
            fontSize: '0.9rem',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#0f0f23' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#0f0f23' } },
        }}
      />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* User Dashboard */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/dashboard/profile" element={<Profile />} />
          <Route path="/dashboard/wallet" element={<Wallet />} />
          <Route path="/dashboard/transactions" element={<Transactions />} />
          <Route path="/dashboard/team" element={<MyTeam />} />
          <Route path="/dashboard/tree" element={<MLMTree />} />
          <Route path="/dashboard/kyc" element={<KYC />} />
          <Route path="/dashboard/earnings" element={<Earnings />} />
          <Route path="/dashboard/withdrawals" element={<Withdrawals />} />
        </Route>

        {/* Admin Dashboard */}
        <Route element={<ProtectedRoute adminOnly />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UsersManagement />} />
          <Route path="/admin/kyc" element={<KYCManagement />} />
          <Route path="/admin/transactions" element={<AdminTransactions />} />
          <Route path="/admin/withdrawals" element={<WithdrawalsAdmin />} />
          <Route path="/admin/wallet" element={<WalletManagement />} />
          <Route path="/admin/commission" element={<CommissionSettings />} />
          <Route path="/admin/reports" element={<AdminDashboard />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
