export default function StoryPreview({ data }) {
  if (!data) return (
    <section className="rounded-xl border bg-white/60 backdrop-blur p-4 md:p-5">
      <p className="text-gray-600">Your story will appear here after generation.</p>
    </section>
  )

  const { story } = data

  return (
    <section className="rounded-xl border bg-white/70 backdrop-blur p-4 md:p-6 space-y-4">
      <div>
        <h2 className="text-2xl font-bold">{story.title}</h2>
        <p className="text-sm text-gray-600">{story.style || 'style'}, {story.tone || 'tone'} • {story.audience} • {story.language}</p>
        {story.moral && <p className="mt-1 text-sm text-emerald-700">Moral: {story.moral}</p>}
      </div>

      {story.cover_image_svg && (
        <div className="overflow-hidden rounded-lg border">
          <img src={story.cover_image_svg} alt={`Cover art for ${story.title}`} className="w-full h-auto" />
        </div>
      )}

      <div className="prose max-w-none">
        {story.chapters.map((c) => (
          <div key={c.index} className="mb-10">
            <h3 className="text-xl font-semibold mb-2">{c.title}</h3>
            {c.image_svg && (
              <div className="overflow-hidden rounded-md border mb-3">
                <img src={c.image_svg} alt={`Illustration for ${c.title}`} className="w-full h-auto" />
              </div>
            )}
            <p className="leading-relaxed text-gray-800 whitespace-pre-wrap">{c.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
