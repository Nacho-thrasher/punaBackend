const router = require('express').Router();

const extrasController = require('../controllers/extras.controller');

router.get('/', extrasController.getExtras);
router.post('/', extrasController.createExtra);
router.put('/:id', extrasController.updateExtra);
router.delete('/:id', extrasController.deleteExtra);

module.exports = router;