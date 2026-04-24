const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skill.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.get('/', verifyToken, skillController.getSkills);
router.post('/', verifyToken, skillController.createSkill);
router.put('/:id', verifyToken, skillController.updateSkill);
router.delete('/:id', verifyToken, skillController.deleteSkill);

module.exports = router;
