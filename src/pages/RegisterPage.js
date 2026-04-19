import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

const S = {
  input: { width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #e0e8f5', fontSize: 14, outline: 'none', fontFamily: 'inherit', color: '#333', background: 'white' },
  btnPrimary: { background: 'linear-gradient(135deg, #0057b8, #0096c7)', color: 'white', border: 'none', padding: '12px 28px', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', width: '100%' },
  label: { fontSize: 12, fontWeight: 700, color: '#666', display: 'block', marginBottom: 6 },
  card: { background: 'white', borderRadius: 16, padding: 32, boxShadow: '0 2px 16px rgba(0,0,0,0.07)' },
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const handleRegister = async () => {
    if (!form.full_name || !form.email || !form.phone || !form.password) { setError('Veuillez remplir tous les champs.'); return; }
    if (form.password !== form.confirm) { setError('Les mots de passe ne correspondent pas.'); return; }
    if (form.password.length < 6) { setError('Le mot de passe doit avoir au moins 6 caractères.'); return; }
    setLoading(true); setError('');
    const { data: authData, error: authError } = await supabase.auth.signUp({ email: form.email, password: form.password });
    if (authError) { setError(authError.message); setLoading(false); return; }
    await supabase.from('users').insert({
      full_name: form.full_name,
      email: form.email,
      phone: form.phone,
      auth_id: authData?.user?.id
    });
    setSuccess(true);
    setLoading(false);
  };

  if (success) return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: '#f0f6ff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ ...S.card, width: '100%', maxWidth: 420, textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>📧</div>
        <h2 style={{ fontWeight: 800, fontSize: 22, color: '#1a1a2e', marginBottom: 8 }}>Vérifiez votre email!</h2>
        <p style={{ color: '#666', marginBottom: 24 }}>Un email de confirmation a été envoyé à <strong>{form.email}</strong>. Cliquez sur le lien pour activer votre compte.</p>
        <button onClick={() => navigate('/')} style={S.btnPrimary}>Retour à l'accueil</button>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: '#f0f6ff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ ...S.card, width: '100%', maxWidth: 420, maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🎉</div>
          <h2 style={{ fontWeight: 800, fontSize: 22, color: '#1a1a2e', marginBottom: 4 }}>Créer un compte</h2>
          <p style={{ color: '#888', fontSize: 14 }}>Rejoignez TabibDZ gratuitement</p>
        </div>
        {error && <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: 10, padding: '10px 14px', marginBottom: 16, color: '#e11d48', fontSize: 13 }}>⚠️ {error}</div>}
        {[
          { field: 'full_name', label: 'NOM COMPLET', placeholder: 'Mohamed Larbi', type: 'text' },
          { field: 'email', label: 'EMAIL', placeholder: 'votre@email.com', type: 'email' },
          { field: 'phone', label: 'TÉLÉPHONE', placeholder: '+213 555 000 111', type: 'tel' },
          { field: 'password', label: 'MOT DE PASSE', placeholder: '••••••••', type: 'password' },
          { field: 'confirm', label: 'CONFIRMER MOT DE PASSE', placeholder: '••••••••', type: 'password' },
        ].map(({ field, label, placeholder, type }) => (
          <div key={field} style={{ marginBottom: 14 }}>
            <label style={S.label}>{label}</label>
            <input value={form[field]} onChange={e => update(field, e.target.value)} placeholder={placeholder} type={type} style={S.input} />
          </div>
        ))}
        <button onClick={handleRegister} style={{ ...S.btnPrimary, marginTop: 6 }} disabled={loading}>{loading ? '⏳ Création...' : '🚀 Créer mon compte'}</button>
        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 14, color: '#888' }}>
          Déjà un compte ?{' '}<span onClick={() => navigate('/connexion')} style={{ color: '#0057b8', fontWeight: 700, cursor: 'pointer' }}>Se connecter</span>
        </div>
      </div>
    </div>
  );
}
