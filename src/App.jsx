import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Article from './pages/Article.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/noticia/:id" element={<Article />} />
    </Routes>
  )
}