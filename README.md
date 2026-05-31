# Observatório de Projetos Integradores

Sistema desenvolvido para centralizar, organizar e divulgar os Projetos Integradores acadêmicos da Faculdade Senac, proporcionando um ambiente único para submissão, avaliação e consulta de trabalhos desenvolvidos por alunos.

## Sobre o Projeto

Atualmente, todos os Projetos Integradores do Senac são enviados por plataformas descentralizadas, como e-mail e Microsoft Teams, dificultando o gerenciamento, a rastreabilidade e a visibilidade dos trabalhos. O Observatório de Projetos Integradores foi criado para resolver esse problema por meio de uma plataforma centralizada, inspirada no modelo da Plataforma Lattes.

Cada aluno possui um perfil acadêmico próprio, onde seus projetos ficam publicados e vinculados aos demais participantes da equipe, formando um portfólio digital acadêmico.

## Principais Funcionalidades

### Autenticação e Controle de Acesso:

* Login seguro utilizando Firebase Authentication;
* Autenticação baseada em token JWT;
* Controle de acesso por perfis (RBAC):

  * Administrador
  * Coordenador
  * Professor
  * Aluno

### Área do Administrador:

* Cadastro de usuários;
* Gerenciamento de perfis;
* Listagem completa dos usuários cadastrados;
* Integração automática entre Firebase e banco de dados.

### Área do Aluno:

* Perfil acadêmico estilo Lattes;
* Publicação de projetos;
* Upload de arquivos PDF;
* Edição e exclusão de projetos;
* Associação de coparticipantes;
* Visualização dos projetos enviados.

### Área do Professor:

* Visualização de todos os projetos cadastrados;
* Avaliação de trabalhos;
* Registro de notas e comentários;
* Controle automático de status:

  * Aprovado
  * Recuperação
  * Reprovado

### Visualização de Projetos:

* Exibição inline de PDFs;
* Acesso controlado por autenticação;
* Histórico centralizado de projetos.

---

## Tecnologias Utilizadas

### Front-end

* React 18
* Vite
* Tailwind CSS

### Back-end

* Node.js
* Express.js

### Banco de Dados

* MySQL 8

### Autenticação

* Firebase Authentication
* Firebase Admin SDK

### Controle de Versão

* Git
* GitHub

### Upload e Visualização

* Multer
* PDF Viewer (iframe)

---

## Estrutura do Sistema

### Perfis de Usuário

| Perfil        | Permissões                    |
| ------------- | ----------------------------- |
| Administrador | Gerenciar usuários e sistema  |
| Coordenador   | Acompanhamento acadêmico      |
| Professor     | Avaliar projetos              |
| Aluno         | Publicar e gerenciar projetos |

### Banco de Dados

O sistema utiliza cinco tabelas principais:

* roles
* usuarios
* projetos
* projeto_alunos
* avaliacoes

---

## Segurança

O projeto segue os princípios da Lei Geral de Proteção de Dados (LGPD):

* Senhas não são armazenadas no banco de dados;
* Autenticação delegada ao Firebase;
* Controle de acesso baseado em permissões;
* Dados acessados apenas por usuários autorizados;
* Armazenamento seguro dos arquivos enviados.

---

## Funcionalidades Futuras

* Painel da Coordenação;
* Relatórios acadêmicos;
* Dashboard com indicadores;
* Sistema de notificações;
* Busca avançada de projetos;
* Área pública para empresas parceiras;
* Portfólio profissional dos alunos.

---

## Equipe Responsável

* [Gabriel Roberto](https://github.com/GABRIELR48O)
* [Ibson Gomes](https://github.com/ibsongomes)
* [Jean Phillip](https://github.com/jean-jpss)
* [João Victor](https://github.com/jvsantino)

---

## Licença

Projeto acadêmico desenvolvido para fins educacionais no Centro Universitário SENAC Pernambuco.
