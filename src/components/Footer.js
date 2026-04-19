import { useNavigate } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();
  return (
    <div style={{ background: '#1a1a2e', padding: '40px 24px', textAlign: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 12 }}>
        <span style={{ fontSize: 24 }}>🩺</span>
        <span style={{ color: 'white', fontWeight: 800, fontSize: 20 }}>TabibDZ</span>
      </div>
      <p style={{ color: '#64748b', fontSize: 13, marginBottom: 24 }}>© 2026 TabibDZ — Plateforme de santé numérique — Algérie 🇩🇿</p>
      <div style={{ borderTop: '1px solid #2d3748', paddingTop: 24 }}>
        <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 16 }}>Vous êtes médecin ou clinique?</p>
        <button onClick={() => navigate('/pro/inscription')} style={{ background: 'linear-gradient(135deg, #0057b8, #0096c7)', color: 'white', border: 'none', padding: '12px 28px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
          🩺 Rejoindre TabibDZ en tant que médecin
        </button>
      </div>
    </div>
  );
}
