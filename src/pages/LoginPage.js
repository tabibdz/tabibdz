import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

const S = {
  input: { width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #e0e8f5', fontSize: 14, outline: 'none', fontFamily: 'inherit', color: '#333', background: 'white' },
  btnPrimary: { background: 'linear-gradient(135deg, #0057b8, #0096c7)', color: 'white', border: 'none', padding: '12px 28px', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', width: '100%' },
  label: { fontSize: 12, fontWeight: 700, color: '#666', display: 'block', marginBottom: 6 },
  card: { background: 'white', borderRadius: 16, padding: 32, boxShadow: '0 2px 16px rgba(0,0,0,0.07)' },
};

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) { setError('Veuillez remplir tous les champs.'); return; }
    setLoading(true); setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError('Email ou mot de passe incorrect. Vérifiez votre boîte email pour confirmer votre compte.');
      setLoading(false);
    } else {
      navigate(-1);
    }
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: '#f0f6ff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ ...S.card, width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🩺</div>
          <h2 style={{ fontWeight: 800, fontSize: 22, color: '#1a1a2e', marginBottom: 4 }}>Connexion</h2>
          <p style={{ color: '#888', fontSize: 14 }}>Bon retour sur TabibDZ 👋</p>
        </div>
        {error && <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: 10, padding: '10px 14px', marginBottom: 16, color: '#e11d48', fontSize: 13 }}>⚠️ {error}</div>}
        <div style={{ marginBottom: 14 }}>
          <label style={S.label}>EMAIL</label>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="votre@email.com" type="email" style={S.input} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={S.label}>MOT DE PASSE</label>
          <input value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" type="password" style={S.input} onKeyDown={e => e.key === 'Enter' && handleLogin()} />
        </div>
        <button onClick={handleLogin} style={S.btnPrimary} disabled={loading}>{loading ? '⏳ Connexion...' : '🔐 Se connecter'}</button>
        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#888' }}>
          Pas encore de compte ?{' '}<span onClick={() => navigate('/inscription')} style={{ color: '#0057b8', fontWeight: 700, cursor: 'pointer' }}>S'inscrire</span>
        </div>
      </div>
    </div>
  );
}
