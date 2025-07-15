import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI

if (!uri) {
  throw new Error('❌ MONGODB_URI is not set in .env.local')
}

let client: MongoClient | null = null
let db: ReturnType<MongoClient['db']> | null = null

export async function saveToMongoDB(data: { url: string; fullText: string }) {
  try {
    if (!client || !db) {
      client = new MongoClient(uri)
      await client.connect()
      db = client.db('blogdb') // You can rename this
    }

    const collection = db.collection('blogs')
    await collection.insertOne({
      ...data,
      createdAt: new Date(),
    })

    console.log('✅ MongoDB insert successful')
  } catch (error: unknown) {
    console.error('❌ MongoDB insert failed:', (error as Error).message)
    throw error
  }
}
