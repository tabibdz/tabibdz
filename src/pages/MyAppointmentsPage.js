import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import ReviewModal from '../ReviewModal';
import Header from '../components/Header';
import useIsMobile from '../hooks/useIsMobile';

const S = {
  card: { background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 16px rgba(0,0,0,0.07)' },
  btnPrimary: { background: 'linear-gradient(135deg, #0057b8, #0096c7)', color: 'white', border: 'none', padding: '12px 28px', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', width: '100%' },
  btnOutline: { background: 'none', border: '1.5px solid #0057b8', color: '#0057b8', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' },
};

export default function MyAppointmentsPage({ user, isDoctor }) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewAppointment, setReviewAppointment] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  const fetchAppointments = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('appointments')
      .select('*, doctors(full_name, specialty, wilaya)')
      .eq('user_id', user.id)
      .order('appointment_date', { ascending: false });
    if (error) console.log('ERROR:', error);
    else setAppointments(data || []);
    setLoading(false);
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: '#f0f6ff', minHeight: '100vh' }}>
      <Header user={user} isDoctor={isDoctor} />
      {reviewAppointment && (
        <ReviewModal
          appointment={reviewAppointment}
          user={user}
          onClose={() => setReviewAppointment(null)}
          onReviewed={() => { fetchAppointments(); setReviewAppointment(null); }}
        />
      )}

      <div style={{ maxWidth: 1100, margin: '40px auto', padding: isMobile ? '0 12px 60px' : '0 24px 60px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontWeight: 800, fontSize: 22, color: '#1a1a2e' }}>📋 Mes Rendez-vous</h2>
          <button onClick={() => navigate('/')} style={S.btnOutline}>← Retour</button>
        </div>

        {loading && <div style={{ textAlign: 'center', padding: 60 }}><div style={{ fontSize: 48 }}>⏳</div></div>}

        {!loading && appointments.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, background: 'white', borderRadius: 16 }}>
            <div style={{ fontSize: 48 }}>📭</div>
            <p style={{ color: '#666', marginTop: 16 }}>Aucun rendez-vous pour l'instant.</p>
            <button onClick={() => navigate('/')} style={{ ...S.btnPrimary, marginTop: 20, width: 'auto', padding: '10px 24px' }}>Prendre un RDV</button>
          </div>
        )}

        {!loading && appointments.map(appt => (
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
                  <button onClick={async () => { await supabase.from('appointments').update({ status: 'cancelled' }).eq('id', appt.id); fetchAppointments(); }} style={{ background: 'none', border: '1px solid #fca5a5', color: '#ef4444', padding: '5px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'inherit' }}>Annuler</button>
                  <button onClick={() => setReviewAppointment(appt)} style={{ background: 'none', border: '1px solid #fbbf24', color: '#d97706', padding: '5px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'inherit' }}>⭐ Avis</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
