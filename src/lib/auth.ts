import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import { connectToDatabase } from './mongodb'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(connectToDatabase()),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          console.log('Attempting to connect to database...')
          const client = await connectToDatabase()
          const db = client.db('qloohack')  // Changed to match your MongoDB URI
          const users = db.collection('users')

          console.log('Looking for user with email:', credentials.email.toLowerCase())
          const user = await users.findOne({ 
            email: credentials.email.toLowerCase() 
          })

          console.log('User found:', user ? 'Yes' : 'No')
          
          if (!user || !user.password) {
            console.log('User not found or no password set')
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password, 
            user.password
          )

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.image || null,
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, account, user }: { token: any; account: any; user: any }) {
      if (account && user) {
        token.userId = user.id
      }
      return token
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token) {
        session.user.id = token.userId as string
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
}
