import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuthContext } from '@asgardeo/auth-react'
import { useAnimals } from '../context/AnimalContext'
import { CATEGORIES } from '../data/animals'
import AddAnimal from './AddAnimal'
import ManageAnimals from './ManageAnimals'

export default function Dashboard() {
  const { state, signOut } = useAuthContext()
  const { animals } = useAnimals()
  const [tab, setTab] = useState('overview')

  const user = state.username || state.sub || 'Admin'

  const stats = [
    { icon: '🐾', label: 'Total Animals',  value: animals.length },
    { icon: '📂', label: 'Categories',     value: CATEGORIES.length },
    { icon: '🌿', label: 'Endemic',        value: animals.filter(a => a.origin === 'endemic').length },
    { icon: '�', label: 'Native',         value: animals.filter(a => a.origin === 'native').length },
    { icon: '✈️', label: 'Exotic',          value: animals.filter(a => a.origin === 'exotic').length },
    { icon: '🛡️', label: 'Endangered',      value: animals.filter(a => ['Endangered','Critically Endangered'].includes(a.conservationStatus)).length },
  ]

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Admin Header ── */}
      <div className="bg-green-900 text-white px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-40 shadow-lg">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-2xl">🌿</Link>
          <div>
            <p className="font-extrabold text-base leading-tight">WildExplore</p>
            <p className="text-green-300 text-xs">Admin Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold">{user}</p>
            <p className="text-green-300 text-xs">Administrator</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-green-700 border-2 border-green-500 flex items-center justify-center font-bold text-sm flex-shrink-0">
            {String(user)[0]?.toUpperCase()}
          </div>
          <button
            onClick={() => signOut()}
            className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        {/* ── Tab nav ── */}
        <div className="flex gap-1 mb-6 border-b border-gray-200 overflow-x-auto">
          {[
            { key: 'overview', icon: '📊', label: 'Overview' },
            { key: 'add',      icon: '➕', label: 'Add Animal' },
            { key: 'manage',   icon: '📋', label: 'Manage Animals' },
          ].map(item => (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all -mb-px whitespace-nowrap ${
                tab === item.key
                  ? 'border-green-600 text-green-700'
                  : 'border-transparent text-gray-500 hover:text-green-600 hover:border-green-300'
              }`}
            >
              {item.icon} {item.label}
            </button>
          ))}
        </div>

        {/* ── Overview tab ── */}
        {tab === 'overview' && (
          <div className="flex flex-col gap-8">

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {stats.map(s => (
                <div key={s.label} className="bg-white rounded-2xl p-5 text-center shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="text-3xl mb-2">{s.icon}</div>
                  <div className="text-2xl font-extrabold text-green-800">{s.value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button onClick={() => setTab('add')}
                className="bg-green-700 hover:bg-green-800 text-white rounded-2xl p-6 text-left shadow-sm transition-all hover:shadow-md">
                <div className="text-3xl mb-2">➕</div>
                <h3 className="font-bold text-lg">Add New Animal</h3>
                <p className="text-green-200 text-sm mt-1">Add a new animal to the database with full details</p>
              </button>
              <button onClick={() => setTab('manage')}
                className="bg-white hover:bg-gray-50 border border-gray-200 rounded-2xl p-6 text-left shadow-sm transition-all hover:shadow-md">
                <div className="text-3xl mb-2">📋</div>
                <h3 className="font-bold text-lg text-green-900">Manage Animals</h3>
                <p className="text-gray-500 text-sm mt-1">Edit or delete existing animals in the database</p>
              </button>
            </div>

            {/* Recent animals table */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-green-900">Recent Animals</h2>
                <button onClick={() => setTab('manage')} className="text-sm text-green-600 hover:text-green-800 font-medium">
                  View all →
                </button>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
                <table className="w-full text-sm min-w-[500px]">
                  <thead>
                    <tr className="bg-green-50 border-b border-green-100">
                      {['Animal', 'Category', 'Origin', 'Conservation', 'Action'].map(h => (
                        <th key={h} className={`px-4 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wide ${h === 'Action' ? 'text-right' : 'text-left'}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {animals.slice(0, 8).map(a => {
                      const cat = CATEGORIES.find(c => c.id === a.category)
                      const aid = String(a._id || a.id)
                      return (
                        <tr key={aid} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              {a.image
                                ? <img src={a.image} alt="" className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                                : <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center text-lg">{cat?.icon}</div>
                              }
                              <div>
                                <p className="font-semibold text-green-900 leading-tight">{a.name}</p>
                                <p className="text-xs text-gray-400 italic">{a.scientificName}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-600">{cat?.icon} {cat?.label}</td>
                          <td className="px-4 py-3">
                            {a.origin && (
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                a.origin === 'endemic' ? 'bg-emerald-100 text-emerald-700'
                                : a.origin === 'native' ? 'bg-teal-100 text-teal-700'
                                : 'bg-blue-100 text-blue-700'
                              }`}>{a.origin}</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-500">{a.conservationStatus || '—'}</td>
                          <td className="px-4 py-3 text-right">
                            <Link to={`/dashboard/edit/${aid}`}
                              className="text-xs bg-green-50 hover:bg-green-100 text-green-700 font-semibold px-3 py-1.5 rounded-lg transition-all">
                              ✏️ Edit
                            </Link>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                {animals.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    <div className="text-4xl mb-2">🌿</div>
                    <p className="text-sm font-medium">No animals yet</p>
                    <p className="text-xs mt-1">Go to the Add Animal tab to get started</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Add Animal tab ── */}
        {tab === 'add' && (
          <div>
            <div className="mb-5 p-4 bg-green-50 border border-green-200 rounded-xl text-sm text-green-800">
              ℹ️ Fill in all required fields below to add a new animal. It will appear on the public site immediately.
            </div>
            <AddAnimal isDashboard onSuccess={() => setTab('manage')} />
          </div>
        )}

        {/* ── Manage tab ── */}
        {tab === 'manage' && <ManageAnimals />}
      </div>
    </div>
  )
}
