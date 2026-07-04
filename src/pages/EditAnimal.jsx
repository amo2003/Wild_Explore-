import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAnimals } from '../context/AnimalContext'
import { CATEGORIES } from '../data/animals'
import { useLang } from '../context/LanguageContext'

const CONSERVATION_STATUSES = [
  'Least Concern', 'Near Threatened', 'Vulnerable',
  'Endangered', 'Critically Endangered', 'Extinct in the Wild', 'Extinct',
]

const inputClass = 'w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent bg-white text-gray-800 transition-all text-sm'

function Field({ label, required, hint, error, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs sm:text-sm font-semibold text-green-900">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

function SectionHeader({ title }) {
  return <h2 className="text-base sm:text-lg font-bold text-green-900 mb-5 pb-2 border-b border-green-50">{title}</h2>
}

export default function EditAnimal() {
  const { id } = useParams()
  const { animals, updateAnimal, deleteAnimal } = useAnimals()
  const navigate = useNavigate()
  const { tr, t } = useLang()
  const animal = animals.map(a => ({ ...a, id: String(a._id || a.id) })).find(a => a.id === id)
  const [form, setForm] = useState(null)
  const [errors, setErrors] = useState({})
  const [saved, setSaved] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    if (!animal) return
    setForm({
      name: animal.name || '',
      scientificName: animal.scientificName || '',
      category: animal.category || '',
      conservationStatus: animal.conservationStatus || '',
      origin: animal.origin || '',
      className: animal.className || '',
      order: animal.order || '',
      suborder: animal.suborder || '',
      family: animal.family || '',
      subfamily: animal.subfamily || '',
      averageWeight: animal.averageWeight || '',
      averageHeight: animal.averageHeight || '',
      maleWeight:    animal.maleWeight    || '',
      femaleWeight:  animal.femaleWeight  || '',
      maleHeight:    animal.maleHeight    || '',
      femaleHeight:  animal.femaleHeight  || '',
      birthArea: animal.birthArea || '',
      food: animal.food || '',
      description: animal.description || '',
      images: animal.images?.length
        ? [...animal.images, '', ''].slice(0, 3)
        : [animal.image || '', '', ''],
    })
  }, [animal])

  if (!animal) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 text-gray-400 px-4">
        <div className="text-6xl">🌿</div>
        <h2 className="text-xl font-bold text-gray-600">{tr(t.detail.notFound)}</h2>
        <Link to="/animals" className="text-green-600 hover:text-green-800 font-medium">{tr(t.form.backAnimals)}</Link>
      </div>
    )
  }
  if (!form) return null

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  function handleImageChange(index, value) {
    setForm(prev => {
      const images = [...prev.images]
      images[index] = value
      return { ...prev, images }
    })
  }

  function validate() {
    const required = ['name', 'scientificName', 'category', 'maleWeight', 'maleHeight', 'birthArea', 'food']
    const errs = {}
    required.forEach(f => { if (!form[f].trim()) errs[f] = tr(t.form.required) })
    return errs
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    const cleanImages = form.images.filter(u => u.trim())
    updateAnimal(id, {
      ...form,
      images: cleanImages,
      image: cleanImages[0] || '',
      averageWeight: form.maleWeight || form.femaleWeight || '',
      averageHeight: form.maleHeight || form.femaleHeight || '',
    })
    setSaved(true)
    setTimeout(() => navigate(`/animals/${id}`), 1200)
  }

  const taxFields = [
    { name: 'className', labelKey: 'classLabel', ph: 'e.g. Mammalia' },
    { name: 'order',     labelKey: 'orderLabel', ph: 'e.g. Artiodactyla' },
    { name: 'suborder',  labelKey: 'suborder',   ph: 'e.g. Suina' },
    { name: 'family',    labelKey: 'family',     ph: 'e.g. Hippopotamidae' },
    { name: 'subfamily', labelKey: 'subfamily',  ph: 'e.g. Hippopotaminae' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-green-900 to-green-700 text-white py-8 sm:py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to={`/animals/${id}`} className="text-green-300 hover:text-white text-xs sm:text-sm transition-colors mb-3 inline-block">
            ← {animal.name}
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold">{tr(t.form.editTitle)}</h1>
          <p className="text-green-200 mt-1 text-sm">{tr(t.form.editSub)} <span className="font-semibold">{animal.name}</span></p>
        </div>
      </div>

      {saved && (
        <div className="bg-green-600 text-white text-center py-3 text-sm font-semibold animate-pulse">
          {tr(t.form.savedMsg)}
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

          <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-5 sm:p-7">
            <SectionHeader title={tr(t.form.sec1)} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label={tr(t.form.commonName)} required error={errors.name}>
                <input type="text" name="name" value={form.name} onChange={handleChange}
                  className={`${inputClass} ${errors.name ? 'border-red-400' : ''}`} />
              </Field>
              <Field label={tr(t.form.sciName)} required error={errors.scientificName}>
                <input type="text" name="scientificName" value={form.scientificName} onChange={handleChange}
                  className={`${inputClass} ${errors.scientificName ? 'border-red-400' : ''}`} />
              </Field>
              <Field label={tr(t.form.category)} required error={errors.category}>
                <select name="category" value={form.category} onChange={handleChange}
                  className={`${inputClass} ${errors.category ? 'border-red-400' : ''}`}>
                  <option value="">{tr(t.form.selectCat)}</option>
                  {CATEGORIES.map(c => (
                    <option key={c.id} value={c.id}>{c.icon} {tr(t.categories[c.id])}</option>
                  ))}
                </select>
              </Field>
              <Field label={tr(t.form.conservation)}>
                <select name="conservationStatus" value={form.conservationStatus} onChange={handleChange} className={inputClass}>
                  <option value="">{tr(t.form.selectStatus)}</option>
                  {CONSERVATION_STATUSES.map(s => (
                    <option key={s} value={s}>{tr(t.conservation[s])}</option>
                  ))}
                </select>
              </Field>

              <Field label={tr(t.form.originLabel)}>
                <select name="origin" value={form.origin} onChange={handleChange} className={inputClass}>
                  <option value="">{tr(t.form.selectOrigin)}</option>
                  <option value="ekadeshiya">🏡 {tr(t.form.ekadeshiya)}</option>
                  <option value="videshiya">✈️ {tr(t.form.videshiya)}</option>
                </select>
              </Field>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-5 sm:p-7">
            <SectionHeader title={tr(t.form.sec2)} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {taxFields.map(f => (
                <Field key={f.name} label={tr(t.form[f.labelKey])}>
                  <input type="text" name={f.name} value={form[f.name]} onChange={handleChange}
                    placeholder={f.ph} className={inputClass} />
                </Field>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-5 sm:p-7">
            <SectionHeader title={tr(t.form.sec3)} />

            {/* Weight */}
            <div className="mb-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">⚖️ {tr(t.form.avgWeight)}</p>
              <div className="grid grid-cols-2 gap-3">
                <Field label={<span>♂ {tr(t.form.maleWeight)}</span>} error={errors.maleWeight}>
                  <input type="text" name="maleWeight" value={form.maleWeight} onChange={handleChange}
                    placeholder="e.g. 180–220 kg"
                    className={`${inputClass} ${errors.maleWeight ? 'border-red-400' : ''}`} />
                </Field>
                <Field label={<span>♀ {tr(t.form.femaleWeight)}</span>}>
                  <input type="text" name="femaleWeight" value={form.femaleWeight} onChange={handleChange}
                    placeholder="e.g. 120–150 kg" className={inputClass} />
                </Field>
              </div>
            </div>

            {/* Height */}
            <div className="mb-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">📏 {tr(t.form.avgHeight)}</p>
              <div className="grid grid-cols-2 gap-3">
                <Field label={<span>♂ {tr(t.form.maleHeight)}</span>} error={errors.maleHeight}>
                  <input type="text" name="maleHeight" value={form.maleHeight} onChange={handleChange}
                    placeholder="e.g. 1.2 m"
                    className={`${inputClass} ${errors.maleHeight ? 'border-red-400' : ''}`} />
                </Field>
                <Field label={<span>♀ {tr(t.form.femaleHeight)}</span>}>
                  <input type="text" name="femaleHeight" value={form.femaleHeight} onChange={handleChange}
                    placeholder="e.g. 1.0 m" className={inputClass} />
                </Field>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Field label={tr(t.form.birthArea)} required error={errors.birthArea}>
                  <input type="text" name="birthArea" value={form.birthArea} onChange={handleChange}
                    className={`${inputClass} ${errors.birthArea ? 'border-red-400' : ''}`} />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label={tr(t.form.food)} required error={errors.food}>
                  <input type="text" name="food" value={form.food} onChange={handleChange}
                    className={`${inputClass} ${errors.food ? 'border-red-400' : ''}`} />
                </Field>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-5 sm:p-7">
            <SectionHeader title={tr(t.form.sec4)} />
            <p className="text-xs text-gray-400 mb-4">{tr(t.form.imagesHint)}</p>
            <div className="flex flex-col gap-4">
              {form.images.map((url, i) => (
                <div key={i}>
                  <label className="text-xs sm:text-sm font-semibold text-green-900 mb-1 block">
                    {i === 0 ? tr(t.form.mainImg) : `${tr(t.form.imageN)} ${i + 1} URL`}
                  </label>
                  <input type="url" value={url} onChange={e => handleImageChange(i, e.target.value)}
                    placeholder="https://example.com/animal.jpg" className={inputClass} />
                  {url && (
                    <div className="mt-2 h-28 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                      <img src={url} alt="" className="w-full h-full object-cover"
                        onError={e => { e.target.style.display = 'none' }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-5 sm:p-7">
            <SectionHeader title={tr(t.form.sec5)} />
            <textarea name="description" value={form.description} onChange={handleChange} rows={4}
              className={`${inputClass} resize-none`} placeholder="..." />
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button type="submit"
              className="flex-1 bg-green-700 hover:bg-green-800 text-white font-bold py-3.5 rounded-xl transition-all text-sm sm:text-base">
              {tr(t.form.saveChanges)}
            </button>
            <Link to={`/animals/${id}`}
              className="sm:w-32 text-center border border-gray-300 text-gray-600 hover:bg-gray-50 font-semibold py-3.5 rounded-xl transition-all text-sm">
              {tr(t.form.cancel)}
            </Link>
          </div>

          {/* ── Danger Zone ── */}
          <div className="rounded-2xl border-2 border-red-100 bg-red-50 p-5 sm:p-6">
            <h3 className="text-sm font-bold text-red-700 flex items-center gap-2 mb-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              </svg>
              {tr(t.form.dangerZone)}
            </h3>
            <p className="text-xs text-red-500 mb-4">{tr(t.form.deleteWarning)}</p>

            {!confirmDelete ? (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="flex items-center gap-2 bg-white border-2 border-red-300 text-red-600 hover:bg-red-600 hover:text-white font-semibold px-5 py-2.5 rounded-xl transition-all text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
                {tr(t.form.deleteAnimal)}
              </button>
            ) : (
              <div className="bg-white border-2 border-red-300 rounded-xl p-4">
                <p className="text-sm font-semibold text-red-700 mb-3">
                  🗑️ {tr(t.form.deleteConfirm)} <span className="text-red-900">"{animal.name}"</span>?
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      deleteAnimal(id)
                      navigate('/animals')
                    }}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl transition-all text-sm"
                  >
                    {tr(t.form.confirmYes)}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="flex-1 border border-gray-300 text-gray-600 hover:bg-gray-50 font-semibold py-2.5 rounded-xl transition-all text-sm"
                  >
                    {tr(t.form.confirmNo)}
                  </button>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
