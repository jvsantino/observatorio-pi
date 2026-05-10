import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#f0f4f8' }}>
      {/* Hero */}
      <div style={{ background: '#004A8C' }} className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <div style={{ background: '#F7941C' }} className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-6 mx-auto">
          PI
        </div>
        <h1 className="text-4xl font-bold text-white mb-3">
          Observatório de Projetos Integradores
        </h1>
        <p style={{ color: '#B8D4F0' }} className="text-lg max-w-2xl mb-8">
          Plataforma centralizada para submissão, gerenciamento e avaliação de Projetos Integradores do Curso de Tecnologia da Informação — SENAC Pernambuco.
        </p>
        <Link
          to="/login"
          style={{ background: '#F7941C' }}
          className="px-8 py-3 rounded-lg text-white font-semibold text-lg hover:opacity-90 transition shadow-lg"
        >
          Acessar Plataforma
        </Link>
      </div>

      {/* Cards informativos */}
      <div style={{ background: '#f0f4f8' }} className="py-16 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: '📁', title: 'Submissão Centralizada', desc: 'Envie e gerencie seus projetos em um único lugar, com controle de versões.' },
            { icon: '👨‍🏫', title: 'Avaliação Integrada', desc: 'Professores avaliam projetos diretamente na plataforma com notas e comentários.' },
            { icon: '🏢', title: 'Portfólio Profissional', desc: 'Construa seu portfólio acadêmico no estilo Lattes e seja visto por empresas parceiras.' },
          ].map((card, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="text-3xl mb-3">{card.icon}</div>
              <h3 style={{ color: '#004A8C' }} className="font-semibold text-lg mb-2">{card.title}</h3>
              <p className="text-gray-500 text-sm">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: '#004A8C' }} className="py-4 text-center">
        <p style={{ color: '#B8D4F0' }} className="text-sm">
          © 2025 SENAC Pernambuco · Curso de Tecnologia da Informação
        </p>
      </footer>
    </div>
  );
}