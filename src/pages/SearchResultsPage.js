import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../supabase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import useIsMobile from '../hooks/useIsMobile';

const S = {
  card: { background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 2px 16px rgba(0,0,0,0.07)' },
  btnOutline: { background: 'none', border: '1.5px solid #0057b8', color: '#0057b8', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontFamily: 'inherit' },
};

export default function SearchResultsPage({ user, isDoctor }) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [searchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const specialty = searchParams.get('specialty') || 'Tous';
  const wilaya = searchParams.get('wilaya') || 'Toutes';

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      let query = supabase.from('doctors').select('*').eq('is_active', true);
      if (specialty !== 'Tous') query = query.ilike('specialty', specialty);
      if (wilaya !== 'Toutes') query = query.ilike('wilaya', wilaya);
      const { data, error } = await query;
      if (error) console.log(error);
      else setDoctors(data || []);
      setLoading(false);
    };
    fetchDoctors();
  }, [specialty, wilaya]);

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: '#f0f6ff', minHeight: '100vh' }}>
      <Header user={user} isDoctor={isDoctor} />

      <div style={{ maxWidth: 1100, margin: '40px auto', padding: isMobile ? '0 12px 60px' : '0 24px 60px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <div style={{ fontSize: 48 }}>⏳</div>
            <p style={{ color: '#666', marginTop: 16, fontSize: 16 }}>Recherche en cours...</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontWeight: 800, fontSize: isMobile ? 18 : 22, color: '#1a1a2e' }}>{doctors.length} médecin(s) trouvé(s)</h2>
              <button onClick={() => navigate(-1)} style={S.btnOutline}>← Retour</button>
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
                    onClick={() => navigate(`/medecin/${doc.id}`)}
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
                      <button onClick={e => { e.stopPropagation(); !user ? navigate('/connexion') : navigate(`/medecin/${doc.id}`); }}
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

      <Footer />
    </div>
  );
}
