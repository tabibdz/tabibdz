import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import useIsMobile from '../hooks/useIsMobile';

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
  label: { fontSize: 12, fontWeight: 700, color: '#666', display: 'block', marginBottom: 6 },
};

export default function HomePage({ user, isDoctor }) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [specialty, setSpecialty] = useState('Tous');
  const [wilaya, setWilaya] = useState('Toutes');

  useEffect(() => {
    if (user && isDoctor) navigate('/pro/dashboard');
  }, [user, isDoctor, navigate]);

  const goSearch = (sp) => {
    const params = new URLSearchParams();
    if (sp || specialty !== 'Tous') params.set('specialty', sp || specialty);
    if (wilaya !== 'Toutes') params.set('wilaya', wilaya);
    navigate(`/medecins?${params.toString()}`);
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: '#f0f6ff', minHeight: '100vh' }}>
      <Header user={user} isDoctor={isDoctor} />

      {/* HERO */}
      <div style={{ background: 'linear-gradient(135deg, #0057b8, #0096c7)', padding: isMobile ? '40px 16px 60px' : '60px 24px 80px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ color: 'white', fontSize: isMobile ? 28 : 42, fontWeight: 900, marginBottom: 16, lineHeight: 1.2 }}>Votre santé, simplifiée 🇩🇿</h1>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: isMobile ? 14 : 18, marginBottom: 40 }}>Trouvez un médecin et prenez rendez-vous en ligne — partout en Algérie</p>
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
                <button onClick={() => goSearch()} style={{ background: 'linear-gradient(135deg, #0057b8, #0096c7)', color: 'white', border: 'none', padding: '12px 28px', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', width: '100%', fontFamily: 'inherit' }}>🔍 Rechercher</button>
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

      {/* SPECIALTIES GRID */}
      <div style={{ maxWidth: 1100, margin: '40px auto', padding: isMobile ? '0 12px 60px' : '0 24px 60px' }}>
        <h2 style={{ fontWeight: 800, fontSize: 22, color: '#1a1a2e', marginBottom: 20 }}>Spécialités populaires</h2>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 14 }}>
          {[['❤️', 'Cardiologue'], ['🦷', 'Dentiste'], ['👁️', 'Ophtalmologue'], ['👶', 'Pédiatre'], ['🧴', 'Dermatologue'], ['🤱', 'Gynécologue'], ['🧠', 'Neurologue'], ['🦴', 'Orthopédiste']].map(([icon, name]) => (
            <div key={name} onClick={() => goSearch(name)}
              style={{ background: 'white', borderRadius: 14, padding: '20px 16px', textAlign: 'center', cursor: 'pointer', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', transition: 'transform 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#333' }}>{name}</div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
