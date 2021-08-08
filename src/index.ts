import { scheduler } from './components'
import { mq } from './utils'

async function execute () {
  try {
    await mq.connectToServer()
    await scheduler()
  } catch (e) {
    console.error(e)
  }
}

process.on('exit', () => console.log(new Date(), 'exiting scheduler'))

execute().then()
