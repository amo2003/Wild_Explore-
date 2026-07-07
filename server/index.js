import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import animalRoutes from './routes/animals.js'
import searchRoutes from './routes/search.js'
import imageRoutes  from './routes/images.js'

const app  = express()
const PORT = process.env.PORT || 5000

// ── Middleware ───────────────────────────────────────────
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true)
    const allowed = (process.env.CLIENT_ORIGIN || '').split(',').map(s => s.trim())
    // Also allow all vercel.app and railway.app domains during development
    if (
      allowed.includes(origin) ||
      allowed.includes('*') ||
      origin.endsWith('.vercel.app') ||
      origin.endsWith('.railway.app') ||
      origin === 'http://localhost:5173' ||
      origin === 'http://localhost:4173'
    ) {
      return callback(null, true)
    }
    callback(new Error(`CORS blocked: ${origin}`))
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}))
app.use(express.json())

// ── Routes ───────────────────────────────────────────────
app.use('/api/animals/search', searchRoutes)  // must be before /api/animals
app.use('/api/animals', animalRoutes)
app.use('/api/images', imageRoutes)

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
