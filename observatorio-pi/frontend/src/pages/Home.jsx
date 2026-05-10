import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold text-blue-800 mb-4">Observatório de Projetos Integradores</h1>
      <p className="text-gray-600 max-w-xl mb-8">
        Plataforma centralizada para submissão, gerenciamento e avaliação de Projetos Integradores
        do Curso de Tecnologia da Informação.
      </p>
      <Link to="/login" className="bg-blue-800 text-white px-6 py-3 rounded-lg text-lg hover:bg-blue-700 transition">
        Acessar Plataforma
      </Link>
    </div>
  );
}
