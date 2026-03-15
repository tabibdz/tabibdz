import { useState, useEffect } from 'react';
import { supabase } from './supabase';

const S = {
  card: { background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 16px rgba(0,0,0,0.07)' },
  btnPrimary: { background: 'linear-gradient(135deg, #0057b8, #0096c7)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' },
  btnDanger: { background: 'none', border: '1px solid #fca5a5', color: '#ef4444', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'inherit' },
  btnSuccess: { background: 'none', border: '1px solid #6ee7b7', color: '#059669', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'inherit' },
  label: { fontSize: 12, fontWeight: 700, color: '#666', display: 'block', marginBottom: 6 },
  input: { width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #e0e8f5', fontSize: 14, outline: 'none', fontFamily: 'inherit', color: '#333', background: 'white', boxSizing: 'border-box' },
};

export default function DoctorDashboard({ user, onLogout }) {
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('today');
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchDoctorData();
  }, [user]);

  const fetchDoctorData = async () => {
    setLoading(true);
    const { data: doctorData } = await supabase
      .from('doctors')
      .select('*')
      .eq('auth_id', user.id)
      .single();

    if (doctorData) {
      setDoctor(doctorData);
      setEditForm(doctorData);

      // Get appointments
      const { data: apptData } = await supabase
        .from('appointments')
        .select('*')
        .eq('doctor_id', doctorData.id)
        .order('appointment_date', { ascending: true });

      // Get patient names from users table
      if (apptData && apptData.length > 0) {
        const apptWithUsers = await Promise.all(apptData.map(async (appt) => {
          const { data: userData } = await supabase
            .from('users')
            .select('full_name, phone')
            .eq('auth_id', appt.user_id)
            .single();
          return {
            ...appt,
            patientName: userData?.full_name || 'Patient anonyme',
            patientPhone: userData?.phone || '—'
          };
        }));
        setAppointments(apptWithUsers);
      } else {
        setAppointments([]);
      }
    }
    setLoading(false);
  };

  const updateAppointment = async (id, status) => {
    await supabase.from('appointments').update({ status }).eq('id', id);
    fetchDoctorData();
  };

  const saveProfile = async () => {
    setSaving(true);
    await supabase.from('doctors').update({
      full_name: editForm.full_name,
      phone: editForm.phone,
      address: editForm.address,
      price: parseInt(editForm.price),
      bio: editForm.bio,
    }).eq('id', doctor.id);
    setSaving(false);
    setEditMode(false);
    fetchDoctorData();
  };

  const today = new Date().toISOString().split('T')[0];
  const todayAppts = appointments.filter(a => a.appointment_date === today);
  const upcomingAppts = appointments.filter(a => a.appointment_date > today);
  const pastAppts = appointments.filter(a => a.appointment_date < today);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f6ff' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
        <p style={{ color: '#666' }}>Chargement...</p>
      </div>
    </div>
  );

  if (!doctor) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f6ff' }}>
      <div style={{ ...S.card, maxWidth: 400, textAlign: 'center', padding: 40 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
        <h2 style={{ fontWeight: 800, color: '#1a1a2e', marginBottom: 8 }}>Compte en cours de vérification</h2>
        <p style={{ color: '#666', marginBottom: 24 }}>Votre demande est en cours d'examen. Vous recevrez un email sous 48h.</p>
        <button onClick={onLogout} style={{ ...S.btnPrimary, width: '100%', padding: '12px' }}>Se déconnecter</button>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: '#f0f6ff', minHeight: '100vh' }}>

      {/* HEADER */}
      <div style={{ background: 'linear-gradient(135deg, #0057b8, #0096c7)', padding: '0 16px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 24 }}>🩺</span>
            <div>
              <span style={{ color: 'white', fontWeight: 800, fontSize: 18 }}>TabibDZ</span>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginLeft: 8 }}>Espace Médecin</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {!isMobile && <span style={{ color: 'white', fontSize: 13 }}>👋 {doctor.full_name}</span>}
            <button onClick={onLogout} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', padding: '8px 14px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit', fontSize: 13 }}>
              🚪 {!isMobile && 'Déconnexion'}
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: isMobile ? '20px 12px' : '28px 24px' }}>

        {/* DOCTOR INFO CARD */}
        <div style={{ ...S.card, marginBottom: 24, display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: 16 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ width: 64, height: 64, borderRadius: 16, background: 'linear-gradient(135deg, #0057b8, #0096c7)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 22, flexShrink: 0 }}>
              {doctor.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 18, color: '#1a1a2e' }}>{doctor.full_name} {doctor.is_verified ? '✅' : '⏳'}</div>
              <div style={{ color: '#0057b8', fontWeight: 600, fontSize: 14 }}>{doctor.specialty}</div>
              <div style={{ color: '#888', fontSize: 13 }}>📍 {doctor.wilaya} · 💰 {doctor.price} DA · ⭐ {doctor.rating || '—'}</div>
            </div>
          </div>
          <button onClick={() => setEditMode(true)} style={S.btnPrimary}>✏️ Modifier mon profil</button>
        </div>

        {/* STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
          {[
            ['📅', todayAppts.length, "Aujourd'hui"],
            ['⏰', upcomingAppts.length, 'À venir'],
            ['✅', appointments.filter(a => a.status === 'confirmed').length, 'Confirmés'],
            ['❌', appointments.filter(a => a.status === 'cancelled').length, 'Annulés'],
          ].map(([icon, count, label]) => (
            <div key={label} style={{ ...S.card, textAlign: 'center', padding: 16 }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>{icon}</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#0057b8' }}>{count}</div>
              <div style={{ fontSize: 12, color: '#888' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* TABS */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, overflowX: 'auto' }}>
          {[
            { id: 'today', label: `📅 Aujourd'hui (${todayAppts.length})` },
            { id: 'upcoming', label: `⏰ À venir (${upcomingAppts.length})` },
            { id: 'past', label: `📋 Passés (${pastAppts.length})` },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{ padding: '10px 18px', borderRadius: 10, border: '1.5px solid', cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', transition: 'all 0.2s',
                borderColor: activeTab === tab.id ? '#0057b8' : '#e0e8f5',
                background: activeTab === tab.id ? '#0057b8' : 'white',
                color: activeTab === tab.id ? 'white' : '#555' }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* APPOINTMENTS */}
        {(activeTab === 'today' ? todayAppts : activeTab === 'upcoming' ? upcomingAppts : pastAppts).length === 0 ? (
          <div style={{ ...S.card, textAlign: 'center', padding: 48 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
            <p style={{ color: '#888' }}>Aucun rendez-vous {activeTab === 'today' ? "aujourd'hui" : activeTab === 'upcoming' ? 'à venir' : 'passé'}.</p>
          </div>
        ) : (
          (activeTab === 'today' ? todayAppts : activeTab === 'upcoming' ? upcomingAppts : pastAppts).map(appt => (
            <div key={appt.id} style={{ ...S.card, marginBottom: 12, display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', gap: 12 }}>
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: '#f0f6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, color: '#0057b8', flexShrink: 0 }}>
                  {appt.patientName?.split(' ').map(n => n[0]).join('').slice(0, 2) || '👤'}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#1a1a2e' }}>{appt.patientName || 'Patient anonyme'}</div>
                  <div style={{ color: '#888', fontSize: 12 }}>📞 {appt.patientPhone || '—'}</div>
                  <div style={{ color: '#0057b8', fontSize: 12, marginTop: 2 }}>📅 {appt.appointment_date} · ⏰ {appt.appointment_time?.slice(0, 5)} · {appt.type}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{ padding: '4px 12px', borderRadius: 99, fontSize: 12, fontWeight: 700,
                  background: appt.status === 'confirmed' ? '#d1fae5' : appt.status === 'cancelled' ? '#fee2e2' : '#fef3c7',
                  color: appt.status === 'confirmed' ? '#065f46' : appt.status === 'cancelled' ? '#991b1b' : '#92400e' }}>
                  {appt.status === 'confirmed' ? '✅ Confirmé' : appt.status === 'cancelled' ? '❌ Annulé' : '⏳ En attente'}
                </span>
                <span style={{ fontWeight: 800, color: '#0057b8', fontSize: 14 }}>{appt.price ? `${appt.price} DA` : '—'}</span>
                {appt.status === 'confirmed' && activeTab !== 'past' && (
                  <button onClick={() => updateAppointment(appt.id, 'cancelled')} style={S.btnDanger}>Annuler</button>
                )}
                {appt.status === 'cancelled' && (
                  <button onClick={() => updateAppointment(appt.id, 'confirmed')} style={S.btnSuccess}>Restaurer</button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* EDIT PROFILE MODAL */}
      {editMode && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)', padding: 16 }}>
          <div style={{ background: 'white', borderRadius: 20, width: '100%', maxWidth: 500, maxHeight: '90vh', overflowY: 'auto', padding: 28, position: 'relative' }}>
            <button onClick={() => setEditMode(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#999' }}>✕</button>
            <h2 style={{ fontWeight: 800, fontSize: 20, color: '#1a1a2e', marginBottom: 20 }}>✏️ Modifier mon profil</h2>
            {[
              { field: 'full_name', label: 'NOM COMPLET', type: 'text' },
              { field: 'phone', label: 'TÉLÉPHONE', type: 'tel' },
              { field: 'address', label: 'ADRESSE DU CABINET', type: 'text' },
              { field: 'price', label: 'PRIX CONSULTATION (DA)', type: 'number' },
            ].map(({ field, label, type }) => (
              <div key={field} style={{ marginBottom: 14 }}>
                <label style={S.label}>{label}</label>
                <input value={editForm[field] || ''} onChange={e => setEditForm(f => ({ ...f, [field]: e.target.value }))} type={type} style={S.input} />
              </div>
            ))}
            <div style={{ marginBottom: 20 }}>
              <label style={S.label}>BIO</label>
              <textarea value={editForm.bio || ''} onChange={e => setEditForm(f => ({ ...f, bio: e.target.value }))} rows={3} style={{ ...S.input, resize: 'none' }} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setEditMode(false)} style={{ flex: 1, background: 'none', border: '1.5px solid #e0e8f5', color: '#666', padding: '12px', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 600 }}>Annuler</button>
              <button onClick={saveProfile} disabled={saving} style={{ ...S.btnPrimary, flex: 2, padding: '12px' }}>{saving ? '⏳ Sauvegarde...' : '💾 Enregistrer'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}