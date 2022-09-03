const router = require('express').Router();
const { createCompany, getCompany, getCompanies, updateCompany, putCompany, deleteCompany, createCompanyWithAsociados } = require("../controllers/company.controllers");

router.post('/', createCompany)
// router.post('/contratista', createCompanyWithAsociados)
router.get('/', getCompanies)
router.get('/:id', getCompany)
// router.put('/:id', updateCompany)
router.put('/:id', putCompany)

module.exports = router;
