import { CronJob } from 'cron';
import { isEqual } from 'lodash'

import { db, mq, logger, watch } from '../../utils';
import Task from './Task';

class Scheduler {
  tasks: { [id: string]: Task } = {}

  async executeSchedule (schedule) {
    try {
      await watch(schedule.name,
        () => mq.enqueue(schedule.queue, Buffer.from(JSON.stringify(schedule.message))),
        true)
    } catch (e) {
      logger.error(e, 'ERROR ON EXECUTE SCHEDULE - %s', e.msg)
      process.exit(1)
    }
  }

  async loadSchedules () {
    const collection = await db.getCollection('schedules')
    return collection.find().toArray()
  }

  async load() {
    const schedules = await this.loadSchedules()
    for (const schedule of schedules) {
      const id = schedule._id.toString();
      if (this.tasks[id]) {
        if (isEqual(schedule, this.tasks[id].schedule)) {
          logger.info('schedule "%s" was not changed', schedule.name)
          continue
        }

        logger.info('stopping old schedules')
        this.tasks[schedule._id].task.stop()
      }

      this.tasks[id] = new Task()
      const task = this.tasks[id]

      task.id = id
      task.name = schedule.name
      task.message = schedule.message
      task.isEnabled = !schedule.isDisabled
      task.task = new CronJob(schedule.cron, () => {
        logger.info('executing "%s" with message (%o)', task.name, schedule.message)
        this.executeSchedule(schedule)
      })
      task.schedule = schedule

      if (task.isEnabled) {
        logger.info('starting "%s" task', task.name)
        task.task.start()
      }
    }
  }
}

const scheduler = new Scheduler()
export default async function execute() {
  await scheduler.load();
}
