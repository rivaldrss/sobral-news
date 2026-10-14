// Em desenvolvimento: usa o proxy do Vite (/api-feed)
// Em produção: usa um proxy externo (definido abaixo)
const FEED_URL = import.meta.env.DEV
  ? '/api-feed?alt=rss'
  : 'https://api.allorigins.win/raw?url=' +
    encodeURIComponent('https://www.sobralnoticias.com.br/feeds/posts/default?alt=rss')

let cache = { data: null, timestamp: 0 }
const CACHE_TTL = 5 * 60 * 1000

export async function fetchNews(force = false) {
  const now = Date.now()
  if (!force && cache.data && now - cache.timestamp < CACHE_TTL) {
    return cache.data
  }

  const res = await fetch(FEED_URL)
  if (!res.ok) throw new Error('Falha ao buscar notícias')
  const text = await res.text()

  const parser = new DOMParser()
  const xml = parser.parseFromString(text, 'application/xml')

  const items = Array.from(xml.querySelectorAll('item')).map((item) => {
    const get = (tag) => item.querySelector(tag)?.textContent || ''
    const categories = Array.from(item.querySelectorAll('category')).map(
      (c) => c.textContent
    )

    const content = get('description')
    const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i)
    const thumbnail = imgMatch ? imgMatch[1] : null

    return {
      id: get('guid') || get('link'),
      title: get('title'),
      link: get('link'),
      pubDate: get('pubDate'),
      content,
      categories,
      thumbnail,
      author: get('author') || 'Sobral Notícias'
    }
  })

  cache = { data: items, timestamp: now }
  return items
}

export function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const diff = (Date.now() - date.getTime()) / 1000

  if (diff < 60) return 'agora'
  if (diff < 3600) return `${Math.floor(diff / 60)} min atrás`
  if (diff < 86400) return `${Math.floor(diff / 3600)} h atrás`
  if (diff < 604800) return `${Math.floor(diff / 86400)} d atrás`

  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}