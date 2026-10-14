import { Link } from 'react-router-dom'
import { formatDate } from '../services/newsApi.js'

export default function NewsCard({ news }) {
  // Limpa HTML do content para resumo
  const plainText = news.content.replace(/<[^>]+>/g, '').trim()
  const summary = plainText.length > 140 ? plainText.slice(0, 140) + '...' : plainText

  return (
    <Link to={`/noticia/${encodeURIComponent(news.id)}`} className="news-card">
      {news.thumbnail && (
        <div className="news-card-image">
          <img src={news.thumbnail} alt={news.title} loading="lazy" />
        </div>
      )}
      <div className="news-card-body">
        {news.categories[0] && (
          <span className="news-card-category">{news.categories[0]}</span>
        )}
        <h2 className="news-card-title">{news.title}</h2>
        <p className="news-card-summary">{summary}</p>
        <div className="news-card-meta">
          <span>{formatDate(news.pubDate)}</span>
        </div>
      </div>
    </Link>
  )
}