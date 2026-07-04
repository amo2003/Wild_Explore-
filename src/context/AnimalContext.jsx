import { createContext, useContext, useState, useEffect } from 'react'

const STORAGE_KEY = 'wildexplore_animals'

const AnimalContext = createContext(null)

function autoCoords(birthArea) {
  const area = (birthArea || '').toLowerCase()
  // Specific countries/islands first — before broad region checks
  if (area.includes('sri lanka') || area.includes('sri_lanka') || area.includes('ceylon'))
                                                                          return { lng: 80.7,  lat: 7.9  }
  if (area.includes('japan'))                                             return { lng: 138,   lat: 36   }
  if (area.includes('borneo'))                                            return { lng: 115,   lat: 1    }
  if (area.includes('sumatra'))                                           return { lng: 102,   lat: 0    }
  if (area.includes('madagascar'))                                        return { lng: 47,    lat: -20  }
  if (area.includes('new zealand'))                                       return { lng: 174,   lat: -41  }
  if (area.includes('indonesia'))                                         return { lng: 117,   lat: -2   }
  if (area.includes('philippines'))                                       return { lng: 122,   lat: 13   }
  if (area.includes('amazon'))                                            return { lng: -60,   lat: -5   }
  if (area.includes('india') || area.includes('indian subcontinent'))     return { lng: 80,    lat: 22   }
  if (area.includes('china'))                                             return { lng: 105,   lat: 35   }
  if (area.includes('russia'))                                            return { lng: 90,    lat: 60   }
  if (area.includes('alaska'))                                            return { lng: -153,  lat: 64   }
  if (area.includes('canada'))                                            return { lng: -96,   lat: 57   }
  if (area.includes('north america'))                                     return { lng: -100,  lat: 45   }
  if (area.includes('south america'))                                     return { lng: -55,   lat: -15  }
  if (area.includes('central america'))                                   return { lng: -85,   lat: 12   }
  if (area.includes('europe'))                                            return { lng: 15,    lat: 50   }
  if (area.includes('australia'))                                         return { lng: 134,   lat: -25  }
  if (area.includes('southeast asia'))                                    return { lng: 110,   lat: 10   }
  if (area.includes('east asia'))                                         return { lng: 120,   lat: 30   }
  if (area.includes('middle east'))                                       return { lng: 45,    lat: 25   }
  if (area.includes('nile'))                                              return { lng: 32,    lat: 15   }
  if (area.includes('africa'))                                            return { lng: 25,    lat: -5   }
  if (area.includes('asia'))                                              return { lng: 90,    lat: 30   }
  return { lng: 20, lat: 0 }
}

export function AnimalProvider({ children }) {
  const [animals, setAnimals] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (!saved) return []
      const parsed = JSON.parse(saved)
      // Re-run coord lookup for any animal stuck at the default (20,0) fallback
      return parsed.map(a => {
        if (a.lng === 20 && a.lat === 0 && a.birthArea) {
          return { ...a, ...autoCoords(a.birthArea) }
        }
        return a
      })
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
