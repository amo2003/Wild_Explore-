import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAnimals } from '../context/AnimalContext'
import { CATEGORIES } from '../data/animals'

export default function ManageAnimals() {
  const { animals, deleteAnimal } = useAnimals()
  const [search, setSearch] = useState('')
  const [confirmId, setConfirmId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const filtered = animals.filter(a =>
    !search ||
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    (a.scientificName || '').toLowerCase().includes(search.toLowerCase())
  )

  async function handleDelete(id) {
    setDeleting(true)
    try {
      await deleteAnimal(id)
    } finally {
      setDeleting(false)
      setConfirmId(null)
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 mb-5 items-start sm:items-center justify-between">
        <h2 className="text-lg font-bold text-green-900">
          All Animals <span className="text-gray-400 font-normal text-base">({animals.length})</span>
        </h2>
        <div className="relative w-full sm:w-64">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            placeholder="Search animals..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-100">
          <div className="text-5xl mb-3">🌿</div>
          <p className="font-medium">{search ? 'No animals match your search' : 'No animals yet'}</p>
          {!search && <p className="text-xs mt-1">Go to the Add Animal tab to get started</p>}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="bg-green-50 border-b border-green-100">
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wide">Animal</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wide">Category</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wide">Origin</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wide text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => {
                const cat = CATEGORIES.find(c => c.id === a.category)
                const animalId = String(a._id || a.id)
                const isConfirming = confirmId === animalId
                return (
                  <tr key={animalId} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {a.image
                          ? <img src={a.image} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                          : <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-xl">{cat?.icon}</div>
                        }
                        <div>
                          <p className="font-semibold text-green-900 leading-tight">{a.name}</p>
                          <p className="text-xs text-gray-400 italic">{a.scientificName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{cat?.icon} {cat?.label}</td>
                    <td className="px-4 py-3">
                      {a.origin ? (
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          a.origin === 'endemic' ? 'bg-emerald-100 text-emerald-700'
                          : a.origin === 'native' ? 'bg-teal-100 text-teal-700'
                          : 'bg-blue-100 text-blue-700'
                        }`}>{a.origin}</span>
                      ) : <span className="text-gray-300 text-xs">—</span>}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{a.conservationStatus || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <Link
                          to={`/dashboard/edit/${animalId}`}
                          className="text-xs bg-green-50 hover:bg-green-100 text-green-700 font-semibold px-3 py-1.5 rounded-lg transition-all"
                        >
                          ✏️ Edit
                        </Link>
                        {isConfirming ? (
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => handleDelete(animalId)}
                              disabled={deleting}
                              className="text-xs bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-bold px-3 py-1.5 rounded-lg transition-all"
                            >
                              {deleting ? '…' : 'Yes, Delete'}
                            </button>
                            <button
                              onClick={() => setConfirmId(null)}
                              className="text-xs border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium px-3 py-1.5 rounded-lg transition-all"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmId(animalId)}
                            className="text-xs bg-red-50 hover:bg-red-100 text-red-600 font-semibold px-3 py-1.5 rounded-lg transition-all"
                          >
                            🗑️ Delete
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
