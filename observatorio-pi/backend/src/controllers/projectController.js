const pool = require('../database/connection');

// Normaliza a lista de participantes vinda do multipart (pode ser
// "participantes[]" ou "participantes", string única, JSON ou array).
function parseParticipantes(body) {
  let p = body['participantes[]'];
  if (p == null) p = body.participantes;
  if (p == null) return [];
  if (!Array.isArray(p)) {
    if (typeof p === 'string') {
      try { const j = JSON.parse(p); p = Array.isArray(j) ? j : [p]; }
      catch { p = [p]; }
    } else {
      p = [p];
    }
  }
  return p.map(Number).filter(n => Number.isInteger(n) && n > 0);
}

const listProjects = async (req, res) => {
  try {
    const { curso, turma, periodo } = req.query;
    let query = `
      SELECT p.*, u.nome AS autor,
        (SELECT GROUP_CONCAT(us.nome ORDER BY us.nome SEPARATOR ', ')
           FROM projeto_alunos pa
           JOIN usuarios us ON pa.aluno_id = us.id
          WHERE pa.projeto_id = p.id AND pa.confirmado = TRUE) AS coparticipantes
      FROM projetos p
      JOIN usuarios u ON p.autor_id = u.id
      WHERE 1=1`;
    const params = [];

    if (curso)   { query += ' AND p.curso = ?';   params.push(curso); }
    if (turma)   { query += ' AND p.turma = ?';   params.push(turma); }
    if (periodo) { query += ' AND p.periodo = ?'; params.push(periodo); }

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('listProjects:', err);
    res.status(500).json({ error: err.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT p.*, u.nome AS autor FROM projetos p JOIN usuarios u ON p.autor_id = u.id WHERE p.id = ?',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Projeto não encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error('getProjectById:', err);
    res.status(500).json({ error: err.message });
  }
};

const createProject = async (req, res) => {
  try {
    const { titulo, descricao, curso, turma, periodo } = req.body;
    const arquivo_pdf = req.file?.path; // URL do Cloudinary

    if (!titulo || !descricao || !curso || !turma || !periodo || !arquivo_pdf) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios, incluindo o PDF' });
    }

    const participantes = parseParticipantes(req.body);

    const [result] = await pool.query(
      'INSERT INTO projetos (titulo, descricao, curso, turma, periodo, arquivo_pdf, autor_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [titulo, descricao, curso, turma, periodo, arquivo_pdf, req.user.id]
    );

    const projectId = result.insertId;

    // Coparticipantes entram como PENDENTES (confirmado = FALSE por padrão)
    for (const alunoId of participantes) {
      if (alunoId === req.user.id) continue; // o autor não é coparticipante de si mesmo
      await pool.query(
        'INSERT IGNORE INTO projeto_alunos (projeto_id, aluno_id) VALUES (?, ?)',
        [projectId, alunoId]
      );
    }

    res.status(201).json({ message: 'Projeto criado', id: projectId });
  } catch (err) {
    console.error('createProject:', err);
    res.status(500).json({ error: err.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const { titulo, descricao, periodo } = req.body;
    const arquivo_pdf = req.file?.path;

    const [rows] = await pool.query('SELECT autor_id FROM projetos WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Projeto não encontrado' });
    if (rows[0].autor_id !== req.user.id) return res.status(403).json({ error: 'Sem permissão' });

    const fields = ['titulo = ?', 'descricao = ?', 'periodo = ?'];
    const values = [titulo, descricao, periodo];

    if (arquivo_pdf) { fields.push('arquivo_pdf = ?'); values.push(arquivo_pdf); }
    values.push(req.params.id);

    await pool.query(`UPDATE projetos SET ${fields.join(', ')} WHERE id = ?`, values);
    res.json({ message: 'Projeto atualizado' });
  } catch (err) {
    console.error('updateProject:', err);
    res.status(500).json({ error: err.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT autor_id FROM projetos WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Projeto não encontrado' });

    const isAdmin = ['administrador', 'coordenador'].includes(req.user.role);
    if (rows[0].autor_id !== req.user.id && !isAdmin) {
      return res.status(403).json({ error: 'Sem permissão' });
    }

    // Remove dependências antes do projeto (evita falha de chave estrangeira)
    await pool.query('DELETE FROM avaliacoes WHERE projeto_id = ?', [req.params.id]);
    await pool.query('DELETE FROM projeto_alunos WHERE projeto_id = ?', [req.params.id]);
    await pool.query('DELETE FROM projetos WHERE id = ?', [req.params.id]);
    res.json({ message: 'Projeto excluído' });
  } catch (err) {
    console.error('deleteProject:', err);
    res.status(500).json({ error: err.message });
  }
};

// Projetos em que o usuário logado foi convidado como coparticipante e AINDA NÃO confirmou
const listInvites = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.id, p.titulo, p.descricao, p.curso, p.turma, p.periodo, p.arquivo_pdf, p.data_envio,
              u.nome AS autor
         FROM projeto_alunos pa
         JOIN projetos p  ON pa.projeto_id = p.id
         JOIN usuarios u  ON p.autor_id = u.id
        WHERE pa.aluno_id = ? AND pa.confirmado = FALSE`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error('listInvites:', err);
    res.status(500).json({ error: err.message });
  }
};

// Projetos em que o usuário logado é coparticipante CONFIRMADO
const listParticipations = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.id, p.titulo, p.descricao, p.curso, p.turma, p.periodo, p.arquivo_pdf, p.data_envio,
              u.nome AS autor
         FROM projeto_alunos pa
         JOIN projetos p  ON pa.projeto_id = p.id
         JOIN usuarios u  ON p.autor_id = u.id
        WHERE pa.aluno_id = ? AND pa.confirmado = TRUE`,
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    console.error('listParticipations:', err);
    res.status(500).json({ error: err.message });
  }
};

// Aceitar ou recusar um convite de coparticipação
const respondInvite = async (req, res) => {
  try {
    const { acao } = req.body; // 'aceitar' | 'recusar'
    const projetoId = req.params.id;

    const [rows] = await pool.query(
      'SELECT * FROM projeto_alunos WHERE projeto_id = ? AND aluno_id = ?',
      [projetoId, req.user.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Convite não encontrado' });

    if (acao === 'aceitar') {
      await pool.query(
        'UPDATE projeto_alunos SET confirmado = TRUE WHERE projeto_id = ? AND aluno_id = ?',
        [projetoId, req.user.id]
      );
      return res.json({ message: 'Participação confirmada' });
    } else if (acao === 'recusar') {
      await pool.query(
        'DELETE FROM projeto_alunos WHERE projeto_id = ? AND aluno_id = ?',
        [projetoId, req.user.id]
      );
      return res.json({ message: 'Convite recusado' });
    }
    return res.status(400).json({ error: "Ação inválida (use 'aceitar' ou 'recusar')" });
  } catch (err) {
    console.error('respondInvite:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  listProjects, getProjectById, createProject, updateProject, deleteProject,
  listInvites, listParticipations, respondInvite,
};