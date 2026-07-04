import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import animalRoutes from './routes/animals.js'

const app  = express()
const PORT = process.env.PORT || 5000

// ── Middleware ───────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}))
app.use(express.json())

// ── Routes ───────────────────────────────────────────────
app.use('/api/animals', animalRoutes)

app.get('/api/health', (_, res) => res.json({ status: 'ok' }))

// Root — friendly message so "/" doesn't show "Cannot GET /"
app.get('/', (_, res) => res.json({
  app: 'WildExplore API',
  version: '1.0.0',
  status: 'running',
  endpoints: {
    health:  '/api/health',
    animals: '/api/animals',
  }
}))

// ── DB + Start ───────────────────────────────────────────
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected')
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message)
    process.exit(1)
  })
