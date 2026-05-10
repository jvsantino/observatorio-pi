const express = require('express');
const router = express.Router();
const {
  listProjects, getProjectById, createProject, updateProject, deleteProject
} = require('../controllers/projectController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.get('/', authMiddleware, listProjects);
router.get('/:id', authMiddleware, getProjectById);
router.post('/', authMiddleware, roleMiddleware('aluno'), upload.single('arquivo_pdf'), createProject);
router.put('/:id', authMiddleware, roleMiddleware('aluno'), upload.single('arquivo_pdf'), updateProject);
router.delete('/:id', authMiddleware, deleteProject);

module.exports = router;
