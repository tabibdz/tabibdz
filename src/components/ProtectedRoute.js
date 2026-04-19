import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProtectedRoute({ user, children }) {
  const navigate = useNavigate();
  useEffect(() => {
    if (user === null) navigate('/connexion');
  }, [user, navigate]);
  if (user === null) return null;
  return children;
}
