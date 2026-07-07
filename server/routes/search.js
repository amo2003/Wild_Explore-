import { Router } from 'express'
import Animal from '../models/Animal.js'

const router = Router()

// Common adjectives/qualifiers in ImageNet labels that are NOT the animal name
const SKIP_WORDS = new Set([
  'indian','african','asian','american','european','sri','lankan','eastern','western',
  'northern','southern','common','giant','great','lesser','greater','little','large',
  'small','wild','domestic','black','white','red','blue','green','grey','gray',
  'brown','spotted','striped','horned','tusker','male','female','baby','young',
])

/**
 * GET /api/animals/search/:name
 * Search for an animal by predicted name (name/scientificName only)
 */
router.get('/:name', async (req, res) => {
  try {
    const { name } = req.params

    // Split label into words, filter short/skip words, prioritise non-qualifier words
    const allWords = name.split(/[\s,]+/).filter(w => w.length > 3)
    const animalWords = allWords.filter(w => !SKIP_WORDS.has(w.toLowerCase()))
    const searchWords = animalWords.length > 0 ? animalWords : allWords

    let animal = null

    // 1. Try each meaningful word with word-boundary match on name/scientificName
    for (const word of searchWords) {
      animal = await Animal.findOne({
        $or: [
          { name:           new RegExp(`\\b${word}\\b`, 'i') },
          { scientificName: new RegExp(`\\b${word}\\b`, 'i') },
        ]
      })
      if (animal) break
    }

    // 2. Fallback: try full label string
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
