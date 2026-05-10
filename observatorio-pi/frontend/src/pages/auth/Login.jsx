import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  if (user) {
  const rotas = {
    aluno: '/student',
    professor: '/teacher',
    administrador: '/admin',
    coordenador: '/admin',
  };
  navigate(rotas[user.role] || '/');
  return null;
}

  const handleLogin = async (e) => {
  e.preventDefault();
  setErro('');
  try {
    await signInWithEmailAndPassword(auth, email, senha);
  } catch {
    setErro('E-mail ou senha inválidos');
  }
};

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">Entrar</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email" placeholder="E-mail" value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password" placeholder="Senha" value={senha}
            onChange={e => setSenha(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {erro && <p className="text-red-500 text-sm">{erro}</p>}
          <button type="submit" className="w-full bg-blue-800 text-white py-2 rounded-lg hover:bg-blue-700 transition">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
