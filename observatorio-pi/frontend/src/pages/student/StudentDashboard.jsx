import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [projetos, setProjetos] = useState([]);
  const [form, setForm] = useState({ titulo: '', descricao: '', curso: '', turma: '', periodo: '' });
  const [arquivo, setArquivo] = useState(null);
  const [editando, setEditando] = useState(null);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [visualizando, setVisualizando] = useState(null);
  const [alunos, setAlunos] = useState([]);
  const [participantes, setParticipantes] = useState([]);

  const carregarProjetos = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjetos(data.filter(p => p.autor_id === user.id));
    } catch {
      console.error('Erro ao carregar projetos');
    }
  };

  useEffect(() => {
    if (user) {
      carregarProjetos();
     api.get('/users/alunos').then(({ data }) => {
  setAlunos(data.filter(u => u.id !== user.id));
});
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(''); setMensagem(''); setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      if (arquivo) formData.append('arquivo_pdf', arquivo);
      participantes.forEach(id => formData.append('participantes[]', id));

      if (editando) {
        await api.put(`/projects/${editando}`, formData);
        setMensagem('Projeto atualizado com sucesso!');
        setEditando(null);
      } else {
        await api.post('/projects', formData);
        setMensagem('Projeto publicado com sucesso!');
      }
      setForm({ titulo: '', descricao: '', curso: '', turma: '', periodo: '' });
      setArquivo(null);
      setParticipantes([]);
      carregarProjetos();
    } catch (err) {
      setErro(err.response?.data?.error || 'Erro ao salvar projeto');
    }
    setLoading(false);
  };

  const handleEditar = (p) => {
    setEditando(p.id);
    setForm({ titulo: p.titulo, descricao: p.descricao, curso: p.curso, turma: p.turma, periodo: p.periodo });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExcluir = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este projeto?')) return;
    await api.delete(`/projects/${id}`);
    carregarProjetos();
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="bg-blue-800 text-white rounded-xl p-6 mb-8">
        <h1 className="text-2xl font-bold">{user?.nome}</h1>
        <p className="text-blue-200 capitalize">{user?.role} · {user?.email}</p>
      </div>

      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          {editando ? 'Editar Projeto' : 'Publicar Novo Projeto'}
        </h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <input
            type="text" placeholder="Título do projeto" value={form.titulo}
            onChange={e => setForm({ ...form, titulo: e.target.value })}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2"
            required
          />
          <textarea
            placeholder="Descrição" value={form.descricao}
            onChange={e => setForm({ ...form, descricao: e.target.value })}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2"
            rows={3} required
          />
          <input
            type="text" placeholder="Curso" value={form.curso}
            onChange={e => setForm({ ...form, curso: e.target.value })}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text" placeholder="Turma" value={form.turma}
            onChange={e => setForm({ ...form, turma: e.target.value })}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text" placeholder="Período (ex: 2025.1)" value={form.periodo}
            onChange={e => setForm({ ...form, periodo: e.target.value })}
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="file" accept="application/pdf"
            onChange={e => setArquivo(e.target.files[0])}
            className="border rounded-lg px-3 py-2 text-sm"
            required={!editando}
          />
          <div className="md:col-span-2">
            <label className="text-sm text-gray-600 mb-1 block">Coparticipantes</label>
            <div className="border rounded-lg p-3 max-h-32 overflow-y-auto space-y-1">
              {alunos.length === 0 && <p className="text-gray-400 text-sm">Nenhum outro aluno cadastrado.</p>}
              {alunos.map(a => (
                <label key={a.id} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={participantes.includes(a.id)}
                    onChange={e => {
                      if (e.target.checked) setParticipantes([...participantes, a.id]);
                      else setParticipantes(participantes.filter(id => id !== a.id));
                    }}
                  />
                  {a.nome} — {a.email}
                </label>
              ))}
            </div>
          </div>
          <div className="md:col-span-2 flex gap-2">
            <button type="submit" disabled={loading}
              className="flex-1 bg-blue-800 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
              {loading ? 'Salvando...' : editando ? 'Salvar Alterações' : 'Publicar Projeto'}
            </button>
            {editando && (
              <button type="button" onClick={() => { setEditando(null); setForm({ titulo: '', descricao: '', curso: '', turma: '', periodo: '' }); }}
                className="px-4 bg-gray-200 rounded-lg hover:bg-gray-300 transition">
                Cancelar
              </button>
            )}
          </div>
        </form>
        {mensagem && <p className="mt-3 text-green-600 text-sm">{mensagem}</p>}
        {erro && <p className="mt-3 text-red-500 text-sm">{erro}</p>}
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Meus Projetos</h2>
        {projetos.length === 0 ? (
          <p className="text-gray-400 text-center py-4">Nenhum projeto publicado ainda.</p>
        ) : (
          <div className="space-y-4">
            {projetos.map(p => (
              <div key={p.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-blue-800">{p.titulo}</h3>
                    <p className="text-sm text-gray-500">{p.curso} · {p.turma} · {p.periodo}</p>
                    <p className="text-sm text-gray-600 mt-1">{p.descricao}</p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button onClick={() => setVisualizando(visualizando === p.id ? null : p.id)}
                      className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded hover:bg-blue-200">
                      {visualizando === p.id ? 'Fechar' : 'Ver PDF'}
                    </button>
                    <button onClick={() => handleEditar(p)}
                      className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded hover:bg-yellow-200">
                      Editar
                    </button>
                    <button onClick={() => handleExcluir(p.id)}
                      className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200">
                      Excluir
                    </button>
                  </div>
                </div>
                {visualizando === p.id && (
                  <iframe
                    src={`http://localhost:3001/uploads/${p.arquivo_pdf}`}
                    className="w-full h-96 mt-4 rounded border"
                    title={p.titulo}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}