require('dotenv').config();
const mysql = require('mysql2/promise');
const admin = require('./src/config/firebase');

async function fixAdmin() {
  const conn = await mysql.createConnection(
    'mysql://root:OauDqUmzvYDKPyNirVNcLMwuAguSmazq@interchange.proxy.rlwy.net:56046/railway'
  );

  const firebaseUser = await admin.auth().getUserByEmail('admin@observatorio.com');
  console.log('Firebase UID:', firebaseUser.uid);

  await conn.execute(
    'INSERT INTO usuarios (nome, email, firebase_uid, role_id) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE firebase_uid = VALUES(firebase_uid), role_id = 1',
    ['Administrador', 'admin@observatorio.com', firebaseUser.uid, 1]
  );

  console.log('Admin sincronizado no banco de produção!');
  await conn.end();
  process.exit(0);
}

fixAdmin().catch(e => { console.error(e); process.exit(1); });