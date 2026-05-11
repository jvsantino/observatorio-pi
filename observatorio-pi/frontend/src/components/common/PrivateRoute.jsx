import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function PrivateRoute({ children, roles }) {
  const { user, loading, precisaTrocarSenha } = useAuth();

  if (loading) return <div className="p-8 text-center">Carregando...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (precisaTrocarSenha && window.location.pathname !== '/trocar-senha') {
    return <Navigate to="/trocar-senha" replace />;
  }
  if (roles && !roles.includes(user.role)) return <Navigate to="/login" replace />;

  return children;
}