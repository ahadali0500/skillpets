const express = require('express');
const router = express.Router();

const questController = require('../../controllers/admin/questController.js');

//Create Challenge
router.post('/add', questController.createQuest);

module.exports = router;
