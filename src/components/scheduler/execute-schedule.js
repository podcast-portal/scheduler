const { mq } = require('../../utils')

module.exports = executeSchedule

async function executeSchedule (schedule) {
  try {
    await mq.enqueue(schedule.queue,
      Buffer.from(JSON.stringify(schedule.message)))
  } catch (e) {
    console.error('ERROR ON EXECUTE SCHEDULE', e)
    process.exit(1)
  }
}
