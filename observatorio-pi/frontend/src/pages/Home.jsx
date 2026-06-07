import { Link } from 'react-router-dom';

export default function Home() {
  const cards = [
    { icon: '📁', title: 'Submissão Centralizada', desc: 'Envie e gerencie seus projetos em um único lugar, com controle de versões.' },
    { icon: '👨‍🏫', title: 'Avaliação Integrada', desc: 'Professores avaliam projetos diretamente na plataforma com notas e comentários.' },
    { icon: '🏢', title: 'Portfólio Profissional', desc: 'Construa seu portfólio acadêmico no estilo Lattes e seja visto por empresas parceiras.' },
  ];

  return (
    <div className="min-h-screen md:h-[calc(100vh_-_3.5rem)] flex flex-col md:overflow-hidden" style={{ background: '#f0f4f8' }}>
      {/* Hero */}
      <div style={{ background: '#004A8C' }} className="flex-1 flex flex-col items-center justify-center text-center px-6 py-4">
        <div style={{ background: '#F7941C' }} className="w-12 h-12 lg:w-16 lg:h-16 rounded-full flex items-center justify-center text-white font-bold text-lg lg:text-2xl mb-3 mx-auto">
          PI
        </div>
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3">
          Observatório de Projetos Integradores
        </h1>
        <p style={{ color: '#B8D4F0' }} className="text-sm md:text-base lg:text-lg max-w-2xl mb-5">
          Plataforma centralizada para submissão, gerenciamento e avaliação de Projetos Integradores do Curso de Tecnologia da Informação — SENAC Pernambuco.
        </p>
        <Link
          to="/login"
          style={{ background: '#F7941C' }}
          className="px-8 py-3 rounded-lg text-white font-semibold text-base lg:text-lg hover:opacity-90 transition shadow-lg"
        >
          Acessar Plataforma
        </Link>
      </div>

      {/* Cards */}
      <div className="px-6 py-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          {cards.map((card, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="text-2xl lg:text-3xl mb-2">{card.icon}</div>
              <h3 style={{ color: '#004A8C' }} className="font-semibold text-base lg:text-lg mb-1">{card.title}</h3>
              <p className="text-gray-500 text-xs lg:text-sm leading-snug">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: '#004A8C' }} className="py-3 text-center">
        <p style={{ color: '#B8D4F0' }} className="text-xs lg:text-sm">
          © 2026 SENAC Pernambuco · Curso de Tecnologia da Informação
        </p>
      </footer>
    </div>
  );
}