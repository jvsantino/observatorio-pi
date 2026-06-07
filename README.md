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
