const mysql = require('mysql2/promise');

async function main() {
  const conn = await mysql.createConnection('mysql://root:OauDqUmzvYDKPyNirVNcLMwuAguSmazq@interchange.proxy.rlwy.net:56046/railway');
  const [rows] = await conn.execute('SELECT id, nome, email, firebase_uid, role_id FROM usuarios');
  console.log(JSON.stringify(rows, null, 2));
  await conn.end();
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });