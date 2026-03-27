const express = require('express')
const router = express.Router()
const controller = require('../controllers/donation.controller')

router.get('/', controller.getAll)
router.get('/:id', controller.getOne)
router.post('/', controller.create)

module.exports = router
