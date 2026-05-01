import { useState } from 'react';
import { T } from '../theme';

export default function StatCard({ icon, label, value, color }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? '#263548' : T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 14,
        padding: '24px 28px',
        flex: '1 1 180px',
        minWidth: 160,
        transition: 'background 0.2s',
        cursor: 'default',
      }}
    >
      <div style={{ fontSize: 30, marginBottom: 14 }}>{icon}</div>
      <div style={{ fontSize: 38, fontWeight: 800, color: color || T.accent, lineHeight: 1, marginBottom: 8 }}>
        {value ?? '—'}
      </div>
      <div style={{ fontSize: 13, color: T.textSecondary }}>{label}</div>
    </div>
  );
}
