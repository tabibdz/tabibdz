import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

const S = {
  input: { width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #e0e8f5', fontSize: 14, outline: 'none', fontFamily: 'inherit', color: '#333', background: 'white' },
  btnPrimary: { background: 'linear-gradient(135deg, #0057b8, #0096c7)', color: 'white', border: 'none', padding: '12px 28px', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', width: '100%' },
  label: { fontSize: 12, fontWeight: 700, color: '#666', display: 'block', marginBottom: 6 },
  card: { background: 'white', borderRadius: 16, padding: 32, boxShadow: '0 2px 16px rgba(0,0,0,0.07)' },
};

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!email) { setError('Veuillez entrer votre adresse email.'); return; }
    setLoading(true); setError('');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password',
    });
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
            <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
            <h2 style={{ fontWeight: 800, fontSize: 22, color: '#1a1a2e', marginBottom: 12 }}>Email envoyé!</h2>
            <p style={{ color: '#666', fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
              Un email de réinitialisation a été envoyé à <strong>{email}</strong>. Vérifiez votre boîte de réception (et spam).
            </p>
            <span onClick={() => navigate('/connexion')} style={{ color: '#0057b8', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}>← Retour à la connexion</span>
          </div>
        ) : (
          <>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>🔑</div>
              <h2 style={{ fontWeight: 800, fontSize: 22, color: '#1a1a2e', marginBottom: 4 }}>Mot de passe oublié</h2>
              <p style={{ color: '#888', fontSize: 14 }}>Entrez votre email pour recevoir un lien de réinitialisation</p>
            </div>
            {error && <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: 10, padding: '10px 14px', marginBottom: 16, color: '#e11d48', fontSize: 13 }}>⚠️ {error}</div>}
            <div style={{ marginBottom: 20 }}>
              <label style={S.label}>EMAIL</label>
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="votre@email.com" type="email" style={S.input} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
            </div>
            <button onClick={handleSubmit} style={S.btnPrimary} disabled={loading}>
              {loading ? '⏳ Envoi...' : '📧 Envoyer le lien de réinitialisation'}
            </button>
            <div style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#888' }}>
              <span onClick={() => navigate('/connexion')} style={{ color: '#0057b8', fontWeight: 700, cursor: 'pointer' }}>← Retour à la connexion</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
