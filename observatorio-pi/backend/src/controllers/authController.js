const admin = require('../config/firebase');
const pool = require('../database/connection');

// Registra o usuário no MySQL após criação no Firebase (feito pelo Admin)
const registerUser = async (req, res) => {
  const { nome, email, role_id } = req.body;

  if (!nome || !email || !role_id) {
    return res.status(400).json({ error: 'Campos obrigatórios: nome, email, role_id' });
  }

  try {
    const firebaseUser = await admin.auth().createUser({ email, password: 'Trocar@123' });
    await pool.query(
      'INSERT INTO usuarios (nome, email, firebase_uid, role_id) VALUES (?, ?, ?, ?)',
      [nome, email, firebaseUser.uid, role_id]
    );
    res.status(201).json({ message: 'Usuário criado com sucesso', uid: firebaseUser.uid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Auto-cadastro de EMPRESA: o usuário já criou a conta no Firebase (client-side)
// e envia o token; aqui validamos o token e inserimos o registro com perfil empresa.
const registerEmpresa = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = await admin.auth().verifyIdToken(token);

    const { nome } = req.body;
    if (!nome) return res.status(400).json({ error: 'Nome da empresa é obrigatório' });

    const [roleRows] = await pool.query("SELECT id FROM roles WHERE nome = 'empresa'");
    if (roleRows.length === 0) {
      return res.status(500).json({ error: "Perfil 'empresa' não encontrado. Rode a migration." });
    }
    const roleId = roleRows[0].id;

    const [exist] = await pool.query('SELECT id FROM usuarios WHERE firebase_uid = ?', [decoded.uid]);
    if (exist.length > 0) {
      return res.status(200).json({ message: 'Empresa já registrada' });
    }

    await pool.query(
      'INSERT INTO usuarios (nome, email, firebase_uid, role_id) VALUES (?, ?, ?, ?)',
      [nome, decoded.email, decoded.uid, roleId]
    );
    res.status(201).json({ message: 'Empresa registrada com sucesso' });
  } catch (err) {
    console.error('registerEmpresa:', err);
    res.status(500).json({ error: err.message });
  }
};

const getMe = async (req, res) => {
  res.json(req.user);
};

module.exports = { registerUser, registerEmpresa, getMe };