import { useEffect } from 'react';
import { T } from '../theme';

const formatValue = (val) => {
  if (val === null || val === undefined) return '—';
  if (typeof val === 'boolean') return val ? 'Oui' : 'Non';
  if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}/.test(val)) {
    return new Date(val).toLocaleDateString('fr-FR');
  }
  return String(val);
};

export default function DetailModal({ title, data, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.72)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9000, padding: 24 }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, width: '100%', maxWidth: 520, maxHeight: '85vh', overflowY: 'auto', padding: 28, position: 'relative' }}
      >
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: T.textMuted, fontSize: 20, cursor: 'pointer', lineHeight: 1 }}
        >✕</button>

        <h2 style={{ color: T.textPrimary, fontWeight: 800, fontSize: 18, marginBottom: 22, paddingRight: 32 }}>{title}</h2>

        <div>
          {Object.entries(data).map(([key, val]) => (
            <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '10px 0', borderBottom: `1px solid ${T.border}`, gap: 20 }}>
              <span style={{ color: T.textMuted, fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', flexShrink: 0, paddingTop: 1 }}>{key}</span>
              <span style={{ color: T.textPrimary, fontSize: 14, textAlign: 'right', wordBreak: 'break-word', maxWidth: '65%' }}>{formatValue(val)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
