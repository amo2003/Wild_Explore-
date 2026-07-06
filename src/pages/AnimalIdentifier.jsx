import { useState, useRef } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { CATEGORIES, STATUS_COLORS } from '../data/animals'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// ── Run MobileNet via tf.loadLayersModel (local files) ───────────────────────
async function runMobileNet(imgElement, onStatus) {
  onStatus('Loading TensorFlow.js…')
  let tf
  try {
    tf = await import('@tensorflow/tfjs')
  } catch (e) {
    throw new Error(`TensorFlow failed to load: ${e.message}`)
  }
  try {
    await tf.ready()
  } catch (e) {
    throw new Error(`TensorFlow backend failed to init: ${e.message}`)
  }

  onStatus('Loading MobileNet model from local files…')
  let model
  try {
    model = await tf.loadLayersModel('/mobilenet/model.json')
  } catch (e) {
    throw new Error(`Model failed to load: ${e.message}`)
  }

  onStatus('Analysing your image…')
  // Pre-process: resize to 224×224, normalise to [-1, 1]
  const tensor = tf.tidy(() => {
    return tf.image
      .resizeBilinear(tf.browser.fromPixels(imgElement), [224, 224])
      .toFloat()
      .div(127.5)
      .sub(1)
      .expandDims(0)
  })

  let predictions
  try {
    const output = model.predict(tensor)
    const scores = await output.data()
    tensor.dispose()
    output.dispose()

    // Get ImageNet class names
    let classes
    try {
      const { IMAGENET_CLASSES } = await import('@tensorflow-models/mobilenet/dist/imagenet_classes')
      classes = IMAGENET_CLASSES
    } catch (_) {
      classes = null
    }

    // Top-3 predictions
    const indexed = Array.from(scores).map((prob, i) => ({ prob, i }))
    indexed.sort((a, b) => b.prob - a.prob)
    const top3 = indexed.slice(0, 3)

    predictions = top3.map(({ prob, i }) => ({
      className: classes ? (classes[i] || `class_${i}`) : `class_${i}`,
      probability: prob,
    }))
  } catch (e) {
    tensor.dispose()
    throw new Error(`Inference failed: ${e.message}`)
  }

  return predictions
}

// ── Confidence bar colour ────────────────────────────────────────────────────
function confColour(pct) {
  if (pct >= 70) return 'bg-green-500'
  if (pct >= 40) return 'bg-yellow-400'
  return 'bg-red-400'
}

// ── Animal result card (same style as AnimalDetail sidebar) ──────────────────
function ResultCard({ animal }) {
  const category = CATEGORIES.find(c => c.id === animal.category)
  const statusColor = STATUS_COLORS[animal.conservationStatus] || 'bg-gray-400 text-white'
  const imgs = (animal.images || []).filter(Boolean)
  const id = String(animal._id || animal.id)

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden">
      {/* Header image */}
      {imgs.length > 0 && (
        <img src={imgs[0]} alt={animal.name} className="w-full h-52 object-cover" />
      )}

      <div className="p-5">
        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          {category && (
            <span className="text-xs bg-green-100 text-green-800 px-2.5 py-1 rounded-full font-medium">
              {category.icon} {category.label}
            </span>
          )}
          {animal.conservationStatus && (
            <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${statusColor}`}>
              {animal.conservationStatus}
            </span>
          )}
          {animal.origin && (
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
              animal.origin === 'endemic' ? 'bg-emerald-100 text-emerald-700'
              : animal.origin === 'native' ? 'bg-teal-100 text-teal-700'
              : 'bg-blue-100 text-blue-700'
            }`}>
              {animal.origin === 'endemic' ? '🌿' : animal.origin === 'native' ? '🌍' : '✈️'} {animal.origin}
            </span>
          )}
        </div>

        <h2 className="text-xl font-extrabold text-green-900">{animal.name}</h2>
        <p className="text-gray-400 text-sm italic mb-3">{animal.scientificName}</p>

        {animal.description && (
          <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-4">{animal.description}</p>
        )}

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            { icon: '⚖️', label: 'Weight', value: animal.maleWeight || animal.averageWeight },
            { icon: '📏', label: 'Height', value: animal.maleHeight || animal.averageHeight },
            { icon: '🌍', label: 'Habitat', value: animal.birthArea },
            { icon: '🍽️', label: 'Diet', value: animal.food?.split('–')[0]?.trim() || animal.food },
          ].filter(s => s.value).map(s => (
            <div key={s.label} className="bg-green-50 rounded-xl p-2.5 border border-green-100">
              <span className="text-base">{s.icon}</span>
              <p className="text-xs text-gray-400 uppercase tracking-wide mt-0.5">{s.label}</p>
              <p className="text-xs font-bold text-green-900 truncate">{s.value}</p>
            </div>
          ))}
        </div>

        <Link to={`/animals/${id}`}
          className="block text-center bg-green-700 hover:bg-green-800 text-white font-semibold py-2.5 rounded-xl transition-all text-sm">
          View Full Details →
        </Link>
      </div>
    </div>
  )
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function AnimalIdentifier() {
  const [imageUrl, setImageUrl]       = useState(null)
  const [predictions, setPredictions] = useState([])
  const [topPrediction, setTop]       = useState(null)
  const [loading, setLoading]         = useState(false)
  const [modelStatus, setModelStatus] = useState('')
  const [elapsed, setElapsed]         = useState(0)
  const [dbResult, setDbResult]       = useState(null)
  const [dbLoading, setDbLoading]     = useState(false)
  const [error, setError]             = useState('')
  const imgRef  = useRef(null)
  const fileRef = useRef(null)
  const timerRef = useRef(null)

  // ── Handle file selection — normalise EXIF orientation via canvas ──────────
  function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG, WebP…)')
      return
    }
    setError('')
    setPredictions([])
    setTop(null)
    setDbResult(null)

    // Draw onto canvas so browser applies EXIF rotation — fixes mobile photos
    const raw = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width  = img.naturalWidth
      canvas.height = img.naturalHeight
      canvas.getContext('2d').drawImage(img, 0, 0)
      URL.revokeObjectURL(raw)
      setImageUrl(canvas.toDataURL('image/jpeg', 0.92))
    }
    img.src = raw
  }

  // ── Run identification ────────────────────────────────
  async function identify() {
    if (!imgRef.current) return
    setError('')
    setPredictions([])
    setTop(null)
    setDbResult(null)
    setLoading(true)
    setElapsed(0)

    // Tick elapsed seconds so user sees progress
    const start = Date.now()
    timerRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000))
    }, 1000)

    // No hard timeout — let TF/network errors surface naturally
    try {
      const preds = await runMobileNet(imgRef.current, setModelStatus)
      setPredictions(preds)

      const best = preds[0]
      setTop(best)
      setModelStatus('')

      setDbLoading(true)
      try {
        const res = await axios.get(`${API}/animals/search/${encodeURIComponent(best.className)}`)
        setDbResult(res.data)
      } catch (dbErr) {
        if (dbErr.response?.status === 404) {
          setDbResult({ found: false, message: dbErr.response.data.message })
        } else {
          setDbResult({ found: false, message: 'Database search failed.' })
        }
      } finally {
        setDbLoading(false)
      }
    } catch (err) {
      setError(err.message || 'Identification failed')
      setModelStatus('')
    } finally {
      clearInterval(timerRef.current)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-900 to-green-700 text-white py-10 sm:py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-green-200 px-4 py-2 rounded-full text-xs font-medium mb-5 border border-white/20">
            🤖 Powered by TensorFlow.js · MobileNet
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold mb-4">AI Animal Identifier</h1>
          <p className="text-green-200 text-sm sm:text-lg max-w-xl mx-auto">
            Upload a photo of any animal. Our AI will identify it and match it against the WildExplore database.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Upload card */}
        <div className="bg-white rounded-2xl shadow-md border border-green-100 overflow-hidden mb-6">
          <div className="p-6">
            <h2 className="font-bold text-green-900 text-lg mb-4">📷 Upload Animal Photo</h2>

            {/* Drop zone */}
            <div
              onClick={() => fileRef.current?.click()}
              className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                imageUrl ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-green-400 hover:bg-green-50'
              }`}
            >
              {imageUrl ? (
                <img
                  ref={imgRef}
                  src={imageUrl}
                  alt="Preview"
                  crossOrigin="anonymous"
                  className="max-h-72 mx-auto rounded-xl object-contain shadow-md"
                />
              ) : (
                <div className="text-gray-400">
                  <div className="text-5xl mb-3">🖼️</div>
                  <p className="font-medium text-gray-600">Click to upload or drag an image here</p>
                  <p className="text-xs mt-1">JPG, PNG, WebP supported</p>
                </div>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={handleFile}
                className="hidden"
              />
            </div>

            {imageUrl && (
              <button
                onClick={() => { setImageUrl(null); setPredictions([]); setTop(null); setDbResult(null); setError('') }}
                className="mt-2 text-xs text-gray-400 hover:text-red-500 transition-colors"
              >
                ✕ Remove image
              </button>
            )}
          </div>

          {/* Identify button */}
          <div className="px-6 pb-6">
            <button
              onClick={identify}
              disabled={!imageUrl || loading}
              className="w-full bg-green-700 hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-3 text-base"
            >
              {loading ? (
                <div className="flex flex-col items-center gap-1.5 py-1">
                  <div className="flex items-center gap-3">
                    <svg className="animate-spin w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                    </svg>
                    <span className="text-sm font-semibold">{modelStatus || 'Starting…'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-200 text-xs">
                    <span>⏱ {elapsed}s elapsed</span>
                    {elapsed > 5 && <span>— please wait, model is loading</span>}
                  </div>
                </div>
              ) : '🔍 Identify Animal'}
            </button>
            {error && (
              <div className="mt-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                ❌ {error}
              </div>
            )}
            {loading && (
              <div className="mt-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-xs text-blue-700 flex flex-col gap-1">
                <p className="font-semibold">🧠 AI is working — model loads from local files, should be fast</p>
                <p className="text-blue-500">TensorFlow is initialising the MobileNet model. This takes a few seconds.</p>
              </div>
            )}
          </div>
        </div>

        {/* Predictions */}
        {predictions.length > 0 && (
          <div className="bg-white rounded-2xl shadow-md border border-green-100 p-6 mb-6">
            <h2 className="font-bold text-green-900 text-lg mb-4">🧠 AI Predictions</h2>
            <div className="flex flex-col gap-3">
              {predictions.map((p, i) => {
                const pct = Math.round(p.probability * 100)
                return (
                  <div key={i} className={`rounded-xl p-4 border ${i === 0 ? 'border-green-300 bg-green-50' : 'border-gray-100'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {i === 0 && <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full font-bold">Top Match</span>}
                        <span className={`font-semibold text-sm ${i === 0 ? 'text-green-900' : 'text-gray-700'}`}>
                          {p.className}
                        </span>
                      </div>
                      <span className={`text-sm font-bold ${i === 0 ? 'text-green-700' : 'text-gray-500'}`}>
                        {pct}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${confColour(pct)}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* DB result */}
        {dbLoading && (
          <div className="flex items-center justify-center gap-3 py-10 text-green-700">
            <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
            <span className="font-medium">Searching WildExplore database…</span>
          </div>
        )}

        {dbResult && !dbLoading && (
          dbResult.found ? (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <p className="text-sm font-semibold text-green-700">
                  Found in WildExplore database! Showing details for <span className="italic">{dbResult.animal.name}</span>
                </p>
              </div>
              <ResultCard animal={dbResult.animal} />
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
              <div className="text-4xl mb-2">🔍</div>
              <h3 className="font-bold text-amber-800 mb-1">Not in our database yet</h3>
              <p className="text-amber-700 text-sm">{dbResult.message}</p>
              <p className="text-amber-600 text-xs mt-2">
                Identified as: <span className="font-semibold">{topPrediction?.className}</span>
              </p>
            </div>
          )
        )}
      </div>
    </div>
  )
}
