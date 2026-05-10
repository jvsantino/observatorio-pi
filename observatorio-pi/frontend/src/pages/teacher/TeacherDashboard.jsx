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

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-800 mb-8">Painel do Professor</h1>

      {mensagem && <p className="mb-4 text-green-600 text-sm">{mensagem}</p>}
      {erro && <p className="mb-4 text-red-500 text-sm">{erro}</p>}

      <div className="space-y-4">
        {projetos.length === 0 && (
          <p className="text-gray-400 text-center py-8">Nenhum projeto disponível.</p>
        )}
        {projetos.map(p => (
          <div key={p.id} className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-blue-800 text-lg">{p.titulo}</h3>
                <p className="text-sm text-gray-500">{p.autor} · {p.curso} · {p.turma} · {p.periodo}</p>
                <p className="text-sm text-gray-600 mt-1">{p.descricao}</p>
              </div>
              <div className="flex gap-2 ml-4">
                <button onClick={() => setVisualizando(visualizando === p.id ? null : p.id)}
                  className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded hover:bg-blue-200">
                  {visualizando === p.id ? 'Fechar' : 'Ver PDF'}
                </button>
                <button onClick={() => setAvaliando(avaliando === p.id ? null : p.id)}
                  className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded hover:bg-green-200">
                  {avaliando === p.id ? 'Cancelar' : 'Avaliar'}
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

            {avaliando === p.id && (
              <form onSubmit={handleAvaliar} className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 border-t pt-4">
                <input
                  type="number" placeholder="Nota (0-10)" min="0" max="10" step="0.1"
                  value={form.nota} onChange={e => setForm({ ...form, nota: e.target.value })}
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
                <textarea
                  placeholder="Comentário (opcional)" value={form.comentario}
                  onChange={e => setForm({ ...form, comentario: e.target.value })}
                  className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 md:col-span-2"
                  rows={2}
                />
                <button type="submit"
                  className="md:col-span-2 bg-green-700 text-white py-2 rounded-lg hover:bg-green-600 transition">
                  Registrar Avaliação
                </button>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}