const pool = require('../database/connection');

const listProjects = async (req, res) => {
  try {
    const { curso, turma, periodo } = req.query;
    let query = 'SELECT p.*, u.nome AS autor FROM projetos p JOIN usuarios u ON p.autor_id = u.id WHERE 1=1';
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
    // Cloudinary: a URL completa do arquivo vem em req.file.path
    const arquivo_pdf = req.file?.path;

    if (!titulo || !descricao || !curso || !turma || !periodo || !arquivo_pdf) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios, incluindo o PDF' });
    }

    // participantes pode chegar como array, string única ou JSON (multipart/form-data)
    let participantes = req.body.participantes;
    if (typeof participantes === 'string') {
      try { participantes = JSON.parse(participantes); }
      catch { participantes = participantes ? [participantes] : []; }
    }

    const [result] = await pool.query(
      'INSERT INTO projetos (titulo, descricao, curso, turma, periodo, arquivo_pdf, autor_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [titulo, descricao, curso, turma, periodo, arquivo_pdf, req.user.id]
    );

    const projectId = result.insertId;

    if (Array.isArray(participantes)) {
      for (const alunoId of participantes) {
        await pool.query(
          'INSERT IGNORE INTO projeto_alunos (projeto_id, aluno_id) VALUES (?, ?)',
          [projectId, alunoId]
        );
      }
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
    const arquivo_pdf = req.file?.path; // URL do Cloudinary, se um novo PDF foi enviado

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

    await pool.query('DELETE FROM projeto_alunos WHERE projeto_id = ?', [req.params.id]);
    await pool.query('DELETE FROM projetos WHERE id = ?', [req.params.id]);
    res.json({ message: 'Projeto excluído' });
  } catch (err) {
    console.error('deleteProject:', err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { listProjects, getProjectById, createProject, updateProject, deleteProject };