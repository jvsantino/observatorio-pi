# 🇺🇸 English | 🇧🇷 Português
* [Read in English](https://github.com/jvsantino/observatorio-pi/edit/main/README.md#observatory-of-integrative-projects)
* [Leia em Português](https://github.com/jvsantino/observatorio-pi/edit/main/README.md#observat%C3%B3rio-de-projetos-integradores)

<a>

# Observatório de Projetos Integradores

> Plataforma acadêmica desenvolvida para centralizar, organizar, avaliar e divulgar Projetos Integradores do Centro Universitário SENAC Pernambuco.

![React](https://img.shields.io/badge/React-18-61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1)
![Firebase](https://img.shields.io/badge/Firebase-Authentication-FFCA28)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Storage-3448C5)

---

## Demonstração

Acesse a plataforma:

https://observatorio-pi-blond.vercel.app/

---

## Sobre o Projeto

O Observatório de Projetos Integradores foi desenvolvido para substituir o modelo tradicional de submissão de projetos por e-mail e Microsoft Teams, centralizando todo o processo acadêmico em uma única plataforma.

Inspirado na Plataforma Lattes, o sistema permite que cada aluno possua um perfil acadêmico próprio, onde seus projetos são publicados, avaliados e vinculados aos seus coparticipantes.

Além do ambiente acadêmico, a plataforma também conecta empresas aos projetos desenvolvidos pelos alunos, incentivando oportunidades de networking e visibilidade profissional.

---

## Principais Funcionalidades

### Autenticação e Segurança

* Login via Firebase Authentication
* Tokens JWT para autenticação
* Controle de acesso baseado em papéis (RBAC)
* Rotas protegidas no frontend e backend
* Troca obrigatória da senha padrão no primeiro acesso

### Área do Aluno

* Perfil acadêmico estilo Lattes
* Publicação de Projetos Integradores
* Upload de arquivos PDF
* Edição e exclusão de projetos
* Visualização inline dos PDFs
* Consulta de avaliações recebidas
* Gestão de coparticipações

### Sistema de Coparticipação

* Convite de coparticipantes
* Aceite ou recusa do convite
* Área "Minhas Participações"
* Exibição apenas de participantes confirmados

### Área do Professor

* Listagem completa dos projetos
* Avaliação por nota (0 a 10)
* Comentários avaliativos
* Geração automática de status:

  * 🟢 Aprovado
  * 🟡 Recuperação
  * 🔴 Reprovado

### Portal da Empresa

* Auto-cadastro com CNPJ
* Validação de CNPJ
* Aprovação pela coordenação
* Avaliação de projetos por estrelas (0–5)
* Comentários sobre projetos
* Manifestação de interesse
* Visualização dos contatos dos autores

### Administração

* Cadastro de usuários
* Gerenciamento de perfis
* Aprovação de empresas
* Controle institucional da plataforma

---

## Perfis do Sistema

| Perfil        | Responsabilidades                      |
| ------------- | -------------------------------------- |
| Administrador | Gerenciamento geral do sistema         |
| Coordenador   | Aprovação de empresas e acompanhamento |
| Professor     | Avaliação dos projetos                 |
| Aluno         | Publicação e gerenciamento de projetos |
| Empresa       | Avaliação e interesse em projetos      |

---

## Tecnologias Utilizadas

### Frontend

* React 18
* Vite
* Tailwind CSS

### Backend

* Node.js
* Express.js

### Banco de Dados

* MySQL 8

### Autenticação

* Firebase Authentication
* Firebase Admin SDK

### Armazenamento

* Cloudinary

### Upload de Arquivos

* Multer

### Controle de Versão

* Git
* GitHub

---

## Segurança e LGPD

O sistema segue os princípios da Lei Geral de Proteção de Dados (LGPD).

### Medidas Implementadas

* Senhas não armazenadas no banco de dados
* Autenticação delegada ao Firebase
* Controle de acesso baseado em permissões
* Coleta mínima de dados
* Rotas protegidas por autenticação
* Armazenamento seguro dos PDFs
* Restrição de acesso às informações acadêmicas

---

## Estrutura de Dados

Principais entidades do sistema:

* Usuários
* Perfis (Roles)
* Projetos
* Coparticipações
* Avaliações de Professores
* Avaliações de Empresas

---

## Próximas Funcionalidades

* Dashboard da Coordenação
* Relatórios acadêmicos
* Sistema de notificações
* URLs assinadas para PDFs
* Integração com Receita Federal para validação de CNPJ
* Métricas e indicadores institucionais

---

## Equipe

* [Gabriel Roberto](https://github.com/GABRIELR48O)
* [Ibson Gomes](https://github.com/ibsongomes)
* [Jean Phillip](https://github.com/jean-jpss)
* [João Victor](https://github.com/jvsantino)

---

## Licença

Projeto acadêmico desenvolvido para fins educacionais no Centro Universitário SENAC Pernambuco.


-----
-----
# Observatory of Integrative Projects

> Academic platform designed to centralize, manage, evaluate and showcase Integrative Projects developed by students at SENAC Pernambuco.


![React](https://img.shields.io/badge/React-18-61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1)
![Firebase](https://img.shields.io/badge/Firebase-Authentication-FFCA28)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Storage-3448C5)

---

##  Live Demo

Access the platform:

https://observatorio-pi-blond.vercel.app/

---

## About the Project

The Integrative Projects Observatory was developed to replace the traditional process of submitting academic projects through email and Microsoft Teams, centralizing the entire workflow into a single platform.

Inspired by the Brazilian Lattes Platform, the system allows each student to maintain an academic profile where projects are published, evaluated and linked to collaborators.

The platform also connects companies with academic projects, creating opportunities for visibility, networking and talent discovery.

---

## Main Features

### Authentication & Security

* Firebase Authentication
* JWT-based authentication
* Role-Based Access Control (RBAC)
* Protected frontend and backend routes
* Mandatory password change on first login

### Student Area

* Academic profile inspired by Lattes
* Project submission and publishing
* PDF file upload
* Project editing and deletion
* Inline PDF visualization
* Access to project evaluations
* Co-participation management

### Co-Participation System

* Invite collaborators to projects
* Accept or reject participation requests
* "My Participations" area
* Only confirmed participants are displayed

### Professor Area

* Complete project listing
* Project evaluation (0–10 score)
* Evaluation comments
* Automatic status generation:

  * 🟢 Approved
  * 🟡 Recovery
  * 🔴 Failed

### Company Portal

* Company self-registration
* CNPJ validation
* Coordinator approval workflow
* Project rating system (0–5 stars)
* Project comments
* Interest expression feature
* Access to student contact information

### Administration Panel

* User management
* Role management
* Company approval process
* Institutional platform administration

---

## User Roles

| Role          | Responsibilities                        |
| ------------- | --------------------------------------- |
| Administrator | Full platform management                |
| Coordinator   | Company approval and monitoring         |
| Professor     | Project evaluation                      |
| Student       | Project publishing and management       |
| Company       | Project evaluation and talent discovery |

---

## Technology Stack

### Frontend

* React 18
* Vite
* Tailwind CSS

### Backend

* Node.js
* Express.js

### Database

* MySQL 8

### Authentication

* Firebase Authentication
* Firebase Admin SDK

### Storage

* Cloudinary

### File Upload

* Multer

### Version Control

* Git
* GitHub

---

## Security & LGPD Compliance

The platform follows the principles established by the Brazilian General Data Protection Law (LGPD).

### Implemented Measures

* Passwords are never stored in the database
* Authentication delegated to Firebase
* Role-based access control
* Minimal data collection
* Protected API routes
* Secure PDF storage
* Restricted access to academic information

---

## Data Structure

Main entities within the system:

* Users
* Roles
* Projects
* Co-participations
* Professor Evaluations
* Company Evaluations

---

## Future Improvements

* Coordinator Dashboard
* Academic Reports
* Notification System
* Signed URLs for PDF protection
* Federal Revenue CNPJ verification
* Analytics and institutional metrics

---

## Development Team

* [Gabriel Roberto](https://github.com/GABRIELR48O)
* [Ibson Gomes](https://github.com/ibsongomes)
* [Jean Phillip](https://github.com/jean-jpss)
* [João Victor](https://github.com/jvsantino)

---

## Institution

Centro Universitário SENAC Pernambuco

Technology in Systems Analysis and Development

---

## License

Academic project developed for educational purposes at SENAC Pernambuco.
