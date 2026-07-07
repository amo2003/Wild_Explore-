import { Router } from 'express'
import Animal from '../models/Animal.js'

const router = Router()

/**
 * GET /api/animals/search/:name
 * Search for an animal by predicted name (case-insensitive match on name/scientificName only)
 * Used by the AI identifier feature
 */
router.get('/:name', async (req, res) => {
  try {
    const { name } = req.params

    // Extract words from MobileNet label, e.g. "ostrich, Struthio camelus" → ["ostrich", "Struthio", "camelus"]
    const words = name.split(/[\s,]+/).filter(w => w.length > 3)

    let animal = null

    // 1. Try exact word match on name or scientificName only (NOT description/food)
    for (const word of words) {
      animal = await Animal.findOne({
        $or: [
          { name:           new RegExp(`\\b${word}\\b`, 'i') },
          { scientificName: new RegExp(`\\b${word}\\b`, 'i') },
        ]
      })
      if (animal) break
    }

    // 2. Fallback: partial match on full label string
    if (!animal) {
      animal = await Animal.findOne({
        $or: [
          { name:           new RegExp(name, 'i') },
          { scientificName: new RegExp(name, 'i') },
        ]
      })
    }

    if (!animal) {
      return res.status(404).json({
        found: false,
        message: `No animal found matching "${name}"`,
        query: name,
      })
    }

    res.json({ found: true, animal })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
