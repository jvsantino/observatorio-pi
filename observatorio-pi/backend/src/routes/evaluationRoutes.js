const express = require('express');
const router = express.Router();
const { createEvaluation, getEvaluationsByProject } = require('../controllers/evaluationController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.post('/', authMiddleware, roleMiddleware('professor'), createEvaluation);
router.get('/project/:id', authMiddleware, getEvaluationsByProject);

module.exports = router;
