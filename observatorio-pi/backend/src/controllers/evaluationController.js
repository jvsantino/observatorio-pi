const pool = require('../database/connection');

const createEvaluation = async (req, res) => {
  const { nota, comentario, projeto_id } = req.body;
  await pool.query(
    'INSERT INTO avaliacoes (nota, comentario, professor_id, projeto_id) VALUES (?, ?, ?, ?)',
    [nota, comentario, req.user.id, projeto_id]
  );
  res.status(201).json({ message: 'Avaliação registrada' });
};

const getEvaluationsByProject = async (req, res) => {
  const [rows] = await pool.query(
    'SELECT a.*, u.nome AS professor FROM avaliacoes a JOIN usuarios u ON a.professor_id = u.id WHERE a.projeto_id = ?',
    [req.params.id]
  );
  res.json(rows);
};

module.exports = { createEvaluation, getEvaluationsByProject };
