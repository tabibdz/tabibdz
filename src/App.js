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
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

export default function App() {
  const [user, setUser] = useState(null);
  const [isDoctor, setIsDoctor] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

useEffect(() => {
    let currentUserId = null;

    const checkIfDoctor = async (userId) => {
      const { data } = await supabase
        .from('doctors')
        .select('id')
        .eq('auth_id', userId)
        .maybeSingle();
      setIsDoctor(!!data);
    };

    // onAuthStateChange fires INITIAL_SESSION immediately on mount with the
    // existing session, so we don't need a separate getSession() call.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const newUserId = session?.user?.id ?? null;

      // Only update state if the user actually changed.
      // Ignore TOKEN_REFRESHED events — they fire on every background token refresh
      // and re-running the doctor check causes race conditions with other queries.
      if (newUserId !== currentUserId) {
        currentUserId = newUserId;
        setUser(session?.user ?? null);
        if (session?.user) {
          checkIfDoctor(session.user.id);
        } else {
          setIsDoctor(false);
        }
      }

      if (event === 'INITIAL_SESSION') {
        setAuthLoading(false);
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
      <Route path="/mot-de-passe-oublie" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
    </Routes>
  );
}
