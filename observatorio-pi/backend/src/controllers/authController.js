const admin = require('../config/firebase');
const pool = require('../database/connection');

function validaCNPJ(valor) {
  const cnpj = String(valor || '').replace(/[^\d]/g, '');
  if (cnpj.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(cnpj)) return false;
  const calc = (base) => {
    const len = base.length;
    const nums = base.split('').map(Number);
    let pos = len - 7, sum = 0;
    for (let i = len; i >= 1; i--) { sum += nums[len - i] * pos--; if (pos < 2) pos = 9; }
    const res = sum % 11;
    return res < 2 ? 0 : 11 - res;
  };
  if (calc(cnpj.slice(0, 12)) !== Number(cnpj[12])) return false;
  if (calc(cnpj.slice(0, 13)) !== Number(cnpj[13])) return false;
  return true;
}

// Cadastro pelo Admin/Coord — usuário recebe senha padrão e DEVE trocá-la no 1º acesso
const registerUser = async (req, res) => {
  const { nome, email, role_id } = req.body;
  if (!nome || !email || !role_id) {
    return res.status(400).json({ error: 'Campos obrigatórios: nome, email, role_id' });
  }
  try {
    const firebaseUser = await admin.auth().createUser({ email, password: 'Trocar@123' });
    await pool.query(
      'INSERT INTO usuarios (nome, email, firebase_uid, role_id, precisa_trocar_senha) VALUES (?, ?, ?, ?, TRUE)',
      [nome, email, firebaseUser.uid, role_id]
    );
    res.status(201).json({ message: 'Usuário criado com sucesso', uid: firebaseUser.uid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Auto-cadastro de EMPRESA (pendente de aprovação; escolhe a própria senha, não precisa trocar)
const registerEmpresa = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = await admin.auth().verifyIdToken(token);

    const { nome, cnpj } = req.body;
    if (!nome) return res.status(400).json({ error: 'Nome da empresa é obrigatório' });
    if (!validaCNPJ(cnpj)) return res.status(400).json({ error: 'CNPJ inválido' });
    const cnpjLimpo = String(cnpj).replace(/[^\d]/g, '');

    const [roleRows] = await pool.query("SELECT id FROM roles WHERE nome = 'empresa'");
    if (roleRows.length === 0) {
      return res.status(500).json({ error: "Perfil 'empresa' não encontrado. Rode a migration." });
    }
    const roleId = roleRows[0].id;

    const [exist] = await pool.query('SELECT id FROM usuarios WHERE firebase_uid = ?', [decoded.uid]);
    if (exist.length > 0) return res.status(200).json({ message: 'Empresa já registrada' });

    await pool.query(
      'INSERT INTO usuarios (nome, email, firebase_uid, role_id, cnpj, aprovado, precisa_trocar_senha) VALUES (?, ?, ?, ?, ?, FALSE, FALSE)',
      [nome, decoded.email, decoded.uid, roleId, cnpjLimpo]
    );
    res.status(201).json({ message: 'Empresa registrada. Aguarde a aprovação da coordenação.' });
  } catch (err) {
    console.error('registerEmpresa:', err);
    res.status(500).json({ error: err.message });
  }
};

// Marca que o usuário já trocou a senha padrão
const senhaTrocada = async (req, res) => {
  try {
    await pool.query('UPDATE usuarios SET precisa_trocar_senha = FALSE WHERE id = ?', [req.user.id]);
    res.json({ message: 'Senha atualizada' });
  } catch (err) {
    console.error('senhaTrocada:', err);
    res.status(500).json({ error: err.message });
  }
};

const getMe = async (req, res) => {
  res.json(req.user);
};

module.exports = { registerUser, registerEmpresa, senhaTrocada, getMe };