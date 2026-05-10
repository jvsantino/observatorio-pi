const express = require('express');
const router = express.Router();
const { registerUser, getMe } = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.post('/register', authMiddleware, roleMiddleware('administrador', 'coordenador'), registerUser);
router.get('/me', authMiddleware, getMe);

module.exports = router;
