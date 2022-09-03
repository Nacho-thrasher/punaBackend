const router = require('express').Router();
const { createMenu, getMenu, getMenues, updateMenu, createDish, userMenu, getBreakfast, getLunch, getAfternoonSnack, getDinner } = require("../controllers/menu.controllers");

router.post('/', createMenu)
router.post('/plato', createDish)
router.get('/', getMenues) // get menues con sus submenues
router.put('/:id', updateMenu)
router.get('/:id', getMenu)
router.get('/type/breakfast', getBreakfast)
router.get('/type/lunch', getLunch)
router.get('/type/afternoonSnack', getAfternoonSnack)
router.get('/type/dinner', getDinner)

module.exports = router;
