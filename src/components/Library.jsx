import { useEffect, useState } from 'react'
import { Library as LibraryIcon, RefreshCw } from 'lucide-react'

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function Library({ onSelect }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${BASE_URL}/api/stories?limit=20`)
      const data = await res.json()
      setItems(data.items || [])
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <section className="rounded-xl border bg-white/70 backdrop-blur p-4 md:p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <LibraryIcon className="h-5 w-5 text-indigo-600" />
          <h2 className="text-lg font-semibold">Recent stories</h2>
        </div>
        <button onClick={load} className="text-sm inline-flex items-center gap-2 text-gray-600 hover:text-gray-800">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-gray-600">No stories yet. Generate one to see it here.</p>
      ) : (
        <ul className="divide-y">
          {items.map((s) => (
            <li key={s._id} className="py-3">
              <button onClick={() => onSelect?.(s)} className="text-left w-full">
                <p className="font-medium">{s.title}</p>
                <p className="text-xs text-gray-600 line-clamp-1">{s.theme} • {s.style} • {s.audience}</p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
