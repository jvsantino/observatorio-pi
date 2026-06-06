const pool = require('../database/connection');

// Empresa avalia um projeto (0–5 estrelas). Um registro por empresa/projeto (upsert).
const rateProject = async (req, res) => {
  try {
    const { projeto_id, estrelas, comentario } = req.body;
    const n = parseInt(estrelas, 10);

    if (!projeto_id || Number.isNaN(n) || n < 0 || n > 5) {
      return res.status(400).json({ error: 'Informe o projeto e uma nota de 0 a 5 estrelas' });
    }

    await pool.query(
      `INSERT INTO avaliacoes_empresa (estrelas, comentario, empresa_id, projeto_id)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE estrelas = VALUES(estrelas), comentario = VALUES(comentario)`,
      [n, comentario || null, req.user.id, projeto_id]
    );
    res.status(201).json({ message: 'Avaliação registrada' });
  } catch (err) {
    console.error('rateProject:', err);
    res.status(500).json({ error: err.message });
  }
};

// Lista as avaliações de empresas para um projeto
const listProjectRatings = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT ae.id, ae.estrelas, ae.comentario, ae.created_at, u.nome AS empresa
         FROM avaliacoes_empresa ae
         JOIN usuarios u ON ae.empresa_id = u.id
        WHERE ae.projeto_id = ?
        ORDER BY ae.created_at DESC`,
      [req.params.id]
    );
    res.json(rows);
  } catch (err) {
    console.error('listProjectRatings:', err);
    res.status(500).json({ error: err.message });
  }
};

// "Tenho interesse": revela os contatos (autor + coparticipantes confirmados) à empresa
const getProjectContacts = async (req, res) => {
  try {
    const projetoId = req.params.id;

    const [autor] = await pool.query(
      `SELECT u.nome, u.email, 'Autor' AS papel
         FROM projetos p JOIN usuarios u ON p.autor_id = u.id
        WHERE p.id = ?`,
      [projetoId]
    );
    if (autor.length === 0) return res.status(404).json({ error: 'Projeto não encontrado' });

    const [copart] = await pool.query(
      `SELECT u.nome, u.email, 'Coparticipante' AS papel
         FROM projeto_alunos pa JOIN usuarios u ON pa.aluno_id = u.id
        WHERE pa.projeto_id = ? AND pa.confirmado = TRUE`,
      [projetoId]
    );

    res.json([...autor, ...copart]);
  } catch (err) {
    console.error('getProjectContacts:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { rateProject, listProjectRatings, getProjectContacts };