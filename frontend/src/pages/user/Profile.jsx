import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userAPI, BACKEND_URL } from '../../services/api';
import DashboardLayout from '../../layouts/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { FiUser, FiMail, FiPhone, FiSave, FiLock, FiCamera } from 'react-icons/fi';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState({ fullName: '', email: '', phone: '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [profileImg, setProfileImg] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [passLoading, setPassLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setProfile({ fullName: user.fullName || '', email: user.email || '', phone: user.phone || '' });
      setPreviewUrl(user.profileImage ? `${BACKEND_URL}/uploads/${user.profileImage.split('/').pop()}` : '');
    }
  }, [user]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImg(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('fullName', profile.fullName);
      formData.append('phone', profile.phone);
      if (profileImg) formData.append('profileImage', profileImg);

      const { data } = await userAPI.updateProfile(formData);
      updateUser(data.user);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (passwords.newPassword.length < 6) { toast.error('Password must be at least 6 chars'); return; }
    setPassLoading(true);
    try {
      await userAPI.changePassword({ currentPassword: passwords.currentPassword, newPassword: passwords.newPassword });
      toast.success('Password changed successfully!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password change failed');
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.5rem', marginBottom: 24 }}>My Profile</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
        {/* Profile update */}
        <div className="card">
          <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 20 }}>Personal Information</h2>

          {/* Avatar */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
            <div style={{ position: 'relative' }}>
              <div style={{ width: 90, height: 90, borderRadius: '50%', background: previewUrl ? 'transparent' : 'linear-gradient(135deg,#6366f1,#8b5cf6)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 800, border: '3px solid rgba(99,102,241,0.4)' }}>
                {previewUrl ? <img src={previewUrl} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : user?.fullName?.[0]?.toUpperCase()}
              </div>
              <label style={{ position: 'absolute', bottom: 0, right: 0, background: '#6366f1', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '2px solid #0f0f23' }}>
                <FiCamera size={12} />
                <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
              </label>
            </div>
          </div>

          <form onSubmit={handleProfileUpdate} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { name: 'fullName', label: 'Full Name', icon: FiUser, type: 'text' },
              { name: 'phone', label: 'Phone', icon: FiPhone, type: 'tel' },
            ].map((f) => (
              <div key={f.name}>
                <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', fontWeight: 600, color: 'rgba(226,232,240,0.8)' }}>{f.label}</label>
                <div style={{ position: 'relative' }}>
                  <f.icon style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(165,180,252,0.5)' }} size={15} />
                  <input
                    type={f.type} name={f.name} value={profile[f.name]}
                    onChange={(e) => setProfile({ ...profile, [f.name]: e.target.value })}
                    className="input" style={{ paddingLeft: 40 }}
                  />
                </div>
              </div>
            ))}

            <div>
              <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', fontWeight: 600, color: 'rgba(226,232,240,0.8)' }}>Email</label>
              <div style={{ position: 'relative' }}>
                <FiMail style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(165,180,252,0.3)' }} size={15} />
                <input value={profile.email} disabled className="input" style={{ paddingLeft: 40, opacity: 0.5 }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ flex: 1, background: 'rgba(99,102,241,0.08)', borderRadius: 10, padding: '10px', textAlign: 'center' }}>
                <p style={{ fontSize: '0.75rem', color: 'rgba(226,232,240,0.5)' }}>Referral Code</p>
                <p style={{ fontWeight: 700, color: '#a5b4fc', fontSize: '0.95rem' }}>{user?.referralCode}</p>
              </div>
              <div style={{ flex: 1, background: 'rgba(99,102,241,0.08)', borderRadius: 10, padding: '10px', textAlign: 'center' }}>
                <p style={{ fontSize: '0.75rem', color: 'rgba(226,232,240,0.5)' }}>Total Earnings</p>
                <p style={{ fontWeight: 700, color: '#10b981', fontSize: '0.95rem' }}>₹{user?.totalEarnings?.toFixed(2) || '0.00'}</p>
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ justifyContent: 'center' }}>
              {loading ? <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : <><FiSave /> Save Profile</>}
            </button>
          </form>
        </div>

        {/* Password change */}
        <div className="card">
          <h2 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 20 }}>Change Password</h2>
          <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { name: 'currentPassword', label: 'Current Password' },
              { name: 'newPassword', label: 'New Password' },
              { name: 'confirmPassword', label: 'Confirm New Password' },
            ].map((f) => (
              <div key={f.name}>
                <label style={{ display: 'block', marginBottom: 6, fontSize: '0.85rem', fontWeight: 600, color: 'rgba(226,232,240,0.8)' }}>{f.label}</label>
                <div style={{ position: 'relative' }}>
                  <FiLock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'rgba(165,180,252,0.5)' }} size={15} />
                  <input
                    type="password" name={f.name} value={passwords[f.name]}
                    onChange={(e) => setPasswords({ ...passwords, [f.name]: e.target.value })}
                    className="input" placeholder="••••••••" style={{ paddingLeft: 40 }}
                  />
                </div>
              </div>
            ))}
            <button type="submit" className="btn-primary" disabled={passLoading} style={{ justifyContent: 'center', marginTop: 8 }}>
              {passLoading ? <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : <><FiLock /> Update Password</>}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
