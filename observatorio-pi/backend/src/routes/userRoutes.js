const express = require('express');
const router = express.Router();
const {
  listUsers, getUserById, updateUser,
  listPendingCompanies, approveCompany, rejectCompany,
} = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const pool = require('../database/connection');

router.get('/alunos', authMiddleware, async (req, res) => {
  const [rows] = await pool.query(
    'SELECT u.id, u.nome, u.email FROM usuarios u JOIN roles r ON u.role_id = r.id WHERE r.nome = "aluno"'
  );
  res.json(rows);
});

// Aprovação de empresas (rotas específicas ANTES de "/:id")
router.get('/empresas-pendentes', authMiddleware, roleMiddleware('administrador', 'coordenador'), listPendingCompanies);
router.put('/:id/aprovar', authMiddleware, roleMiddleware('administrador', 'coordenador'), approveCompany);
router.delete('/empresa/:id', authMiddleware, roleMiddleware('administrador', 'coordenador'), rejectCompany);

router.get('/', authMiddleware, roleMiddleware('administrador', 'coordenador'), listUsers);
router.get('/:id', authMiddleware, getUserById);
router.put('/:id', authMiddleware, roleMiddleware('administrador', 'coordenador'), updateUser);

module.exports = router;