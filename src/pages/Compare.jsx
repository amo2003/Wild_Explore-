import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAnimals } from '../context/AnimalContext'
import { CATEGORIES, STATUS_COLORS } from '../data/animals'
import { useLang } from '../context/LanguageContext'

function categoryLabel(id) {
  const c = CATEGORIES.find(c => c.id === id)
  return c ? `${c.icon} ${c.label}` : id
}
function parseAvg(str) {
  if (!str) return null
  const nums = String(str).replace(/,/g, '').match(/[\d.]+/g)
  if (!nums) return null
  const vals = nums.map(Number)
  return vals.reduce((a, b) => a + b, 0) / vals.length
}
function sameVal(a, b) {
  return a && b && a.trim().toLowerCase() === b.trim().toLowerCase()
}

// ── Picker card ───────────────────────────────────────────────────────────────
function PickerCard({ animal, selected, onClick }) {
  const img = animal.images?.[0] || animal.image || ''
  const statusColor = STATUS_COLORS[animal.conservationStatus] || 'bg-gray-400 text-white'
  return (
    <button onClick={onClick}
      className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left
        ${selected ? 'border-green-500 bg-green-50 shadow-md' : 'border-gray-100 bg-white hover:border-green-300 hover:bg-green-50'}`}>
      <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
        {img ? <img src={img} alt={animal.name} className="w-full h-full object-cover" />
              : <span className="w-full h-full flex items-center justify-center text-2xl">🐾</span>}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-green-900 text-sm truncate">{animal.name}</p>
        <p className="text-gray-400 text-xs italic truncate">{animal.scientificName}</p>
        {animal.conservationStatus && (
          <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold mt-0.5 inline-block ${statusColor}`}>
            {animal.conservationStatus}
          </span>
        )}
      </div>
    </button>
  )
}

// ── Side panel ────────────────────────────────────────────────────────────────
function AnimalPanel({ animal, side, tr, c }) {
  const img = animal.images?.[0] || animal.image || ''
  const statusColor = STATUS_COLORS[animal.conservationStatus] || 'bg-gray-400 text-white'
  const cat = CATEGORIES.find(ct => ct.id === animal.category)
  return (
    <div className={`bg-white rounded-2xl border-2 shadow-md overflow-hidden flex flex-col
      ${side === 'left' ? 'border-blue-300' : 'border-orange-300'}`}>
      <div className={`h-1.5 ${side === 'left' ? 'bg-blue-400' : 'bg-orange-400'}`} />
      {img && <img src={img} alt={animal.name} className="w-full h-48 object-cover" />}
      <div className="p-5 flex-1 flex flex-col gap-2">
        <div className="flex flex-wrap gap-1.5 mb-1">
          {cat && <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">{cat.icon} {cat.label}</span>}
          {animal.conservationStatus && <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${statusColor}`}>{animal.conservationStatus}</span>}
          {animal.origin && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-teal-100 text-teal-700 font-medium">
              {animal.origin === 'endemic' ? '🌿' : animal.origin === 'native' ? '🌍' : '✈️'} {animal.origin}
            </span>
          )}
        </div>
        <h3 className="text-lg font-extrabold text-green-900 leading-tight">{animal.name}</h3>
        <p className="text-gray-400 text-xs italic">{animal.scientificName}</p>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {[
            { icon: '⚖️', label: tr(c.fWeight),  value: animal.maleWeight || animal.averageWeight },
            { icon: '📏', label: tr(c.fHeight),  value: animal.maleHeight || animal.averageHeight },
            { icon: '🍽️', label: tr(c.fDiet),    value: animal.food?.split('–')[0]?.trim() || animal.food },
            { icon: '📍', label: tr(c.fHabitat), value: animal.birthArea },
          ].filter(s => s.value).map(s => (
            <div key={s.label} className="bg-gray-50 rounded-lg p-2 border border-gray-100">
              <p className="text-xs text-gray-400 uppercase tracking-wide">{s.icon} {s.label}</p>
              <p className="text-xs font-semibold text-gray-800 mt-0.5 line-clamp-2">{s.value}</p>
            </div>
          ))}
        </div>
        {animal.description && <p className="text-gray-500 text-xs leading-relaxed mt-2 line-clamp-4">{animal.description}</p>}
        <Link to={`/animals/${animal._id || animal.id}`}
          className={`mt-auto block text-center text-white font-semibold py-2 rounded-xl text-xs transition-all
            ${side === 'left' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-orange-500 hover:bg-orange-600'}`}>
          {tr(c.viewDetails)}
        </Link>
      </div>
    </div>
  )
}

// ── Similarities ──────────────────────────────────────────────────────────────
function Similarities({ a, b, tr, c }) {
  const items = []
  if (a.category === b.category) {
    const cat = CATEGORIES.find(ct => ct.id === a.category)
    items.push({ icon: cat?.icon || '📂', label: tr(c.simCat), value: cat?.label || a.category })
  }
  if (a.conservationStatus && a.conservationStatus === b.conservationStatus)
    items.push({ icon: '🛡️', label: tr(c.simStatus), value: a.conservationStatus })
  if (a.origin && a.origin === b.origin)
    items.push({ icon: '🌍', label: tr(c.simOrigin), value: a.origin })
  if (a.className && b.className && sameVal(a.className, b.className))
    items.push({ icon: '🔬', label: tr(c.simClass), value: a.className })
  if (a.order && b.order && sameVal(a.order, b.order))
    items.push({ icon: '🧬', label: tr(c.simOrder), value: a.order })
  if (a.family && b.family && sameVal(a.family, b.family))
    items.push({ icon: '👨‍👩‍👧', label: tr(c.simFamily), value: a.family })

  const dA = (a.food || '').toLowerCase(), dB = (b.food || '').toLowerCase()
  const herbW = ['herb','grass','plant','leaf','fruit','vegetat']
  const carnW = ['carn','meat','prey','fish','insect','hunt']
  const hA = herbW.some(w => dA.includes(w)), hB = herbW.some(w => dB.includes(w))
  const kA = carnW.some(w => dA.includes(w)), kB = carnW.some(w => dB.includes(w))
  if (hA && hB) items.push({ icon: '🌱', label: tr(c.simHerb), value: tr(c.plantDiet) })
  else if (kA && kB) items.push({ icon: '🥩', label: tr(c.simCarn), value: tr(c.meatDiet) })

  const wA = parseAvg(a.maleWeight || a.averageWeight)
  const wB = parseAvg(b.maleWeight || b.averageWeight)
  if (wA && wB && Math.max(wA, wB) / Math.min(wA, wB) < 1.5)
    items.push({ icon: '⚖️', label: tr(c.simWeight), value: `~${Math.round(wA)} kg vs ~${Math.round(wB)} kg` })

  const hA2 = parseAvg(a.maleHeight || a.averageHeight)
  const hB2 = parseAvg(b.maleHeight || b.averageHeight)
  if (hA2 && hB2 && Math.max(hA2, hB2) / Math.min(hA2, hB2) < 1.5)
    items.push({ icon: '📏', label: tr(c.simHeight), value: `~${hA2.toFixed(1)} m vs ~${hB2.toFixed(1)} m` })

  if (items.length === 0) return null
  return (
    <div className="bg-white rounded-2xl border border-green-100 shadow-md p-6 mt-6">
      <h3 className="text-lg font-extrabold text-green-900 mb-4 flex items-center gap-2 flex-wrap">
        ✅ {tr(c.simTitle)} — <span className="text-blue-600">{a.name}</span>
        <span className="text-gray-400 font-normal text-sm">{tr(c.simBetween)}</span>
        <span className="text-orange-500">{b.name}</span>
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-3 bg-green-50 rounded-xl p-3 border border-green-100">
            <span className="text-xl flex-shrink-0">{item.icon}</span>
            <div>
              <p className="text-xs font-bold text-green-800">{item.label}</p>
              <p className="text-xs text-gray-600 mt-0.5">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Comparison table ──────────────────────────────────────────────────────────
function DiffRow({ icon, label, valA, valB }) {
  if (!valA && !valB) return null
  const same = sameVal(valA, valB)
  return (
    <tr className="border-t border-gray-100">
      <td className="py-2.5 px-3 text-xs font-semibold text-gray-500 w-28">{icon} {label}</td>
      <td className={`py-2.5 px-3 text-xs ${same ? 'text-green-700 font-semibold' : 'text-gray-800'}`}>{valA || '—'}</td>
      <td className="py-2.5 px-3 text-center text-base">{same ? '✅' : '↔️'}</td>
      <td className={`py-2.5 px-3 text-xs ${same ? 'text-green-700 font-semibold' : 'text-gray-800'}`}>{valB || '—'}</td>
    </tr>
  )
}

function CompareTable({ a, b, tr, c }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden mt-6">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="text-lg font-extrabold text-green-900">{tr(c.tableTitle)}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-2 px-3 text-left text-xs font-bold text-gray-400 uppercase w-28">Field</th>
              <th className="py-2 px-3 text-left text-xs font-bold text-blue-500 uppercase">{a.name}</th>
              <th className="py-2 px-3 w-8" />
              <th className="py-2 px-3 text-left text-xs font-bold text-orange-500 uppercase">{b.name}</th>
            </tr>
          </thead>
          <tbody>
            <DiffRow icon="📂" label={tr(c.fCategory)} valA={categoryLabel(a.category)}       valB={categoryLabel(b.category)} />
            <DiffRow icon="🛡️" label={tr(c.fStatus)}   valA={a.conservationStatus}            valB={b.conservationStatus} />
            <DiffRow icon="🌍" label={tr(c.fOrigin)}   valA={a.origin}                        valB={b.origin} />
            <DiffRow icon="🔬" label={tr(c.fClass)}    valA={a.className}                     valB={b.className} />
            <DiffRow icon="🧬" label={tr(c.fOrder)}    valA={a.order}                         valB={b.order} />
            <DiffRow icon="👨‍👩‍👧" label={tr(c.fFamily)} valA={a.family}                        valB={b.family} />
            <DiffRow icon="⚖️" label={tr(c.fWeight)}   valA={a.maleWeight || a.averageWeight} valB={b.maleWeight || b.averageWeight} />
            <DiffRow icon="📏" label={tr(c.fHeight)}   valA={a.maleHeight || a.averageHeight} valB={b.maleHeight || b.averageHeight} />
            <DiffRow icon="🍽️" label={tr(c.fDiet)}    valA={a.food}                          valB={b.food} />
            <DiffRow icon="📍" label={tr(c.fHabitat)}  valA={a.birthArea}                     valB={b.birthArea} />
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Compare() {
  const { animals, loading } = useAnimals()
  const { tr, t } = useLang()
  const c = t.compare

  const [search, setSearch]   = useState('')
  const [animalA, setAnimalA] = useState(null)
  const [animalB, setAnimalB] = useState(null)

  const filteredA = useMemo(() => {
    const q = search.toLowerCase()
    return animals.filter(a =>
      a.name?.toLowerCase().includes(q) || a.scientificName?.toLowerCase().includes(q)
    ).slice(0, 50)
  }, [animals, search])

  const suggestions = useMemo(() => {
    if (!animalA) return []
    return animals
      .filter(a =>
        String(a._id || a.id) !== String(animalA._id || animalA.id) &&
        a.category === animalA.category
      )
      .sort((x, y) => {
        const xs = (x.order === animalA.order || x.family === animalA.family) ? 1 : 0
        const ys = (y.order === animalA.order || y.family === animalA.family) ? 1 : 0
        return ys - xs
      })
      .slice(0, 12)
  }, [animals, animalA])

  const catLabel = animalA ? (CATEGORIES.find(ct => ct.id === animalA.category)?.label || animalA.category) : ''

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-900 to-green-700 text-white py-10 sm:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-green-200 px-4 py-2 rounded-full text-xs font-medium mb-5 border border-white/20">
            ⚖️ {tr(c.tag)}
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-3">{tr(c.title)}</h1>
          <p className="text-green-200 text-sm sm:text-base max-w-xl mx-auto">{tr(c.subtitle)}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20 gap-3 text-green-700">
            <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            <span className="font-medium">{tr(c.loading)}</span>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Picker A */}
              <div className="bg-white rounded-2xl border-2 border-blue-200 shadow-sm overflow-hidden">
                <div className="bg-blue-50 px-5 py-3 border-b border-blue-100">
                  <h2 className="font-bold text-blue-800 text-sm">{tr(c.picker1)}</h2>
                </div>
                <div className="p-4">
                  <input type="text" placeholder={tr(c.searchPh)} value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 mb-3" />
                  {animalA && (
                    <div className="mb-3 p-3 bg-blue-50 rounded-xl border border-blue-200 flex items-center justify-between">
                      <span className="text-sm font-bold text-blue-800">{tr(c.selected)}: {animalA.name}</span>
                      <button onClick={() => { setAnimalA(null); setAnimalB(null) }}
                        className="text-xs text-blue-400 hover:text-red-500 transition-colors">{tr(c.clear)}</button>
                    </div>
                  )}
                  <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
                    {filteredA.map(a => (
                      <PickerCard key={a._id || a.id} animal={a}
                        selected={String(animalA?._id || animalA?.id) === String(a._id || a.id)}
                        onClick={() => { setAnimalA(a); setAnimalB(null) }} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Picker B */}
              <div className="bg-white rounded-2xl border-2 border-orange-200 shadow-sm overflow-hidden">
                <div className="bg-orange-50 px-5 py-3 border-b border-orange-100">
                  <h2 className="font-bold text-orange-800 text-sm">{tr(c.picker2)}</h2>
                  {animalA && (
                    <p className="text-xs text-orange-600 mt-0.5">
                      {tr(c.showing).replace('{cat}', catLabel)}
                    </p>
                  )}
                </div>
                <div className="p-4">
                  {!animalA ? (
                    <div className="text-center py-12 text-gray-400">
                      <div className="text-4xl mb-2">👈</div>
                      <p className="text-sm">{tr(c.selectFirst)}</p>
                    </div>
                  ) : (
                    <>
                      {animalB && (
                        <div className="mb-3 p-3 bg-orange-50 rounded-xl border border-orange-200 flex items-center justify-between">
                          <span className="text-sm font-bold text-orange-800">{tr(c.selected)}: {animalB.name}</span>
                          <button onClick={() => setAnimalB(null)}
                            className="text-xs text-orange-400 hover:text-red-500 transition-colors">{tr(c.clear)}</button>
                        </div>
                      )}
                      <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
                        {suggestions.map(a => (
                          <PickerCard key={a._id || a.id} animal={a}
                            selected={String(animalB?._id || animalB?.id) === String(a._id || a.id)}
                            onClick={() => setAnimalB(a)} />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {animalA && animalB ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <AnimalPanel animal={animalA} side="left"  tr={tr} c={c} />
                  <AnimalPanel animal={animalB} side="right" tr={tr} c={c} />
                </div>
                <Similarities a={animalA} b={animalB} tr={tr} c={c} />
                <CompareTable a={animalA} b={animalB} tr={tr} c={c} />
              </>
            ) : (
              <div className="text-center py-16 text-gray-400">
                <div className="text-6xl mb-4">⚖️</div>
                <p className="text-lg font-semibold text-gray-500">{tr(c.selectBoth)}</p>
                <p className="text-sm mt-1">{tr(c.selectHint)}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
