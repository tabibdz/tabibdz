import { useState, useEffect } from 'react';
import { supabase } from './supabase';

const S = {
  btnPrimary: { background: 'linear-gradient(135deg, #0057b8, #0096c7)', color: 'white', border: 'none', padding: '14px 28px', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', width: '100%', fontFamily: 'inherit' },
  card: { background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 16px rgba(0,0,0,0.07)' },
};

export default function DoctorProfile({ doctor, user, onClose, onBook }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const { data } = await supabase
      .from('reviews')
      .select('*, users(full_name)')
      .eq('doctor_id', doctor.id)
      .eq('is_visible', true)
      .order('created_at', { ascending: false });
    setReviews(data || []);
    setLoading(false);
  };

  const stars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < rating ? '#f59e0b' : '#e0e0e0', fontSize: 18 }}>★</span>
    ));
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)', padding: 16, overflowY: 'auto' }}>
      <div style={{ background: '#f0f6ff', width: '100%', maxWidth: 680, borderRadius: 20, maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>

        {/* CLOSE BUTTON */}
        <button onClick={onClose} style={{ position: 'sticky', top: 16, left: '95%', zIndex: 10, background: 'white', border: 'none', borderRadius: '50%', width: 36, height: 36, fontSize: 18, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>

        {/* HEADER */}
        <div style={{ background: 'linear-gradient(135deg, #0057b8, #0096c7)', padding: '32px 24px 60px', marginTop: -44 }}>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginTop: 20 }}>
            <div style={{ width: 80, height: 80, borderRadius: 20, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 28, flexShrink: 0, border: '3px solid rgba(255,255,255,0.4)' }}>
              {doctor.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 800, fontSize: 22 }}>{doctor.full_name} {doctor.is_verified ? '✅' : ''}</div>
              <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 15, marginTop: 4 }}>{doctor.specialty}</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 4 }}>📍 {doctor.wilaya}</div>
            </div>
          </div>
        </div>

        <div style={{ padding: '0 20px 32px', marginTop: -30 }}>

          {/* QUICK INFO CARDS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
            {[
              ['⭐', doctor.rating || '—', 'Note'],
              ['💰', doctor.price ? `${doctor.price} DA` : '—', 'Consultation'],
              ['📅', 'Disponible', 'Aujourd\'hui'],
            ].map(([icon, value, label]) => (
              <div key={label} style={{ ...S.card, textAlign: 'center', padding: 16 }}>
                <div style={{ fontSize: 22, marginBottom: 4 }}>{icon}</div>
                <div style={{ fontWeight: 800, fontSize: 15, color: '#0057b8' }}>{value}</div>
                <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* BIO */}
          {doctor.bio && (
            <div style={{ ...S.card, marginBottom: 20 }}>
              <h3 style={{ fontWeight: 700, fontSize: 16, color: '#1a1a2e', marginBottom: 12 }}>👨‍⚕️ À propos</h3>
              <p style={{ color: '#555', fontSize: 14, lineHeight: 1.7 }}>{doctor.bio}</p>
            </div>
          )}

          {/* INFO */}
          <div style={{ ...S.card, marginBottom: 20 }}>
            <h3 style={{ fontWeight: 700, fontSize: 16, color: '#1a1a2e', marginBottom: 16 }}>ℹ️ Informations</h3>
            {[
              ['📍 Adresse', doctor.address || 'Non spécifiée'],
              ['📞 Téléphone', doctor.phone || 'Non spécifié'],
              ['🏥 Spécialité', doctor.specialty],
              ['💰 Prix consultation', doctor.price ? `${doctor.price} DA` : 'Non spécifié'],
            ].map(([label, value]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f4f8', fontSize: 14 }}>
                <span style={{ color: '#888' }}>{label}</span>
                <span style={{ fontWeight: 600, color: '#1a1a2e', textAlign: 'right', maxWidth: '60%' }}>{value}</span>
              </div>
            ))}
          </div>

          {/* REVIEWS */}
          <div style={{ ...S.card, marginBottom: 20 }}>
            <h3 style={{ fontWeight: 700, fontSize: 16, color: '#1a1a2e', marginBottom: 16 }}>⭐ Avis patients ({reviews.length})</h3>
            {loading && <p style={{ color: '#888', fontSize: 14 }}>Chargement...</p>}
            {!loading && reviews.length === 0 && (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>💬</div>
                <p style={{ color: '#888', fontSize: 14 }}>Aucun avis pour l'instant.</p>
              </div>
            )}
            {reviews.map(review => (
              <div key={review.id} style={{ padding: '14px 0', borderBottom: '1px solid #f0f4f8' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#1a1a2e' }}>
                    {review.users?.full_name || 'Patient anonyme'}
                  </div>
                  <div style={{ display: 'flex' }}>{stars(review.rating)}</div>
                </div>
                {review.comment && <p style={{ color: '#555', fontSize: 13, lineHeight: 1.6 }}>{review.comment}</p>}
                <div style={{ color: '#aaa', fontSize: 11, marginTop: 4 }}>
                  {new Date(review.created_at).toLocaleDateString('fr-DZ')}
                </div>
              </div>
            ))}
          </div>

          {/* BOOK BUTTON */}
          <button onClick={() => !user ? onBook(null) : onBook(doctor)}
            style={S.btnPrimary}>
            📅 Prendre rendez-vous
          </button>

        </div>
      </div>
    </div>
  );
}