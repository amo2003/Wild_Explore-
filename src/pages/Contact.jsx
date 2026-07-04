import { useState } from 'react'
import { Link } from 'react-router-dom'

const CONTACT_INFO = [
  { icon: '📧', label: 'Email', value: 'amodindupa@gmail.com', href: 'mailto:amodindupa@gmail.com' },
  { icon: '🐙', label: 'GitHub', value: 'github.com/amo2003/Wild_Explore-', href: 'https://github.com/amo2003/Wild_Explore-' },
  { icon: '🌍', label: 'Website', value: 'wild-explore.vercel.app', href: 'https://wild-explore.vercel.app' },
]

const TOPICS = [
  'General Inquiry',
  'Data Correction / Scientific Accuracy',
  'New Animal Suggestion',
  'Bug Report',
  'Partnership / Collaboration',
  'Other',
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', topic: '', message: '' })
  const [sent, setSent] = useState(false)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    // Opens default email client with pre-filled data
    const subject = encodeURIComponent(`[WildExplore] ${form.topic || 'Contact'} — ${form.name}`)
    const body = encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\nTopic: ${form.topic}\n\nMessage:\n${form.message}`)
    window.location.href = `mailto:amodindupa@gmail.com?subject=${subject}&body=${body}`
    setSent(true)
  }

  const inputClass = 'w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent bg-white text-gray-800 text-sm transition-all'

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-green-950 via-green-800 to-green-600 text-white py-20 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 right-10 text-[180px] opacity-5 select-none">🌿</div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-green-400/10 rounded-full translate-y-1/2 -translate-x-1/3" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-green-200 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/20">
            💬 Get in Touch
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold mb-4">
            Contact <span className="text-green-300">Us</span>
          </h1>
          <p className="text-green-100 text-lg leading-relaxed">
            Have a question, spotted an error, or want to collaborate? We'd love to hear from you.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 50" fill="none" className="w-full">
            <path d="M0 50L1440 50L1440 0C1080 50 360 50 0 0Z" fill="#f9fafb"/>
          </svg>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left — contact info */}
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="text-xl font-extrabold text-green-900 mb-1">Reach Out</h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                We typically respond within 24–48 hours. For data corrections, please include the animal name and source.
              </p>
            </div>

            {CONTACT_INFO.map(c => (
              <a key={c.label} href={c.href} target="_blank" rel="noreferrer"
                className="flex items-center gap-4 bg-white rounded-2xl p-4 border border-green-100 shadow-sm hover:shadow-md hover:border-green-300 transition-all group">
                <span className="text-2xl w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">{c.icon}</span>
                <div className="min-w-0">
                  <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{c.label}</p>
                  <p className="text-sm font-semibold text-green-800 group-hover:text-green-600 truncate transition-colors">{c.value}</p>
                </div>
              </a>
            ))}

            {/* Fun fact */}
            <div className="bg-green-50 rounded-2xl p-5 border border-green-100 mt-2">
              <p className="text-xs font-bold text-green-700 uppercase tracking-wide mb-2">🦁 Did you know?</p>
              <p className="text-sm text-gray-600 leading-relaxed">
                WildExplore covers animals from all 6 continents, with data on taxonomy, habitat, diet, and conservation status in 3 languages.
              </p>
            </div>
          </div>

          {/* Right — form */}
          <div className="lg:col-span-2">
            {sent ? (
              <div className="bg-white rounded-2xl shadow-md border border-green-100 p-10 text-center">
                <div className="text-6xl mb-4">📬</div>
                <h3 className="text-2xl font-extrabold text-green-900 mb-2">Message Ready!</h3>
                <p className="text-gray-500 text-sm mb-6">
                  Your email client opened with the message pre-filled. Just hit send!
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button onClick={() => setSent(false)}
                    className="border border-green-700 text-green-700 hover:bg-green-50 font-semibold px-6 py-3 rounded-xl transition-all text-sm">
                    Send Another
                  </button>
                  <Link to="/" className="bg-green-700 hover:bg-green-800 text-white font-semibold px-6 py-3 rounded-xl transition-all text-sm text-center">
                    Back to Home
                  </Link>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-md border border-green-100 p-6 sm:p-8">
                <h2 className="text-xl font-extrabold text-green-900 mb-6">Send a Message</h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-green-900 mb-1 block">Your Name <span className="text-red-500">*</span></label>
                      <input type="text" name="name" value={form.name} onChange={handleChange} required
                        placeholder="e.g. Amod Indupa" className={inputClass} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-green-900 mb-1 block">Email Address <span className="text-red-500">*</span></label>
                      <input type="email" name="email" value={form.email} onChange={handleChange} required
                        placeholder="you@example.com" className={inputClass} />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-green-900 mb-1 block">Topic</label>
                    <select name="topic" value={form.topic} onChange={handleChange} className={inputClass}>
                      <option value="">Select a topic</option>
                      {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-green-900 mb-1 block">Message <span className="text-red-500">*</span></label>
                    <textarea name="message" value={form.message} onChange={handleChange} required rows={5}
                      placeholder="Tell us what's on your mind…"
                      className={`${inputClass} resize-none`} />
                  </div>

                  <button type="submit"
                    className="w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-md text-sm sm:text-base flex items-center justify-center gap-2">
                    📨 Send Message
                  </button>

                  <p className="text-xs text-gray-400 text-center">
                    This will open your email client with the message pre-filled.
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer className="bg-green-950 text-green-400 text-center py-5 text-xs sm:text-sm px-4">
        <p>© 2026 WildExplore — Celebrating the diversity of wildlife on Earth 🌿</p>
      </footer>
    </div>
  )
}
