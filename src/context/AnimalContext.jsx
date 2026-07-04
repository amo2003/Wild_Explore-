import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../services/api'

const AnimalContext = createContext(null)

export function AnimalProvider({ children }) {
  const [animals, setAnimals]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [error,   setError]     = useState(null)

  // ── Fetch all animals on mount ───────────────────────
  useEffect(() => {
    api.getAnimals()
      .then(data => setAnimals(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  // ── CRUD ─────────────────────────────────────────────
  async function addAnimal(animal) {
    const created = await api.createAnimal(animal)
    setAnimals(prev => [created, ...prev])
    return created
  }

  async function updateAnimal(id, updated) {
    const saved = await api.updateAnimal(id, updated)
    setAnimals(prev => prev.map(a => String(a._id) === String(id) ? saved : a))
    return saved
  }

  async function deleteAnimal(id) {
    await api.deleteAnimal(id)
    setAnimals(prev => prev.filter(a => String(a._id) !== String(id)))
  }

  return (
    <AnimalContext.Provider value={{ animals, loading, error, addAnimal, updateAnimal, deleteAnimal }}>
      {children}
    </AnimalContext.Provider>
  )
}

export function useAnimals() {
  return useContext(AnimalContext)
}
