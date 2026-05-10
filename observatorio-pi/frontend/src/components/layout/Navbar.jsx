import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { useAuth } from '../../hooks/useAuth';

export default function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <nav className="bg-blue-800 text-white px-6 py-3 flex items-center justify-between">
      <Link to="/" className="font-bold text-lg">Observatório PI</Link>
      {user && (
        <div className="flex items-center gap-4">
          <span className="text-sm">{user.nome} ({user.role})</span>
          <button onClick={handleLogout} className="bg-white text-blue-800 px-3 py-1 rounded text-sm">
            Sair
          </button>
        </div>
      )}
    </nav>
  );
}
