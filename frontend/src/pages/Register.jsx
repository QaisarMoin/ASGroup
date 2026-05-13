import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff, FiGift, FiUserPlus, FiDollarSign } from 'react-icons/fi';

const Register = () => {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', password: '', confirmPassword: '',
    referralCode: searchParams.get('ref') || '',
    joiningAmount: '1000',
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.phone || !form.password) {
      toast.error('All fields required'); return;
    }
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }

    setLoading(true);
    try {
      const { confirmPassword, ...submitData } = form;
      const data = await register(submitData);
      toast.success('Registration successful! Welcome to AS Group!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'fullName', label: 'Full Name', type: 'text', icon: FiUser, placeholder: 'John Doe' },
    { name: 'email', label: 'Email Address', type: 'email', icon: FiMail, placeholder: 'john@email.com' },
    { name: 'phone', label: 'Phone Number', type: 'tel', icon: FiPhone, placeholder: '+91 9876543210' },
    { name: 'joiningAmount', label: 'Joining Amount (₹)', type: 'number', icon: FiDollarSign, placeholder: '1000' },
    { name: 'referralCode', label: 'Referral Code (Optional)', type: 'text', icon: FiGift, placeholder: 'XXXXXXXX' },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#0f0f23 0%,#1a1a2e 50%,#16213e 100%)', padding: '30px 20px' }}>
      <div style={{ position: 'fixed', top: '10%', right: '10%', width: 350, height: 350, borderRadius: '50%', background: 'rgba(99,102,241,0.07)', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'fixed', bottom: '10%', left: '5%', width: 280, height: 280, borderRadius: '50%', background: 'rgba(139,92,246,0.07)', filter: 'blur(60px)', pointerEvents: 'none' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        style={{ width: '100%', maxWidth: 500 }}
      >
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div className="gradient-bg" style={{ width: 60, height: 60, borderRadius: 18, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 22, fontFamily: 'Outfit, sans-serif', marginBottom: 14 }}>
            AS
          </div>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.7rem' }}>Join AS Group</h1>
          <p style={{ color: 'rgba(165,180,252,0.7)', marginTop: 6 }}>Start your MLM journey today</p>
          {form.referralCode && (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 20, padding: '6px 14px', marginTop: 10 }}>
              <FiGift style={{ color: '#10b981' }} />
              <span style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: 600 }}>Referral: {form.referralCode}</span>
            </div>
          )}
        </div>

        <div className="glass-strong" style={{ borderRadius: 20, padding: '28px 28px' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {fields.map((f) => (
              <div key={f.name}>
                <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', fontWeight: 600, color: 'rgba(226,232,240,0.8)' }}>{f.label}</label>
                <div style={{ position: 'relative' }}>
                  <f.icon style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(165,180,252,0.5)', fontSize: 15 }} />
                  <input
                    type={f.type} name={f.name} value={form[f.name]}
                    onChange={handleChange} className="input" placeholder={f.placeholder}
                    style={{ paddingLeft: 40 }}
                  />
                </div>
              </div>
            ))}

            <div>
              <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', fontWeight: 600, color: 'rgba(226,232,240,0.8)' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <FiLock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(165,180,252,0.5)' }} />
                <input
                  type={showPass ? 'text' : 'password'} name="password" value={form.password}
                  onChange={handleChange} className="input" placeholder="Min. 6 characters"
                  style={{ paddingLeft: 40, paddingRight: 40 }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(165,180,252,0.5)', cursor: 'pointer' }}>
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', fontWeight: 600, color: 'rgba(226,232,240,0.8)' }}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <FiLock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(165,180,252,0.5)' }} />
                <input
                  type={showPass ? 'text' : 'password'} name="confirmPassword" value={form.confirmPassword}
                  onChange={handleChange} className="input" placeholder="Re-enter password"
                  style={{ paddingLeft: 40 }}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', fontSize: '1rem', padding: '14px', marginTop: 4 }}>
              {loading ? <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : <><FiUserPlus /> Create Account</>}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 18, color: 'rgba(226,232,240,0.6)', fontSize: '0.9rem' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#6366f1', fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
