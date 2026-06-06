import { useState } from 'react';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';

export default function RegisterEmpresa() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErro(''); setSucesso(''); setLoading(true);
    try {
      // 1) cria a conta no Firebase (a empresa define a própria senha)
      await createUserWithEmailAndPassword(auth, email, senha);
      // 2) registra no banco com o perfil "empresa" (token vai automático)
      await api.post('/auth/register-empresa', { nome });
      // 3) desloga e manda pro login (evita a tela de "trocar senha")
      await signOut(auth);
      setSucesso('Conta criada com sucesso! Redirecionando para o login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      const code = err.code || '';
      if (code === 'auth/email-already-in-use') setErro('Este e-mail já está cadastrado.');
      else if (code === 'auth/weak-password') setErro('A senha deve ter ao menos 6 caracteres.');
      else if (code === 'auth/invalid-email') setErro('E-mail inválido.');
      else setErro(err.response?.data?.error || 'Erro ao criar conta. Tente novamente.');
      // se o Firebase criou a conta mas o backend falhou, desloga para não travar
      try { await signOut(auth); } catch { /* ignore */ }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#f0f4f8' }}>
      <div style={{ background: '#004A8C' }} className="hidden md:flex md:w-1/2 flex-col items-center justify-center px-12 text-white">
        <div style={{ background: '#F7941C' }} className="w-20 h-20 rounded-full flex items-center justify-center text-white font-bold text-3xl mb-8">PI</div>
        <h2 className="text-3xl font-bold mb-3 text-center">Portal das Empresas</h2>
        <p style={{ color: '#B8D4F0' }} className="text-center text-base max-w-sm">
          Conheça os Projetos Integradores dos nossos alunos, avalie os trabalhos e conecte-se com os talentos.
        </p>
        <div className="mt-12 space-y-4 w-full max-w-sm">
          {['Acesso aos projetos publicados', 'Avaliação por estrelas e comentários', 'Contato direto com os alunos'].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div style={{ background: '#F7941C' }} className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">✓</div>
              <span style={{ color: '#B8D4F0' }} className="text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
          <div className="text-center mb-8">
            <div style={{ background: '#004A8C' }} className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-3">PI</div>
            <h2 style={{ color: '#004A8C' }} className="text-2xl font-bold">Cadastro de Empresa</h2>
            <p className="text-gray-400 text-sm mt-1">Crie sua conta para acessar os projetos</p>
          </div>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Nome da empresa</label>
              <input type="text" value={nome} onChange={e => setNome(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"
                placeholder="Ex: Tech Solutions Ltda" required />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">E-mail corporativo</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"
                placeholder="contato@empresa.com" required />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Senha</label>
              <input type="password" value={senha} onChange={e => setSenha(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"
                placeholder="Mínimo 6 caracteres" required />
            </div>
            {erro && <p className="text-red-500 text-sm">{erro}</p>}
            {sucesso && <div style={{ background: '#E8F5E9', color: '#2E7D32' }} className="p-3 rounded-lg text-sm">✓ {sucesso}</div>}
            <button type="submit" disabled={loading} style={{ background: '#004A8C' }}
              className="w-full text-white py-2.5 rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50">
              {loading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>
          <Link to="/login" className="block w-full text-center text-sm mt-4 hover:underline" style={{ color: '#004A8C' }}>
            Já tenho conta — Entrar
          </Link>
        </div>
      </div>
    </div>
  );
}