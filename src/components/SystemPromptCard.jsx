import { useEffect, useState } from 'react'
import { Copy, Check } from 'lucide-react'

const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export default function SystemPromptCard() {
  const [prompt, setPrompt] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetch(`${BASE_URL}/api/prompt/system`)
      .then((r) => r.json())
      .then((d) => setPrompt(d.system_prompt || ''))
      .catch(() => setPrompt(''))
  }, [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {}
  }

  return (
    <section className="rounded-xl border bg-white/70 backdrop-blur p-4 md:p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">System Prompt</h2>
        <button onClick={copy} className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-gray-700 whitespace-pre-wrap">
        {prompt || 'Loading…'}
      </p>
    </section>
  )
}
