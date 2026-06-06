const express = require('express');
const router = express.Router();
const { rateProject, listProjectRatings, getProjectContacts } = require('../controllers/companyController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.post('/ratings', authMiddleware, roleMiddleware('empresa'), rateProject);
router.get('/ratings/project/:id', authMiddleware, listProjectRatings);
router.get('/projects/:id/contacts', authMiddleware, roleMiddleware('empresa'), getProjectContacts);

module.exports = router;