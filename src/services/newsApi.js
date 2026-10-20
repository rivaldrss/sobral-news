// URL do feed local (gerado automaticamente pelo GitHub Action a cada 15 min)
const FEED_URL = `${import.meta.env.BASE_URL}feed.xml`

let cache = { data: null, timestamp: 0 }
const CACHE_TTL = 5 * 60 * 1000 // 5 minutos

// Função para limpar lixo do HTML (entidades e email do blogger)
export function cleanText(text) {
  if (!text) return ''
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/noreply@blogger\.com\s*/gi, '') // Remove email do blogger
    .replace(/\s+/g, ' ') // Remove espaços duplos
    .trim()
}

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

    // Limpa o conteúdo HTML para extrair a imagem e o texto
    const content = get('description')
    const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/i)
    const thumbnail = imgMatch ? imgMatch[1] : null

    // Trata o autor (remove o email e parenteses)
    let author = get('author')
    author = cleanText(author)
    // Se o autor ficar vazio após limpar (só tinha o email), usa padrão
    if (!author || author.includes('(')) {
      author = 'Sobral Notícias'
    }

    return {
      id: get('guid') || get('link'),
      title: cleanText(get('title')),
      link: get('link'),
      pubDate: get('pubDate'),
      content,
      categories,
      thumbnail,
      author: author || 'Sobral Notícias'
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