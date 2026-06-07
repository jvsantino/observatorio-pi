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
    <nav style={{ background: '#004A8C' }} className="text-white h-14 px-6 flex items-center justify-between shadow-md">
      <Link to="/" className="flex items-center gap-3">
        <img src="/logo.jpg" alt="Observatório PI" className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
        <div className="leading-tight">
          <span className="font-bold text-white text-sm sm:text-base leading-none block">Observatório PI</span>
          <span className="text-xs leading-none" style={{ color: '#B8D4F0' }}>SENAC Pernambuco</span>
        </div>
      </Link>
      {user && (
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <span className="text-sm font-medium block leading-none">{user.nome}</span>
            <span className="text-xs capitalize" style={{ color: '#F7941C' }}>{user.role}</span>
          </div>
          <button
            onClick={handleLogout}
            style={{ border: '1px solid rgba(255,255,255,0.3)' }}
            className="px-4 py-1.5 rounded-lg text-sm text-white hover:bg-white hover:text-blue-900 transition flex-shrink-0"
          >
            Sair
          </button>
        </div>
      )}
    </nav>
  );
}