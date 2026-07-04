import { Router } from 'express'
import Animal from '../models/Animal.js'

const router = Router()

function autoCoords(birthArea) {
  const area = (birthArea || '').toLowerCase()
  if (area.includes('sri lanka') || area.includes('ceylon')) return { lng: 80.7, lat: 7.9 }
  if (area.includes('japan'))           return { lng: 138,  lat: 36  }
  if (area.includes('borneo'))          return { lng: 115,  lat: 1   }
  if (area.includes('sumatra'))         return { lng: 102,  lat: 0   }
  if (area.includes('madagascar'))      return { lng: 47,   lat: -20 }
  if (area.includes('new zealand'))     return { lng: 174,  lat: -41 }
  if (area.includes('indonesia'))       return { lng: 117,  lat: -2  }
  if (area.includes('philippines'))     return { lng: 122,  lat: 13  }
  if (area.includes('amazon'))          return { lng: -60,  lat: -5  }
  if (area.includes('india') || area.includes('indian subcontinent')) return { lng: 80, lat: 22 }
  if (area.includes('china'))           return { lng: 105,  lat: 35  }
  if (area.includes('russia'))          return { lng: 90,   lat: 60  }
  if (area.includes('alaska'))          return { lng: -153, lat: 64  }
  if (area.includes('canada'))          return { lng: -96,  lat: 57  }
  if (area.includes('north america'))   return { lng: -100, lat: 45  }
  if (area.includes('south america'))   return { lng: -55,  lat: -15 }
  if (area.includes('central america')) return { lng: -85,  lat: 12  }
  if (area.includes('europe'))          return { lng: 15,   lat: 50  }
  if (area.includes('australia'))       return { lng: 134,  lat: -25 }
  if (area.includes('southeast asia'))  return { lng: 110,  lat: 10  }
  if (area.includes('middle east'))     return { lng: 45,   lat: 25  }
  if (area.includes('nile'))            return { lng: 32,   lat: 15  }
  if (area.includes('africa'))          return { lng: 25,   lat: -5  }
  if (area.includes('asia'))            return { lng: 90,   lat: 30  }
  return { lng: 20, lat: 0 }
}

// GET /api/animals — list all
router.get('/', async (req, res) => {
  try {
    const animals = await Animal.find().sort({ createdAt: -1 })
    res.json(animals)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /api/animals/:id
router.get('/:id', async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id)
    if (!animal) return res.status(404).json({ error: 'Not found' })
    res.json(animal)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /api/animals — create
router.post('/', async (req, res) => {
  try {
    const data = req.body
    // Auto-assign coordinates if missing
    if (data.lng == null || data.lat == null) {
      Object.assign(data, autoCoords(data.birthArea))
    }
    // Set averageWeight/Height for card display
    data.averageWeight = data.maleWeight || data.femaleWeight || data.averageWeight || ''
    data.averageHeight = data.maleHeight || data.femaleHeight || data.averageHeight || ''
    data.image = (data.images && data.images[0]) || data.image || ''

    const animal = await Animal.create(data)
    res.status(201).json(animal)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// PUT /api/animals/:id — update
router.put('/:id', async (req, res) => {
  try {
    const data = req.body
    data.averageWeight = data.maleWeight || data.femaleWeight || data.averageWeight || ''
    data.averageHeight = data.maleHeight || data.femaleHeight || data.averageHeight || ''
    data.image = (data.images && data.images[0]) || data.image || ''

    const animal = await Animal.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true })
    if (!animal) return res.status(404).json({ error: 'Not found' })
    res.json(animal)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

// DELETE /api/animals/:id
router.delete('/:id', async (req, res) => {
  try {
    const animal = await Animal.findByIdAndDelete(req.params.id)
    if (!animal) return res.status(404).json({ error: 'Not found' })
    res.json({ success: true, id: req.params.id })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
