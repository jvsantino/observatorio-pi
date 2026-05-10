const pool = require('../database/connection');

const listUsers = async (req, res) => {
  const [rows] = await pool.query(
    'SELECT u.id, u.nome, u.email, r.nome AS role FROM usuarios u JOIN roles r ON u.role_id = r.id'
  );
  res.json(rows);
};

const getUserById = async (req, res) => {
  const [rows] = await pool.query(
    'SELECT u.id, u.nome, u.email, r.nome AS role FROM usuarios u JOIN roles r ON u.role_id = r.id WHERE u.id = ?',
    [req.params.id]
  );
  if (rows.length === 0) return res.status(404).json({ error: 'Usuário não encontrado' });
  res.json(rows[0]);
};

const updateUser = async (req, res) => {
  const { nome, role_id } = req.body;
  await pool.query('UPDATE usuarios SET nome = ?, role_id = ? WHERE id = ?', [nome, role_id, req.params.id]);
  res.json({ message: 'Usuário atualizado' });
};

module.exports = { listUsers, getUserById, updateUser };
