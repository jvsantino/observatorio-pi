const express = require('express');
const router = express.Router();
const { registerUser, registerEmpresa, senhaTrocada, getMe } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.post('/register', authMiddleware, roleMiddleware('administrador', 'coordenador'), registerUser);
router.post('/register-empresa', registerEmpresa);
router.post('/senha-trocada', authMiddleware, senhaTrocada);
router.get('/me', authMiddleware, getMe);

module.exports = router;