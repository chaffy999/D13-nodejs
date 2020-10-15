const router = require('express').Router()

const controller = require('./controller.js')
const authenticate = require('../../middleware/authentication.js')

// Express does not resolve params with use so we have to explicitly tell the full route here
const baseRoute = '/:articleId/comment'

router.get(`${baseRoute}/`, controller.getAll)
router.post(`${baseRoute}/`, authenticate.authorize, controller.createComment)

module.exports = router
