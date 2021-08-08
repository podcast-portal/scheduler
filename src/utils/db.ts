import { MongoClient } from 'mongodb'

import watch from './watch'

let _db = null
let client = null

export default {
  isConnect,
  connect,
  getCollection
}
async function getCollection (collectionName) {
  if (!isConnect()) {
    await connect()
  }

  return _db.collection(collectionName)
}

function isConnect () {
  return _db && _db.s.client.topology.isConnected()
}

async function connect () {
  return await watch('connect to mongodb', async () => {
    client = new MongoClient(process.env.MONGO_HOST, {
    })
    await client.connect()
    _db = client.db(process.env.MONGO_DB)
  }, true)
}
