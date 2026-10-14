import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Header from '../components/Header.jsx'
import Loading from '../components/Loading.jsx'
import ShareButton from '../components/ShareButton.jsx'
import { fetchNews, formatDate } from '../services/newsApi.js'

export default function Article() {
  const { id } = useParams()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const all = await fetchNews()
      const found = all.find((n) => n.id === decodeURIComponent(id))
      setArticle(found || null)
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) {
    return (
      <>
        <Header />
        <Loading />
      </>
    )
  }

  if (!article) {
    return (
      <>
        <Header />
        <main className="container">
          <p className="error">Notícia não encontrada.</p>
          <Link to="/" className="back-link">← Voltar</Link>
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="container">
        <Link to="/" className="back-link">← Voltar</Link>

        <article className="article">
          {article.categories[0] && (
            <span className="article-category">{article.categories[0]}</span>
          )}
          <h1 className="article-title">{article.title}</h1>
          <div className="article-meta">
            <span>{article.author}</span>
            <span>•</span>
            <span>{formatDate(article.pubDate)}</span>
          </div>

          <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          <div className="article-share">
            <ShareButton title={article.title} url={article.link} />
          </div>
        </article>
      </main>
    </>
  )
}