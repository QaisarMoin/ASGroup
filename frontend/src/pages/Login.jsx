import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiLogIn, FiEye, FiEyeOff } from 'react-icons/fi';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error('All fields required'); return; }
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      toast.success(`Welcome back, ${data.user.fullName}!`);
      navigate(data.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#0f0f23 0%,#1a1a2e 50%,#16213e 100%)', padding: 20 }}>
      {/* Glow orbs */}
      <div style={{ position: 'fixed', top: '20%', left: '10%', width: 400, height: 400, borderRadius: '50%', background: 'rgba(99,102,241,0.08)', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '20%', right: '10%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(139,92,246,0.08)', filter: 'blur(60px)', pointerEvents: 'none' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: 440 }}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div className="gradient-bg" style={{ width: 64, height: 64, borderRadius: 20, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 24, fontFamily: 'Outfit, sans-serif', marginBottom: 16 }}>
            AS
          </div>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.8rem' }}>AS Group MLM</h1>
          <p style={{ color: 'rgba(165,180,252,0.7)', marginTop: 6 }}>Sign in to your account</p>
        </div>

        <div className="glass-strong" style={{ borderRadius: 20, padding: 32 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'block', marginBottom: 8, fontSize: '0.85rem', fontWeight: 600, color: 'rgba(226,232,240,0.8)' }}>Email Address</label>
              <div style={{ position: 'relative' }}>
                <FiMail style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(165,180,252,0.5)' }} />
                <input
                  type="email" name="email" value={form.email} onChange={handleChange}
                  className="input" placeholder="qaisarashraf685@gmail.com"
                  style={{ paddingLeft: 40 }} autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 8, fontSize: '0.85rem', fontWeight: 600, color: 'rgba(226,232,240,0.8)' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <FiLock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(165,180,252,0.5)' }} />
                <input
                  type={showPass ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange}
                  className="input" placeholder="••••••••"
                  style={{ paddingLeft: 40, paddingRight: 40 }} autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(165,180,252,0.5)', cursor: 'pointer' }}>
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', fontSize: '1rem', padding: '14px' }}>
              {loading ? <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : <><FiLogIn /> Sign In</>}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 20, color: 'rgba(226,232,240,0.6)', fontSize: '0.9rem' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#6366f1', fontWeight: 600, textDecoration: 'none' }}>Create Account</Link>
          </p>
        </div>

        <p style={{ textAlign: 'center', marginTop: 24, color: '#fff', fontSize: '0.8rem' }}>
          Admin:
          Email-  qaisarashraf685@gmail.com / Pass -qaisarashraf685@gmail.com
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
