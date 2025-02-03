const express = require('express');
const router = express.Router();

const challengeController = require('../../controllers/admin/challengeController.js');

//Create Challenge
router.post('/add', challengeController.createChallenge);

module.exports = router;
