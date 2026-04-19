import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

const S = {
  input: { width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #e0e8f5', fontSize: 14, outline: 'none', fontFamily: 'inherit', color: '#333', background: 'white' },
  btnPrimary: { background: 'linear-gradient(135deg, #0057b8, #0096c7)', color: 'white', border: 'none', padding: '12px 28px', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', width: '100%' },
  label: { fontSize: 12, fontWeight: 700, color: '#666', display: 'block', marginBottom: 6 },
  card: { background: 'white', borderRadius: 16, padding: 32, boxShadow: '0 2px 16px rgba(0,0,0,0.07)' },
};

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => navigate('/'), 3000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  const handleSubmit = async () => {
    if (!password || !confirm) { setError('Veuillez remplir tous les champs.'); return; }
    if (password !== confirm) { setError('Les mots de passe ne correspondent pas.'); return; }
    if (password.length < 6) { setError('Le mot de passe doit avoir au moins 6 caractères.'); return; }
    setLoading(true); setError('');
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: '#f0f6ff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ ...S.card, width: '100%', maxWidth: 420 }}>
        {success ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <h2 style={{ fontWeight: 800, fontSize: 22, color: '#1a1a2e', marginBottom: 12 }}>Mot de passe mis à jour!</h2>
            <p style={{ color: '#666', fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
              Vous êtes maintenant connecté. Redirection automatique dans 3 secondes...
            </p>
            <button onClick={() => navigate('/')} style={S.btnPrimary}>Aller à l'accueil</button>
          </div>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>🔐</div>
              <h2 style={{ fontWeight: 800, fontSize: 22, color: '#1a1a2e', marginBottom: 4 }}>Nouveau mot de passe</h2>
              <p style={{ color: '#888', fontSize: 14 }}>Choisissez un nouveau mot de passe sécurisé</p>
            </div>
            {error && <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: 10, padding: '10px 14px', marginBottom: 16, color: '#e11d48', fontSize: 13 }}>⚠️ {error}</div>}
            <div style={{ marginBottom: 14 }}>
              <label style={S.label}>NOUVEAU MOT DE PASSE</label>
              <input value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" type="password" style={S.input} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={S.label}>CONFIRMER MOT DE PASSE</label>
              <input value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••" type="password" style={S.input} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
            </div>
            <button onClick={handleSubmit} style={S.btnPrimary} disabled={loading}>
              {loading ? '⏳ Mise à jour...' : '✅ Mettre à jour le mot de passe'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
