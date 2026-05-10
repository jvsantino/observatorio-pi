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
    setErro(''); setMensagem(''); setLoading(true);
    try {
      await api.post('/auth/register', form);
      setMensagem(`Usuário ${form.nome} criado! Senha padrão: Trocar@123`);
      setForm({ nome: '', email: '', role_id: '4' });
      carregarUsuarios();
    } catch (err) {
      setErro(err.response?.data?.error || 'Erro ao criar usuário');
    }
    setLoading(false);
  };

  const roleColors = {
    administrador: { bg: '#E8F0FB', color: '#004A8C' },
    coordenador:   { bg: '#FFF3E0', color: '#E65100' },
    professor:     { bg: '#E8F5E9', color: '#2E7D32' },
    aluno:         { bg: '#F3E5F5', color: '#6A1B9A' },
  };

  return (
    <div style={{ background: '#f0f4f8', minHeight: '100vh' }} className="p-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 style={{ color: '#004A8C' }} className="text-2xl font-bold">Painel Administrativo</h1>
          <p className="text-gray-400 text-sm mt-1">Gerencie os usuários da plataforma</p>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <div style={{ background: '#F7941C' }} className="w-1 h-6 rounded-full"></div>
            <h2 style={{ color: '#004A8C' }} className="font-semibold text-lg">Cadastrar Novo Usuário</h2>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Nome completo</label>
              <input
                type="text" value={form.nome}
                onChange={e => setForm({ ...form, nome: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                placeholder="Ex: João Silva"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">E-mail</label>
              <input
                type="email" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                placeholder="Ex: joao@senac.br"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Perfil</label>
              <select
                value={form.role_id}
                onChange={e => setForm({ ...form, role_id: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
              >
                {roles.map(r => <option key={r.id} value={r.id}>{r.nome}</option>)}
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="submit" disabled={loading}
                style={{ background: '#004A8C' }}
                className="w-full text-white py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition disabled:opacity-50"
              >
                {loading ? 'Criando...' : 'Cadastrar Usuário'}
              </button>
            </div>
          </form>
          {mensagem && (
            <div style={{ background: '#E8F5E9', color: '#2E7D32' }} className="mt-4 p-3 rounded-lg text-sm">
              ✓ {mensagem}
            </div>
          )}
          {erro && (
            <div style={{ background: '#FFEBEE', color: '#C62828' }} className="mt-4 p-3 rounded-lg text-sm">
              ✕ {erro}
            </div>
          )}
        </div>

        {/* Tabela */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <div style={{ background: '#F7941C' }} className="w-1 h-6 rounded-full"></div>
            <h2 style={{ color: '#004A8C' }} className="font-semibold text-lg">
              Usuários Cadastrados
              <span style={{ background: '#E8F0FB', color: '#004A8C' }} className="ml-2 text-xs font-medium px-2 py-0.5 rounded-full">
                {usuarios.length}
              </span>
            </h2>
          </div>
          <div className="space-y-2">
            {usuarios.length === 0 && (
              <p className="text-gray-400 text-center py-8 text-sm">Nenhum usuário cadastrado.</p>
            )}
            {usuarios.map(u => (
              <div key={u.id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:border-gray-200 transition">
                <div className="flex items-center gap-3">
                  <div style={{ background: '#E8F0FB', color: '#004A8C' }}
                    className="w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm flex-shrink-0">
                    {u.nome.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{u.nome}</p>
                    <p className="text-xs text-gray-400">{u.email}</p>
                  </div>
                </div>
                <span
                  style={roleColors[u.role] || { bg: '#f0f0f0', color: '#333' }}
                  className="text-xs font-medium px-3 py-1 rounded-full capitalize"
                  style={{ background: (roleColors[u.role] || {}).bg, color: (roleColors[u.role] || {}).color }}
                >
                  {u.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}