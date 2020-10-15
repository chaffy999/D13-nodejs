const router = require('express').Router()
const authenticate = require('../middleware/authentication.js')
const controller = require('./controller.js')

router.post(`/login`, controller.login)
router.post(`/register`, controller.register)

module.exports = router
