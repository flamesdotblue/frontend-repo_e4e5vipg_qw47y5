import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { BookOpen } from 'lucide-react'

function buildHtml(story) {
  const css = `body{font-family:ui-sans-serif,system-ui,Inter,Arial;margin:2rem;line-height:1.6}img{max-width:100%;height:auto;border-radius:8px;border:1px solid #e5e7eb;margin:0.5rem 0}h1,h2,h3{line-height:1.2}`
  let html = `<!doctype html><html><head><meta charset="utf-8"/><title>${escapeHtml(story.title)}</title><style>${css}</style></head><body>`
  html += `<h1>${escapeHtml(story.title)}</h1>`
  html += `<p><em>${escapeHtml(story.style || 'style')}, ${escapeHtml(story.tone || 'tone')} • ${escapeHtml(story.audience)} • ${escapeHtml(story.language)}</em></p>`
  if (story.moral) html += `<p><strong>Moral:</strong> ${escapeHtml(story.moral)}</p>`
  if (story.cover_image_svg) html += `<img src="${story.cover_image_svg}" alt="Cover" />`
  for (const c of story.chapters) {
    html += `<h2>${escapeHtml(c.title)}</h2>`
    if (c.image_svg) html += `<img src="${c.image_svg}" alt="${escapeHtml(c.title)}" />`
    html += `<p>${escapeHtml(c.text).replace(/\n/g, '<br/>')}</p>`
  }
  html += `</body></html>`
  return html
}

function escapeHtml(s) {
  return String(s || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

async function buildEpubZip(story) {
  const zip = new JSZip()
  // Required mimetype file must be the first entry, uncompressed
  zip.file('mimetype', 'application/epub+zip', { compression: 'STORE' })

  // Container
  zip.file('META-INF/container.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">\n  <rootfiles>\n    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>\n  </rootfiles>\n</container>`)

  // Assets
  const oebps = zip.folder('OEBPS')
  const images = oebps.folder('images')
  const text = oebps.folder('text')
  const styles = oebps.folder('styles')

  styles.file('style.css', `body{font-family:serif;margin:1rem 1.2rem;line-height:1.5}img{max-width:100%;height:auto}`)

  // Save images (convert data URL to raw SVG files)
  if (story.cover_image_svg) {
    const svg = decodeDataUrl(story.cover_image_svg)
    images.file('cover.svg', svg)
  }
  story.chapters.forEach((c, i) => {
    if (c.image_svg) {
      const svg = decodeDataUrl(c.image_svg)
      images.file(`chap${i + 1}.svg`, svg)
    }
  })

  // XHTML files
  text.file('cover.xhtml', xhtmlDoc(`<section>\n  <h1>${escapeHtml(story.title)}</h1>\n  ${story.cover_image_svg ? '<img src="../images/cover.svg" alt="Cover"/>' : ''}\n</section>`))

  const manifestItems = [
    { id: 'ncx', href: 'toc.ncx', 'media-type': 'application/x-dtbncx+xml' },
    { id: 'css', href: 'styles/style.css', 'media-type': 'text/css' },
    { id: 'cover', href: 'text/cover.xhtml', 'media-type': 'application/xhtml+xml' },
  ]

  story.chapters.forEach((c, i) => {
    const imgTag = c.image_svg ? `<img src="../images/chap${i + 1}.svg" alt="${escapeHtml(c.title)}"/>` : ''
    const body = `<section>\n  <h2>${escapeHtml(c.title)}</h2>\n  ${imgTag}\n  <p>${escapeHtml(c.text).replace(/\n/g, '<br/>')}</p>\n</section>`
    text.file(`chap${i + 1}.xhtml`, xhtmlDoc(body))
    manifestItems.push({ id: `chap${i + 1}`, href: `text/chap${i + 1}.xhtml`, 'media-type': 'application/xhtml+xml' })
    if (c.image_svg) manifestItems.push({ id: `img${i + 1}`, href: `images/chap${i + 1}.svg`, 'media-type': 'image/svg+xml' })
  })
  if (story.cover_image_svg) manifestItems.push({ id: 'imgcover', href: 'images/cover.svg', 'media-type': 'image/svg+xml' })

  // OPF (package) file
  const spineItems = ['cover', ...story.chapters.map((_, i) => `chap${i + 1}`)]
  oebps.file('content.opf', `<?xml version="1.0" encoding="utf-8"?>\n<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="bookid" version="2.0">\n  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">\n    <dc:title>${escapeHtml(story.title)}</dc:title>\n    <dc:language>${escapeHtml(story.language || 'en')}</dc:language>\n    <dc:creator>FLAMES Storybook</dc:creator>\n    <meta name="cover" content="cover"/>\n  </metadata>\n  <manifest>\n    ${manifestItems.map(it => `<item id="${it.id}" href="${it.href}" media-type="${it['media-type']}"/>`).join('\n    ')}\n  </manifest>\n  <spine toc="ncx">\n    ${spineItems.map(id => `<itemref idref="${id}"/>`).join('\n    ')}\n  </spine>\n</package>`)\n
  // Simple NCX (table of contents)
  oebps.file('toc.ncx', `<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE ncx PUBLIC \"-//NISO//DTD ncx 2005-1//EN\" \"http://www.daisy.org/z3986/2005/ncx-2005-1.dtd\">\n<ncx version=\"2005-1\" xml:lang=\"en\" xmlns=\"http://www.daisy.org/z3986/2005/ncx/\">\n  <head>\n    <meta name=\"dtb:uid\" content=\"urn:uuid:${cryptoRandom()}\"/>\n  </head>\n  <docTitle><text>${escapeHtml(story.title)}</text></docTitle>\n  <navMap>\n    <navPoint id=\"navCover\" playOrder=\"1\"><navLabel><text>Cover</text></navLabel><content src=\"text/cover.xhtml\"/></navPoint>\n    ${story.chapters.map((c, i) => `<navPoint id=\"nav${i + 1}\" playOrder=\"${i + 2}\"><navLabel><text>${escapeHtml(c.title)}</text></navLabel><content src=\"text/chap${i + 1}.xhtml\"/></navPoint>`).join('\n    ')}\n  </navMap>\n</ncx>`)\n
  return zip
}

function xhtmlDoc(body) {
  return `<?xml version="1.0" encoding="utf-8"?>\n<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">\n<html xmlns="http://www.w3.org/1999/xhtml">\n  <head>\n    <title>Chapter</title>\n    <link rel="stylesheet" type="text/css" href="../styles/style.css"/>\n  </head>\n  <body>\n    ${body}\n  </body>\n</html>`
}

function decodeDataUrl(dataUrl) {
  // data:image/svg+xml;charset=utf-8,<svg ...>
  const idx = dataUrl.indexOf(',')
  return decodeURIComponent(dataUrl.slice(idx + 1))
}

function cryptoRandom() {
  // lightweight UUID-ish
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export default function EbookActions({ story }) {
  const disabled = !story

  const downloadHtml = async () => {
    const html = buildHtml(story)
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
    saveAs(blob, `${story.title || 'storybook'}.html`)
  }

  const downloadEpub = async () => {
    const zip = await buildEpubZip(story)
    const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' })
    saveAs(blob, `${story.title || 'storybook'}.epub`)
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button disabled={disabled} onClick={downloadHtml} className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-3 py-2 rounded-md disabled:opacity-60">
        <BookOpen className="h-4 w-4" /> Download HTML
      </button>
      <button disabled={disabled} onClick={downloadEpub} className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-3 py-2 rounded-md disabled:opacity-60">
        <BookOpen className="h-4 w-4" /> Download EPUB
      </button>
    </div>
  )
}
