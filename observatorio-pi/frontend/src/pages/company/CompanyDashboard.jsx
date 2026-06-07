import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

const FILES_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:3001/api').replace(/\/api\/?$/, '');
const pdfUrl = (arquivo) => /^https?:\/\//.test(arquivo || '') ? arquivo : `${FILES_BASE}/uploads/${arquivo}`;

// Estrelas clicáveis (0–5)
function StarRating({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(n => (
        <button key={n} type="button" onClick={() => onChange(n)}
          style={{ color: n <= value ? '#F7941C' : '#D1D5DB' }}
          className="text-2xl leading-none hover:scale-110 transition">★</button>
      ))}
    </div>
  );
}

function StarsView({ value }) {
  return (
    <span style={{ color: '#F7941C' }} className="text-base">
      {'★'.repeat(value)}<span style={{ color: '#D1D5DB' }}>{'★'.repeat(5 - value)}</span>
    </span>
  );
}

export default function CompanyDashboard() {
  const { user } = useAuth();
  const [projetos, setProjetos] = useState([]);
  const [ratings, setRatings] = useState({});     // { [projeto_id]: [rating, ...] }
  const [contatos, setContatos] = useState({});   // { [projeto_id]: [contato, ...] }
  const [form, setForm] = useState({});           // { [projeto_id]: { estrelas, comentario } }
  const [visualizando, setVisualizando] = useState(null);
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  const carregar = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjetos(data);
      const entradas = await Promise.all(
        data.map(async (p) => {
          try {
            const { data: r } = await api.get(`/companies/ratings/project/${p.id}`);
            return [p.id, r];
          } catch { return [p.id, []]; }
        })
      );
      setRatings(Object.fromEntries(entradas));
    } catch {
      console.error('Erro ao carregar projetos');
    }
  };

  useEffect(() => {
    // Só carrega os dados se a empresa estiver aprovada
    if (user && (user.aprovado === 1 || user.aprovado === true)) carregar();
  }, [user]);

  const setCampo = (pid, campo, valor) =>
    setForm(f => ({ ...f, [pid]: { ...f[pid], [campo]: valor } }));

  const enviarAvaliacao = async (pid) => {
    setErro(''); setMensagem('');
    const f = form[pid] || {};
    if (!f.estrelas) { setErro('Selecione de 1 a 5 estrelas antes de enviar.'); return; }
    try {
      await api.post('/companies/ratings', { projeto_id: pid, estrelas: f.estrelas, comentario: f.comentario || '' });
      setMensagem('Avaliação enviada com sucesso!');
      setForm(prev => ({ ...prev, [pid]: { estrelas: 0, comentario: '' } }));
      carregar();
    } catch (err) {
      setErro(err.response?.data?.error || 'Erro ao enviar avaliação');
    }
  };

  const verContatos = async (pid) => {
    try {
      const { data } = await api.get(`/companies/projects/${pid}/contacts`);
      setContatos(prev => ({ ...prev, [pid]: data }));
    } catch (err) {
      setErro(err.response?.data?.error || 'Erro ao buscar contatos');
    }
  };

  // Empresa ainda não aprovada pela coordenação
  if (user && (user.aprovado === 0 || user.aprovado === false)) {
    return (
      <div style={{ background: '#f0f4f8', minHeight: '100vh' }} className="p-6">
        <div className="max-w-xl mx-auto">
          <div className="bg-[#F8FAFC] rounded-2xl p-10 mt-10 text-center shadow-sm">
            <div className="text-5xl mb-4">⏳</div>
            <h1 style={{ color: '#004A8C' }} className="text-2xl font-bold mb-2">Cadastro em análise</h1>
            <p className="text-gray-500 text-sm">
              Olá, <span className="font-medium">{user?.nome}</span>! Sua conta de empresa foi recebida e está
              <span className="font-medium"> aguardando aprovação da coordenação</span>. Assim que for liberada,
              você poderá acessar os projetos, avaliar e entrar em contato com os alunos.
            </p>
            <p className="text-gray-400 text-xs mt-4">Tente novamente mais tarde fazendo login.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#f0f4f8', minHeight: '100vh' }} className="p-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div style={{ background: '#004A8C' }} className="rounded-2xl p-6 mb-6 flex items-center gap-5">
          <div style={{ background: '#F7941C' }} className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
            {user?.nome?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{user?.nome}</h1>
            <p style={{ color: '#B8D4F0' }} className="text-sm">Empresa · {user?.email}</p>
            <p style={{ color: '#B8D4F0' }} className="text-xs mt-1">Explore os projetos, avalie e entre em contato com os alunos.</p>
          </div>
        </div>

        {mensagem && <div style={{ background: '#E8F5E9', color: '#2E7D32' }} className="mb-4 p-3 rounded-lg text-sm">✓ {mensagem}</div>}
        {erro && <div style={{ background: '#FFEBEE', color: '#C62828' }} className="mb-4 p-3 rounded-lg text-sm">✕ {erro}</div>}

        {projetos.length === 0 ? (
          <div className="bg-[#F8FAFC] rounded-2xl p-12 text-center shadow-sm">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-gray-400 text-sm">Nenhum projeto disponível no momento.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {projetos.map(p => {
              const f = form[p.id] || {};
              const rs = ratings[p.id] || [];
              const cs = contatos[p.id];
              return (
                <div key={p.id} className="bg-[#F8FAFC] rounded-2xl shadow-sm p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-start">
                    <div className="flex-1">
                      <h3 style={{ color: '#004A8C' }} className="font-semibold text-lg">{p.titulo}</h3>
                      <p className="text-xs text-gray-400">{p.autor} · {p.curso} · {p.turma} · {p.periodo}</p>
                      <p className="text-sm text-gray-500 mt-2">{p.descricao}</p>
                      {p.coparticipantes && (
                        <p className="text-xs text-gray-500 mt-1"><span className="font-medium" style={{ color: '#004A8C' }}>Equipe:</span> {p.autor}, {p.coparticipantes}</p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 sm:ml-4 flex-shrink-0">
                      <button onClick={() => setVisualizando(visualizando === p.id ? null : p.id)}
                        style={{ background: '#E8F0FB', color: '#004A8C' }}
                        className="text-xs px-3 py-1.5 rounded-lg font-medium hover:opacity-80 transition">
                        {visualizando === p.id ? 'Fechar PDF' : 'Ver PDF'}
                      </button>
                      <button onClick={() => verContatos(p.id)}
                        style={{ background: '#FFF3E0', color: '#E65100' }}
                        className="text-xs px-3 py-1.5 rounded-lg font-medium hover:opacity-80 transition">
                        Tenho interesse
                      </button>
                    </div>
                  </div>

                  {/* Contatos revelados */}
                  {cs && (
                    <div style={{ background: '#FFF8EE', border: '1px solid #F7941C44' }} className="mt-3 p-3 rounded-lg">
                      <p style={{ color: '#E65100' }} className="text-xs font-semibold mb-1">Contatos da equipe</p>
                      {cs.map((c, i) => (
                        <p key={i} className="text-sm text-gray-700">
                          {c.nome} <span className="text-gray-400 text-xs">({c.papel})</span> — <a href={`mailto:${c.email}`} style={{ color: '#004A8C' }} className="hover:underline">{c.email}</a>
                        </p>
                      ))}
                    </div>
                  )}

                  {visualizando === p.id && (
                    <iframe src={pdfUrl(p.arquivo_pdf)} className="w-full h-96 mt-4 rounded-xl border" title={p.titulo} />
                  )}

                  {/* Avaliações de empresas já feitas */}
                  {rs.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                      {rs.map(r => (
                        <div key={r.id} className="text-sm">
                          <div className="flex items-center gap-2">
                            <StarsView value={r.estrelas} />
                            <span className="text-xs text-gray-400">— {r.empresa}</span>
                          </div>
                          {r.comentario && <p className="text-gray-600 mt-0.5">{r.comentario}</p>}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Formulário de avaliação da empresa logada */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs font-medium text-gray-500 mb-1">Sua avaliação</p>
                    <StarRating value={f.estrelas || 0} onChange={(n) => setCampo(p.id, 'estrelas', n)} />
                    <textarea value={f.comentario || ''} onChange={e => setCampo(p.id, 'comentario', e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mt-2 focus:outline-none focus:border-blue-400"
                      rows={2} placeholder="Comentário (opcional)" />
                    <button onClick={() => enviarAvaliacao(p.id)}
                      style={{ background: '#004A8C' }}
                      className="mt-2 text-white text-sm px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition">
                      Enviar avaliação
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}