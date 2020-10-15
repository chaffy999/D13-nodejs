const bodyParser = require('body-parser')
const compression = require('compression')
const cors = require('cors')
const morgan = require('morgan')
const helmet = require('helmet')
const express = require('express')
const R = require('ramda')

// App and logger
const app = express()
const logger = require('./helpers/logger.js')

const corsOptions = {
  origin: R.split(',')(process.env.API_CORS_ORIGIN),
  optionsSuccessStatus: 200,
  exposedHeaders: ['Content-Disposition'],
  credentials: true,
}

const PORT = process.env.API_PORT || 3000

// Import api routes
const apiRoutes = require('./app/router.js')

// Use morgan to log http requests
app.use(
  morgan(
    ':date[iso] :method :url :status :res[content-length] - :response-time ms',
  ),
)

// Use cors middleware for cross origin compatibility and security
app.use(cors(corsOptions))

// Use helmet middleware to set some security helpers
app.use(helmet())

// Use bodyparser middleware to parse the various inputs
app.use(bodyParser.json({ limit: '10mb' }))
app.use(
  bodyParser.urlencoded({
    limit: '10mb',
    extended: true,
    parameterLimit: 10000,
  }),
)

// Use compression middleware to compress response body
app.use(compression())

// Load root route
app.get('/', (req, res) => res.status(200).json({ message: 'Todo server API' }))

// Define REST routes
app.use('/api', apiRoutes)

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    logger.info(`Todo server API is listening on port ${PORT}`)
  })
}

module.exports = app
