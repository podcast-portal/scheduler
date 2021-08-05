const { connect } = require('amqplib')
const watch = require('./watch')

class MessageQueue {
  connection

  async connectToServer() {
    this.connection = await connect(process.env.RABBIT_URL)
  }

  async enqueueChannel(channel, queue, value, priority) {
    return await channel
      .sendToQueue(queue,
        Buffer.from(JSON.stringify(value)),
        { priority })
  }

  async enqueue(queue, value, priority) {
    if (!this.connection) {
      await watch('connect to rabbit mq',
          async () => await this.connectToServer(),
          true)
    }

    const channel = await this.connection.createChannel()
    await channel.assertQueue(queue)
    await this.enqueueChannel(channel, queue, value, priority)
  }
}

const mq = new MessageQueue();

module.exports = mq
