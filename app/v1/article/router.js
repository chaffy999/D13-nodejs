const router = require('express').Router()

const controller = require('./controller.js')
const commentRouter = require('./comment/router.js')
const authenticate = require('../middleware/authentication.js')

router.get('/', controller.getAll)
router.get('/:id', controller.getById)
router.post('/', authenticate.authorize, controller.createArticle)
router.put('/:id', authenticate.authorize, controller.updateArticle)
router.delete('/:id', authenticate.authorize, controller.deleteArticle)
router.use(commentRouter)

module.exports = router
