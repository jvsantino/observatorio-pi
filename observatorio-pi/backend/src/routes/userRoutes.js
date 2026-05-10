const express = require('express');
const router = express.Router();
const { listUsers, getUserById, updateUser } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const pool = require('../database/connection');

router.get('/alunos', authMiddleware, async (req, res) => {
  const [rows] = await pool.query(
    'SELECT u.id, u.nome, u.email FROM usuarios u JOIN roles r ON u.role_id = r.id WHERE r.nome = "aluno"'
  );
  res.json(rows);
});

router.get('/', authMiddleware, roleMiddleware('administrador', 'coordenador'), listUsers);
router.get('/:id', authMiddleware, getUserById);
router.put('/:id', authMiddleware, roleMiddleware('administrador', 'coordenador'), updateUser);

module.exports = router;