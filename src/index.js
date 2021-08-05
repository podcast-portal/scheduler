const { scheduler } = require('./components')

async function execute () {
  try {
    await scheduler()
  } catch (e) {
    console.error(e)
  }
}

process.on('exit', () => console.log(new Date(), 'exiting scheduler'))

execute().then()