import { useAnimals } from '../context/AnimalContext'
import WorldMap from '../components/WorldMap'

export default function MapPage() {
  const { animals, loading } = useAnimals()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-900 to-green-700 text-white py-6 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-extrabold">🌍 Wildlife Habitat Map</h1>
          <p className="text-green-200 text-sm mt-1">
            Explore where animals live around the world. Click any pin to view details.
          </p>
        </div>
      </div>

      {/* Full map */}
      <div className="flex-1 p-3 sm:p-6">
        <div className="max-w-7xl mx-auto h-full" style={{ minHeight: '70vh' }}>
          {loading ? (
            <div className="flex items-center justify-center h-full gap-3 text-green-700 py-20">
              <svg className="animate-spin w-7 h-7" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              <span className="font-medium">Loading map…</span>
            </div>
          ) : (
            <div style={{ height: '75vh' }}>
              <WorldMap animals={animals} fullscreen />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
