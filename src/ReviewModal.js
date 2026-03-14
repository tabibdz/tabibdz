import { useState } from 'react';
import { supabase } from './supabase';

export default function ReviewModal({ appointment, user, onClose, onReviewed }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const submitReview = async () => {
    if (rating === 0) { setError('Veuillez choisir une note.'); return; }
    setLoading(true);
    setError('');

    // 💾 SAVE: insert review in database
    const { error: reviewError } = await supabase.from('reviews').insert({
      user_id: user.id,
      doctor_id: appointment.doctor_id,
      appointment_id: appointment.id,
      rating: rating,
      comment: comment,
      is_visible: true,
    });

    if (reviewError) {
      setError('Erreur — réessayez.');
      console.log(reviewError);
      setLoading(false);
      return;
    }

    // 💾 UPDATE: recalculate doctor's average rating
    const { data: allReviews } = await supabase
      .from('reviews')
      .select('rating')
      .eq('doctor_id', appointment.doctor_id);

    if (allReviews && allReviews.length > 0) {
      const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
      await supabase.from('doctors')
        .update({ rating: Math.round(avg * 10) / 10 })
        .eq('id', appointment.doctor_id);
    }

    setSuccess(true);
    setLoading(false);
    onReviewed();
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, backdropFilter: 'blur(4px)', padding: 16 }}>
      <div style={{ background: 'white', borderRadius: 20, padding: 32, width: '100%', maxWidth: 440, position: 'relative', boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>

        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: '#999' }}>✕</button>

        {success ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🌟</div>
            <h2 style={{ fontWeight: 800, fontSize: 22, color: '#1a1a2e', marginBottom: 8 }}>Merci pour votre avis!</h2>
            <p style={{ color: '#666', marginBottom: 24 }}>Votre avis aide les autres patients à choisir le bon médecin.</p>
            <button onClick={onClose} style={{ background: 'linear-gradient(135deg, #0057b8, #0096c7)', color: 'white', border: 'none', padding: '12px 28px', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: 'pointer', width: '100%', fontFamily: 'inherit' }}>
              Fermer
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>⭐</div>
              <h2 style={{ fontWeight: 800, fontSize: 20, color: '#1a1a2e', marginBottom: 4 }}>
                Évaluer {appointment.doctors?.full_name}
              </h2>
              <p style={{ color: '#888', fontSize: 13 }}>
                {appointment.doctors?.specialty} · {appointment.appointment_date}
              </p>
            </div>

            {/* Star Rating */}
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <p style={{ fontWeight: 700, fontSize: 14, color: '#444', marginBottom: 12 }}>Votre note</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <span
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    style={{
                      fontSize: 40,
                      cursor: 'pointer',
                      color: star <= (hover || rating) ? '#f59e0b' : '#e0e0e0',
                      transition: 'all 0.1s',
                      transform: star <= (hover || rating) ? 'scale(1.2)' : 'scale(1)',
                      display: 'inline-block',
                    }}>
                    ★
                  </span>
                ))}
              </div>
              {rating > 0 && (
                <p style={{ color: '#f59e0b', fontWeight: 700, marginTop: 8, fontSize: 14 }}>
                  {['', 'Très mauvais 😞', 'Mauvais 😕', 'Correct 😐', 'Bien 😊', 'Excellent! 🌟'][rating]}
                </p>
              )}
            </div>

            {/* Comment */}
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#666', display: 'block', marginBottom: 6 }}>
                COMMENTAIRE (optionnel)
              </label>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Partagez votre expérience avec ce médecin..."
                rows={3}
                style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: '1.5px solid #e0e8f5', fontSize: 14, outline: 'none', fontFamily: 'inherit', color: '#333', resize: 'none', boxSizing: 'border-box' }}
              />
            </div>

            {error && (
              <div style={{ background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: 10, padding: '10px 14px', marginBottom: 16, color: '#e11d48', fontSize: 13 }}>
                ⚠️ {error}
              </div>
            )}

            <button onClick={submitReview} disabled={loading || rating === 0}
              style={{ background: 'linear-gradient(135deg, #0057b8, #0096c7)', color: 'white', border: 'none', padding: '14px', borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: rating === 0 ? 'not-allowed' : 'pointer', width: '100%', fontFamily: 'inherit', opacity: rating === 0 ? 0.4 : 1 }}>
              {loading ? '⏳ Envoi...' : '🌟 Publier mon avis'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}