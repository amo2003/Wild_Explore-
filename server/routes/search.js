import { Router } from 'express'
import Animal from '../models/Animal.js'

const router = Router()

/**
 * GET /api/animals/search/:name
 * Search for an animal by predicted name (case-insensitive regex match)
 * Used by the AI identifier feature
 */
router.get('/:name', async (req, res) => {
  try {
    const { name } = req.params

    // Extract key animal word from MobileNet class string
    // e.g. "tiger cat" → try "tiger" first, then full string
    const words = name.split(/[\s,]+/).filter(w => w.length > 3)

    let animal = null

    // Try each word from the prediction label, longest first
    for (const word of words) {
      animal = await Animal.findOne({
        $or: [
          { name:           new RegExp(word, 'i') },
          { scientificName: new RegExp(word, 'i') },
          { description:    new RegExp(word, 'i') },
          { food:           new RegExp(word, 'i') },
        ]
      })
      if (animal) break
    }

    // Fallback: try full string
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
