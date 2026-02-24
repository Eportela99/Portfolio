import './Footer.css'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <span className="logo-bracket">&lt;</span>
          EP
          <span className="logo-bracket">/&gt;</span>
        </div>
        <p className="footer-copy">
          &copy; {year} Enrique L. Portela &mdash; Built with{' '}
          <span className="neon-text">React</span> &amp; passion.
        </p>
        <div className="footer-back-top">
          <a href="#hero" className="back-top-link" aria-label="Back to top">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  )
}
