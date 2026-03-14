import { useState } from 'react';
import { supabase } from './supabase';

const SPECIALTIES = [
  'Cardiologue', 'Dermatologue', 'Pédiatre', 'Généraliste',
  'Ophtalmologue', 'Dentiste', 'Gynécologue', 'Neurologue',
  'Orthopédiste', 'Psychiatre', 'Urologue', 'ORL',
  'Rhumatologue', 'Endocrinologue', 'Gastro-entérologue'
];

const WILAYAS = [
  'Alger', 'Oran', 'Constantine', 'Annaba', 'Blida',
  'Sétif', 'Tlemcen', 'Béjaïa', 'Batna', 'Djelfa',
  'Sidi Bel Abbès', 'Biskra', 'Tébessa', 'Skikda', 'Médéa'
];

const S = {
  input: { width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #e0e8f5', fontSize: 14, outline: 'none', fontFamily: 'inherit', color: '#333', background: 'white', boxSizing: 'border-box' },
  label: { fontSize: 12, fontWeight: 700, color: '#666', display: 'block', marginBottom: 6 },
  btnPrimary: { background: 'linear-gradient(135deg, #0057b8, #0096c7)', color: 'white', border: 'none', padding: '14px', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', width: '100%', fontFamily: 'inherit' },
};

export default function DoctorRegister({ onClose, onSwitchToLogin }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', password: '', confirm: '',
    specialty: '', wilaya: '', address: '', price: '', bio: '',
    diploma: '', years_experience: ''
  });

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const validateStep1 = () => {
    if (!form.full_name || !form.email || !form.phone || !form.password || !form.confirm) {
      setError('Veuillez remplir tous les champs.'); return false;
    }
    if (form.password !== form.confirm) {
      setError('Les mots de passe ne correspondent pas.'); return false;
    }
    if (form.password.length < 6) {
      setError('Le mot de passe doit avoir au moins 6 caractères.'); return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!form.specialty || !form.wilaya || !form.address || !form.price) {
      setError('Veuillez remplir tous les champs obligatoires.'); return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;
    setLoading(true);
    setError('');

    // Create auth account
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (authError) { setError(authError.message); setLoading(false); return; }

    // Save doctor profile — status pending until admin approves
    const { error: dbError } = await supabase.from('doctors').insert({
      full_name: form.full_name,
      email: form.email,
      phone: form.phone,
      specialty: form.specialty,
      wilaya: form.wilaya,
      address: form.address,
      price: parseInt(form.price),
      bio: form.bio,
      is_verified: false,
      is_active: false, // not active until admin approves
      rating: 0,
      auth_id: authData.user?.id,
    });

    if (dbError) { setError(dbError.message); setLoading(false); return; }

    setSuccess(true);
    setLoading(false);
  };

  if (success) return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)', padding: 16 }}>
      <div style={{ background: 'white', borderRadius: 20, padding: 40, maxWidth: 440, width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
        <h2 style={{ fontWeight: 800, fontSize: 22, color: '#1a1a2e', marginBottom: 12 }}>Demande envoyée!</h2>
        <p style={{ color: '#666', lineHeight: 1.6, marginBottom: 24 }}>
          Votre demande d'inscription a été reçue. Notre équipe va vérifier vos informations et activer votre compte sous <strong>48h</strong>.
        </p>
        <div style={{ background: '#f0f6ff', borderRadius: 14, padding: 16, marginBottom: 24, textAlign: 'left' }}>
          {[['👤 Nom', form.full_name], ['📧 Email', form.email], ['🏥 Spécialité', form.specialty], ['📍 Wilaya', form.wilaya]].map(([label, value]) => (
            <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
              <span style={{ color: '#888' }}>{label}</span>
              <span style={{ fontWeight: 700 }}>{value}</span>
            </div>
          ))}
        </div>
        <button onClick={onClose} style={S.btnPrimary}>Fermer</button>
      </div>
    </div>
  );

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)', padding: 16 }}>
      <div style={{ background: 'white', borderRadius: 20, width: '100%', maxWidth: 500, maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>

        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg, #0057b8, #0096c7)', padding: '24px 28px', borderRadius: '20px 20px 0 0' }}>
          <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', fontSize: 16 }}>✕</button>
          <div style={{ fontSize: 32, marginBottom: 8 }}>🩺</div>
          <h2 style={{ color: 'white', fontWeight: 800, fontSize: 20, marginBottom: 4 }}>Inscription Médecin</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13 }}>Rejoignez TabibDZ et gérez vos rendez-vous</p>

          {/* Steps indicator */}
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            {[1, 2].map(s => (
              <div key={s} style={{ flex: 1, height: 4, borderRadius: 99, background: s <= step ? 'white' : 'rgba(255,255,255,0.3)', transition: 'all 0.3s' }} />
            ))}
          </div>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, marginTop: 6 }}>
            Étape {step} sur 2 — {step === 1 ? 'Informations personnelles' : 'Informations professionnelles'}
          </p>
        </div>

        <div style={{ padding: 28 }}>
          {error && (
            <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: 10, padding: '10px 14px', marginBottom: 16, color: '#e11d48', fontSize: 13 }}>
              ⚠️ {error}
            </div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <>
              {[
                { field: 'full_name', label: 'NOM COMPLET *', placeholder: 'Dr. Mohamed Larbi', type: 'text' },
                { field: 'email', label: 'EMAIL *', placeholder: 'docteur@email.com', type: 'email' },
                { field: 'phone', label: 'TÉLÉPHONE *', placeholder: '+213 555 000 111', type: 'tel' },
                { field: 'password', label: 'MOT DE PASSE *', placeholder: '••••••••', type: 'password' },
                { field: 'confirm', label: 'CONFIRMER MOT DE PASSE *', placeholder: '••••••••', type: 'password' },
              ].map(({ field, label, placeholder, type }) => (
                <div key={field} style={{ marginBottom: 14 }}>
                  <label style={S.label}>{label}</label>
                  <input value={form[field]} onChange={e => { update(field, e.target.value); setError(''); }}
                    placeholder={placeholder} type={type} style={S.input} />
                </div>
              ))}
              <button onClick={() => { if (validateStep1()) { setError(''); setStep(2); } }}
                style={S.btnPrimary}>
                Continuer →
              </button>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <div style={{ marginBottom: 14 }}>
                <label style={S.label}>SPÉCIALITÉ *</label>
                <select value={form.specialty} onChange={e => { update('specialty', e.target.value); setError(''); }} style={S.input}>
                  <option value="">Choisir une spécialité...</option>
                  {SPECIALTIES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={S.label}>WILAYA *</label>
                <select value={form.wilaya} onChange={e => { update('wilaya', e.target.value); setError(''); }} style={S.input}>
                  <option value="">Choisir une wilaya...</option>
                  {WILAYAS.map(w => <option key={w}>{w}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={S.label}>ADRESSE DU CABINET *</label>
                <input value={form.address} onChange={e => { update('address', e.target.value); setError(''); }}
                  placeholder="24 rue Didouche Mourad, Alger" style={S.input} />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={S.label}>PRIX CONSULTATION (DA) *</label>
                <input value={form.price} onChange={e => { update('price', e.target.value); setError(''); }}
                  placeholder="2000" type="number" style={S.input} />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={S.label}>BIO / PRÉSENTATION (optionnel)</label>
                <textarea value={form.bio} onChange={e => update('bio', e.target.value)}
                  placeholder="Décrivez votre expérience, vos spécialisations..."
                  rows={3} style={{ ...S.input, resize: 'none' }} />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setStep(1)}
                  style={{ flex: 1, background: 'none', border: '1.5px solid #e0e8f5', color: '#666', padding: '14px', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' }}>
                  ← Retour
                </button>
                <button onClick={handleSubmit} disabled={loading}
                  style={{ ...S.btnPrimary, flex: 2 }}>
                  {loading ? '⏳ Envoi...' : '🚀 Soumettre ma demande'}
                </button>
              </div>
            </>
          )}

          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#888' }}>
            Déjà inscrit ?{' '}
            <span onClick={onSwitchToLogin} style={{ color: '#0057b8', fontWeight: 700, cursor: 'pointer' }}>
              Se connecter
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}