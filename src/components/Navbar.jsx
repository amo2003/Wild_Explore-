import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'
import { useReadonly } from '../hooks/useReadonly'

export default function Navbar() {
  const { pathname } = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const { lang, setLang, tr, t, LANGUAGES } = useLang()
  const readonly = useReadonly()

  const links = [
    { to: '/',          label: tr(t.nav.home) },
    { to: '/animals',   label: tr(t.nav.animals) },
    { to: '/map',       label: tr(t.nav.map) },
    { to: '/compare',   label: tr(t.nav.compare) },
    { to: '/identify',  label: tr(t.nav.aiIdentify) },
    { to: '/about',     label: tr(t.nav.about) },
    { to: '/contact',   label: tr(t.nav.contact) },
    ...(!readonly ? [{ to: '/dashboard', label: tr(t.nav.dashboard) }] : []),
  ]

  const currentLang = LANGUAGES.find(l => l.code === lang)

  return (
    <nav className="bg-green-900 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group flex-shrink-0">
            <span className="text-2xl">🌿</span>
            <span className="text-xl font-bold tracking-wide text-green-100 group-hover:text-white transition-colors">
              Wild<span className="text-green-400">Explore</span>
            </span>
          </Link>

          {/* Desktop nav + language switcher */}
          <div className="hidden sm:flex items-center gap-1">
            {links.map(({ to, label }) => (
              <Link key={to} to={to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  pathname === to ? 'bg-green-600 text-white' : 'text-green-200 hover:bg-green-800 hover:text-white'
                }`}>
                {label}
              </Link>
            ))}
            <div className="relative ml-2">
              <button onClick={() => setLangOpen(o => !o)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-green-200 hover:bg-green-800 hover:text-white transition-all border border-green-700">
                <span>{currentLang?.flag}</span>
                <span className="hidden md:inline">{currentLang?.nativeLabel}</span>
                <svg className={`w-3.5 h-3.5 transition-transform ${langOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1 bg-green-950 border border-green-700 rounded-xl shadow-xl overflow-hidden z-50 min-w-[150px]">
                  {LANGUAGES.map(l => (
                    <button key={l.code} onClick={() => { setLang(l.code); setLangOpen(false) }}
                      className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${
                        lang === l.code ? 'bg-green-700 text-white font-semibold' : 'text-green-200 hover:bg-green-800 hover:text-white'
                      }`}>
                      <span className="text-base">{l.flag}</span>
                      <div className="text-left">
                        <div className="font-medium leading-tight">{l.nativeLabel}</div>
                        <div className="text-xs opacity-60">{l.label}</div>
                      </div>
                      {lang === l.code && <span className="ml-auto text-green-300">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile: lang + hamburger */}
          <div className="sm:hidden flex items-center gap-2">
            <div className="relative">
              <button onClick={() => setLangOpen(o => !o)}
                className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-bold text-green-200 hover:bg-green-800 border border-green-700">
                <span>{currentLang?.flag}</span>
                <span className="uppercase">{lang}</span>
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1 bg-green-950 border border-green-700 rounded-xl shadow-xl overflow-hidden z-50 min-w-[130px]">
                  {LANGUAGES.map(l => (
                    <button key={l.code} onClick={() => { setLang(l.code); setLangOpen(false) }}
                      className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm transition-colors ${
                        lang === l.code ? 'bg-green-700 text-white font-semibold' : 'text-green-200 hover:bg-green-800'
                      }`}>
                      <span>{l.flag}</span>
                      <span>{l.nativeLabel}</span>
                      {lang === l.code && <span className="ml-auto text-green-300 text-xs">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button className="p-2 rounded-lg text-green-200 hover:bg-green-800 hover:text-white transition-colors"
              onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
              {menuOpen
                ? <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              }
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="sm:hidden bg-green-950 border-t border-green-800 px-4 pb-4 pt-2 flex flex-col gap-1">
          {links.map(({ to, label }) => (
            <Link key={to} to={to} onClick={() => setMenuOpen(false)}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                pathname === to ? 'bg-green-700 text-white' : 'text-green-200 hover:bg-green-800 hover:text-white'
              }`}>
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
