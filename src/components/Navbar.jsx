import { useState, useEffect } from 'react'
import './Navbar.css'
import profileImg from '../assets/Profile-Updated.png'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [scrolled,      setScrolled]      = useState(false)
  const [menuOpen,      setMenuOpen]      = useState(false)
  const [avatarExpanded, setAvatarExpanded] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const close = (e) => {
      if (avatarExpanded && !e.target.closest('.navbar-logo')) setAvatarExpanded(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [avatarExpanded])

  const handleLinkClick = () => setMenuOpen(false)

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">

        <a
          href="#hero"
          className={`navbar-logo${avatarExpanded ? ' avatar-expanded' : ''}`}
          onClick={(e) => { e.preventDefault(); setAvatarExpanded(v => !v) }}
        >
          <span className="logo-bracket">&lt;</span>
          <img src={profileImg} alt="Enrique Portela" className="navbar-avatar" />
          <span className="logo-bracket">/&gt;</span>
        </a>

        <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          {navLinks.map((link) => (
            <li key={link.label}>
              <a href={link.href} className="nav-link" onClick={handleLinkClick}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          className={`hamburger ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </nav>
  )
}
