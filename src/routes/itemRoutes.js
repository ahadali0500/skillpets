const express = require('express');
const router = express.Router();

const itemController = require('../controllers/itemController');

router.get('/', itemController.getAllItems);
router.post('/admin/create', itemController.createItems);
router.delete('/:item_id', itemController.deleteItemById);
router.put('/:item_id', itemController.updateItemById);



module.exports = router;
