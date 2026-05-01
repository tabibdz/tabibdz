import { useState, useEffect } from 'react';
import { supabase } from '../../supabase';
import { T } from '../theme';
import StatCard from '../components/StatCard';

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('fr-FR') : '—';

export default function BackofficeDashboard() {
  const [stats, setStats] = useState({ doctors: null, patients: null, appointments: null, today: null });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const today = new Date().toISOString().split('T')[0];
    const [
      { count: doctors },
      { count: patients },
      { count: appointments },
      { count: todayCount },
      { data: recent },
    ] = await Promise.all([
      supabase.from('doctors').select('*', { count: 'exact', head: true }),
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('appointments').select('*', { count: 'exact', head: true }),
      supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('appointment_date', today),
      supabase.from('users').select('full_name, email, wilaya, created_at').order('created_at', { ascending: false }).limit(5),
    ]);
    setStats({ doctors, patients, appointments, today: todayCount });
    setRecentUsers(recent || []);
    setLoading(false);
  };

  return (
    <div>
      <h1 style={{ color: T.textPrimary, fontWeight: 800, fontSize: 26, marginBottom: 6 }}>Tableau de bord</h1>
      <p style={{ color: T.textMuted, fontSize: 14, marginBottom: 32 }}>Vue d'ensemble de la plateforme TabibDZ</p>

      {/* Stat cards */}
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 40 }}>
        <StatCard icon="👨‍⚕️" label="Total Médecins" value={loading ? '…' : stats.doctors} color={T.accent} />
        <StatCard icon="👥" label="Total Patients" value={loading ? '…' : stats.patients} color={T.success} />
        <StatCard icon="📅" label="Total RDV" value={loading ? '…' : stats.appointments} color={T.warning} />
        <StatCard icon="🗓️" label="RDV Aujourd'hui" value={loading ? '…' : stats.today} color={T.danger} />
      </div>

      {/* Recent signups */}
      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 14, padding: 28 }}>
        <h2 style={{ color: T.textPrimary, fontWeight: 700, fontSize: 17, marginBottom: 20 }}>Dernières inscriptions</h2>

        {loading && <p style={{ color: T.textMuted, fontSize: 14 }}>⏳ Chargement...</p>}
        {!loading && recentUsers.length === 0 && <p style={{ color: T.textMuted, fontSize: 14 }}>Aucun utilisateur.</p>}

        {recentUsers.map((u, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 0', borderBottom: i < recentUsers.length - 1 ? `1px solid ${T.border}` : 'none', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: `${T.accent}28`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.accent, fontWeight: 800, fontSize: 14, flexShrink: 0 }}>
                {(u.full_name || '?').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div style={{ color: T.textPrimary, fontWeight: 600, fontSize: 14 }}>{u.full_name || '—'}</div>
                <div style={{ color: T.textMuted, fontSize: 12 }}>{u.email}</div>
              </div>
            </div>
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{ color: T.textSecondary, fontSize: 12 }}>{u.wilaya || '—'}</div>
              <div style={{ color: T.textMuted, fontSize: 11, marginTop: 2 }}>{fmtDate(u.created_at)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
