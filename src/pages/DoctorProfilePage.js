import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import DoctorProfile from '../DoctorProfile';

export default function DoctorProfilePage({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctor = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('doctors')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      
      if (error) console.log(error);
      setDoctor(data);
      setLoading(false);
    };
    fetchDoctor();
  }, [id]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 60 }}>
        <div style={{ fontSize: 48 }}>⏳</div>
        <p style={{ color: '#666', marginTop: 16 }}>Chargement du profil...</p>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div style={{ textAlign: 'center', padding: 60 }}>
        <div style={{ fontSize: 48 }}>😕</div>
        <p style={{ color: '#666', marginTop: 16 }}>Médecin introuvable</p>
        <button
          onClick={() => navigate('/')}
          style={{
            marginTop: 20,
            background: 'linear-gradient(135deg, #0057b8, #0096c7)',
            color: 'white',
            border: 'none',
            padding: '10px 24px',
            borderRadius: 10,
            cursor: 'pointer',
            fontWeight: 700,
          }}
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }

  return (
    <DoctorProfile
      doctor={doctor}
      user={user}
      onClose={() => navigate(-1)}
      onBook={(doc) => {
        if (!user) navigate('/connexion');
        else navigate(`/medecin/${doc.id}/reserver`);
      }}
    />
  );
}