import { Rocket, BookOpen } from 'lucide-react'

export default function Header() {
  return (
    <header className="w-full py-6 border-b bg-white/70 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-fuchsia-500 to-indigo-600 grid place-items-center text-white">
            <Rocket className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">FLAMES Storybook</h1>
            <p className="text-sm text-gray-500">Free, next‑gen AI storybook generator</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-indigo-600">
          <BookOpen className="h-5 w-5" />
          <span className="text-sm font-medium">Create. Imagine. Share.</span>
        </div>
      </div>
    </header>
  )
}
