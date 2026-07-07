import { Router } from 'express'
import Animal from '../models/Animal.js'

const router = Router()

// Generic qualifiers in ImageNet labels — not the animal type word
const SKIP_WORDS = new Set([
  'indian','african','asian','american','european','sri','lankan','eastern','western',
  'northern','southern','common','giant','great','lesser','greater','little','large',
  'small','wild','domestic','black','white','red','blue','green','grey','gray',
  'brown','spotted','striped','horned','tusker','male','female','baby','young','nile',
])

/**
 * GET /api/animals/search/:name
 * Search by AI predicted label — scores all candidates, returns best match
 */
router.get('/:name', async (req, res) => {
  try {
    const { name } = req.params

    const allWords = name.split(/[\s,]+/).filter(w => w.length > 3)
    const animalWords = allWords.filter(w => !SKIP_WORDS.has(w.toLowerCase()))
    const searchWords = animalWords.length > 0 ? animalWords : allWords

    // Fetch all candidates that match ANY search word on name or scientificName
    const orClauses = searchWords.map(w => ([
      { name:           new RegExp(`\\b${w}\\b`, 'i') },
      { scientificName: new RegExp(`\\b${w}\\b`, 'i') },
    ])).flat()

    let candidates = orClauses.length > 0
      ? await Animal.find({ $or: orClauses })
      : []

    // Score each candidate: count how many search words appear in its name
    function score(animal) {
      const haystack = `${animal.name} ${animal.scientificName}`.toLowerCase()
      return searchWords.reduce((acc, w) => acc + (haystack.includes(w.toLowerCase()) ? 1 : 0), 0)
    }

    candidates.sort((a, b) => score(b) - score(a))
    let animal = candidates[0] || null

    // Fallback: full label regex on name only
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
