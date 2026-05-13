import { useState, useEffect, useRef } from 'react';
import { teamAPI } from '../../services/api';
import DashboardLayout from '../../layouts/DashboardLayout';
import LoadingSpinner from '../../components/LoadingSpinner';
import Tree from 'react-d3-tree';

const MLMTree = () => {
  const [treeData, setTreeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    teamAPI.getTree()
      .then(({ data }) => {
        // Transform to react-d3-tree format
        const transformNode = (node) => ({
          name: node.name || 'Unknown',
          attributes: {
            Email: node.email,
            'Ref Code': node.referralCode,
            isSponsor: node.isSponsor || false,
          },
          children: (node.children || []).map(transformNode),
        });
        if (data.tree) setTreeData(transformNode(data.tree));
      })
      .finally(() => setLoading(false));
  }, []);

  const renderNode = ({ nodeDatum }) => {
    const isSponsor = nodeDatum.attributes?.isSponsor;
    const isMe = !isSponsor && nodeDatum.name !== 'Unknown'; // Rough heuristic, but visual works
    
    // Use gold/orange for sponsor, indigo for the rest
    const colorPrimary = isSponsor ? '#f59e0b' : '#6366f1';
    const colorLight = isSponsor ? '#fbbf24' : '#818cf8';
    
    return (
    <g>
      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={colorPrimary} floodOpacity="0.3" />
        </filter>
        <linearGradient id={`nodeGradient-${isSponsor ? 'sponsor' : 'regular'}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={colorLight} />
          <stop offset="100%" stopColor={colorPrimary} />
        </linearGradient>
      </defs>
      <circle r={28} fill={`url(#nodeGradient-${isSponsor ? 'sponsor' : 'regular'})`} filter="url(#shadow)" stroke={colorPrimary} strokeWidth={2} />
      {isSponsor && <text fill="#f59e0b" x={0} y={-70} textAnchor="middle" fontSize={12} fontWeight={700}>Upline</text>}
      <text fill="#ffffff" x={0} y={-45} textAnchor="middle" fontSize={14} fontWeight={800} style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
        {nodeDatum.name?.split(' ')[0]}
      </text>
      <rect x={-40} y={38} width={80} height={20} rx={10} fill="rgba(255,255,255,0.05)" stroke={`rgba(${isSponsor ? '245,158,11' : '99,102,241'},0.3)`} />
      <text fill={isSponsor ? '#fcd34d' : '#a5b4fc'} x={0} y={52} textAnchor="middle" fontSize={10} fontWeight={600}>
        {nodeDatum.attributes?.['Ref Code']}
      </text>
    </g>
    );
  };

  return (
    <DashboardLayout>
      <div className="mobile-column" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: 'clamp(1.2rem, 5vw, 1.8rem)', marginBottom: 4, background: 'linear-gradient(to right, #fff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>My Network Tree</h1>
          <p style={{ color: 'rgba(165,180,252,0.6)', fontSize: '0.85rem' }}>Interactive visualization of your team hierarchy</p>
        </div>
        <div style={{ background: 'rgba(99,102,241,0.1)', padding: '8px 16px', borderRadius: 12, border: '1px solid rgba(99,102,241,0.2)', fontSize: '0.85rem' }}>
          Total Team: <span style={{ color: '#6366f1', fontWeight: 800 }}>{treeData ? countNodes(treeData) : 0}</span>
        </div>
      </div>

      {loading ? <LoadingSpinner /> : !treeData ? (
        <div className="card" style={{ textAlign: 'center', padding: '80px 0', background: 'rgba(255,255,255,0.02)' }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>🌱</div>
          <p style={{ color: 'rgba(165,180,252,0.4)', fontSize: '1.1rem' }}>No team data available yet. Start referring!</p>
        </div>
      ) : (
        <div className="card" style={{ padding: 0, overflow: 'hidden', border: '1px solid rgba(99,102,241,0.2)', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
          <div ref={containerRef} style={{ width: '100%', height: 600, background: 'radial-gradient(circle at center, #161636 0%, #0f0f23 100%)' }}>
            <Tree
              data={treeData}
              orientation="vertical"
              pathFunc="step"
              translate={{ x: 400, y: 100 }}
              nodeSize={{ x: 200, y: 160 }}
              renderCustomNodeElement={renderNode}
              pathClassFunc={() => 'rd3t-link'}
              separation={{ siblings: 1.5, nonSiblings: 2 }}
              enableLegacyTransitions={true}
              transitionDuration={500}
            />
          </div>
          <div style={{ padding: '16px 24px', background: 'rgba(15,15,35,0.8)', borderTop: '1px solid rgba(99,102,241,0.1)', display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: '0.75rem', color: 'rgba(165,180,252,0.6)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>🖱️ Drag to pan</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>🔍 Scroll to zoom</span>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

// Helper to count actual downline nodes (excluding self and sponsor)
const countNodes = (node) => {
  let count = 0;
  // If it's a sponsor, don't count them, just count their children (which is us + our downline)
  // But wait, the user themselves isn't part of their OWN downline count.
  // We'll just recursively count all nodes that are NOT sponsor and NOT the root user.
  
  const walk = (n, isRoot = false) => {
    let c = (!n.attributes?.isSponsor && !isRoot) ? 1 : 0;
    if (n.children) {
      n.children.forEach(child => {
        // The first non-sponsor node is the user, so its direct children are the real downline
        c += walk(child, n.attributes?.isSponsor ? true : false);
      });
    }
    return c;
  };
  
  return walk(node, !node.attributes?.isSponsor);
};

export default MLMTree;
