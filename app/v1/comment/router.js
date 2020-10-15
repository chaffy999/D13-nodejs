const router = require('express').Router()

const controller = require('./controller.js')
const authenticate = require('../middleware/authentication.js')

router.put(`/:id`, authenticate.authorize, controller.updateComment)
router.put(`/:id/check`, controller.checkComment)
router.delete(`/:id`, authenticate.authorize, controller.deleteComment)

module.exports = router
