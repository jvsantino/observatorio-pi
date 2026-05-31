const express = require('express');
const router = express.Router();
const {
  listProjects, getProjectById, createProject, updateProject, deleteProject,
  listInvites, listParticipations, respondInvite,
} = require('../controllers/projectController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// IMPORTANTE: rotas específicas (/me/...) devem vir ANTES de "/:id",
// senão o Express trata "me" como um id.
router.get('/me/invites', authMiddleware, roleMiddleware('aluno'), listInvites);
router.get('/me/participations', authMiddleware, roleMiddleware('aluno'), listParticipations);
router.put('/:id/coparticipation', authMiddleware, roleMiddleware('aluno'), respondInvite);

router.get('/', authMiddleware, listProjects);
router.get('/:id', authMiddleware, getProjectById);
router.post('/', authMiddleware, roleMiddleware('aluno'), upload.single('arquivo_pdf'), createProject);
router.put('/:id', authMiddleware, roleMiddleware('aluno'), upload.single('arquivo_pdf'), updateProject);
router.delete('/:id', authMiddleware, deleteProject);

module.exports = router;