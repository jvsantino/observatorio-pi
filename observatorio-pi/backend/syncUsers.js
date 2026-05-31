require('dotenv').config();
const mysql = require('mysql2/promise');
const admin = require('./src/config/firebase');

const users = [
  { email: 'joaovsantino@gmail.com', nome: 'João Santino', role_id: 4 },
  { email: 'ibsongomes028@gmail.com', nome: 'Ibson Gomes', role_id: 4 },
];

async function main() {
  const conn = await mysql.createConnection('mysql://root:OauDqUmzvYDKPyNirVNcLMwuAguSmazq@interchange.proxy.rlwy.net:56046/railway');

  for (const user of users) {
    try {
      const firebaseUser = await admin.auth().getUserByEmail(user.email);
      await conn.execute(
        'INSERT INTO usuarios (nome, email, firebase_uid, role_id) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE firebase_uid = VALUES(firebase_uid)',
        [user.nome, user.email, firebaseUser.uid, user.role_id]
      );
      console.log(`✓ ${user.email} sincronizado`);
    } catch (e) {
      console.error(`✗ ${user.email}: ${e.message}`);
    }
  }

  await conn.end();
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });