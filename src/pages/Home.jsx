import { useEffect, useState } from 'react'
import Header from '../components/Header.jsx'
import NewsCard from '../components/NewsCard.jsx'
import SkeletonCard from '../components/SkeletonCard.jsx'
import { fetchNews } from '../services/newsApi.js'

export default function Home() {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  const load = async (force = false) => {
    try {
      if (force) setRefreshing(true)
      else setLoading(true)
      const data = await fetchNews(force)
      setNews(data)
      setError(null)
    } catch (e) {
      setError('Não foi possível carregar as notícias. Verifique sua conexão.')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <>
      <Header />
      <main className="container">
        <div className="home-top">
          <h1 className="home-title">Últimas notícias</h1>
          <button
            className="refresh-btn"
            onClick={() => load(true)}
            disabled={refreshing}
          >
            {refreshing ? 'Atualizando...' : 'Atualizar'}
          </button>
        </div>

        {/* Mostra o Skeleton enquanto carrega */}
        {loading && (
          <div className="news-list">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        )}

        {error && <p className="error">{error}</p>}

        {!loading && !error && (
          <div className="news-list">
            {news.map((item) => (
              <NewsCard key={item.id} news={item} />
            ))}
          </div>
        )}
      </main>
    </>
  )
}