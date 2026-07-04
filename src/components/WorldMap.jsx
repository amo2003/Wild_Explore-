import { useState, useEffect, useRef } from 'react'
import { feature } from 'topojson-client'

// ── Continent colours by ISO numeric country id ─────────────────────────────
const AFRICA   = new Set([12,24,72,108,120,132,140,148,174,175,180,204,231,232,262,266,270,288,324,384,404,426,430,434,450,454,466,478,504,508,516,562,566,646,678,686,694,706,710,716,728,736,748,768,788,800,818,834,854,894])
const AMERICAS = new Set([28,32,44,52,68,76,84,124,152,170,188,192,212,214,218,222,238,254,304,308,320,328,332,340,388,474,484,500,530,531,533,534,535,558,591,600,604,630,659,662,663,670,740,780,796,840,850,858,862])
const ASIA     = new Set([4,50,64,96,104,116,144,156,158,162,356,360,364,368,376,392,400,408,410,414,418,422,446,458,462,496,512,524,586,608,634,682,702,704,760,764,784,792,860,887])
const EUROPE   = new Set([8,20,40,56,100,112,191,203,208,233,234,246,250,276,292,300,336,348,352,372,380,398,428,438,440,442,470,492,498,499,528,578,616,620,642,643,674,703,705,724,752,756,804,826,831,832,833])
const OCEANIA  = new Set([36,90,242,296,316,520,540,548,554,570,580,583,584,585,598,882,876])

function countryColor(id) {
  const n = Number(id)
  if (AFRICA.has(n))   return { fill: '#4ade80', stroke: '#16a34a' }
  if (AMERICAS.has(n)) return { fill: '#fbbf24', stroke: '#d97706' }
  if (ASIA.has(n))     return { fill: '#fb923c', stroke: '#ea580c' }
  if (EUROPE.has(n))   return { fill: '#60a5fa', stroke: '#2563eb' }
  if (OCEANIA.has(n))  return { fill: '#a3e635', stroke: '#65a30d' }
  return { fill: '#cbd5e1', stroke: '#94a3b8' }
}

const LEGEND = [
  { color: '#4ade80', label: 'Africa' },
  { color: '#fbbf24', label: 'Americas' },
  { color: '#fb923c', label: 'Asia' },
  { color: '#60a5fa', label: 'Europe' },
  { color: '#a3e635', label: 'Oceania' },
]

// ── Mercator projection (matches topojson rendering) ─────────────────────────
const VW = 960, VH = 500

function mX(lon) {
  return ((lon + 180) / 360) * VW
}
function mY(lat) {
  const phi = (lat * Math.PI) / 180
  return (VH / 2) - (VW / (2 * Math.PI)) * Math.log(Math.tan(Math.PI / 4 + phi / 2))
}

// GeoJSON feature → SVG path string
function toSVGPath(geom) {
  if (!geom) return ''
  const ringToD = ring =>
    ring.map((pt, i) => `${i ? 'L' : 'M'}${mX(pt[0]).toFixed(1)} ${mY(pt[1]).toFixed(1)}`).join('') + 'Z'
  if (geom.type === 'Polygon')
    return geom.coordinates.map(ringToD).join(' ')
  if (geom.type === 'MultiPolygon')
    return geom.coordinates.flatMap(poly => poly.map(ringToD)).join(' ')
  return ''
}

export default function WorldMap({ animals }) {
  const [paths, setPaths]   = useState([])
  const [hovered, setHovered] = useState(null)

  // Viewport: pan (tx, ty) and zoom stored as a CSS matrix
  const [view, setView] = useState({ tx: 0, ty: 0, scale: 1 })
  const dragging = useRef(false)
  const last     = useRef({ x: 0, y: 0 })
  const svgRef   = useRef(null)

  // Load bundled local TopoJSON
  useEffect(() => {
    fetch('/countries-110m.json')
      .then(r => r.json())
      .then(topo => {
        const countries = feature(topo, topo.objects.countries)
        setPaths(
          countries.features
            .map(f => ({ d: toSVGPath(f.geometry), ...countryColor(f.id) }))
            .filter(p => p.d)
        )
      })
  }, [])

  // Only show animals with real lng/lat
  const pins = animals.filter(a => a.lng != null && a.lat != null)

  // ── Wheel zoom (zoom toward cursor) ────────────────────────────────────────
  function onWheel(e) {
    e.preventDefault()
    const rect = svgRef.current.getBoundingClientRect()
    const mx = e.clientX - rect.left   // cursor in element coords
    const my = e.clientY - rect.top
    const factor = e.deltaY < 0 ? 1.15 : 0.87
    setView(v => {
      const ns = Math.min(10, Math.max(0.8, v.scale * factor))
      // Adjust pan so the point under the cursor stays fixed
      const tx = mx - (mx - v.tx) * (ns / v.scale)
      const ty = my - (my - v.ty) * (ns / v.scale)
      return { tx, ty, scale: ns }
    })
  }

  // ── Drag pan ───────────────────────────────────────────────────────────────
  const onMouseDown = e => { dragging.current = true; last.current = { x: e.clientX, y: e.clientY } }
  const onMouseMove = e => {
    if (!dragging.current) return
    const dx = e.clientX - last.current.x
    const dy = e.clientY - last.current.y
    last.current = { x: e.clientX, y: e.clientY }
    setView(v => ({ ...v, tx: v.tx + dx, ty: v.ty + dy }))
  }
  const onMouseUp = () => { dragging.current = false }

  const onTouchStart = e => {
    if (e.touches.length !== 1) return
    dragging.current = true
    last.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }
  const onTouchMove = e => {
    if (!dragging.current || e.touches.length !== 1) return
    const dx = e.touches[0].clientX - last.current.x
    const dy = e.touches[0].clientY - last.current.y
    last.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
    setView(v => ({ ...v, tx: v.tx + dx, ty: v.ty + dy }))
  }
  const onTouchEnd = () => { dragging.current = false }

  // SVG <g> transform: translate then scale, origin top-left
  const gTransform = `translate(${view.tx} ${view.ty}) scale(${view.scale})`

  return (
    <div
      className="rounded-2xl overflow-hidden border-2 border-green-300 shadow-2xl relative"
      style={{ background: '#7dd3fc', aspectRatio: `${VW}/${VH}`, userSelect: 'none' }}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-3 py-2
                      bg-gradient-to-b from-black/45 to-transparent pointer-events-none">
        <span className="text-white text-xs sm:text-sm font-bold drop-shadow">🌍 Wildlife Habitat Map</span>
        <span className="text-white/75 text-xs hidden sm:block drop-shadow">
          Scroll to zoom · Drag to pan · Hover pins
        </span>
      </div>

      {/* Map SVG */}
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VW} ${VH}`}
        className="w-full h-full block"
        style={{ cursor: dragging.current ? 'grabbing' : 'grab' }}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onWheel={onWheel}
      >
        <defs>
          {pins.map(a => (
            <clipPath key={a.id} id={`wm-clip-${a.id}`}>
              <circle cx="0" cy="0" r="12" />
            </clipPath>
          ))}
        </defs>

        {/* Ocean base */}
        <rect x="-9999" y="-9999" width="29999" height="29999" fill="#7dd3fc" />

        <g transform={gTransform}>
          {/* Countries */}
          {paths.map((p, i) => (
            <path key={i} d={p.d} fill={p.fill} stroke={p.stroke} strokeWidth={0.5} />
          ))}

          {paths.length === 0 && (
            <text x={VW / 2} y={VH / 2} textAnchor="middle"
              fill="white" fontSize={20} fontFamily="system-ui,sans-serif">
              Loading map…
            </text>
          )}

          {/* Animal pins */}
          {pins.map(animal => {
            const x = mX(animal.lng)
            const y = mY(animal.lat)
            const img = animal.images?.[0] || animal.image || ''
            const isHov = hovered === animal.id
            const R = 12

            return (
              <g
                key={animal.id}
                transform={`translate(${x.toFixed(1)},${y.toFixed(1)})`}
                style={{ cursor: 'pointer' }}
                onMouseEnter={e => { e.stopPropagation(); setHovered(animal.id) }}
                onMouseLeave={e => { e.stopPropagation(); setHovered(null) }}
                onClick={e => { e.stopPropagation(); window.location.assign(`/animals/${animal.id}`) }}
              >
                {/* Hover glow */}
                {isHov && <circle r={R + 10} fill="#16a34a" opacity={0.25} />}

                {/* White drop-shadow ring */}
                <circle r={R + 3} fill="white"
                  style={{ filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.5))' }} />

                {/* Coloured border */}
                <circle r={R + 1.5} fill="none"
                  stroke={isHov ? '#15803d' : '#22c55e'}
                  strokeWidth={isHov ? 2.5 : 1.5} />

                {/* Animal photo */}
                {img
                  ? <image href={img} x={-R} y={-R} width={R * 2} height={R * 2}
                      clipPath={`url(#wm-clip-${animal.id})`}
                      preserveAspectRatio="xMidYMid slice" />
                  : <text textAnchor="middle" dominantBaseline="central"
                      fontSize={R} fill="#15803d">🐾</text>
                }

                {/* Pin stem */}
                <line x1="0" y1={R + 3} x2="0" y2={R + 10}
                  stroke="#15803d" strokeWidth="2" />
                <circle cx="0" cy={R + 11} r="2.5" fill="#15803d" />

                {/* Tooltip */}
                {isHov && (
                  <g>
                    <rect x="-48" y={-R - 38} width="96" height="30" rx="7"
                      fill="#14532d"
                      style={{ filter: 'drop-shadow(0 3px 10px rgba(0,0,0,0.6))' }} />
                    <polygon points={`-6,${-R - 8} 6,${-R - 8} 0,${-R - 1}`} fill="#14532d" />
                    <text y={-R - 24} textAnchor="middle"
                      fill="white" fontSize="8" fontWeight="700"
                      fontFamily="system-ui,sans-serif">
                      {animal.name.length > 20 ? animal.name.slice(0, 19) + '…' : animal.name}
                    </text>
                    <text y={-R - 12} textAnchor="middle"
                      fill="#86efac" fontSize="7"
                      fontFamily="system-ui,sans-serif">
                      📍 {(animal.birthArea || '').length > 24
                        ? animal.birthArea.slice(0, 23) + '…'
                        : animal.birthArea}
                    </text>
                  </g>
                )}
              </g>
            )
          })}
        </g>
      </svg>

      {/* Legend */}
      <div className="absolute bottom-2 left-2 z-10 flex flex-wrap gap-1 pointer-events-none">
        {LEGEND.map(({ color, label }) => (
          <div key={label}
            className="flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5 shadow">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: color }} />
            <span className="text-xs font-semibold text-gray-700">{label}</span>
          </div>
        ))}
      </div>

      {/* Zoom hint */}
      <div className="absolute bottom-2 right-2 z-10 hidden sm:block bg-white/85 backdrop-blur-sm
                      rounded-full px-2.5 py-1 text-xs text-gray-500 pointer-events-none shadow">
        🔍 Scroll to zoom
      </div>
    </div>
  )
}
