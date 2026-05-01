import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabase';
import { T } from '../theme';

const inputStyle = {
  width: '100%', padding: '11px 14px', borderRadius: 8,
  border: `1px solid ${T.border}`, background: T.bg,
  color: T.textPrimary, fontSize: 14, outline: 'none',
  fontFamily: 'inherit', boxSizing: 'border-box',
};

const labelStyle = {
  fontSize: 11, fontWeight: 700, color: T.textMuted,
  display: 'block', marginBottom: 6,
  textTransform: 'uppercase', letterSpacing: '0.05em',
};

export default function BackofficeLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) { setError('Veuillez remplir tous les champs.'); return; }
    setLoading(true); setError('');

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) { setError(authError.message); setLoading(false); return; }

    const { data: userRow } = await supabase
      .from('users')
      .select('is_admin')
      .eq('auth_id', authData.user.id)
      .maybeSingle();

    if (!userRow?.is_admin) {
      await supabase.auth.signOut();
      setError('Accès refusé — compte non-administrateur');
      setLoading(false);
      return;
    }

    navigate('/backoffice');
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: T.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: 40, width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🩺</div>
          <h1 style={{ color: T.textPrimary, fontWeight: 800, fontSize: 24, marginBottom: 4 }}>TabibDZ Admin</h1>
          <p style={{ color: T.textMuted, fontSize: 14 }}>Espace d'administration</p>
        </div>

        {error && (
          <div style={{ background: `${T.danger}22`, border: `1px solid ${T.danger}44`, borderRadius: 10, padding: '10px 14px', marginBottom: 20, color: T.danger, fontSize: 13 }}>
            ⚠️ {error}
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>EMAIL</label>
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="admin@email.com" style={inputStyle} />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={labelStyle}>MOT DE PASSE</label>
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="••••••••"
            onKeyDown={e => e.key === 'Enter' && handleLogin()} style={inputStyle} />
        </div>

        <button onClick={handleLogin} disabled={loading}
          style={{ width: '100%', padding: '12px', borderRadius: 8, border: 'none', background: T.accent, color: 'white', fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, fontFamily: 'inherit' }}>
          {loading ? '⏳ Connexion...' : '🔐 Se connecter'}
        </button>
      </div>
    </div>
  );
}
