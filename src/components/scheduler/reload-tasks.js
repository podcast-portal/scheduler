const cron = require('node-cron')
const _ = require('lodash')

const loadSchedules = require('./load-schedules')
const executeSchedule = require('./execute-schedule')

module.exports = {
  reloadTasks,
  loadTasks
}

async function load(tasks) {
  const schedules = await loadSchedules()
  for (const schedule of schedules) {
    if (tasks[schedule._id]) {
      if (_.isEqual(schedule, tasks[schedule._id].schedule)) {
        console.log(new Date(), 'schedule', schedule.name, 'was not changed')
        continue
      }

      console.log(new Date(), 'stopping old schedules')
      tasks[schedule._id].task.stop()
      tasks[schedule._id].task.destroy()
    }

    tasks[schedule._id] = {
      schedule,
      task: cron.schedule(schedule.cron, () => {
        console.log(new Date(), 'executing', schedule.name, 'with message', schedule.message)
        executeSchedule(schedule)
      })
    }

    if (tasks[schedule._id].isEnabled) {
      console.log(new Date(), 'starting', schedule.name, 'task')
      tasks[schedule._id].start()
    }
  }
}

async function loadTasks () {
  try {
    console.log(new Date(), 'loading tasks')
    const tasks = {};

    await load(tasks);

    return tasks;
  } catch (e) {
    console.error('ERROR ON LOAD TASKS', e)
  }
}

async function reloadTasks (tasks) {
  try {
    console.log(new Date(), 'reloading tasks')
    await load(tasks)
  } catch (e) {
    console.error('ERROR ON RELOAD TASKS', e)
  }
}
