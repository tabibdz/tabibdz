import { useNavigate } from 'react-router-dom';
import DoctorRegister from '../DoctorRegister';

export default function DoctorRegisterPage() {
  const navigate = useNavigate();
  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: '#f0f6ff', minHeight: '100vh' }}>
      <DoctorRegister
        onClose={() => navigate('/')}
        onSwitchToLogin={() => navigate('/connexion')}
      />
    </div>
  );
}
