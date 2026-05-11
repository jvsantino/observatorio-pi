import { useState } from 'react';
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function TrocarSenha() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTrocar = async (e) => {
    e.preventDefault();
    setErro('');

    if (novaSenha.length < 6) {
      setErro('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (novaSenha !== confirmar) {
      setErro('As senhas não coincidem.');
      return;
    }
    if (novaSenha === 'Trocar@123') {
      setErro('Escolha uma senha diferente da senha padrão.');
      return;
    }

    setLoading(true);
    try {
      const firebaseUser = auth.currentUser;
      const credential = EmailAuthProvider.credential(firebaseUser.email, senhaAtual);
      await reauthenticateWithCredential(firebaseUser, credential);
      await updatePassword(firebaseUser, novaSenha);

      const rotas = { aluno: '/student', professor: '/teacher', administrador: '/admin', coordenador: '/admin' };
      navigate(rotas[user.role] || '/');
    } catch (err) {
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setErro('Senha atual incorreta.');
      } else {
        setErro('Erro ao trocar a senha. Tente novamente.');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#f0f4f8' }}>
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <div style={{ background: '#F7941C' }} className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
            🔒
          </div>
          <h2 style={{ color: '#004A8C' }} className="text-2xl font-bold">Trocar Senha</h2>
          <p className="text-gray-400 text-sm mt-1">Por segurança, troque a senha padrão antes de continuar.</p>
        </div>
        <form onSubmit={handleTrocar} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Senha atual</label>
            <input
              type="password" value={senhaAtual}
              onChange={e => setSenhaAtual(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"
              placeholder="••••••••" required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Nova senha</label>
            <input
              type="password" value={novaSenha}
              onChange={e => setNovaSenha(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"
              placeholder="Mínimo 6 caracteres" required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Confirmar nova senha</label>
            <input
              type="password" value={confirmar}
              onChange={e => setConfirmar(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"
              placeholder="Repita a nova senha" required
            />
          </div>
          {erro && <p className="text-red-500 text-sm">{erro}</p>}
          <button
            type="submit" disabled={loading}
            style={{ background: '#004A8C' }}
            className="w-full text-white py-2.5 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Salvando...' : 'Salvar nova senha'}
          </button>
        </form>
      </div>
    </div>
  );
}