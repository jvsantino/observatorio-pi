require('dotenv').config();
const admin = require('./src/config/firebase');
const pool = require('./src/database/connection');

async function main() {
  const firebaseUser = await admin.auth().createUser({
    email: 'admin@observatorio.com',
    password: 'Admin@123'
  });

  console.log('Firebase UID:', firebaseUser.uid);

  await pool.query(
    'INSERT INTO usuarios (nome, email, firebase_uid, role_id) VALUES (?, ?, ?, ?)',
    ['Administrador', 'admin@observatorio.com', firebaseUser.uid, 1]
  );

  console.log('Usuário admin criado com sucesso!');
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });