import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function AdminDashboard() {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({ nome: '', email: '', role_id: '4' });
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const roles = [
    { id: 1, nome: 'Administrador' },
    { id: 2, nome: 'Coordenador' },
    { id: 3, nome: 'Professor' },
    { id: 4, nome: 'Aluno' },
  ];

  const carregarUsuarios = async () => {
    try {
      const { data } = await api.get('/users');
      setUsuarios(data);
    } catch {
      console.error('Erro ao carregar usuários');
    }
  };

  useEffect(() => { carregarUsuarios(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setMensagem('');
    setLoading(true);
    try {
      await api.post('/auth/register', form);
      setMensagem(`Usuário ${form.nome} criado com sucesso! Senha padrão: Trocar@123`);
      setForm({ nome: '', email: '', role_id: '4' });
      carregarUsuarios();
    } catch (err) {
      setErro(err.response?.data?.error || 'Erro ao criar usuário');
    }
    setLoading(false);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-800 mb-8">Painel Administrativo</h1>

      {/* Formulário */}
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Cadastrar Novo Usuário</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <input
            type="text" placeholder="Nome completo" value={form.nome}
            onChange={e => setForm({ ...form, nome: e.target.value })}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="email" placeholder="E-mail" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <select
            value={form.role_id}
            onChange={e => setForm({ ...form, role_id: e.target.value })}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {roles.map(r => (
              <option key={r.id} value={r.id}>{r.nome}</option>
            ))}
          </select>
          <button
            type="submit" disabled={loading}
            className="bg-blue-800 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Criando...' : 'Cadastrar Usuário'}
          </button>
        </form>
        {mensagem && <p className="mt-3 text-green-600 text-sm">{mensagem}</p>}
        {erro && <p className="mt-3 text-red-500 text-sm">{erro}</p>}
      </div>

      {/* Lista de usuários */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Usuários Cadastrados</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="pb-2">Nome</th>
              <th className="pb-2">E-mail</th>
              <th className="pb-2">Perfil</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(u => (
              <tr key={u.id} className="border-b last:border-0">
                <td className="py-2">{u.nome}</td>
                <td className="py-2">{u.email}</td>
                <td className="py-2 capitalize">{u.role}</td>
              </tr>
            ))}
            {usuarios.length === 0 && (
              <tr><td colSpan={3} className="py-4 text-center text-gray-400">Nenhum usuário encontrado</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}