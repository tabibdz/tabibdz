import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import { T } from './theme';

const NAV = [
  { to: '/backoffice', label: '📊 Tableau de bord', end: true },
  { to: '/backoffice/medecins', label: '👨‍⚕️ Médecins' },
  { to: '/backoffice/patients', label: '👥 Patients' },
  { to: '/backoffice/rendez-vous', label: '📅 Rendez-vous' },
];

export default function BackofficeLayout({ user }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/backoffice/connexion');
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", display: 'flex', minHeight: '100vh', background: T.bg }}>

      {/* SIDEBAR */}
      <div style={{ width: T.sidebarWidth, minWidth: T.sidebarWidth, background: T.surface, borderRight: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' }}>

        {/* Logo */}
        <div style={{ padding: '22px 20px', borderBottom: `1px solid ${T.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 22 }}>🩺</span>
            <div>
              <div style={{ color: T.textPrimary, fontWeight: 800, fontSize: 15, lineHeight: 1.2 }}>TabibDZ</div>
              <div style={{ color: T.accent, fontSize: 11, fontWeight: 600, letterSpacing: '0.04em' }}>ADMINISTRATION</div>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: '14px 10px' }}>
          {NAV.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              style={({ isActive }) => ({
                display: 'block',
                padding: '10px 12px',
                borderRadius: 8,
                marginBottom: 2,
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: isActive ? 700 : 500,
                color: isActive ? T.accent : T.textSecondary,
                background: isActive ? `${T.accent}18` : 'transparent',
                transition: 'all 0.15s',
              })}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: '14px 16px', borderTop: `1px solid ${T.border}` }}>
          <div style={{ color: T.textMuted, fontSize: 12, marginBottom: 10, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            👤 {user?.email}
          </div>
          <button onClick={handleLogout}
            style={{ width: '100%', padding: '8px 12px', borderRadius: 8, border: `1px solid ${T.border}`, background: 'transparent', color: T.textSecondary, fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' }}>
            ⏻ Déconnexion
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '36px 40px', minWidth: 0 }}>
        <Outlet />
      </div>
    </div>
  );
}
