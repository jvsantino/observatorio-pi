# 🎓 Observatório de Projetos Integradores

Plataforma web centralizada para submissão, gerenciamento e avaliação de Projetos Integradores.

## 🛠 Stack

| Camada | Tecnologia |
|---|---|
| Front-end | React 18 + Tailwind CSS + Vite |
| Autenticação | Firebase Authentication |
| Back-end | Node.js + Express.js |
| Banco de Dados | MySQL 8 |
| Upload PDF | Multer |
| Controle de Versão | Git + GitHub |

## 📁 Estrutura

```
observatorio-pi/
├── backend/
│   ├── src/
│   │   ├── config/         # Firebase Admin SDK
│   │   ├── controllers/    # Lógica de negócio
│   │   ├── database/       # Conexão MySQL e migrations
│   │   ├── middlewares/    # Auth, RBAC, Upload
│   │   └── routes/         # Endpoints da API
│   ├── uploads/            # PDFs enviados
│   └── server.js
└── frontend/
    └── src/
        ├── components/     # common/ e layout/
        ├── contexts/       # AuthContext (Firebase)
        ├── hooks/          # useAuth
        ├── pages/          # auth/, admin/, student/, teacher/
        └── services/       # firebase.js + api.js (axios)
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+, MySQL 8, conta no Firebase

### Backend
```bash
cd backend
npm install
cp .env.example .env   # preencha as variáveis
mysql -u root -p < src/database/migrations.sql
npm run dev            # http://localhost:3001
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env   # preencha as variáveis Firebase
npm run dev            # http://localhost:5173
```

## 👥 Hierarquia de Papéis

| Papel | Cadastrar Usuários | Publicar Projeto | Avaliar | Relatórios |
|---|:---:|:---:|:---:|:---:|
| Administrador | ✅ | — | — | ✅ |
| Coordenador | ✅ | — | — | ✅ |
| Professor | — | — | ✅ | — |
| Aluno | — | ✅ | — | — |

## 📡 Rotas da API

| Método | Rota | Acesso |
|---|---|---|
| `GET` | `/api/auth/me` | Autenticado |
| `POST` | `/api/auth/register` | Admin/Coord |
| `GET` | `/api/users` | Admin/Coord |
| `GET/PUT` | `/api/users/:id` | Autenticado |
| `GET` | `/api/projects` | Autenticado |
| `POST` | `/api/projects` | Aluno |
| `PUT/DELETE` | `/api/projects/:id` | Aluno/Admin |
| `POST` | `/api/evaluations` | Professor |
| `GET` | `/api/evaluations/project/:id` | Autenticado |

---
Curso de Tecnologia da Informação · 2025
