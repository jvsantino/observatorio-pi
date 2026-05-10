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
    <nav style={{ background: '#004A8C' }} className="text-white px-6 py-3 flex items-center justify-between shadow-md">
      <Link to="/" className="flex items-center gap-3">
        <div style={{ background: '#F7941C' }} className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm">
          PI
        </div>
        <div>
          <span className="font-bold text-white text-base leading-none block">Observatório PI</span>
          <span className="text-xs leading-none" style={{ color: '#B8D4F0' }}>SENAC Pernambuco</span>
        </div>
      </Link>
      {user && (
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <span className="text-sm font-medium block">{user.nome}</span>
            <span className="text-xs capitalize" style={{ color: '#F7941C' }}>{user.role}</span>
          </div>
          <button
            onClick={handleLogout}
            style={{ border: '1px solid rgba(255,255,255,0.3)' }}
            className="px-4 py-1.5 rounded-lg text-sm text-white hover:bg-white hover:text-blue-900 transition"
          >
            Sair
          </button>
        </div>
      )}
    </nav>
  );
}