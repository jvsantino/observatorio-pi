import { useAuth } from '../../hooks/useAuth';

export default function StudentDashboard() {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-blue-800 mb-2">Painel do Aluno</h1>
      <p className="text-gray-600 mb-6">Bem-vindo, {user?.nome}!</p>
      {/* TODO: listar projetos do aluno */}
      <div className="bg-white rounded-xl shadow p-6 text-gray-400 text-center">
        Nenhum projeto publicado ainda.
      </div>
    </div>
  );
}
