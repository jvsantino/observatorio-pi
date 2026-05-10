CREATE DATABASE IF NOT EXISTS observatorio_pi;
USE observatorio_pi;

CREATE TABLE IF NOT EXISTS roles (
  id   INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(30) NOT NULL
);

CREATE TABLE IF NOT EXISTS usuarios (
  id           INT PRIMARY KEY AUTO_INCREMENT,
  nome         VARCHAR(100) NOT NULL,
  email        VARCHAR(100) UNIQUE NOT NULL,
  firebase_uid VARCHAR(128) UNIQUE NOT NULL,
  role_id      INT NOT NULL,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE IF NOT EXISTS projetos (
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

CREATE TABLE IF NOT EXISTS projeto_alunos (
  projeto_id  INT     NOT NULL,
  aluno_id    INT     NOT NULL,
  confirmado  BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (projeto_id, aluno_id),
  FOREIGN KEY (projeto_id) REFERENCES projetos(id),
  FOREIGN KEY (aluno_id)   REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS avaliacoes (
  id           INT PRIMARY KEY AUTO_INCREMENT,
  nota         DECIMAL(4,2) NOT NULL,
  comentario   TEXT,
  professor_id INT NOT NULL,
  projeto_id   INT NOT NULL,
  created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (professor_id) REFERENCES usuarios(id),
  FOREIGN KEY (projeto_id)   REFERENCES projetos(id)
);

-- Papéis iniciais
INSERT IGNORE INTO roles (id, nome) VALUES
  (1, 'administrador'),
  (2, 'coordenador'),
  (3, 'professor'),
  (4, 'aluno');
