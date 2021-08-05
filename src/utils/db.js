const { MongoClient } = require('mongodb')

const watch = require('./watch')

let db = null
let client = null

module.exports = {
  isConnect,
  connect,
  getCollection
}
async function getCollection (collectionName) {
  if (!isConnect()) {
    await connect()
  }

  return db.collection(collectionName)
}

function isConnect () {
  return db && db.s.client.topology.isConnected()
}

async function connect () {
  return await watch('connect to mongodb', async () => {
    client = new MongoClient(process.env.MONGO_HOST, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    await client.connect()
    db = client.db(process.env.MONGO_DB)
  }, true)
}
