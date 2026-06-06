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

// Empresas aguardando aprovação
const listPendingCompanies = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT u.id, u.nome, u.email, u.cnpj, u.created_at
         FROM usuarios u JOIN roles r ON u.role_id = r.id
        WHERE r.nome = 'empresa' AND u.aprovado = FALSE
        ORDER BY u.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error('listPendingCompanies:', err);
    res.status(500).json({ error: err.message });
  }
};

// Aprovar empresa
const approveCompany = async (req, res) => {
  try {
    await pool.query('UPDATE usuarios SET aprovado = TRUE WHERE id = ?', [req.params.id]);
    res.json({ message: 'Empresa aprovada' });
  } catch (err) {
    console.error('approveCompany:', err);
    res.status(500).json({ error: err.message });
  }
};

// Recusar (remove o registro do banco)
const rejectCompany = async (req, res) => {
  try {
    await pool.query('DELETE FROM usuarios WHERE id = ?', [req.params.id]);
    res.json({ message: 'Empresa recusada' });
  } catch (err) {
    console.error('rejectCompany:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { listUsers, getUserById, updateUser, listPendingCompanies, approveCompany, rejectCompany };