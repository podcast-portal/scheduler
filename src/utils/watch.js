const Stopwatch = require('statman-stopwatch');
const logger = require('./logger')

module.exports = watch

async function watch (name, func, doLog) {
  if (typeof name === 'function') {
    func = name
    name = 'undefined'
  }

  const sw = new Stopwatch(name, true)
  const startTime = Date()

  if (doLog) {
    logger.debug({
      process: 'starting',
      startTime,
      info: name
    }, 'starting %s', name)
  }

  let result
  let error

  try {
    result = await func()
  } catch (e) {
    error = e
  } finally {
    sw.stop()
    const elapsedTime = sw.read()

    if (error) {
      logger.error({
        process: 'finished with error',
        error,
        startTime,
        info: name,
        elapsedTime
      }, 'starting %s in %d', name, elapsedTime)
    } else {
      if (doLog) {
        logger.info({
          process: 'finished',
          startTime,
          info: name,
          elapsedTime
        }, 'finished %s in %d', name, elapsedTime)
      }
    }
  }

  return result;
}
