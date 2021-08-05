const pino = require('pino')({
  prettyPrint: true
})

class Logger {
  trace(obj, message, ...values) {
    pino.trace(obj, message, ...values)
  }
  debug(obj, message, ...values) {
    pino.debug(obj, message, ...values)
  }
  info(obj, message, ...values) {
    pino.info(obj, message, ...values)
  }
  warning(obj, message, ...values) {
    pino.warn(obj, message, ...values)
  }
  error(obj, message, ...values) {
    pino.error(obj, message, ...values)
  }
  fatal(obj, message, ...values) {
    pino.fatal(obj, message, ...values)
  }
}

const logger = new Logger()

module.exports = logger
