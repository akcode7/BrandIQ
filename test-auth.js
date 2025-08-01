const { MongoClient } = require('mongodb')
const bcrypt = require('bcryptjs')

const MONGODB_URI = 'mongodb+srv://vendorstreet:vWp6yBnxE2fiZ.Z@cluster0.tpj3y.mongodb.net/qloohack?retryWrites=true&w=majority&appName=Cluster0'

async function testAuth() {
  try {
    console.log('Connecting to MongoDB...')
    const client = new MongoClient(MONGODB_URI)
    await client.connect()
    console.log('✅ Connected to MongoDB!')

    const db = client.db('qloohack')
    const users = db.collection('users')

    // Check if any users exist
    const userCount = await users.countDocuments()
    console.log(`📊 Total users in database: ${userCount}`)

    // List existing users (without passwords)
    const existingUsers = await users.find({}, { projection: { password: 0 } }).toArray()
    console.log('👥 Existing users:', existingUsers)

    // Create a test user if none exist
    if (userCount === 0) {
      console.log('Creating test user...')
      const hashedPassword = await bcrypt.hash('test123456', 12)
      
      const testUser = {
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
        emailVerified: null,
        image: null,
        role: 'user'
      }

      const result = await users.insertOne(testUser)
      console.log('✅ Test user created:', result.insertedId)
      console.log('📝 Login with: test@example.com / test123456')
    }

    await client.close()
    console.log('🔌 Database connection closed')

  } catch (error) {
    console.error('❌ Error:', error.message)
    if (error.code === 'ENOTFOUND') {
      console.log('🌐 DNS resolution failed - check your internet connection')
    } else if (error.code === 8000) {
      console.log('🔐 Authentication failed - check your MongoDB credentials')
    }
  }
}

testAuth()
