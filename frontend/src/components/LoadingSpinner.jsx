const LoadingSpinner = ({ size = 36, text = 'Loading...' }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0' }}>
    <div
      style={{
        width: size,
        height: size,
        border: '3px solid rgba(99,102,241,0.2)',
        borderTopColor: '#6366f1',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }}
    />
    {text && <p style={{ color: 'rgba(165,180,252,0.7)', marginTop: 16, fontSize: '0.9rem' }}>{text}</p>}
  </div>
);

export const PageSkeleton = () => (
  <div style={{ padding: 24 }}>
    <div className="skeleton" style={{ height: 32, width: '40%', marginBottom: 24 }} />
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
      {[...Array(4)].map((_, i) => (
        <div key={i} className="skeleton" style={{ height: 100, borderRadius: 16 }} />
      ))}
    </div>
    <div className="skeleton" style={{ height: 300, borderRadius: 16 }} />
  </div>
);

export default LoadingSpinner;
