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

    // Porteira: empresa não-aprovada só pode acessar /auth/me (para ver a tela de "pendente").
    // Qualquer outra rota é bloqueada até a coordenação aprovar. Não afeta outros perfis.
    const ehRotaMe = req.originalUrl.includes('/auth/me');
    if (req.user.role === 'empresa' && !req.user.aprovado && !ehRotaMe) {
      return res.status(403).json({ error: 'Sua conta de empresa está aguardando aprovação da coordenação.' });
    }

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};

module.exports = authMiddleware;