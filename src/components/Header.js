import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import useIsMobile from '../hooks/useIsMobile';

export default function Header({ user, isDoctor }) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div style={{ background: 'linear-gradient(135deg, #0057b8, #0096c7)', padding: '0 16px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 64 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => navigate('/')}>
          <span style={{ fontSize: 28 }}>🩺</span>
          <span style={{ color: 'white', fontWeight: 800, fontSize: 22 }}>TabibDZ</span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          {user ? (
            <>
              {!isMobile && <span style={{ color: 'white', fontSize: 13 }}>👋 {user.email}</span>}
              <button onClick={() => navigate('/mes-rdv')} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', padding: '8px 12px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit', fontSize: 13 }}>📋 {!isMobile && 'Mes '}RDV</button>
              <button onClick={() => navigate(isDoctor ? '/pro/dashboard' : '/pro/inscription')} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', padding: '8px 12px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit', fontSize: 13 }}>🩺 {!isMobile && 'Espace '}Médecin</button>
              <button onClick={handleLogout} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', padding: '8px 12px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit', fontSize: 13 }}>{isMobile ? '🚪' : 'Déconnexion'}</button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/pro/inscription')} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit', fontSize: 13 }}>🩺 {!isMobile && 'Espace '}Médecin</button>
              <button onClick={() => navigate('/connexion')} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit', fontSize: 13 }}>Connexion</button>
              <button onClick={() => navigate('/inscription')} style={{ background: 'white', border: 'none', color: '#0057b8', padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontFamily: 'inherit', fontSize: 13 }}>S'inscrire</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
