const { createLogger, format, transports } = require('winston')

function formatParams(info) {
  const { timestamp, level, message } = info
  const ts = timestamp.slice(0, 19).replace('T', ' ')

  return `${ts} ${level}: ${message}`
}

// conf
const developmentFormat = format.combine(
  format.colorize(),
  format.timestamp(),
  format.align(),
  format.printf(formatParams),
)
const level = process.env.LOG_LEVEL || 'debug'

module.exports = createLogger({
  format: developmentFormat,
  level,
  transports: [new transports.Console()],
})
