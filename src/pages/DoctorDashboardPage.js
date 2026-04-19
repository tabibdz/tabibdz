import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import DoctorDashboard from '../DoctorDashboard';

export default function DoctorDashboardPage({ user, isDoctor, setUser, setIsDoctor }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/connexion');
    else if (!isDoctor) navigate('/');
  }, [user, isDoctor, navigate]);

  if (!user || !isDoctor) return null;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsDoctor(false);
    navigate('/');
  };

  return <DoctorDashboard user={user} onLogout={handleLogout} />;
}
