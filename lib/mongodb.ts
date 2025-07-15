// lib/mongodb.ts

import { MongoClient, Db } from 'mongodb'

const uri = process.env.MONGODB_URI

if (!uri) {
  throw new Error('❌ MONGODB_URI is not defined in environment variables')
}

let client: MongoClient | null = null
let db: Db | null = null

export async function saveToMongoDB(data: { url: string; fullText: string }) {
  try {
    if (!client || !db) {
      client = new MongoClient(uri as string) // ✅ assert type as string
      await client.connect()
      db = client.db('blogdb')
    }

    const collection = db.collection('blogs')
    await collection.insertOne({
      ...data,
      createdAt: new Date(),
    })

    console.log('✅ MongoDB insert successful')
  } catch (error) {
    console.error('❌ MongoDB insert failed:', error)
    throw error
  }
}
