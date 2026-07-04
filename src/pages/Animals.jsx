import { useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAnimals } from '../context/AnimalContext'
import { CATEGORIES, STATUS_COLORS } from '../data/animals'
import { useLang } from '../context/LanguageContext'

export default function Animals() {
  const { animals } = useAnimals()
  const { tr, t } = useLang()
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')

  const activeCategory = searchParams.get('category') || 'all'
  const activeOrigin   = searchParams.get('origin') || 'all'

  function setCategory(cat) {
    const params = {}
    if (cat !== 'all') params.category = cat
    if (activeOrigin !== 'all') params.origin = activeOrigin
    setSearchParams(params)
  }

  function setOrigin(origin) {
    const params = {}
    if (activeCategory !== 'all') params.category = activeCategory
    if (origin !== 'all') params.origin = origin
    setSearchParams(params)
  }

  const filtered = useMemo(() => {
    return animals.filter(a => {
      const matchCat    = activeCategory === 'all' || a.category === activeCategory
      const matchOrigin = activeOrigin === 'all' || a.origin === activeOrigin
      const matchSearch =
        !search ||
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.scientificName.toLowerCase().includes(search.toLowerCase())
      return matchCat && matchOrigin && matchSearch
    })
  }, [animals, activeCategory, activeOrigin, search])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-green-900 to-green-700 text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-4xl font-extrabold mb-1 sm:mb-2">{tr(t.animals.pageTitle)}</h1>
          <p className="text-green-200 text-sm sm:text-base">{tr(t.animals.pageSub)}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Search */}
        <div className="mb-4 sm:mb-6">
          <div className="relative w-full sm:max-w-md">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              type="text"
              placeholder={tr(t.animals.search)}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 mb-3 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
          <button
            onClick={() => setCategory('all')}
            className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
              activeCategory === 'all'
                ? 'bg-green-700 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-green-400 hover:text-green-700'
            }`}
          >
            {tr(t.animals.all)} ({animals.length})
          </button>
          {CATEGORIES.map(cat => {
            const count = animals.filter(a => a.category === cat.id).length
            return (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all flex items-center gap-1 sm:gap-1.5 whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-green-700 text-white shadow-md'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-green-400 hover:text-green-700'
                }`}
              >
                {cat.icon} {tr(t.categories[cat.id])} ({count})
              </button>
            )
          })}
        </div>

        {/* Origin filter */}
        <div className="flex gap-2 mb-6 sm:mb-8">
          {[
            { key: 'all',         label: tr(t.originAll),             icon: '🌐' },
            { key: 'ekadeshiya',  label: tr(t.origin.ekadeshiya),     icon: '🏡' },
            { key: 'videshiya',   label: tr(t.origin.videshiya),      icon: '✈️' },
          ].map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => setOrigin(key)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                activeOrigin === key
                  ? key === 'ekadeshiya'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : key === 'videshiya'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-green-700 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-green-400 hover:text-green-700'
              }`}
            >
              <span>{icon}</span> {label}
              <span className="opacity-75">
                ({key === 'all' ? animals.length : animals.filter(a => a.origin === key).length})
              </span>
            </button>
          ))}
        </div>

        {/* Count */}
        {filtered.length > 0 && (
          <p className="text-xs text-gray-400 mb-4">
            {tr(t.animals.showing)} {filtered.length} {filtered.length !== 1 ? tr(t.animals.animals) : tr(t.animals.animal)}
          </p>
        )}

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 sm:py-20 text-gray-400">
            <div className="text-5xl sm:text-6xl mb-4">🌿</div>
            <p className="text-lg sm:text-xl font-medium">{tr(t.animals.notFound)}</p>
            <p className="text-sm mt-2">{tr(t.animals.tryDiff)}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {filtered.map(animal => (
              <AnimalCard key={animal.id} animal={animal} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function AnimalCard({ animal }) {
  const { tr, t } = useLang()
  const category = CATEGORIES.find(c => c.id === animal.category)
  const statusColor = STATUS_COLORS[animal.conservationStatus] || 'bg-gray-400 text-white'
  const translatedStatus = tr(t.conservation[animal.conservationStatus]) || animal.conservationStatus
  const translatedCat = tr(t.categories[animal.category]) || category?.label

  return (
    <Link
      to={`/animals/${animal.id}`}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:-translate-y-1"
    >
      <div className="relative h-44 overflow-hidden bg-green-50">
        {animal.image ? (
          <img src={animal.image} alt={animal.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl sm:text-6xl">
            {category?.icon}
          </div>
        )}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <span className="bg-white/90 text-gray-700 text-xs px-2 py-0.5 rounded-full font-medium shadow-sm">
            {category?.icon} {translatedCat}
          </span>
          {animal.origin && (
            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold shadow-sm w-fit ${
              animal.origin === 'ekadeshiya'
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-blue-100 text-blue-700'
            }`}>
              {animal.origin === 'ekadeshiya' ? '🏡' : '✈️'} {tr(t.origin[animal.origin])}
            </span>
          )}
        </div>
        {animal.conservationStatus && (
          <div className="absolute bottom-2 right-2">
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor}`}>
              {translatedStatus}
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-green-900 group-hover:text-green-600 transition-colors text-sm sm:text-base">
          {animal.name}
        </h3>
        <p className="text-gray-400 text-xs italic mt-0.5">{animal.scientificName}</p>
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-500">
          <span>⚖️ {animal.averageWeight}</span>
          <span>📏 {animal.averageHeight}</span>
        </div>
        <p className="mt-2 text-gray-600 text-xs line-clamp-2">{animal.description}</p>
      </div>
    </Link>
  )
}
