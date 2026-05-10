import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [mostrarReset, setMostrarReset] = useState(false);
  const [resetMensagem, setResetMensagem] = useState('');
  const [resetErro, setResetErro] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const rotas = { aluno: '/student', professor: '/teacher', administrador: '/admin', coordenador: '/admin' };
      navigate(rotas[user.role] || '/');
    }
  }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, senha);
    } catch {
      setErro('E-mail ou senha inválidos');
    }
    setLoading(false);
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setResetErro(''); setResetMensagem(''); setResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetMensagem('E-mail enviado! Verifique sua caixa de entrada.');
      setResetEmail('');
    } catch {
      setResetErro('E-mail não encontrado. Verifique e tente novamente.');
    }
    setResetLoading(false);
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#f0f4f8' }}>
      {/* Painel esquerdo */}
      <div style={{ background: '#004A8C' }} className="hidden md:flex md:w-1/2 flex-col items-center justify-center px-12 text-white">
        <div style={{ background: '#F7941C' }} className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-3xl mb-8">
          PI
        </div>
        <h2 className="text-3xl font-bold mb-3 text-center">Observatório PI</h2>
        <p style={{ color: '#B8D4F0' }} className="text-center text-base max-w-sm">
          Gerencie seus Projetos Integradores com organização, segurança e visibilidade profissional.
        </p>
        <div className="mt-12 space-y-4 w-full max-w-sm">
          {['Submissão centralizada de projetos', 'Perfil acadêmico estilo Lattes', 'Avaliação integrada por professores'].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div style={{ background: '#F7941C' }} className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">✓</div>
              <span style={{ color: '#B8D4F0' }} className="text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Painel direito */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">

          {!mostrarReset ? (
            <>
              <div className="text-center mb-8">
                <div style={{ background: '#004A8C' }} className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">
                  PI
                </div>
                <h2 style={{ color: '#004A8C' }} className="text-2xl font-bold">Entrar</h2>
                <p className="text-gray-400 text-sm mt-1">SENAC Pernambuco</p>
              </div>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1">E-mail</label>
                  <input
                    type="email" value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"
                    placeholder="seu@email.com" required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1">Senha</label>
                  <input
                    type="password" value={senha}
                    onChange={e => setSenha(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"
                    placeholder="••••••••" required
                  />
                </div>
                {erro && <p className="text-red-500 text-sm">{erro}</p>}
                <button
                  type="submit" disabled={loading}
                  style={{ background: '#004A8C' }}
                  className="w-full text-white py-2.5 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </button>
              </form>
              <button
                onClick={() => { setMostrarReset(true); setErro(''); }}
                className="w-full text-center text-sm mt-4 hover:underline"
                style={{ color: '#004A8C' }}
              >
                Esqueci minha senha
              </button>
              <p className="text-center text-xs text-gray-400 mt-4">
                Acesso apenas para usuários cadastrados pela coordenação.
              </p>
            </>
          ) : (
            <>
              <div className="text-center mb-8">
                <div style={{ background: '#F7941C' }} className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">
                  ✉
                </div>
                <h2 style={{ color: '#004A8C' }} className="text-2xl font-bold">Redefinir Senha</h2>
                <p className="text-gray-400 text-sm mt-1">Enviaremos um link para seu e-mail</p>
              </div>
              <form onSubmit={handleReset} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1">E-mail cadastrado</label>
                  <input
                    type="email" value={resetEmail}
                    onChange={e => setResetEmail(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"
                    placeholder="seu@email.com" required
                  />
                </div>
                {resetMensagem && (
                  <div style={{ background: '#E8F5E9', color: '#2E7D32' }} className="p-3 rounded-lg text-sm">
                    ✓ {resetMensagem}
                  </div>
                )}
                {resetErro && <p className="text-red-500 text-sm">{resetErro}</p>}
                <button
                  type="submit" disabled={resetLoading}
                  style={{ background: '#004A8C' }}
                  className="w-full text-white py-2.5 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
                >
                  {resetLoading ? 'Enviando...' : 'Enviar link de redefinição'}
                </button>
              </form>
              <button
                onClick={() => { setMostrarReset(false); setResetMensagem(''); setResetErro(''); }}
                className="w-full text-center text-sm mt-4 hover:underline"
                style={{ color: '#004A8C' }}
              >
                ← Voltar ao login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}