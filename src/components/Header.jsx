import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="header">
      <Link to="/" className="header-logo">
        <img 
          src={`${import.meta.env.BASE_URL}icons/logo-s.png`} 
          alt="Sobral News" 
          className="header-logo-img" 
        />
        <span className="header-logo-text">Sobral News</span>
      </Link>
    </header>
  )
}