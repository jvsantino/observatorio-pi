# 🎓 Observatório de Projetos Integradores

<div align="center">

**Plataforma web centralizada para submissão, gerenciamento e avaliação de Projetos Integradores**

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://mysql.com)
[![Express](https://img.shields.io/badge/Express.js-4.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![Status](https://img.shields.io/badge/Status-1º%20Entregável%20Concluído-2E7D32?style=flat-square)]()

</div>

---

## 📌 Sobre o Projeto

O **Observatório de Projetos Integradores** é uma plataforma web acadêmica inspirada no modelo do **Currículo Lattes (CNPq)**, desenvolvida como Projeto Integrador do Curso de Tecnologia da Informação — **SENAC Pernambuco**.

O sistema centraliza o processo de submissão, gerenciamento e avaliação dos Projetos Integradores, substituindo o fluxo descentralizado via e-mail e Microsoft Teams por um ambiente organizado, seguro e acessível a todos os perfis da instituição.

| Problema Atual | Solução na Plataforma |
|---|---|
| Envio por e-mail e Teams sem controle | Submissão centralizada com histórico |
| Perda de arquivos e versões | Controle de versão por projeto |
| Sem portfólio profissional para alunos | Perfil individual estilo Lattes |
| Professores sem ferramenta de avaliação | Painel de avaliação integrado |
| Coordenação sem visão consolidada | Relatórios por turma, curso e período |

---

## ✨ Funcionalidades Implementadas

### 🔐 Autenticação e Controle de Acesso
- Login com e-mail e senha via **Firebase Authentication**
- Token JWT verificado pelo backend via Firebase Admin SDK
- **RBAC** — 4 perfis: Administrador, Coordenador, Professor e Aluno
- Rotas protegidas no frontend com redirecionamento automático por perfil

### 🏠 Tela Home Institucional
- Apresentação da plataforma com identidade visual SENAC
- Cards informativos com diferenciais do sistema
- Botão de acesso ao login

### 👨‍💼 Painel Administrativo
- Cadastro de novos usuários (nome, e-mail, perfil)
- Criação automática no Firebase + MySQL
- Listagem de usuários com badges por perfil

### 👨‍🎓 Painel do Aluno
- Perfil estilo Lattes com avatar, nome, e-mail e contador de projetos
- Publicação de projetos em PDF com: título, descrição, curso, turma e período
- Vinculação de coparticipantes via checkbox
- Edição e exclusão de projetos próprios
- Visualização inline do PDF sem download

### 👨‍🏫 Painel do Professor
- Listagem de todos os projetos submetidos
- Visualização inline do PDF de cada projeto
- Avaliação com nota (0–10), comentário e badge automático (Aprovado / Recuperação / Reprovado)

---

## 🛠 Tecnologias

### Front-end
| Tecnologia | Versão | Uso |
|---|---|---|
| React.js | 18+ | Framework principal |
| Vite | 4.x | Bundler e servidor de desenvolvimento |
| Tailwind CSS | 3.x | Estilização e responsividade |
| React Router DOM | 6.x | Navegação e rotas protegidas |
| Firebase SDK | 10.x | Autenticação no cliente |
| Axios | 1.x | Requisições HTTP |

### Back-end
| Tecnologia | Versão | Uso |
|---|---|---|
| Node.js | 18+ | Runtime |
| Express.js | 4.x | Framework HTTP |
| Firebase Admin SDK | 12.x | Verificação de tokens JWT |
| Multer | 1.x | Upload de arquivos PDF |
| mysql2 | 3.x | Driver de conexão com MySQL |
| dotenv | 16.x | Variáveis de ambiente |

### Banco de Dados
| Tecnologia | Versão | Uso |
|---|---|---|
| MySQL | 8.0+ | Banco relacional principal |

---

## 📁 Estrutura do Projeto

```
observatorio-pi/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── firebase.js          # Firebase Admin SDK
│   │   ├── controllers/
│   │   │   ├── authController.js    # Registro e perfil
│   │   │   ├── userController.js    # Gestão de usuários
│   │   │   ├── projectController.js # CRUD de projetos
│   │   │   └── evaluationController.js
│   │   ├── middlewares/
│   │   │   ├── authMiddleware.js    # Verifica token Firebase
│   │   │   ├── roleMiddleware.js    # Controle RBAC
│   │   │   └── uploadMiddleware.js  # Multer (só PDF)
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── userRoutes.js
│   │   │   ├── projectRoutes.js
│   │   │   └── evaluationRoutes.js
│   │   └── database/
│   │       ├── connection.js        # Pool MySQL
│   │       └── migrations.sql       # Criação das tabelas
│   ├── uploads/                     # PDFs armazenados
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── common/
│       │   │   ├── PrivateRoute.jsx # Guard de rotas
│       │   │   └── PDFViewer.jsx
│       │   └── layout/
│       │       └── Navbar.jsx
│       ├── contexts/
│       │   └── AuthContext.jsx      # Estado global do usuário
│       ├── hooks/
│       │   └── useAuth.js
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── auth/Login.jsx
│       │   ├── admin/AdminDashboard.jsx
│       │   ├── student/StudentDashboard.jsx
│       │   └── teacher/TeacherDashboard.jsx
│       └── services/
│           ├── firebase.js          # Config Firebase
│           └── api.js               # Axios + token automático
│
├── docs/
│   └── Escopo_Observatorio_PI_v3.docx
├── .gitignore
└── README.md
```

---

## 🗄 Banco de Dados

### Diagrama de Relacionamentos

```
roles (1) ──────────── (N) usuarios (1) ──────────────── (N) projetos
                                │ (1)                            │ (1)
                                │                                │
                              (N) │                            (N) │
                       projeto_alunos (N:M)          avaliacoes (N)
                                │                                │
                              (N) │                            (N) │
                            projetos                         usuarios
                           (copart.)                        (professor)
```

### SQL — Criação das Tabelas

```sql
CREATE TABLE roles (
  id   INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(30) NOT NULL
);

CREATE TABLE usuarios (
  id           INT PRIMARY KEY AUTO_INCREMENT,
  nome         VARCHAR(100) NOT NULL,
  email        VARCHAR(100) UNIQUE NOT NULL,
  firebase_uid VARCHAR(128) UNIQUE NOT NULL,
  role_id      INT NOT NULL,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE projetos (
  id           INT PRIMARY KEY AUTO_INCREMENT,
  titulo       VARCHAR(150) NOT NULL,
  descricao    TEXT NOT NULL,
  curso        VARCHAR(100) NOT NULL,
  turma        VARCHAR(50)  NOT NULL,
  periodo      VARCHAR(20)  NOT NULL,
  arquivo_pdf  VARCHAR(255) NOT NULL,
  data_envio   DATETIME DEFAULT CURRENT_TIMESTAMP,
  autor_id     INT NOT NULL,
  FOREIGN KEY (autor_id) REFERENCES usuarios(id)
);

CREATE TABLE projeto_alunos (
  projeto_id  INT     NOT NULL,
  aluno_id    INT     NOT NULL,
  confirmado  BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (projeto_id, aluno_id),
  FOREIGN KEY (projeto_id) REFERENCES projetos(id),
  FOREIGN KEY (aluno_id)   REFERENCES usuarios(id)
);

CREATE TABLE avaliacoes (
  id           INT PRIMARY KEY AUTO_INCREMENT,
  nota         DECIMAL(4,2) NOT NULL,
  comentario   TEXT,
  professor_id INT NOT NULL,
  projeto_id   INT NOT NULL,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (professor_id) REFERENCES usuarios(id),
  FOREIGN KEY (projeto_id)   REFERENCES projetos(id)
);

INSERT INTO roles (nome) VALUES
  ('administrador'), ('coordenador'), ('professor'), ('aluno');
```

---

## 🚀 Como Executar

### Pré-requisitos

- [Node.js](https://nodejs.org) 18 ou superior
- [MySQL](https://mysql.com) 8.0 ou superior
- Conta no [Firebase](https://firebase.google.com) com projeto criado

### 1. Clonar o repositório

```bash
git clone https://github.com/jvsantino/observatorio-pi.git
cd observatorio-pi
```

### 2. Configurar o Firebase

1. Acesse [console.firebase.google.com](https://console.firebase.google.com)
2. Crie um projeto e ative o **Authentication → E-mail/senha**
3. Registre um app Web e copie o `firebaseConfig`
4. Em **Configurações → Contas de serviço**, gere uma chave privada (JSON)

### 3. Configurar o Back-end

```bash
cd backend
npm install
cp .env.example .env
# Edite o .env com suas credenciais
```

Conteúdo do `backend/.env`:
```env
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=observatorio_pi
FIREBASE_PROJECT_ID=seu_project_id
FIREBASE_CLIENT_EMAIL=seu_client_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
UPLOAD_DIR=uploads
MAX_FILE_SIZE=10485760
```

Criar o banco de dados:
```bash
# Via MySQL Workbench: abrir e executar backend/src/database/migrations.sql
# Ou via terminal:
mysql -u root -p < backend/src/database/migrations.sql
```

Iniciar o servidor:
```bash
npm run dev   # http://localhost:3001
```

### 4. Configurar o Front-end

```bash
cd frontend
npm install
cp .env.example .env
# Edite o .env com suas credenciais Firebase
```

Conteúdo do `frontend/.env`:
```env
VITE_API_URL=http://localhost:3001/api
VITE_FIREBASE_API_KEY=sua_api_key
VITE_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=seu_project_id
VITE_FIREBASE_STORAGE_BUCKET=seu_projeto.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
VITE_FIREBASE_APP_ID=seu_app_id
```

Iniciar o frontend:
```bash
npm run dev   # http://localhost:5173
```

### 5. Criar o primeiro usuário Administrador

Com o backend rodando, execute na pasta `backend/`:

```bash
node createAdmin.js
```

Acesse com:
- **E-mail:** admin@observatorio.com
- **Senha:** Admin@123

---

## 📡 Rotas da API

### Autenticação
| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| `GET` | `/api/auth/me` | Autenticado | Retorna dados do usuário logado |
| `POST` | `/api/auth/register` | Admin/Coord | Cria usuário no Firebase + MySQL |

### Usuários
| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| `GET` | `/api/users` | Admin/Coord | Lista todos os usuários |
| `GET` | `/api/users/alunos` | Autenticado | Lista apenas alunos |
| `GET` | `/api/users/:id` | Autenticado | Busca usuário por ID |
| `PUT` | `/api/users/:id` | Admin/Coord | Atualiza usuário |

### Projetos
| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| `GET` | `/api/projects` | Autenticado | Lista projetos (filtros: curso/turma/período) |
| `GET` | `/api/projects/:id` | Autenticado | Busca projeto por ID |
| `POST` | `/api/projects` | Aluno | Cria projeto com upload PDF |
| `PUT` | `/api/projects/:id` | Aluno (autor) | Edita projeto próprio |
| `DELETE` | `/api/projects/:id` | Aluno/Admin | Exclui projeto |

### Avaliações
| Método | Rota | Acesso | Descrição |
|---|---|---|---|
| `POST` | `/api/evaluations` | Professor | Registra avaliação com nota |
| `GET` | `/api/evaluations/project/:id` | Autenticado | Avaliações de um projeto |

---

## 📜 Regras de Negócio

| Código | Regra |
|---|---|
| RN01 | Somente Administrador/Coordenador pode cadastrar novos usuários |
| RN02 | Cada aluno pode editar e excluir apenas os projetos de sua própria autoria |
| RN03 | O sistema registra automaticamente data e horário de cada submissão |
| RN04 | Projetos só podem ser excluídos pelo autor ou pelo administrador |
| RN05 | Todo projeto deve conter: título, descrição, curso, turma, período e arquivo PDF |
| RN06 | Um projeto pode ter múltiplos coparticipantes vinculados |
| RN07 | O sistema valida e aceita exclusivamente arquivos no formato PDF |
| RN08 | O controle de acesso é baseado em papéis (RBAC) via tabela `roles` |

---

## 👥 Hierarquia de Papéis

| Papel | Cadastrar Usuários | Publicar Projeto | Avaliar Projeto | Ver Todos os Projetos |
|---|:---:|:---:|:---:|:---:|
| Administrador | ✅ | — | — | ✅ |
| Coordenador | ✅ | — | — | ✅ |
| Professor | — | — | ✅ | ✅ |
| Aluno | — | ✅ | — | ✅ (públicos) |

---

## 🎨 Identidade Visual

O sistema utiliza a identidade visual institucional do **SENAC Pernambuco**:

| Elemento | Cor |
|---|---|
| Azul institucional | `#004A8C` |
| Laranja SENAC | `#F7941C` |
| Fundo geral | `#F0F4F8` |

---

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch: `git checkout -b feature/nome-da-feature`
3. Commit: `git commit -m 'feat: adiciona nome-da-feature'`
4. Push: `git push origin feature/nome-da-feature`
5. Abra um Pull Request

### Padrão de commits
```
feat:     nova funcionalidade
fix:      correção de bug
docs:     atualização de documentação
style:    formatação visual
refactor: refatoração de código
```

---

## 👨‍💻 Equipe

Desenvolvido por alunos do **Curso de Tecnologia da Informação — SENAC Pernambuco**

| Nome | GitHub |
|---|---|
| João Victor Santino | [@jvsantino](https://github.com/jvsantino) |
| Jean Phillip Saboia | [@jean-jpss](https://github.com/jean-jpss) |
| Ibson Gomes Lemos | [@ibsongomes](https://github.com/ibsongomes) |
| Gabriel Roberto Tavares | [@GABRIELR48O](https://github.com/GABRIELR48O) |

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">

**Observatório de Projetos Integradores** · SENAC Pernambuco · Curso de Tecnologia da Informação · 2025

</div>
