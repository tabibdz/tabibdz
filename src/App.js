import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import './App.css';
import DoctorProfile from './DoctorProfile';
import ReviewModal from './ReviewModal';
import DoctorRegister from './DoctorRegister';
import DoctorDashboard from './DoctorDashboard';

const SPECIALTIES = [
  'Tous', 'Cardiologue', 'Dermatologue', 'Pédiatre',
  'Généraliste', 'Ophtalmologue', 'Dentiste', 'Gynécologue'
];

const WILAYAS = [
  'Toutes', 'Alger', 'Oran', 'Constantine', 'Annaba',
  'Blida', 'Sétif', 'Tlemcen', 'Béjaïa'
];

const S = {
  input: { width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #e0e8f5', fontSize: 14, outline: 'none', fontFamily: 'inherit', color: '#333', background: 'white' },
  btnPrimary: { background: 'linear-gradient(135deg, #0057b8, #0096c7)', color: 'white', border: 'none', padding: '12px 28px', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', width: '100%' },
  btnOutline: { background: 'none', border: '1.5px solid #0057b8', color: '#0057b8', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' },
  card: { background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 16px rgba(0,0,0,0.07)' },
  label: { fontSize: 12, fontWeight: 700, color: '#666', display: 'block', marginBottom: 6 },
};

function BookingModal({ doctor, user, onClose, onBooked }) {
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const days = Array.from({ length: 5 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return {
      label: date.toLocaleDateString('fr-DZ', { weekday: 'short', day: 'numeric', month: 'short' }),
      value: date.toISOString().split('T')[0],
    };
  });

  const slots = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

  const confirmBooking = async () => {
    if (!selectedDay || !selectedSlot) return;
    setLoading(true);
    const { error } = await supabase.from('appointments').insert({
      user_id: user.id,
      doctor_id: doctor.id,
      appointment_date: selectedDay,
      appointment_time: selectedSlot,
      status: 'confirmed',
      type: 'Consultation',
      price: doctor.price,
      payment_status: 'unpaid'
    });
    if (error) { console.log(error); alert('Erreur — réessayez.'); }
    else { setConfirmed(true); onBooked(); }
    setLoading(false);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)', padding: 16 }}>
      <div style={{ ...S.card, width: '100%', maxWidth: 480, position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#999' }}>✕</button>
        {confirmed ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>✅</div>
            <h2 style={{ fontWeight: 800, fontSize: 22, color: '#1a1a2e', marginBottom: 8 }}>Rendez-vous confirmé!</h2>
            <p style={{ color: '#666', marginBottom: 24 }}>Un SMS de confirmation vous sera envoyé.</p>
            <div style={{ background: '#f0f6ff', borderRadius: 14, padding: 20, textAlign: 'left', marginBottom: 24 }}>
              {[['👨‍⚕️ Médecin', doctor.full_name], ['🏥 Spécialité', doctor.specialty], ['📅 Date', selectedDay], ['⏰ Heure', selectedSlot], ['💰 Prix', `${doctor.price} DA`]].map(([label, value]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 14 }}>
                  <span style={{ color: '#888' }}>{label}</span>
                  <span style={{ fontWeight: 700, color: '#1a1a2e' }}>{value}</span>
                </div>
              ))}
            </div>
            <button onClick={onClose} style={S.btnPrimary}>Fermer</button>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', gap: 14, marginBottom: 24, paddingRight: 32 }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, background: 'linear-gradient(135deg, #0057b8, #0096c7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 18, flexShrink: 0 }}>
                {doctor.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 18, color: '#1a1a2e' }}>{doctor.full_name}</div>
                <div style={{ color: '#0057b8', fontWeight: 600 }}>{doctor.specialty}</div>
                <div style={{ color: '#888', fontSize: 13 }}>📍 {doctor.wilaya} · 💰 {doctor.price} DA</div>
              </div>
            </div>
            <h3 style={{ fontWeight: 700, fontSize: 15, color: '#1a1a2e', marginBottom: 12 }}>📅 Choisissez un jour</h3>
            <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
              {days.map(day => (
                <button key={day.value} onClick={() => setSelectedDay(day.value)}
                  style={{ padding: '10px 14px', borderRadius: 10, border: '1.5px solid', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, transition: 'all 0.2s', borderColor: selectedDay === day.value ? '#0057b8' : '#e0e8f5', background: selectedDay === day.value ? '#0057b8' : 'white', color: selectedDay === day.value ? 'white' : '#555' }}>
                  {day.label}
                </button>
              ))}
            </div>
            {selectedDay && (
              <>
                <h3 style={{ fontWeight: 700, fontSize: 15, color: '#1a1a2e', marginBottom: 12 }}>⏰ Choisissez un horaire</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 24 }}>
                  {slots.map(slot => (
                    <button key={slot} onClick={() => setSelectedSlot(slot)}
                      style={{ padding: '10px', borderRadius: 10, border: '1.5px solid', cursor: 'pointer', fontFamily: 'inherit', fontSize: 14, fontWeight: 700, transition: 'all 0.2s', borderColor: selectedSlot === slot ? '#0057b8' : '#e0e8f5', background: selectedSlot === slot ? '#0057b8' : 'white', color: selectedSlot === slot ? 'white' : '#333' }}>
                      {slot}
                    </button>
                  ))}
                </div>
              </>
            )}
            <button onClick={confirmBooking} disabled={!selectedDay || !selectedSlot || loading}
              style={{ ...S.btnPrimary, opacity: (!selectedDay || !selectedSlot) ? 0.4 : 1, cursor: (!selectedDay || !selectedSlot) ? 'not-allowed' : 'pointer' }}>
              {loading ? '⏳ Confirmation...' : '✅ Confirmer le rendez-vous'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function LoginScreen({ onClose, onSwitchToRegister, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) { setError('Veuillez remplir tous les champs.'); return; }
    setLoading(true); setError('');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError('Email ou mot de passe incorrect. Vérifiez votre boîte email pour confirmer votre compte.');
      setLoading(false);
    } else {
      await onLogin(data.user);
      onClose();
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)', padding: 16 }}>
      <div style={{ ...S.card, width: '100%', maxWidth: 420, position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#999' }}>✕</button>
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
          Pas encore de compte ?{' '}<span onClick={onSwitchToRegister} style={{ color: '#0057b8', fontWeight: 700, cursor: 'pointer' }}>S'inscrire</span>
        </div>
      </div>
    </div>
  );
}

function RegisterScreen({ onClose, onSwitchToLogin }) {
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
    const { error: authError } = await supabase.auth.signUp({ email: form.email, password: form.password });
    if (authError) { setError(authError.message); setLoading(false); return; }
    await supabase.from('users').insert({ full_name: form.full_name, email: form.email, phone: form.phone });
    setSuccess(true);
    setLoading(false);
  };

  if (success) return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)', padding: 16 }}>
      <div style={{ ...S.card, width: '100%', maxWidth: 420, textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 16 }}>📧</div>
        <h2 style={{ fontWeight: 800, fontSize: 22, color: '#1a1a2e', marginBottom: 8 }}>Vérifiez votre email!</h2>
        <p style={{ color: '#666', marginBottom: 24 }}>Un email de confirmation a été envoyé à <strong>{form.email}</strong>. Cliquez sur le lien pour activer votre compte.</p>
        <button onClick={onClose} style={S.btnPrimary}>Fermer</button>
      </div>
    </div>
  );

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)', padding: 16 }}>
      <div style={{ ...S.card, width: '100%', maxWidth: 420, position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#999' }}>✕</button>
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
          Déjà un compte ?{' '}<span onClick={onSwitchToLogin} style={{ color: '#0057b8', fontWeight: 700, cursor: 'pointer' }}>Se connecter</span>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [specialty, setSpecialty] = useState('Tous');
  const [wilaya, setWilaya] = useState('Toutes');
  const [searched, setSearched] = useState(false);
  const [screen, setScreen] = useState(null);
  const [user, setUser] = useState(null);
  const [isDoctor, setIsDoctor] = useState(false);
  const [bookingDoctor, setBookingDoctor] = useState(null);
  const [profileDoctor, setProfileDoctor] = useState(null);
  const [reviewAppointment, setReviewAppointment] = useState(null);
  const [showDoctorRegister, setShowDoctorRegister] = useState(false);
  const [showMyRdv, setShowMyRdv] = useState(false);
  const [myAppointments, setMyAppointments] = useState([]);
  const [rdvLoading, setRdvLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data } = await supabase
          .from('doctors')
          .select('id')
          .eq('auth_id', session.user.id)
          .single();
        setIsDoctor(!!data);
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    setUser(session?.user ?? null);
    if (session?.user) {
      supabase.from('doctors').select('id').eq('auth_id', session.user.id).single()
        .then(({ data }) => setIsDoctor(!!data));
    } else {
      setIsDoctor(false);
    }
  });
    return () => subscription.unsubscribe();
  }, []);

  const fetchMyAppointments = async () => {
    if (!user) return;
    setRdvLoading(true);
    setShowMyRdv(true);
    const { data, error } = await supabase
      .from('appointments')
      .select('*, doctors(full_name, specialty, wilaya)')
      .eq('user_id', user.id)
      .order('appointment_date', { ascending: false });
    if (error) console.log('ERROR:', error);
    else setMyAppointments(data);
    setRdvLoading(false);
  };

  const searchDoctors = async (overrideSpecialty) => {
    setLoading(true);
    setSearched(true);
    setShowMyRdv(false);
    const sp = overrideSpecialty || specialty;
    let query = supabase.from('doctors').select('*').eq('is_active', true);
    if (sp !== 'Tous') query = query.ilike('specialty', sp);
    if (wilaya !== 'Toutes') query = query.ilike('wilaya', wilaya);
    const { data, error } = await query;
    if (error) console.log(error);
    else setDoctors(data);
    setLoading(false);
  };

  // Show doctor dashboard if logged in as doctor
  if (isDoctor && user) {
    return <DoctorDashboard user={user} onLogout={() => { supabase.auth.signOut(); setUser(null); setIsDoctor(false); }} />;
  }

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: '#f0f6ff', minHeight: '100vh' }}>

      {/* MODALS */}
      {showDoctorRegister && (
        <DoctorRegister
          onClose={() => setShowDoctorRegister(false)}
          onSwitchToLogin={() => { setShowDoctorRegister(false); setScreen('login'); }}
        />
      )}
      {reviewAppointment && (
        <ReviewModal
          appointment={reviewAppointment}
          user={user}
          onClose={() => setReviewAppointment(null)}
          onReviewed={() => { fetchMyAppointments(); }}
        />
      )}
      {profileDoctor && (
        <DoctorProfile
          doctor={profileDoctor}
          user={user}
          onClose={() => setProfileDoctor(null)}
          onBook={(doc) => {
            setProfileDoctor(null);
            if (!user) { setScreen('login'); }
            else { setBookingDoctor(doc); }
          }}
        />
      )}
      {bookingDoctor && user && (
        <BookingModal doctor={bookingDoctor} user={user} onClose={() => setBookingDoctor(null)} onBooked={() => setTimeout(() => setBookingDoctor(null), 3000)} />
      )}
      {screen === 'login' && <LoginScreen onClose={() => setScreen(null)} onSwitchToRegister={() => setScreen('register')} onLogin={u => setUser(u)} />}
      {screen === 'register' && <RegisterScreen onClose={() => setScreen(null)} onSwitchToLogin={() => setScreen('login')} onLogin={u => setUser(u)} />}

      {/* HEADER */}
      <div style={{ background: 'linear-gradient(135deg, #0057b8, #0096c7)', padding: '0 16px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => { setSearched(false); setDoctors([]); setShowMyRdv(false); }}>
            <span style={{ fontSize: 28 }}>🩺</span>
            <span style={{ color: 'white', fontWeight: 800, fontSize: 22 }}>TabibDZ</span>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {user ? (
              <>
                {!isMobile && <span style={{ color: 'white', fontSize: 13 }}>👋 {user.email}</span>}
                <button onClick={fetchMyAppointments} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', padding: '8px 12px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit', fontSize: 13 }}>📋 {!isMobile && 'Mes '}RDV</button>
                <button onClick={() => setShowDoctorRegister(true)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', padding: '8px 12px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit', fontSize: 13 }}>🩺 {!isMobile && 'Espace '}Médecin</button>
                <button onClick={() => { supabase.auth.signOut(); setUser(null); }} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', padding: '8px 12px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit', fontSize: 13 }}>
                  {isMobile ? '🚪' : 'Déconnexion'}
                </button>
              </>
            ) : (
              <>
                <button onClick={() => setShowDoctorRegister(true)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit', fontSize: 13 }}>🩺 {!isMobile && 'Espace '}Médecin</button>
                <button onClick={() => setScreen('login')} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit', fontSize: 13 }}>Connexion</button>
                <button onClick={() => setScreen('register')} style={{ background: 'white', border: 'none', color: '#0057b8', padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontFamily: 'inherit', fontSize: 13 }}>S'inscrire</button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* HERO */}
      <div style={{ background: 'linear-gradient(135deg, #0057b8, #0096c7)', padding: isMobile ? '40px 16px 60px' : '60px 24px 80px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ color: 'white', fontSize: isMobile ? 28 : 42, fontWeight: 900, marginBottom: 16, lineHeight: 1.2 }}>
            Votre santé, simplifiée 🇩🇿
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: isMobile ? 14 : 18, marginBottom: 40 }}>
            Trouvez un médecin et prenez rendez-vous en ligne — partout en Algérie
          </p>
          <div style={{ background: 'white', borderRadius: 16, padding: isMobile ? 16 : 24, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr auto', gap: 12 }}>
              <div>
                <label style={S.label}>SPÉCIALITÉ</label>
                <select value={specialty} onChange={e => setSpecialty(e.target.value)} style={S.input}>
                  {SPECIALTIES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={S.label}>WILAYA</label>
                <select value={wilaya} onChange={e => setWilaya(e.target.value)} style={S.input}>
                  {WILAYAS.map(w => <option key={w}>{w}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: isMobile ? 'stretch' : 'flex-end' }}>
                <button onClick={() => searchDoctors()}
                  style={{ background: 'linear-gradient(135deg, #0057b8, #0096c7)', color: 'white', border: 'none', padding: '12px 28px', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', width: '100%', fontFamily: 'inherit' }}>
                  🔍 Rechercher
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div style={{ maxWidth: 1100, margin: '-30px auto 0', padding: '0 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: isMobile ? 8 : 16 }}>
          {[['1,240+', 'Médecins partenaires', '👨‍⚕️'], ['58', 'Wilayas couvertes', '📍'], ['24/7', 'Disponible', '⏰']].map(([val, lab, icon]) => (
            <div key={lab} style={{ background: 'white', borderRadius: 14, padding: isMobile ? '12px 8px' : '20px 24px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
              <div style={{ fontSize: isMobile ? 20 : 28, marginBottom: 4 }}>{icon}</div>
              <div style={{ fontSize: isMobile ? 18 : 28, fontWeight: 800, color: '#0057b8' }}>{val}</div>
              <div style={{ fontSize: isMobile ? 10 : 13, color: '#888', marginTop: 2 }}>{lab}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth: 1100, margin: '40px auto', padding: isMobile ? '0 12px 60px' : '0 24px 60px' }}>

        {/* MES RDV */}
        {showMyRdv && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h2 style={{ fontWeight: 800, fontSize: 22, color: '#1a1a2e' }}>📋 Mes Rendez-vous</h2>
              <button onClick={() => setShowMyRdv(false)} style={S.btnOutline}>← Retour</button>
            </div>
            {rdvLoading && <div style={{ textAlign: 'center', padding: 60 }}><div style={{ fontSize: 48 }}>⏳</div></div>}
            {!rdvLoading && myAppointments.length === 0 && (
              <div style={{ textAlign: 'center', padding: 60, background: 'white', borderRadius: 16 }}>
                <div style={{ fontSize: 48 }}>📭</div>
                <p style={{ color: '#666', marginTop: 16 }}>Aucun rendez-vous pour l'instant.</p>
                <button onClick={() => setShowMyRdv(false)} style={{ ...S.btnPrimary, marginTop: 20, width: 'auto', padding: '10px 24px' }}>Prendre un RDV</button>
              </div>
            )}
            {!rdvLoading && myAppointments.map(appt => (
              <div key={appt.id} style={{ ...S.card, marginBottom: 16, display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: isMobile ? 12 : 0 }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg, #0057b8, #0096c7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 16, flexShrink: 0 }}>
                    {appt.doctors?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '?'}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: '#1a1a2e' }}>{appt.doctors?.full_name || 'Médecin inconnu'}</div>
                    <div style={{ color: '#0057b8', fontSize: 13, fontWeight: 600 }}>{appt.doctors?.specialty} · 📍 {appt.doctors?.wilaya}</div>
                    <div style={{ color: '#888', fontSize: 13, marginTop: 4 }}>📅 {appt.appointment_date} · ⏰ {appt.appointment_time?.slice(0, 5)}</div>
                  </div>
                </div>
                <div style={{ textAlign: isMobile ? 'left' : 'right' }}>
                  <div style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 99, fontSize: 12, fontWeight: 700, marginBottom: 8, background: appt.status === 'confirmed' ? '#d1fae5' : appt.status === 'cancelled' ? '#fee2e2' : '#fef3c7', color: appt.status === 'confirmed' ? '#065f46' : appt.status === 'cancelled' ? '#991b1b' : '#92400e' }}>
                    {appt.status === 'confirmed' ? '✅ Confirmé' : appt.status === 'cancelled' ? '❌ Annulé' : '⏳ En attente'}
                  </div>
                  <div style={{ fontWeight: 800, color: '#0057b8', fontSize: 15 }}>{appt.price ? `${appt.price} DA` : '—'}</div>
                  {appt.status === 'confirmed' && (
                    <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap', justifyContent: isMobile ? 'flex-start' : 'flex-end' }}>
                      <button
                        onClick={async () => {
                          await supabase.from('appointments').update({ status: 'cancelled' }).eq('id', appt.id);
                          fetchMyAppointments();
                        }}
                        style={{ background: 'none', border: '1px solid #fca5a5', color: '#ef4444', padding: '5px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'inherit' }}>
                        Annuler
                      </button>
                      <button
                        onClick={() => setReviewAppointment(appt)}
                        style={{ background: 'none', border: '1px solid #fbbf24', color: '#d97706', padding: '5px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'inherit' }}>
                        ⭐ Avis
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SPECIALTIES */}
        {!searched && !showMyRdv && (
          <>
            <h2 style={{ fontWeight: 800, fontSize: 22, color: '#1a1a2e', marginBottom: 20 }}>Spécialités populaires</h2>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 14 }}>
              {[['❤️', 'Cardiologue'], ['🦷', 'Dentiste'], ['👁️', 'Ophtalmologue'], ['👶', 'Pédiatre'], ['🧴', 'Dermatologue'], ['🤱', 'Gynécologue'], ['🧠', 'Neurologue'], ['🦴', 'Orthopédiste']].map(([icon, name]) => (
                <div key={name} onClick={() => { setSpecialty(name); searchDoctors(name); }}
                  style={{ background: 'white', borderRadius: 14, padding: '20px 16px', textAlign: 'center', cursor: 'pointer', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', transition: 'transform 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#333' }}>{name}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* LOADING */}
        {loading && (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <div style={{ fontSize: 48 }}>⏳</div>
            <p style={{ color: '#666', marginTop: 16, fontSize: 16 }}>Recherche en cours...</p>
          </div>
        )}

        {/* RESULTS */}
        {searched && !loading && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontWeight: 800, fontSize: isMobile ? 18 : 22, color: '#1a1a2e' }}>{doctors.length} médecin(s) trouvé(s)</h2>
              <button onClick={() => { setSearched(false); setDoctors([]); setSpecialty('Tous'); setWilaya('Toutes'); }} style={S.btnOutline}>← Retour</button>
            </div>
            {doctors.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 60, background: 'white', borderRadius: 16 }}>
                <div style={{ fontSize: 48 }}>🔍</div>
                <p style={{ color: '#666', marginTop: 16 }}>Aucun médecin trouvé.</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
                {doctors.map(doc => (
                  <div key={doc.id} style={{ ...S.card, transition: 'transform 0.2s', cursor: 'pointer' }}
                    onClick={() => setProfileDoctor(doc)}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                    <div style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
                      <div style={{ width: 56, height: 56, borderRadius: 14, background: 'linear-gradient(135deg, #0057b8, #0096c7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 18, flexShrink: 0 }}>
                        {doc.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 16, color: '#1a1a2e' }}>{doc.full_name} {doc.is_verified ? '✅' : ''}</div>
                        <div style={{ color: '#0057b8', fontSize: 13, fontWeight: 600 }}>{doc.specialty}</div>
                        <div style={{ color: '#888', fontSize: 12 }}>📍 {doc.wilaya}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14, borderTop: '1px solid #f0f4f8' }}>
                      <div><span style={{ color: '#f59e0b' }}>★ </span><span style={{ fontWeight: 700, fontSize: 14 }}>{doc.rating || '—'}</span></div>
                      <span style={{ fontWeight: 800, color: '#0057b8', fontSize: 15 }}>{doc.price ? `${doc.price} DA` : '—'}</span>
                      <button onClick={e => { e.stopPropagation(); !user ? setScreen('login') : setBookingDoctor(doc); }}
                        style={{ background: 'linear-gradient(135deg, #0057b8, #0096c7)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 13, fontFamily: 'inherit' }}>
                        Prendre RDV
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* FOOTER */}
      <div style={{ background: '#1a1a2e', padding: '40px 24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 12 }}>
          <span style={{ fontSize: 24 }}>🩺</span>
          <span style={{ color: 'white', fontWeight: 800, fontSize: 20 }}>TabibDZ</span>
        </div>
        <p style={{ color: '#64748b', fontSize: 13, marginBottom: 24 }}>© 2026 TabibDZ — Plateforme de santé numérique — Algérie 🇩🇿</p>
        <div style={{ borderTop: '1px solid #2d3748', paddingTop: 24 }}>
          <p style={{ color: '#94a3b8', fontSize: 14, marginBottom: 16 }}>Vous êtes médecin ou clinique?</p>
          <button onClick={() => setShowDoctorRegister(true)}
            style={{ background: 'linear-gradient(135deg, #0057b8, #0096c7)', color: 'white', border: 'none', padding: '12px 28px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
            🩺 Rejoindre TabibDZ en tant que médecin
          </button>
        </div>
      </div>

    </div>
  );
}