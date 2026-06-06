const express = require('express');
const router = express.Router();
const { registerUser, registerEmpresa, getMe } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.post('/register', authMiddleware, roleMiddleware('administrador', 'coordenador'), registerUser);
// Pública: o token do Firebase é validado dentro do controller (o usuário ainda não existe no MySQL)
router.post('/register-empresa', registerEmpresa);
router.get('/me', authMiddleware, getMe);

module.exports = router;