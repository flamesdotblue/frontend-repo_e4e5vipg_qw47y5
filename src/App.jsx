import { useState } from 'react'
import Header from './components/Header'
import SystemPromptCard from './components/SystemPromptCard'
import StoryForm from './components/StoryForm'
import StoryPreview from './components/StoryPreview'
import Library from './components/Library'

function App() {
  const [generated, setGenerated] = useState(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-fuchsia-50 to-sky-50">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <StoryForm onGenerated={setGenerated} />
          <StoryPreview data={generated} />
        </div>
        <div className="space-y-6">
          <SystemPromptCard />
          <Library onSelect={(s) => setGenerated({ story: s, id: s._id })} />
        </div>
      </main>
      <style>{`
        .input { @apply w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white; }
      `}</style>
    </div>
  )
}

export default App
