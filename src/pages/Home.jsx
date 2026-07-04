import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES } from '../data/animals'
import { useAnimals } from '../context/AnimalContext'
import { useLang } from '../context/LanguageContext'
import WorldMap from '../components/WorldMap'
import { useReadonly } from '../hooks/useReadonly'

const SLIDES = [
  {
    image: 'https://wallpaperaccess.com/full/5480971.jpg',
  },
  {
    image: 'https://wallpaperaccess.com/full/654151.jpg',
  },
  {
    image: 'https://wallpaperaccess.com/full/5481160.jpg',
  },
  {
    image: 'https://images.unsplash.com/photo-1611689342806-0863700ce1e4?w=1600&q=80',
  },
  {
    image: 'https://wallpaperaccess.com/full/5481162.jpg',
  },
  {
    image: 'https://wallpaperaccess.com/full/5481186.jpg',
  },
  {
    image: 'https://wallpaperaccess.com/full/5482065.jpg',
  },
]

function HeroSlideshow() {
  const [current, setCurrent] = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setCurrent(c => (c + 1) % SLIDES.length)
        setFading(false)
      }, 600)
    }, 4500)
    return () => clearInterval(timer)
  }, [])

  function goTo(i) {
    if (i === current) return
    setFading(true)
    setTimeout(() => {
      setCurrent(i)
      setFading(false)
    }, 400)
  }

  const slide = SLIDES[current]

  return (
    <>
      {/* Slide images — preload all, show active */}
      {SLIDES.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
          style={{
            backgroundImage: `url('${s.image}')`,
            opacity: i === current ? (fading ? 0 : 1) : 0,
          }}
        />
      ))}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

      {/* Slide label bottom-right */}
      <div
        className="absolute bottom-16 right-6 sm:right-10 text-right transition-opacity duration-500"
        style={{ opacity: fading ? 0 : 1 }}
      >
        <p className="text-white font-bold text-sm sm:text-base drop-shadow">{slide.label}</p>
        <p className="text-green-300 text-xs sm:text-sm italic">{slide.sub}</p>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === current
                ? 'bg-green-400 w-6 h-2.5'
                : 'bg-white/50 hover:bg-white/80 w-2.5 h-2.5'
            }`}
          />
        ))}
      </div>

      {/* Prev / Next arrows */}
      <button
        onClick={() => goTo((current - 1 + SLIDES.length) % SLIDES.length)}
        aria-label="Previous slide"
        className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 backdrop-blur-sm text-white rounded-full w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center transition-all border border-white/20"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => goTo((current + 1) % SLIDES.length)}
        aria-label="Next slide"
        className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 backdrop-blur-sm text-white rounded-full w-9 h-9 sm:w-11 sm:h-11 flex items-center justify-center transition-all border border-white/20"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </>
  )
}

function StatCard({ icon, value, label }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 text-center border border-white/20">
      <div className="text-3xl sm:text-4xl mb-1 sm:mb-2">{icon}</div>
      <div className="text-2xl sm:text-3xl font-bold text-white">{value}</div>
      <div className="text-green-200 text-xs sm:text-sm mt-1">{label}</div>
    </div>
  )
}

export default function Home() {
  const { animals } = useAnimals()
  const { tr, t } = useLang()
  const readonly = useReadonly()

  const categoryCounts = CATEGORIES.map(cat => ({
    ...cat,
    label: tr(t.categories[cat.id]) || cat.label,
    description: cat.description,
    count: animals.filter(a => a.category === cat.id).length,
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section — full-area image slideshow */}
      <section className="relative text-white overflow-hidden" style={{ minHeight: '92vh' }}>

        <HeroSlideshow />

        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center" style={{ minHeight: '92vh' }}>
          <div className="max-w-2xl py-20 sm:py-28">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-green-200 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-5 sm:mb-7 border border-white/20">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              {tr(t.home.heroTag)}
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-5 sm:mb-7 drop-shadow-lg">
              {tr(t.home.heroTitle1)}
              <span className="block text-green-300">{tr(t.home.heroTitle2)}</span>
            </h1>
            <p className="text-white/85 text-sm sm:text-xl leading-relaxed mb-8 sm:mb-10 max-w-lg drop-shadow">
              {tr(t.home.heroDesc)}
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <Link to="/animals"
                className="text-center bg-green-400 hover:bg-green-300 text-green-950 font-bold px-7 sm:px-9 py-3.5 rounded-xl transition-all duration-200 shadow-xl hover:-translate-y-0.5 text-sm sm:text-base">
                {tr(t.home.browseBtn)}
              </Link>
              {!readonly && (
                <Link to="/add"
                  className="text-center bg-white/15 hover:bg-white/25 border border-white/40 backdrop-blur-sm text-white font-semibold px-7 sm:px-9 py-3.5 rounded-xl transition-all duration-200 text-sm sm:text-base">
                  {tr(t.home.addBtn)}
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 60L1440 60L1440 0C1440 0 1080 60 720 60C360 60 0 0 0 0L0 60Z" fill="#f9fafb"/>
          </svg>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-gradient-to-r from-green-800 to-green-700 -mt-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <StatCard icon="🐾" value={animals.length} label={tr(t.home.statAnimals)} />
            <StatCard icon="📂" value={CATEGORIES.length} label={tr(t.home.statCats)} />
            <StatCard icon="🌏" value="6" label={tr(t.home.statConts)} />
            <StatCard icon="🔬" value="100%" label={tr(t.home.statSci)} />
          </div>
        </div>
      </section>

      {/* Browse by Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="text-center mb-7 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-green-900">{tr(t.home.browseTitle)}</h2>
          <p className="text-gray-500 mt-2 text-sm sm:text-base">{tr(t.home.browseSub)}</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categoryCounts.map(cat => (
            <Link key={cat.id} to={`/animals?category=${cat.id}`}
              className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-green-100 hover:-translate-y-1">
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 sm:p-6 text-center">
                <span className="text-4xl sm:text-5xl">{cat.icon}</span>
              </div>
              <div className="p-3 sm:p-5">
                <h3 className="text-sm sm:text-base font-bold text-green-900 group-hover:text-green-600 transition-colors">{cat.label}</h3>
                <div className="mt-2 sm:mt-3 flex items-center justify-between">
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                    {cat.count} {tr(t.home.species)}
                  </span>
                  <span className="text-green-500 text-xs sm:text-sm group-hover:translate-x-1 transition-transform inline-block">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* World Map — Wildlife Habitats */}
      <section className="bg-green-50 py-10 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start sm:items-center justify-between mb-7 sm:mb-10 gap-3">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-green-900">{tr(t.home.mapTitle)}</h2>
              <p className="text-gray-500 mt-1 text-sm sm:text-base">{tr(t.home.mapSub)}</p>
            </div>
            <Link to="/animals" className="text-green-600 hover:text-green-800 font-semibold text-sm transition-colors flex-shrink-0">
              {tr(t.home.viewAll)}
            </Link>
          </div>
          <WorldMap animals={animals} />
          {/* Animal pins list below map on mobile */}
          <div className="mt-5 flex flex-wrap gap-2 justify-center">
            {animals.filter(a => a.mapX != null).map(a => (
              <Link key={a.id} to={`/animals/${a.id}`}
                className="flex items-center gap-2 bg-white border border-green-100 rounded-full px-3 py-1.5 shadow-sm hover:shadow-md hover:border-green-400 transition-all group">
                <img src={a.images?.[0] || a.image} alt={a.name}
                  className="w-7 h-7 rounded-full object-cover border-2 border-green-200 group-hover:border-green-500 transition-colors flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-green-900 leading-tight truncate">{a.name}</p>
                  <p className="text-xs text-gray-400 truncate">📍 {a.birthArea}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — hidden in readonly/public mode */}
      {!readonly && (
        <section className="py-10 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-green-800 to-green-600 rounded-2xl sm:rounded-3xl p-8 sm:p-10 text-center text-white shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 opacity-10 text-[120px] sm:text-[200px] leading-none flex items-center justify-center pointer-events-none select-none">🌿</div>
              <div className="relative">
                <h2 className="text-2xl sm:text-3xl font-extrabold mb-2 sm:mb-3">{tr(t.home.ctaTitle)}</h2>
                <p className="text-green-200 text-sm sm:text-lg mb-6 sm:mb-8 max-w-lg mx-auto">{tr(t.home.ctaDesc)}</p>
                <Link to="/add"
                  className="inline-block bg-white text-green-800 font-bold px-8 sm:px-10 py-3 rounded-xl hover:bg-green-50 transition-all shadow-lg hover:-translate-y-0.5">
                  {tr(t.home.ctaBtn)}
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <footer className="bg-green-950 text-green-400 text-center py-5 sm:py-6 text-xs sm:text-sm px-4">
        <p>{tr(t.home.footerText)}</p>
      </footer>
    </div>
  )
}
