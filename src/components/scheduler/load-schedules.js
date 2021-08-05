const { db } = require('../../utils')

module.exports = loadSchedules

async function loadSchedules () {
  const collection = await db.getCollection('schedules')

  return collection.find().toArray()
}
