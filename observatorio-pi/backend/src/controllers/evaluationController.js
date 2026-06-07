const pool = require('../database/connection');

const createEvaluation = async (req, res) => {
  try {
    const { nota, comentario, projeto_id } = req.body;

    // Já existe avaliação deste professor para este projeto?
    const [existing] = await pool.query(
      'SELECT id FROM avaliacoes WHERE professor_id = ? AND projeto_id = ?',
      [req.user.id, projeto_id]
    );

    if (existing.length > 0) {
      // Reavaliação: atualiza a nota/comentário existentes (não cria outra)
      await pool.query(
        'UPDATE avaliacoes SET nota = ?, comentario = ?, created_at = CURRENT_TIMESTAMP WHERE professor_id = ? AND projeto_id = ?',
        [nota, comentario, req.user.id, projeto_id]
      );
      return res.json({ message: 'Avaliação atualizada' });
    }

    // Primeira avaliação: insere
    await pool.query(
      'INSERT INTO avaliacoes (nota, comentario, professor_id, projeto_id) VALUES (?, ?, ?, ?)',
      [nota, comentario, req.user.id, projeto_id]
    );
    res.status(201).json({ message: 'Avaliação registrada' });
  } catch (err) {
    console.error('createEvaluation:', err);
    res.status(500).json({ error: err.message });
  }
};

const getEvaluationsByProject = async (req, res) => {
  const [rows] = await pool.query(
    'SELECT a.*, u.nome AS professor FROM avaliacoes a JOIN usuarios u ON a.professor_id = u.id WHERE a.projeto_id = ?',
    [req.params.id]
  );
  res.json(rows);
};

module.exports = { createEvaluation, getEvaluationsByProject };