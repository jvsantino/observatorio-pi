const admin = require('../config/firebase');
const pool = require('../database/connection');

// Registra o usuário no MySQL após criação no Firebase (feito pelo Admin)
const registerUser = async (req, res) => {
  const { nome, email, role_id } = req.body;

  if (!nome || !email || !role_id) {
    return res.status(400).json({ error: 'Campos obrigatórios: nome, email, role_id' });
  }

  try {
    // Cria no Firebase Authentication
    const firebaseUser = await admin.auth().createUser({ email, password: 'Trocar@123' });

    // Salva no MySQL
    await pool.query(
      'INSERT INTO usuarios (nome, email, firebase_uid, role_id) VALUES (?, ?, ?, ?)',
      [nome, email, firebaseUser.uid, role_id]
    );

    res.status(201).json({ message: 'Usuário criado com sucesso', uid: firebaseUser.uid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Retorna dados do usuário logado (token já validado pelo middleware)
const getMe = async (req, res) => {
  res.json(req.user);
};

module.exports = { registerUser, getMe };
