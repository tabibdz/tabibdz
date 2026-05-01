import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BackofficeProtectedRoute({ user, isAdmin, children }) {
  const navigate = useNavigate();
  useEffect(() => {
    if (!user || !isAdmin) navigate('/backoffice/connexion');
  }, [user, isAdmin, navigate]);
  if (!user || !isAdmin) return null;
  return children;
}
