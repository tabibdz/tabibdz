import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { supabase } from './supabase';
import './App.css';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import SearchResultsPage from './pages/SearchResultsPage';
import DoctorProfilePage from './pages/DoctorProfilePage';
import MyAppointmentsPage from './pages/MyAppointmentsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DoctorRegisterPage from './pages/DoctorRegisterPage';
import DoctorDashboardPage from './pages/DoctorDashboardPage';

export default function App() {
  const [user, setUser] = useState(null);
  const [isDoctor, setIsDoctor] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data } = await supabase.from('doctors').select('id').eq('auth_id', session.user.id).maybeSingle();
        setIsDoctor(!!data);
      }
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const { data } = await supabase.from('doctors').select('id').eq('auth_id', session.user.id).maybeSingle();
        setIsDoctor(!!data);
      } else {
        setIsDoctor(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  if (authLoading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f6ff' }}>
      <div style={{ fontSize: 48 }}>⏳</div>
    </div>
  );

  return (
    <Routes>
      <Route path="/" element={<HomePage user={user} isDoctor={isDoctor} />} />
      <Route path="/medecins" element={<SearchResultsPage user={user} isDoctor={isDoctor} />} />
      <Route path="/medecin/:id" element={<DoctorProfilePage user={user} />} />
      <Route path="/mes-rdv" element={
        <ProtectedRoute user={user}>
          <MyAppointmentsPage user={user} isDoctor={isDoctor} />
        </ProtectedRoute>
      } />
      <Route path="/connexion" element={<LoginPage />} />
      <Route path="/inscription" element={<RegisterPage />} />
      <Route path="/pro/inscription" element={<DoctorRegisterPage />} />
      <Route path="/pro/dashboard" element={
        <DoctorDashboardPage user={user} isDoctor={isDoctor} setUser={setUser} setIsDoctor={setIsDoctor} />
      } />
    </Routes>
  );
}
