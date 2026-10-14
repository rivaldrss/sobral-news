import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="header">
      <Link to="/" className="header-logo">
        <span className="header-logo-mark">SN</span>
        <span className="header-logo-text">Sobral News</span>
      </Link>
    </header>
  )
}