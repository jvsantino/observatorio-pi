import { useState, useEffect } from 'react';
import api from '../../services/api';

export default function TeacherDashboard() {
  const [projetos, setProjetos] = useState([]);
  const [avaliando, setAvaliando] = useState(null);
  const [form, setForm] = useState({ nota: '', comentario: '' });
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');
  const [visualizando, setVisualizando] = useState(null);

  useEffect(() => {
    api.get('/projects').then(({ data }) => setProjetos(data));
  }, []);

  const handleAvaliar = async (e) => {
    e.preventDefault();
    setErro(''); setMensagem('');
    try {
      await api.post('/evaluations', { ...form, projeto_id: avaliando });
      setMensagem('Avaliação registrada com sucesso!');
      setAvaliando(null);
      setForm({ nota: '', comentario: '' });
    } catch (err) {
      setErro(err.response?.data?.error || 'Erro ao registrar avaliação');
    }
  };

  const notaColor = (nota) => {
    if (!nota) return {};
    const n = parseFloat(nota);
    if (n >= 7) return { bg: '#E8F5E9', color: '#2E7D32' };
    if (n >= 5) return { bg: '#FFF3E0', color: '#E65100' };
    return { bg: '#FFEBEE', color: '#C62828' };
  };

  return (
    <div style={{ background: '#f0f4f8', minHeight: '100vh' }} className="p-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 style={{ color: '#004A8C' }} className="text-2xl font-bold">Painel do Professor</h1>
          <p className="text-gray-400 text-sm mt-1">Avalie os projetos submetidos pelos alunos</p>
        </div>

        {mensagem && <div style={{ background: '#E8F5E9', color: '#2E7D32' }} className="mb-4 p-3 rounded-lg text-sm">✓ {mensagem}</div>}
        {erro && <div style={{ background: '#FFEBEE', color: '#C62828' }} className="mb-4 p-3 rounded-lg text-sm">✕ {erro}</div>}

        {projetos.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <div className="text-4xl mb-3">📋</div>
            <p className="text-gray-400 text-sm">Nenhum projeto disponível para avaliação.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {projetos.map(p => (
              <div key={p.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 style={{ color: '#004A8C' }} className="font-semibold text-lg">{p.titulo}</h3>
                      </div>
                      <p className="text-xs text-gray-400">{p.autor} · {p.curso} · {p.turma} · {p.periodo}</p>
                      <p className="text-sm text-gray-500 mt-2">{p.descricao}</p>
                    </div>
                    <div className="flex gap-2 ml-4 flex-shrink-0">
                      <button
                        onClick={() => setVisualizando(visualizando === p.id ? null : p.id)}
                        style={{ background: '#E8F0FB', color: '#004A8C' }}
                        className="text-xs px-3 py-1.5 rounded-lg font-medium hover:opacity-80 transition"
                      >
                        {visualizando === p.id ? 'Fechar PDF' : 'Ver PDF'}
                      </button>
                      <button
                        onClick={() => setAvaliando(avaliando === p.id ? null : p.id)}
                        style={{ background: avaliando === p.id ? '#FFEBEE' : '#E8F5E9', color: avaliando === p.id ? '#C62828' : '#2E7D32' }}
                        className="text-xs px-3 py-1.5 rounded-lg font-medium hover:opacity-80 transition"
                      >
                        {avaliando === p.id ? 'Cancelar' : 'Avaliar'}
                      </button>
                    </div>
                  </div>

                  {visualizando === p.id && (
                    <iframe
                      src={`http://localhost:3001/uploads/${p.arquivo_pdf}`}
                      className="w-full h-96 mt-4 rounded-xl border"
                      title={p.titulo}
                    />
                  )}

                  {avaliando === p.id && (
                    <form onSubmit={handleAvaliar} className="mt-4 pt-4 border-t border-gray-100">
                      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                        <div>
                          <label className="text-xs font-medium text-gray-500 block mb-1">Nota (0 – 10)</label>
                          <input
                            type="number" min="0" max="10" step="0.1"
                            value={form.nota}
                            onChange={e => setForm({ ...form, nota: e.target.value })}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-400"
                            placeholder="Ex: 8.5" required
                          />
                          {form.nota && (
                            <span
                              style={notaColor(form.nota)}
                              className="inline-block mt-1 text-xs font-medium px-2 py-0.5 rounded-full"
                            >
                              {parseFloat(form.nota) >= 7 ? 'Aprovado' : parseFloat(form.nota) >= 5 ? 'Recuperação' : 'Reprovado'}
                            </span>
                          )}
                        </div>
                        <div className="md:col-span-2">
                          <label className="text-xs font-medium text-gray-500 block mb-1">Comentário (opcional)</label>
                          <textarea
                            value={form.comentario}
                            onChange={e => setForm({ ...form, comentario: e.target.value })}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-green-400"
                            rows={2} placeholder="Feedback para o aluno..."
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        style={{ background: '#2E7D32' }}
                        className="mt-3 w-full text-white py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition"
                      >
                        Registrar Avaliação
                      </button>
                    </form>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}