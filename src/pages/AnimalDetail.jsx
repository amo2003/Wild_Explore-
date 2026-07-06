import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAnimals } from '../context/AnimalContext'
import { CATEGORIES, STATUS_COLORS } from '../data/animals'
import { useLang } from '../context/LanguageContext'

function InfoRow({ icon, label, value }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-green-50 last:border-0">
      <span className="text-base w-6 text-center flex-shrink-0 mt-0.5">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-gray-800 font-semibold mt-0.5 text-sm break-words">{value}</p>
      </div>
    </div>
  )
}

function TaxonomyRow({ label, value }) {
  if (!value) return null
  return (
    <tr className="border-b border-green-100 last:border-0">
      <td className="py-2.5 px-4 text-xs text-gray-500 font-semibold uppercase tracking-wide bg-green-50/60 w-28">{label}</td>
      <td className="py-2.5 px-4 text-sm text-gray-800 font-medium italic">{value}</td>
    </tr>
  )
}

function ImageGallery({ images, name }) {
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const imgs = (images || []).filter(Boolean)
  if (!imgs.length) return null

  return (
    <>
      <div>
        {/* Main image */}
        <div className="relative w-full overflow-hidden bg-black" style={{ aspectRatio: '16/7' }}>
          <img
            key={active}
            src={imgs[active]}
            alt={`${name} photo ${active + 1}`}
            className="w-full h-full object-cover cursor-zoom-in"
            onClick={() => setLightbox(true)}
            title="Click to enlarge"
          />

          {/* Expand hint */}
          <button
            onClick={() => setLightbox(true)}
            className="absolute top-3 left-3 bg-black/50 hover:bg-black/75 backdrop-blur-sm text-white text-xs px-2.5 py-1.5 rounded-full flex items-center gap-1.5 transition-all"
            aria-label="Enlarge image"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"/>
            </svg>
            Enlarge
          </button>

          {/* Counter */}
          {imgs.length > 1 && (
            <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
              {active + 1} / {imgs.length}
            </div>
          )}

          {/* Prev/Next arrows */}
          {imgs.length > 1 && (
            <>
              <button onClick={() => setActive(i => (i - 1 + imgs.length) % imgs.length)}
                aria-label="Previous"
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full w-9 h-9 flex items-center justify-center border border-white/20 backdrop-blur-sm transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
              </button>
              <button onClick={() => setActive(i => (i + 1) % imgs.length)}
                aria-label="Next"
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white rounded-full w-9 h-9 flex items-center justify-center border border-white/20 backdrop-blur-sm transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
              </button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {imgs.length > 1 && (
          <div className="flex gap-2 p-3 bg-gray-50 border-t border-gray-100 overflow-x-auto">
            {imgs.map((src, i) => (
              <button key={i} onClick={() => setActive(i)}
                className={`flex-shrink-0 w-16 h-11 sm:w-20 sm:h-14 rounded-lg overflow-hidden border-2 transition-all ${
                  i === active ? 'border-green-500 shadow-md' : 'border-transparent opacity-50 hover:opacity-80'
                }`}>
                <img src={src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center"
          onClick={() => setLightbox(false)}
        >
          {/* Close */}
          <button
            className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/25 rounded-full w-10 h-10 flex items-center justify-center transition-all"
            onClick={() => setLightbox(false)}
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>

          {/* Image */}
          <img
            src={imgs[active]}
            alt={`${name} photo ${active + 1}`}
            className="max-w-[95vw] max-h-[85vh] object-contain rounded-xl shadow-2xl"
            onClick={e => e.stopPropagation()}
          />

          {/* Name below image */}
          <p className="text-white/70 text-sm mt-3">{name} — photo {active + 1} of {imgs.length}</p>

          {/* Arrows in lightbox */}
          {imgs.length > 1 && (
            <>
              <button
                onClick={e => { e.stopPropagation(); setActive(i => (i - 1 + imgs.length) % imgs.length) }}
                className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/25 text-white rounded-full w-11 h-11 flex items-center justify-center transition-all"
                aria-label="Previous">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/></svg>
              </button>
              <button
                onClick={e => { e.stopPropagation(); setActive(i => (i + 1) % imgs.length) }}
                className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/25 text-white rounded-full w-11 h-11 flex items-center justify-center transition-all"
                aria-label="Next">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
              </button>
            </>
          )}

          {/* Thumbnail dots */}
          {imgs.length > 1 && (
            <div className="flex gap-2 mt-3" onClick={e => e.stopPropagation()}>
              {imgs.map((_, i) => (
                <button key={i} onClick={() => setActive(i)}
                  className={`rounded-full transition-all ${i === active ? 'bg-green-400 w-5 h-2.5' : 'bg-white/40 w-2.5 h-2.5 hover:bg-white/70'}`} />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}

export default function AnimalDetail() {
  const { id } = useParams()
  const { animals, loading } = useAnimals()
  const { tr, t, lang } = useLang()
  const animal = animals.map(a => ({ ...a, id: String(a._id || a.id) })).find(a => a.id === id)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center gap-3 text-green-700">
        <svg className="animate-spin w-7 h-7" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
        <span className="font-medium">Loading…</span>
      </div>
    )
  }

  if (!animal) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 text-gray-400 px-4">
        <div className="text-6xl">🌿</div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-600">{tr(t.detail.notFound)}</h2>
        <Link to="/animals" className="text-green-600 hover:text-green-800 font-medium">{tr(t.detail.backAnimals)}</Link>
      </div>
    )
  }

  const category = CATEGORIES.find(c => c.id === animal.category)
  const statusColor = STATUS_COLORS[animal.conservationStatus] || 'bg-gray-400 text-white'
  const allImages = (animal.images || []).filter(Boolean).length
    ? (animal.images || []).filter(Boolean)
    : animal.image ? [animal.image] : []
  const hasTaxonomy = animal.className || animal.order || animal.suborder || animal.family || animal.subfamily

  // Pick description for current language, fall back to English
  const description = (lang === 'si' && animal.descriptionSi)
    ? animal.descriptionSi
    : (lang === 'ta' && animal.descriptionTa)
    ? animal.descriptionTa
    : animal.description || ''

  const translatedCat    = tr(t.categories[animal.category]) || category?.label
  const translatedStatus = tr(t.conservation[animal.conservationStatus]) || animal.conservationStatus
  const translatedOrigin = animal.origin ? tr(t.origin[animal.origin]) : null
  const originIcon       = animal.origin === 'endemic' ? '🌿'
                         : animal.origin === 'native'  ? '🌍'
                         : animal.origin === 'exotic'  ? '✈️' : null
  const originBadgeClass = animal.origin === 'endemic' ? 'bg-emerald-500 text-white'
                         : animal.origin === 'native'  ? 'bg-teal-500 text-white'
                         : animal.origin === 'exotic'  ? 'bg-blue-500 text-white'
                         : 'bg-gray-400 text-white'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-green-900 text-green-200 py-3">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-xs sm:text-sm flex items-center gap-1.5 overflow-hidden">
          <Link to="/" className="hover:text-white transition-colors flex-shrink-0">{tr(t.misc.home)}</Link>
          <span>/</span>
          <Link to="/animals" className="hover:text-white transition-colors flex-shrink-0">{tr(t.misc.animals)}</Link>
          <span>/</span>
          <span className="text-white font-medium truncate">{animal.name}</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden border border-green-100">

          {allImages.length > 0 ? (
            <div>
              <ImageGallery images={allImages} name={animal.name} />
              {/* Name + badges — below gallery, never overlapping thumbnails */}
              <div className="bg-gradient-to-r from-green-900 to-green-700 px-5 sm:px-8 py-5">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="bg-white/20 backdrop-blur text-white text-xs px-2.5 py-1 rounded-full border border-white/30">
                    {category?.icon} {translatedCat}
                  </span>
                  {animal.conservationStatus && (
                    <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${statusColor}`}>
                      {translatedStatus}
                    </span>
                  )}
                  {translatedOrigin && (
                    <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${originBadgeClass}`}>
                      {originIcon} {translatedOrigin}
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white leading-tight">{animal.name}</h1>
                <p className="text-green-300 italic text-sm sm:text-base mt-1">{animal.scientificName}</p>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-green-800 to-green-600 p-8 text-white">
              <div className="text-7xl mb-3">{category?.icon}</div>
              <div className="flex flex-wrap gap-2 mb-2">
                <span className="bg-white/20 text-white text-xs px-2.5 py-1 rounded-full">{translatedCat}</span>
                {animal.conservationStatus && (
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${statusColor}`}>{translatedStatus}</span>
                )}
                {translatedOrigin && (
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${originBadgeClass}`}>
                    {originIcon} {translatedOrigin}
                  </span>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold">{animal.name}</h1>
              <p className="italic text-green-200 mt-1">{animal.scientificName}</p>
            </div>
          )}

          <div className="p-5 sm:p-8 lg:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">

              {/* Left: About + stats + taxonomy */}
              <div className="lg:col-span-2 order-2 lg:order-1 flex flex-col gap-7">
                {description && (
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-green-900 mb-3 flex items-center gap-2">
                      <span>📖</span> {tr(t.detail.about)}
                    </h2>
                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{description}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* Weight – male/female or average fallback */}
                  {(animal.maleWeight || animal.averageWeight) && (
                    <div className="bg-green-50 rounded-xl p-3 text-center border border-green-100">
                      <div className="text-xl mb-1">⚖️</div>
                      <div className="text-xs text-gray-400 font-medium uppercase tracking-wide">{tr(t.detail.avgWeight)}</div>
                      {animal.maleWeight ? (
                        <div className="mt-1 space-y-0.5">
                          <div className="text-xs font-bold text-blue-700">♂ {animal.maleWeight}</div>
                          {animal.femaleWeight && <div className="text-xs font-bold text-pink-600">♀ {animal.femaleWeight}</div>}
                        </div>
                      ) : (
                        <div className="text-xs sm:text-sm font-bold text-green-900 mt-0.5">{animal.averageWeight}</div>
                      )}
                    </div>
                  )}

                  {/* Height – male/female or average fallback */}
                  {(animal.maleHeight || animal.averageHeight) && (
                    <div className="bg-green-50 rounded-xl p-3 text-center border border-green-100">
                      <div className="text-xl mb-1">📏</div>
                      <div className="text-xs text-gray-400 font-medium uppercase tracking-wide">{tr(t.detail.avgHeight)}</div>
                      {animal.maleHeight ? (
                        <div className="mt-1 space-y-0.5">
                          <div className="text-xs font-bold text-blue-700">♂ {animal.maleHeight}</div>
                          {animal.femaleHeight && <div className="text-xs font-bold text-pink-600">♀ {animal.femaleHeight}</div>}
                        </div>
                      ) : (
                        <div className="text-xs sm:text-sm font-bold text-green-900 mt-0.5">{animal.averageHeight}</div>
                      )}
                    </div>
                  )}

                  {animal.birthArea && (
                    <div className="bg-green-50 rounded-xl p-3 text-center border border-green-100">
                      <div className="text-xl mb-1">🌍</div>
                      <div className="text-xs text-gray-400 font-medium uppercase tracking-wide">{tr(t.detail.habitat)}</div>
                      <div className="text-xs sm:text-sm font-bold text-green-900 mt-0.5 break-words">{animal.birthArea}</div>
                    </div>
                  )}

                  {(animal.food) && (
                    <div className="bg-green-50 rounded-xl p-3 text-center border border-green-100">
                      <div className="text-xl mb-1">🍽️</div>
                      <div className="text-xs text-gray-400 font-medium uppercase tracking-wide">{tr(t.detail.diet)}</div>
                      <div className="text-xs sm:text-sm font-bold text-green-900 mt-0.5 break-words">
                        {animal.food?.split('–')[0]?.trim() || animal.food}
                      </div>
                    </div>
                  )}
                </div>

                {hasTaxonomy && (
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-green-900 mb-3 flex items-center gap-2">
                      <span>🔬</span> {tr(t.detail.taxonomy)}
                    </h2>
                    <div className="rounded-xl border border-green-100 overflow-hidden">
                      <table className="w-full text-left">
                        <tbody>
                          <TaxonomyRow label={tr(t.detail.classLabel)} value={animal.className} />
                          <TaxonomyRow label={tr(t.detail.orderLabel)} value={animal.order} />
                          <TaxonomyRow label={tr(t.detail.suborder)}   value={animal.suborder} />
                          <TaxonomyRow label={tr(t.detail.family)}     value={animal.family} />
                          <TaxonomyRow label={tr(t.detail.subfamily)}  value={animal.subfamily} />
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

              {/* Right: Details card */}
              <div className="order-1 lg:order-2 h-fit">
                <div className="bg-green-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-green-100">
                  <h2 className="text-base font-bold text-green-900 mb-2">{tr(t.detail.detailsCard)}</h2>
                  <InfoRow icon="🏷️" label={tr(t.detail.commonName)}   value={animal.name} />
                  <InfoRow icon="🔬" label={tr(t.detail.sciName)}      value={animal.scientificName} />
                  <InfoRow icon="📂" label={tr(t.detail.category)}     value={translatedCat} />
                  {/* Weight rows */}
                  {animal.maleWeight
                    ? <>
                        <InfoRow icon="♂" label={tr(t.detail.maleWeight)}   value={animal.maleWeight} />
                        {animal.femaleWeight && <InfoRow icon="♀" label={tr(t.detail.femaleWeight)} value={animal.femaleWeight} />}
                      </>
                    : <InfoRow icon="⚖️" label={tr(t.detail.avgWeight)} value={animal.averageWeight} />
                  }
                  {/* Height rows */}
                  {animal.maleHeight
                    ? <>
                        <InfoRow icon="♂" label={tr(t.detail.maleHeight)}   value={animal.maleHeight} />
                        {animal.femaleHeight && <InfoRow icon="♀" label={tr(t.detail.femaleHeight)} value={animal.femaleHeight} />}
                      </>
                    : <InfoRow icon="📏" label={tr(t.detail.avgHeight)} value={animal.averageHeight} />
                  }
                  <InfoRow icon="🗺️" label={tr(t.detail.habitat)}      value={animal.birthArea} />
                  <InfoRow icon="🍃" label={tr(t.detail.diet)}         value={animal.food} />
                  <InfoRow icon="🛡️" label={tr(t.detail.conservation)} value={translatedStatus} />
                  {translatedOrigin && (
                    <InfoRow icon={originIcon} label={tr(t.originLabel)} value={translatedOrigin} />
                  )}
                </div>
              </div>
            </div>

            {/* Actions — Back to Animals only */}
            <div className="mt-8 pt-5 border-t border-gray-100">
              <Link to="/animals"
                className="inline-flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold px-5 py-3 rounded-xl transition-all text-sm">
                {tr(t.detail.backAnimals)}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
