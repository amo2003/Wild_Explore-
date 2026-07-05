import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAnimals } from '../context/AnimalContext'
import { CATEGORIES } from '../data/animals'
import { useLang } from '../context/LanguageContext'

const CONSERVATION_STATUSES = [
  'Least Concern', 'Near Threatened', 'Vulnerable',
  'Endangered', 'Critically Endangered', 'Extinct in the Wild', 'Extinct',
]

const EMPTY_FORM = {
  name: '', scientificName: '', category: '', conservationStatus: '',
  origin: '',
  className: '', order: '', suborder: '', family: '', subfamily: '',
  maleWeight: '', femaleWeight: '', maleHeight: '', femaleHeight: '',
  averageWeight: '', averageHeight: '',
  birthArea: '', food: '',
  description: '', descriptionSi: '', descriptionTa: '', images: ['', '', ''],
}

const inputClass = 'w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent bg-white text-gray-800 transition-all text-sm'

function SectionHeader({ num, title }) {
  return (
    <h2 className="text-base sm:text-lg font-bold text-green-900 flex items-center gap-2 mb-5">
      <span className="bg-green-100 text-green-700 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0">{num}</span>
      {title}
    </h2>
  )
}

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

export default function AddAnimal() {
  const { addAnimal } = useAnimals()
  const { tr, t } = useLang()
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [addedName, setAddedName] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

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
    const required = ['name', 'scientificName', 'category', 'origin', 'maleWeight', 'maleHeight', 'birthArea', 'food']
    const errs = {}
    required.forEach(f => { if (!form[f].trim()) errs[f] = tr(t.form.required) })
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) {
      setErrors(errs)
      document.querySelector('[data-error="true"]')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    setSaving(true)
    setSaveError('')
    try {
      const cleanImages = form.images.filter(u => u.trim())
      await addAnimal({
        ...form,
        images: cleanImages,
        image: cleanImages[0] || '',
        averageWeight: form.maleWeight || form.femaleWeight || '',
        averageHeight: form.maleHeight || form.femaleHeight || '',
      })
      setAddedName(form.name)
      setSubmitted(true)
    } catch (err) {
      setSaveError(err.message || 'Failed to save. Check your connection.')
    } finally {
      setSaving(false)
    }
  }

  function handleReset() {
    setForm(EMPTY_FORM)
    setErrors({})
    setSubmitted(false)
    setAddedName('')
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
        <div className="bg-white rounded-3xl shadow-xl p-8 sm:p-10 text-center max-w-md w-full border border-green-100">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-green-900 mb-2">{tr(t.form.addedTitle)}</h2>
          <p className="text-gray-500 mb-8 text-sm sm:text-base">
            <span className="font-semibold text-green-700">{addedName}</span> {tr(t.form.addedMsg)}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/animals" className="bg-green-700 hover:bg-green-800 text-white font-semibold px-6 py-3 rounded-xl transition-all text-sm text-center">
              {tr(t.form.viewAnimals)}
            </Link>
            <button onClick={handleReset} className="border border-green-700 text-green-700 hover:bg-green-50 font-semibold px-6 py-3 rounded-xl transition-all text-sm">
              {tr(t.form.addAnother)}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-green-900 to-green-700 text-white py-8 sm:py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/animals" className="text-green-300 hover:text-white text-xs sm:text-sm transition-colors mb-3 inline-block">
            {tr(t.form.backAnimals)}
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold">{tr(t.form.addTitle)}</h1>
          <p className="text-green-200 mt-1 text-sm">{tr(t.form.addSub)}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

          {/* 1 – Basic */}
          <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-5 sm:p-7">
            <SectionHeader num="1" title={tr(t.form.sec1)} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label={tr(t.form.commonName)} required error={errors.name}>
                <div data-error={!!errors.name}>
                  <input type="text" name="name" value={form.name} onChange={handleChange}
                    placeholder="e.g. Hippopotamus"
                    className={`${inputClass} ${errors.name ? 'border-red-400' : ''}`} />
                </div>
              </Field>

              <Field label={tr(t.form.sciName)} required hint={tr(t.form.sciHint)} error={errors.scientificName}>
                <div data-error={!!errors.scientificName}>
                  <input type="text" name="scientificName" value={form.scientificName} onChange={handleChange}
                    placeholder="e.g. Hippopotamus amphibius"
                    className={`${inputClass} ${errors.scientificName ? 'border-red-400' : ''}`} />
                </div>
              </Field>

              <Field label={tr(t.form.category)} required error={errors.category}>
                <div data-error={!!errors.category}>
                  <select name="category" value={form.category} onChange={handleChange}
                    className={`${inputClass} ${errors.category ? 'border-red-400' : ''}`}>
                    <option value="">{tr(t.form.selectCat)}</option>
                    {CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.icon} {tr(t.categories[c.id])}</option>
                    ))}
                  </select>
                </div>
              </Field>

              <Field label={tr(t.form.conservation)}>
                <select name="conservationStatus" value={form.conservationStatus} onChange={handleChange} className={inputClass}>
                  <option value="">{tr(t.form.selectStatus)}</option>
                  {CONSERVATION_STATUSES.map(s => (
                    <option key={s} value={s}>{tr(t.conservation[s])}</option>
                  ))}
                </select>
              </Field>

              <Field label={tr(t.form.originLabel)} required error={errors.origin}>
                <div data-error={!!errors.origin}>
                  <select name="origin" value={form.origin} onChange={handleChange}
                    className={`${inputClass} ${errors.origin ? 'border-red-400' : ''}`}>
                    <option value="">{tr(t.form.selectOrigin)}</option>
                    <option value="endemic">{tr(t.form.endemic)}</option>
                    <option value="native">{tr(t.form.native)}</option>
                    <option value="exotic">{tr(t.form.exotic)}</option>
                  </select>
                </div>
              </Field>
            </div>
          </div>

          {/* 2 – Taxonomy */}
          <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-5 sm:p-7">
            <SectionHeader num="2" title={tr(t.form.sec2)} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: 'className', labelKey: 'classLabel', ph: 'e.g. Mammalia' },
                { name: 'order',     labelKey: 'orderLabel', ph: 'e.g. Artiodactyla' },
                { name: 'suborder',  labelKey: 'suborder',   ph: 'e.g. Suina' },
                { name: 'family',    labelKey: 'family',     ph: 'e.g. Hippopotamidae' },
                { name: 'subfamily', labelKey: 'subfamily',  ph: 'e.g. Hippopotaminae' },
              ].map(f => (
                <Field key={f.name} label={tr(t.form[f.labelKey])} hint={tr(t.form.optional)}>
                  <input type="text" name={f.name} value={form[f.name]} onChange={handleChange}
                    placeholder={f.ph} className={inputClass} />
                </Field>
              ))}
            </div>
          </div>

          {/* 3 – Physical */}
          <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-5 sm:p-7">
            <SectionHeader num="3" title={tr(t.form.sec3)} />

            {/* Weight – Male / Female */}
            <div className="mb-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                ⚖️ {tr(t.form.avgWeight)}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Field label={<span>♂ {tr(t.form.maleWeight)}</span>} hint={tr(t.form.weightHint)} error={errors.maleWeight}>
                  <div data-error={!!errors.maleWeight}>
                    <input type="text" name="maleWeight" value={form.maleWeight} onChange={handleChange}
                      placeholder="e.g. 180–220 kg"
                      className={`${inputClass} ${errors.maleWeight ? 'border-red-400' : ''}`} />
                  </div>
                </Field>
                <Field label={<span>♀ {tr(t.form.femaleWeight)}</span>} hint={tr(t.form.weightHint)}>
                  <input type="text" name="femaleWeight" value={form.femaleWeight} onChange={handleChange}
                    placeholder="e.g. 120–150 kg" className={inputClass} />
                </Field>
              </div>
            </div>

            {/* Height – Male / Female */}
            <div className="mb-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                📏 {tr(t.form.avgHeight)}
              </p>
              <div className="grid grid-cols-2 gap-3">
                <Field label={<span>♂ {tr(t.form.maleHeight)}</span>} hint={tr(t.form.heightHint)} error={errors.maleHeight}>
                  <div data-error={!!errors.maleHeight}>
                    <input type="text" name="maleHeight" value={form.maleHeight} onChange={handleChange}
                      placeholder="e.g. 1.2 m"
                      className={`${inputClass} ${errors.maleHeight ? 'border-red-400' : ''}`} />
                  </div>
                </Field>
                <Field label={<span>♀ {tr(t.form.femaleHeight)}</span>} hint={tr(t.form.heightHint)}>
                  <input type="text" name="femaleHeight" value={form.femaleHeight} onChange={handleChange}
                    placeholder="e.g. 1.0 m" className={inputClass} />
                </Field>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Field label={tr(t.form.birthArea)} required error={errors.birthArea}>
                  <div data-error={!!errors.birthArea}>
                    <input type="text" name="birthArea" value={form.birthArea} onChange={handleChange}
                      placeholder="e.g. Sub-Saharan Africa – rivers and lakes"
                      className={`${inputClass} ${errors.birthArea ? 'border-red-400' : ''}`} />
                  </div>
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label={tr(t.form.food)} required hint={tr(t.form.foodHint)} error={errors.food}>
                  <div data-error={!!errors.food}>
                    <input type="text" name="food" value={form.food} onChange={handleChange}
                      placeholder="e.g. Herbivore – grasses, aquatic plants"
                      className={`${inputClass} ${errors.food ? 'border-red-400' : ''}`} />
                  </div>
                </Field>
              </div>
            </div>
          </div>

          {/* 4 – Images */}
          <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-5 sm:p-7">
            <SectionHeader num="4" title={tr(t.form.sec4)} />
            <p className="text-xs text-gray-400 mb-4">{tr(t.form.imagesHint)}</p>
            <div className="flex flex-col gap-4">
              {form.images.map((url, i) => (
                <div key={i}>
                  <label className="text-xs sm:text-sm font-semibold text-green-900 mb-1 block">
                    {i === 0 ? tr(t.form.mainImg) : `${tr(t.form.imageN)} ${i + 1} URL`}
                    {i === 0 && <span className="text-gray-400 font-normal"> {tr(t.form.mainImgHint)}</span>}
                  </label>
                  <input type="url" value={url} onChange={e => handleImageChange(i, e.target.value)}
                    placeholder="https://example.com/animal.jpg" className={inputClass} />
                  {url && (
                    <div className="mt-2 h-28 sm:h-36 rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                      <img src={url} alt="" className="w-full h-full object-cover"
                        onError={e => { e.target.style.display = 'none' }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 5 – Description (3 languages) */}
          <div className="bg-white rounded-2xl shadow-sm border border-green-100 p-5 sm:p-7">
            <SectionHeader num="5" title={tr(t.form.sec5)} />
            <div className="flex flex-col gap-5">
              {/* English */}
              <Field label={<span>🇬🇧 Description <span className="text-gray-400 font-normal text-xs">(English)</span></span>}
                hint="Behavior, unique traits, interesting facts">
                <textarea name="description" value={form.description} onChange={handleChange} rows={4}
                  placeholder="Describe the animal in English..."
                  className={`${inputClass} resize-none`} />
              </Field>
              {/* Sinhala */}
              <Field label={<span>🇱🇰 විස්තරය <span className="text-gray-400 font-normal text-xs">(සිංහල)</span></span>}
                hint="සිංහල භාෂාවෙන් විස්තර කරන්න">
                <textarea name="descriptionSi" value={form.descriptionSi} onChange={handleChange} rows={4}
                  placeholder="සිංහල විස්තරය මෙහි ලියන්න..."
                  className={`${inputClass} resize-none`}
                  lang="si" />
              </Field>
              {/* Tamil */}
              <Field label={<span>🇱🇰 விளக்கம் <span className="text-gray-400 font-normal text-xs">(தமிழ்)</span></span>}
                hint="தமிழ் மொழியில் விளக்கவும்">
                <textarea name="descriptionTa" value={form.descriptionTa} onChange={handleChange} rows={4}
                  placeholder="தமிழ் விளக்கத்தை இங்கே எழுதுங்கள்..."
                  className={`${inputClass} resize-none`}
                  lang="ta" />
              </Field>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {saveError && (
              <div className="sm:col-span-2 w-full bg-red-50 border border-red-300 text-red-700 text-sm rounded-xl px-4 py-3">
                ❌ {saveError}
              </div>
            )}
            <button type="submit" disabled={saving}
              className="flex-1 bg-green-700 hover:bg-green-800 active:bg-green-900 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all shadow-md text-sm sm:text-base flex items-center justify-center gap-2">
              {saving ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Saving…
                </>
              ) : tr(t.form.submitAdd)}
            </button>
            <button type="button" onClick={handleReset}
              className="sm:w-32 border border-gray-300 text-gray-600 hover:bg-gray-50 font-semibold py-3.5 rounded-xl transition-all text-sm">
              {tr(t.form.reset)}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
