import p from 'pino'

const pino = p({
  prettyPrint: {
    // levelKey: 'SCHEDULER',
    translateTime: 'yyyy-mm-dd HH:MM:ss.l',
    singleLine: true
  }
})

class _logger {
  trace(obj, message = null, ...values) {
    pino.trace(obj, message, ...values)
  }
  debug(obj, message = null, ...values) {
    pino.debug(obj, message, ...values)
  }
  info(obj, message = null, ...values) {
    pino.info(obj, message, ...values)
  }
  warning(obj, message = null, ...values) {
    pino.warn(obj, message, ...values)
  }
  error(obj, message = null, ...values) {
    pino.error(obj, message, ...values)
  }
  fatal(obj, message = null, ...values) {
    pino.fatal(obj, message, ...values)
  }
}

const logger = new _logger()

export default logger
