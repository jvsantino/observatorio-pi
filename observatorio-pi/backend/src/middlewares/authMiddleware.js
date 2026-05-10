const admin = require('../config/firebase');
const pool = require('../database/connection');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    const [rows] = await pool.query(
      'SELECT u.*, r.nome AS role FROM usuarios u JOIN roles r ON u.role_id = r.id WHERE u.firebase_uid = ?',
      [decoded.uid]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Usuário não encontrado no sistema' });
    }

    req.user = rows[0];
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};

module.exports = authMiddleware;
