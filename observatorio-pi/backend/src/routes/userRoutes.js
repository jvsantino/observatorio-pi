const express = require('express');
const router = express.Router();
const { listUsers, getUserById, updateUser } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.get('/', authMiddleware, roleMiddleware('administrador', 'coordenador'), listUsers);
router.get('/:id', authMiddleware, getUserById);
router.put('/:id', authMiddleware, roleMiddleware('administrador', 'coordenador'), updateUser);

module.exports = router;
