require('dotenv').config();
const admin = require('./src/config/firebase');
const pool = require('./src/database/connection');

async function fixAdmin() {
  const firebaseUser = await admin.auth().getUserByEmail('admin@observatorio.com');
  console.log('Firebase UID:', firebaseUser.uid);

  await pool.query(
    'INSERT INTO usuarios (nome, email, firebase_uid, role_id) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE firebase_uid = VALUES(firebase_uid), role_id = 1',
    ['Administrador', 'admin@observatorio.com', firebaseUser.uid, 1]
  );

  console.log('Admin sincronizado no banco!');
  process.exit(0);
}

fixAdmin().catch(e => { console.error(e); process.exit(1); });