import { createContext, useContext, useState, useEffect } from 'react'

const STORAGE_KEY = 'wildexplore_animals'

const AnimalContext = createContext(null)

function autoCoords(birthArea) {
  const area = (birthArea || '').toLowerCase()
  if (area.includes('africa'))                                              return { lng: 25,   lat: -5  }
  if (area.includes('india') || area.includes('indian subcontinent'))      return { lng: 80,   lat: 22  }
  if (area.includes('north america'))                                       return { lng: -100, lat: 45  }
  if (area.includes('south america') || area.includes('amazon'))           return { lng: -55,  lat: -15 }
  if (area.includes('europe'))                                              return { lng: 15,   lat: 50  }
  if (area.includes('australia'))                                           return { lng: 134,  lat: -25 }
  if (area.includes('china'))                                               return { lng: 105,  lat: 35  }
  if (area.includes('southeast asia'))                                      return { lng: 110,  lat: 10  }
  if (area.includes('asia'))                                                return { lng: 90,   lat: 30  }
  if (area.includes('nile'))                                                return { lng: 32,   lat: 15  }
  return { lng: 20, lat: 0 }
}

export function AnimalProvider({ children }) {
  const [animals, setAnimals] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Persist every change to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(animals))
    } catch {}
  }, [animals])

  function addAnimal(animal) {
    const coords = (animal.lng == null) ? autoCoords(animal.birthArea) : { lng: animal.lng, lat: animal.lat }
    const newAnimal = { ...animal, id: Date.now(), ...coords }
    setAnimals(prev => [...prev, newAnimal])
    return newAnimal
  }

  function updateAnimal(id, updated) {
    setAnimals(prev => prev.map(a =>
      String(a.id) === String(id) ? { ...a, ...updated } : a
    ))
  }

  function deleteAnimal(id) {
    setAnimals(prev => prev.filter(a => String(a.id) !== String(id)))
  }

  return (
    <AnimalContext.Provider value={{ animals, addAnimal, updateAnimal, deleteAnimal }}>
      {children}
    </AnimalContext.Provider>
  )
}

export function useAnimals() {
  return useContext(AnimalContext)
}
