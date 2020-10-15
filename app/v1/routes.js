const router = require('express').Router()

const article = require('./article/router.js')
const comment = require('./comment/router.js')
const users = require('./users/router.js')

router.use('/article', article)
router.use('/comment', comment)
router.use('/users', users)

module.exports = router
