import { useState } from 'react';
import { supabase } from '../supabase';

const S = {
  card: { background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 16px rgba(0,0,0,0.07)' },
  btnPrimary: { background: 'linear-gradient(135deg, #0057b8, #0096c7)', color: 'white', border: 'none', padding: '12px 28px', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', width: '100%' },
};

export default function BookingModal({ doctor, user, onClose, onBooked }) {
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
