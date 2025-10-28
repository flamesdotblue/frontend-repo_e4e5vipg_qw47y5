import { useState } from 'react'
import { Wand2 } from 'lucide-react'

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function StoryForm({ onGenerated }) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    theme: 'friendship and courage',
    audience: 'children',
    style: 'fairy tale',
    tone: 'cozy',
    moral: 'Kindness is a quiet superpower',
    setting: 'a small village by a whispering forest',
    language: 'en',
    characters: 'Lumi, Puck, Mira',
    chapters: 5,
    save: true,
    include_images: true,
  })

  const update = (k, v) => setForm((s) => ({ ...s, [k]: v }))

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        ...form,
        characters: form.characters
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        chapters: Number(form.chapters) || 5,
        save: Boolean(form.save),
        include_images: Boolean(form.include_images),
      }
      const res = await fetch(`${BASE_URL}/api/stories/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.detail || 'Failed to generate')
      onGenerated?.(data)
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="rounded-xl border bg-white/70 backdrop-blur p-4 md:p-5 space-y-4">
      <h2 className="text-lg font-semibold">Create a new story</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <label className="grid gap-1">
          <span className="text-sm text-gray-600">Title</span>
          <input value={form.title} onChange={(e) => update('title', e.target.value)} required className="input" placeholder="The Lantern at the Edge of Dawn" />
        </label>
        <label className="grid gap-1">
          <span className="text-sm text-gray-600">Theme</span>
          <input value={form.theme} onChange={(e) => update('theme', e.target.value)} className="input" />
        </label>
        <label className="grid gap-1">
          <span className="text-sm text-gray-600">Audience</span>
          <select value={form.audience} onChange={(e) => update('audience', e.target.value)} className="input">
            <option>children</option>
            <option>teens</option>
            <option>adults</option>
          </select>
        </label>
        <label className="grid gap-1">
          <span className="text-sm text-gray-600">Style</span>
          <input value={form.style} onChange={(e) => update('style', e.target.value)} className="input" />
        </label>
        <label className="grid gap-1">
          <span className="text-sm text-gray-600">Tone</span>
          <input value={form.tone} onChange={(e) => update('tone', e.target.value)} className="input" />
        </label>
        <label className="grid gap-1">
          <span className="text-sm text-gray-600">Moral</span>
          <input value={form.moral} onChange={(e) => update('moral', e.target.value)} className="input" />
        </label>
        <label className="grid gap-1 md:col-span-2">
          <span className="text-sm text-gray-600">Setting</span>
          <input value={form.setting} onChange={(e) => update('setting', e.target.value)} className="input" />
        </label>
        <label className="grid gap-1 md:col-span-2">
          <span className="text-sm text-gray-600">Characters (comma separated)</span>
          <input value={form.characters} onChange={(e) => update('characters', e.target.value)} className="input" />
        </label>
        <label className="grid gap-1">
          <span className="text-sm text-gray-600">Language</span>
          <input value={form.language} onChange={(e) => update('language', e.target.value)} className="input" placeholder="en" />
        </label>
        <label className="grid gap-1">
          <span className="text-sm text-gray-600">Chapters</span>
          <input type="number" min="1" max="15" value={form.chapters} onChange={(e) => update('chapters', e.target.value)} className="input" />
        </label>
        <label className="flex items-center gap-2 md:col-span-2">
          <input type="checkbox" checked={form.include_images} onChange={(e) => update('include_images', e.target.checked)} />
          <span className="text-sm text-gray-700">Include illustrations</span>
        </label>
      </div>
      <button disabled={loading} className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-md disabled:opacity-60">
        <Wand2 className="h-4 w-4" /> {loading ? 'Generating…' : 'Generate story'}
      </button>
    </form>
  )
}
