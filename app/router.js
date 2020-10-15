const router = require('express').Router()

// V1 routes
router.use('/v1', require('./v1/routes.js'))

module.exports = router
