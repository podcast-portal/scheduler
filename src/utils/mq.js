const { connect } = require('amqplib')
const watch = require('./watch')

class MessageQueue {
  connection

  async connectToServer() {
    await watch('connect to rabbit mq',
      async () => this.connection = await connect(process.env.RABBIT_URL),
      true)
  }

  async consume(queue, handler) {
    if (!this.connection) {
      await this.connectToServer();
    }

    const channel = await this.connection.createChannel()
    await channel.assertQueue(queue)

    channel.prefetch(process.env.PARALLEL_PROCESSES || 5)
    channel.consume(queue, handler(channel))
  }

  async enqueueChannel(channel, queue, value, priority) {
    return await channel
      .sendToQueue(queue,
        Buffer.from(JSON.stringify(value)),
        { priority })
  }

  async enqueue(queue, value, priority) {
    if (!this.connection) {
      await this.connectToServer();
    }

    const channel = await this.connection.createChannel()
    await channel.assertQueue(queue)
    await this.enqueueChannel(channel, queue, value, priority)
  }
}

const mq = new MessageQueue();

module.exports = mq
