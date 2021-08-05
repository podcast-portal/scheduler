const cron = require('node-cron')

const { reloadTasks, loadTasks } = require('./reload-tasks');

const tasks = {
  reload: cron.schedule(
    process.env.RELOAD_TASKS_SCHEDULE || '*/5 * * * *',
    async () => await reloadTasks(tasks),
    { scheduled: true }
  )
}

module.exports = async function execute() {
  await loadTasks(tasks)
}
