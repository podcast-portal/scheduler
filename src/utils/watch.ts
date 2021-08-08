import { Stopwatch } from 'ts-stopwatch'
import logger from './logger'

export default watch

async function watch (name, func, doLog) {
  if (typeof name === 'function') {
    func = name
    name = 'undefined'
  }

  const sw = new Stopwatch()
  const startTime = Date()

  let result
  let error

  try {
    sw.start()

    if (doLog) {
      logger.debug({
        process: 'starting',
        startTime,
        info: name
      }, 'starting %s', name)
    }

    result = await func()
  } catch (e) {
    error = e
  } finally {
    sw.stop()
    const elapsedTime = sw.getTime()

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
