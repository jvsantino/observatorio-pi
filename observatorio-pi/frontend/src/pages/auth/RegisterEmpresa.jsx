import { useState } from 'react';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../../services/firebase';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';

// Validação de CNPJ (formato + dígitos verificadores)
function validaCNPJ(valor) {
  const cnpj = String(valor || '').replace(/[^\d]/g, '');
  if (cnpj.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(cnpj)) return false;
  const calc = (base) => {
    const len = base.length;
    const nums = base.split('').map(Number);
    let pos = len - 7, sum = 0;
    for (let i = len; i >= 1; i--) {
      sum += nums[len - i] * pos--;
      if (pos < 2) pos = 9;
    }
    const res = sum % 11;
    return res < 2 ? 0 : 11 - res;
  };
  if (calc(cnpj.slice(0, 12)) !== Number(cnpj[12])) return false;
  if (calc(cnpj.slice(0, 13)) !== Number(cnpj[13])) return false;
  return true;
}

// Máscara visual 00.000.000/0000-00
function mascararCNPJ(v) {
  return String(v).replace(/[^\d]/g, '').slice(0, 14)
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
}

export default function RegisterEmpresa() {
  const [nome, setNome] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErro(''); setSucesso('');

    if (!validaCNPJ(cnpj)) {
      setErro('CNPJ inválido. Verifique os números digitados.');
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, senha);
      await api.post('/auth/register-empresa', { nome, cnpj });
      await signOut(auth);
      setSucesso('Cadastro enviado! Sua conta será liberada após a aprovação da coordenação. Você já pode tentar o login depois disso.');
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      const code = err.code || '';
      if (code === 'auth/email-already-in-use') setErro('Este e-mail já está cadastrado.');
      else if (code === 'auth/weak-password') setErro('A senha deve ter ao menos 6 caracteres.');
      else if (code === 'auth/invalid-email') setErro('E-mail inválido.');
      else setErro(err.response?.data?.error || 'Erro ao criar conta. Tente novamente.');
      try { await signOut(auth); } catch { /* ignore */ }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#f0f4f8' }}>
      <div style={{ background: '#004A8C' }} className="hidden md:flex md:w-1/2 flex-col items-center justify-center px-12 text-white">
        <img src="/logo.jpg" alt="Observatório PI" className="w-28 h-28 rounded-2xl object-cover mb-6 shadow-lg" />
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

      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <img src="/logo.jpg" alt="Observatório PI" className="w-16 h-16 rounded-xl object-cover mx-auto mb-3" />
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
              <label className="text-xs font-medium text-gray-500 block mb-1">CNPJ</label>
              <input type="text" value={cnpj} onChange={e => setCnpj(mascararCNPJ(e.target.value))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"
                placeholder="00.000.000/0000-00" inputMode="numeric" required />
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
              {loading ? 'Enviando cadastro...' : 'Criar conta'}
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