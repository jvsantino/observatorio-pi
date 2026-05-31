import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

// URL base dos arquivos (backend), derivada da VITE_API_URL removendo o sufixo "/api"
const FILES_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace(/\/api\/?$/, '');
// Se arquivo_pdf já for uma URL completa (Cloudinary), usa direto; senão, compat. /uploads (legado)
const pdfUrl = (arquivo) => /^https?:\/\//.test(arquivo || '') ? arquivo : `${FILES_BASE}/uploads/${arquivo}`;

const statusInfo = (nota) => {
  const n = parseFloat(nota);
  if (n >= 7) return { label: 'Aprovado', bg: '#E8F5E9', color: '#2E7D32' };
  if (n >= 5) return { label: 'Recuperação', bg: '#FFF3E0', color: '#E65100' };
  return { label: 'Reprovado', bg: '#FFEBEE', color: '#C62828' };
};

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
  const [avaliacoes, setAvaliacoes] = useState({});       // { [projeto_id]: [avaliacao, ...] }
  const [convites, setConvites] = useState([]);           // projetos pendentes de aceite
  const [participacoes, setParticipacoes] = useState([]); // projetos onde sou coparticipante confirmado

  const carregarAvaliacoes = async (lista) => {
    const entradas = await Promise.all(
      lista.map(async (p) => {
        try {
          const { data: avs } = await api.get(`/evaluations/project/${p.id}`);
          return [p.id, avs];
        } catch {
          return [p.id, []];
        }
      })
    );
    return Object.fromEntries(entradas);
  };

  const carregarTudo = async () => {
    try {
      const { data } = await api.get('/projects');
      const meus = data.filter(p => p.autor_id === user.id);
      setProjetos(meus);

      const [{ data: inv }, { data: part }] = await Promise.all([
        api.get('/projects/me/invites'),
        api.get('/projects/me/participations'),
      ]);
      setConvites(inv);
      setParticipacoes(part);

      // avaliações dos meus projetos + das minhas participações
      const mapa = await carregarAvaliacoes([...meus, ...part]);
      setAvaliacoes(mapa);
    } catch {
      console.error('Erro ao carregar dados do painel');
    }
  };

  useEffect(() => {
    if (user) {
      carregarTudo();
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
      carregarTudo();
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
    carregarTudo();
  };

  const responderConvite = async (projetoId, acao) => {
    try {
      await api.put(`/projects/${projetoId}/coparticipation`, { acao });
      setMensagem(acao === 'aceitar' ? 'Participação confirmada!' : 'Convite recusado.');
      carregarTudo();
    } catch (err) {
      setErro(err.response?.data?.error || 'Erro ao responder convite');
    }
  };

  // Bloco reutilizável para exibir avaliações de um projeto
  const blocoAvaliacoes = (projetoId) => {
    const avs = avaliacoes[projetoId] || [];
    if (avs.length === 0) return null;
    return (
      <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
        {avs.map(a => {
          const s = statusInfo(a.nota);
          return (
            <div key={a.id} className="flex items-start gap-3">
              <div className="flex flex-col items-center flex-shrink-0">
                <span style={{ color: '#004A8C' }} className="text-lg font-bold leading-none">{parseFloat(a.nota).toFixed(1)}</span>
                <span style={{ background: s.bg, color: s.color }} className="mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full">{s.label}</span>
              </div>
              <div className="text-sm">
                <p className="text-gray-700">{a.comentario || <span className="text-gray-400 italic">Sem comentário</span>}</p>
                {a.professor && <p className="text-xs text-gray-400 mt-0.5">Avaliado por {a.professor}</p>}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div style={{ background: '#f0f4f8', minHeight: '100vh' }} className="p-6">
      <div className="max-w-4xl mx-auto">

        {/* Perfil estilo Lattes */}
        <div style={{ background: '#004A8C' }} className="rounded-2xl p-6 mb-6 flex items-center gap-5">
          <div style={{ background: '#F7941C' }} className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
            {user?.nome?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{user?.nome}</h1>
            <p style={{ color: '#B8D4F0' }} className="text-sm capitalize">{user?.role} · {user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span style={{ background: '#F7941C' }} className="text-white text-xs px-3 py-0.5 rounded-full font-medium">
                {projetos.length} {projetos.length === 1 ? 'projeto' : 'projetos'} publicados
              </span>
            </div>
          </div>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <div style={{ background: '#F7941C' }} className="w-1 h-6 rounded-full"></div>
            <h2 style={{ color: '#004A8C' }} className="font-semibold text-lg">
              {editando ? 'Editar Projeto' : 'Publicar Novo Projeto'}
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="text-xs font-medium text-gray-500 block mb-1">Título do projeto</label>
              <input type="text" value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                placeholder="Ex: Sistema de Gestão Escolar" required />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-medium text-gray-500 block mb-1">Descrição</label>
              <textarea value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                rows={3} placeholder="Descreva o objetivo e escopo do projeto..." required />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Curso</label>
              <input type="text" value={form.curso} onChange={e => setForm({ ...form, curso: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                placeholder="Ex: ADS" required />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Turma</label>
              <input type="text" value={form.turma} onChange={e => setForm({ ...form, turma: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                placeholder="Ex: TDS-02" required />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Período</label>
              <input type="text" value={form.periodo} onChange={e => setForm({ ...form, periodo: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
                placeholder="Ex: 2025.1" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Arquivo PDF</label>
              <input type="file" accept="application/pdf" onChange={e => setArquivo(e.target.files[0])}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" required={!editando} />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-medium text-gray-500 block mb-1">Coparticipantes</label>
              <div className="border border-gray-200 rounded-lg p-3 max-h-32 overflow-y-auto space-y-1">
                {alunos.length === 0
                  ? <p className="text-gray-400 text-xs">Nenhum outro aluno cadastrado.</p>
                  : alunos.map(a => (
                    <label key={a.id} className="flex items-center gap-2 text-sm cursor-pointer hover:bg-gray-50 p-1 rounded">
                      <input type="checkbox" checked={participantes.includes(a.id)}
                        onChange={e => {
                          if (e.target.checked) setParticipantes([...participantes, a.id]);
                          else setParticipantes(participantes.filter(id => id !== a.id));
                        }} />
                      <span className="text-gray-700">{a.nome}</span>
                      <span className="text-gray-400 text-xs">— {a.email}</span>
                    </label>
                  ))
                }
              </div>
              <p className="text-[11px] text-gray-400 mt-1">Os coparticipantes recebem um convite e só aparecem no projeto após aceitarem.</p>
            </div>
            <div className="md:col-span-2 flex gap-2">
              <button type="submit" disabled={loading} style={{ background: '#004A8C' }}
                className="flex-1 text-white py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition disabled:opacity-50">
                {loading ? 'Salvando...' : editando ? 'Salvar Alterações' : 'Publicar Projeto'}
              </button>
              {editando && (
                <button type="button"
                  onClick={() => { setEditando(null); setForm({ titulo: '', descricao: '', curso: '', turma: '', periodo: '' }); }}
                  className="px-5 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition">
                  Cancelar
                </button>
              )}
            </div>
          </form>
          {mensagem && <div style={{ background: '#E8F5E9', color: '#2E7D32' }} className="mt-4 p-3 rounded-lg text-sm">✓ {mensagem}</div>}
          {erro && <div style={{ background: '#FFEBEE', color: '#C62828' }} className="mt-4 p-3 rounded-lg text-sm">✕ {erro}</div>}
        </div>

        {/* Convites de Participação */}
        {convites.length > 0 && (
          <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <div style={{ background: '#F7941C' }} className="w-1 h-6 rounded-full"></div>
              <h2 style={{ color: '#004A8C' }} className="font-semibold text-lg">Convites de Participação</h2>
              <span style={{ background: '#FFF3E0', color: '#E65100' }} className="text-xs px-2 py-0.5 rounded-full font-medium">{convites.length}</span>
            </div>
            <div className="space-y-3">
              {convites.map(p => (
                <div key={p.id} style={{ border: '1px solid #e5e7eb' }} className="rounded-xl p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 style={{ color: '#004A8C' }} className="font-semibold">{p.titulo}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">por {p.autor} · {p.curso} · {p.turma} · {p.periodo}</p>
                      <p className="text-sm text-gray-500 mt-1">{p.descricao}</p>
                    </div>
                    <div className="flex gap-2 ml-4 flex-shrink-0">
                      <button onClick={() => responderConvite(p.id, 'aceitar')}
                        style={{ background: '#E8F5E9', color: '#2E7D32' }}
                        className="text-xs px-3 py-1.5 rounded-lg font-medium hover:opacity-80 transition">Aceitar</button>
                      <button onClick={() => responderConvite(p.id, 'recusar')}
                        style={{ background: '#FFEBEE', color: '#C62828' }}
                        className="text-xs px-3 py-1.5 rounded-lg font-medium hover:opacity-80 transition">Recusar</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Meus Projetos */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <div style={{ background: '#F7941C' }} className="w-1 h-6 rounded-full"></div>
            <h2 style={{ color: '#004A8C' }} className="font-semibold text-lg">Meus Projetos</h2>
          </div>
          {projetos.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">📂</div>
              <p className="text-gray-400 text-sm">Nenhum projeto publicado ainda.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {projetos.map(p => (
                <div key={p.id} style={{ border: '1px solid #e5e7eb' }} className="rounded-xl p-4 hover:border-blue-200 transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 style={{ color: '#004A8C' }} className="font-semibold">{p.titulo}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">{p.curso} · {p.turma} · {p.periodo}</p>
                      <p className="text-sm text-gray-500 mt-1">{p.descricao}</p>
                      {p.coparticipantes && (
                        <p className="text-xs text-gray-500 mt-1"><span className="font-medium" style={{ color: '#004A8C' }}>Com:</span> {p.coparticipantes}</p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4 flex-shrink-0">
                      <button onClick={() => setVisualizando(visualizando === p.id ? null : p.id)}
                        style={{ background: '#E8F0FB', color: '#004A8C' }}
                        className="text-xs px-3 py-1.5 rounded-lg font-medium hover:opacity-80 transition">
                        {visualizando === p.id ? 'Fechar' : 'Ver PDF'}
                      </button>
                      <button onClick={() => handleEditar(p)}
                        style={{ background: '#FFF3E0', color: '#E65100' }}
                        className="text-xs px-3 py-1.5 rounded-lg font-medium hover:opacity-80 transition">Editar</button>
                      <button onClick={() => handleExcluir(p.id)}
                        style={{ background: '#FFEBEE', color: '#C62828' }}
                        className="text-xs px-3 py-1.5 rounded-lg font-medium hover:opacity-80 transition">Excluir</button>
                    </div>
                  </div>
                  {blocoAvaliacoes(p.id)}
                  {visualizando === p.id && (
                    <iframe src={pdfUrl(p.arquivo_pdf)} className="w-full h-96 mt-4 rounded-lg border" title={p.titulo} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Minhas Participações */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <div style={{ background: '#F7941C' }} className="w-1 h-6 rounded-full"></div>
            <h2 style={{ color: '#004A8C' }} className="font-semibold text-lg">Minhas Participações</h2>
          </div>
          {participacoes.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-3">🤝</div>
              <p className="text-gray-400 text-sm">Você ainda não participa de projetos de outros alunos.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {participacoes.map(p => (
                <div key={p.id} style={{ border: '1px solid #e5e7eb' }} className="rounded-xl p-4 hover:border-blue-200 transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 style={{ color: '#004A8C' }} className="font-semibold">{p.titulo}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">por {p.autor} · {p.curso} · {p.turma} · {p.periodo}</p>
                      <p className="text-sm text-gray-500 mt-1">{p.descricao}</p>
                    </div>
                    <div className="flex gap-2 ml-4 flex-shrink-0">
                      <button onClick={() => setVisualizando(visualizando === p.id ? null : p.id)}
                        style={{ background: '#E8F0FB', color: '#004A8C' }}
                        className="text-xs px-3 py-1.5 rounded-lg font-medium hover:opacity-80 transition">
                        {visualizando === p.id ? 'Fechar' : 'Ver PDF'}
                      </button>
                    </div>
                  </div>
                  {blocoAvaliacoes(p.id)}
                  {visualizando === p.id && (
                    <iframe src={pdfUrl(p.arquivo_pdf)} className="w-full h-96 mt-4 rounded-lg border" title={p.titulo} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}