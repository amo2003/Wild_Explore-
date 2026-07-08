import { Link } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'

const STATS = [
  { icon: '🌍', labelKey: 'statsConts', value: '6' },
  { icon: '📂', labelKey: 'statsCats',  value: '6+' },
  { icon: '🔬', labelKey: 'statsSci',   value: '10+' },
  { icon: '🌐', labelKey: 'statsLangs', value: '3' },
]

export default function About() {
  const { tr, t } = useLang()
  const a = t.about

  const VALUES = [
    { icon: '🎯', title: tr(a.val1Title), desc: tr(a.val1Desc) },
    { icon: '🌿', title: tr(a.val2Title), desc: tr(a.val2Desc) },
    { icon: '🤝', title: tr(a.val3Title), desc: tr(a.val3Desc) },
    { icon: '🌐', title: tr(a.val4Title), desc: tr(a.val4Desc) },
  ]

  const TEAM = [
    { avatar: '🧑‍💻', name: tr(a.team1Name), role: tr(a.team1Role), bio: tr(a.team1Bio) },
    { avatar: '🔬',   name: tr(a.team2Name), role: tr(a.team2Role), bio: tr(a.team2Bio) },
    { avatar: '🌿',   name: tr(a.team3Name), role: tr(a.team3Role), bio: tr(a.team3Bio) },
  ]

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-green-950 via-green-800 to-green-600 text-white py-20 sm:py-28 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-400/10 rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-300/10 rounded-full translate-y-1/2 -translate-x-1/3 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-green-200 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/20">
            🌿 {tr(a.tag)}
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold mb-6 leading-tight">
            {tr(a.title)}
          </h1>
          <p className="text-green-100 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto">
            {tr(a.subtitle)}
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" fill="none" className="w-full">
            <path d="M0 50L1440 50L1440 0C1080 50 360 50 0 0Z" fill="#f9fafb"/>
          </svg>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-extrabold text-green-900 mb-4">{tr(a.missionTitle)}</h2>
            <p className="text-gray-600 leading-relaxed mb-4">{tr(a.mission1)}</p>
            <p className="text-gray-600 leading-relaxed mb-6">{tr(a.mission2)}</p>
            <Link to="/animals"
              className="inline-flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold px-6 py-3 rounded-xl transition-all text-sm">
              {tr(a.exploreBtn)}
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {STATS.map(s => (
              <div key={s.labelKey} className="bg-white rounded-2xl p-6 text-center shadow-sm border border-green-100">
                <div className="text-4xl mb-2">{s.icon}</div>
                <div className="text-2xl font-extrabold text-green-800">{s.value}</div>
                <div className="text-sm text-gray-500 mt-1">{tr(a[s.labelKey])}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-green-50 py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-green-900">{tr(a.valuesTitle)}</h2>
            <p className="text-gray-500 mt-2">{tr(a.valuesSub)}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {VALUES.map(v => (
              <div key={v.title} className="bg-white rounded-2xl p-6 shadow-sm border border-green-100 flex gap-4">
                <span className="text-3xl flex-shrink-0">{v.icon}</span>
                <div>
                  <h3 className="font-bold text-green-900 text-lg mb-1">{v.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-green-900">{tr(a.teamTitle)}</h2>
          <p className="text-gray-500 mt-2">{tr(a.teamSub)}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {TEAM.map(m => (
            <div key={m.name} className="bg-white rounded-2xl p-6 text-center shadow-sm border border-green-100">
              <div className="text-5xl mb-3">{m.avatar}</div>
              <h3 className="font-bold text-green-900 text-lg">{m.name}</h3>
              <p className="text-green-600 text-xs font-semibold uppercase tracking-wide mt-1 mb-3">{m.role}</p>
              <p className="text-gray-500 text-sm leading-relaxed">{m.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-gradient-to-r from-green-800 to-green-600 py-14 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-3">{tr(a.ctaTitle)}</h2>
          <p className="text-green-200 text-sm sm:text-base mb-6">{tr(a.ctaDesc)}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/animals" className="bg-white text-green-800 font-bold px-7 py-3 rounded-xl hover:bg-green-50 transition-all shadow-md text-sm">
              {tr(a.browseBtn)}
            </Link>
            <Link to="/contact" className="border border-white/40 backdrop-blur-sm text-white font-semibold px-7 py-3 rounded-xl hover:bg-white/10 transition-all text-sm">
              {tr(a.contactBtn)}
            </Link>
          </div>
        </div>
      </section>

      <footer className="bg-green-950 text-green-400 text-center py-5 text-xs sm:text-sm px-4">
        <p>{tr(t.home.footerText)}</p>
      </footer>
    </div>
  )
}
