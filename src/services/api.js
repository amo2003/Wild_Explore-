// Base URL — set VITE_API_URL in .env for production
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}

export const api = {
  getAnimals:    ()         => request('/animals'),
  getAnimal:     (id)       => request(`/animals/${id}`),
  createAnimal:  (body)     => request('/animals',      { method: 'POST',   body: JSON.stringify(body) }),
  updateAnimal:  (id, body) => request(`/animals/${id}`, { method: 'PUT',    body: JSON.stringify(body) }),
  deleteAnimal:  (id)       => request(`/animals/${id}`, { method: 'DELETE' }),

  // Fetch an external image URL through our server and return a base64 data URI
  uploadImageUrl: (url) => request('/images/upload-url', { method: 'POST', body: JSON.stringify({ url }) }),
}
