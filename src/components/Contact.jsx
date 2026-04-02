import { useState } from 'react'
import './Contact.css'

const socials = [
  {
    name: 'GitHub',
    href: 'https://github.com/Eportela99',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Form submission would be wired up here
    alert('Message sent! (wire up your backend here)')
  }

  return (
    <section className="contact" id="contact">
      <div className="container">
        <div className="section-header fade-in">
          <h2 className="section-title contact-title" data-text="Get In Touch">Get In <span className="neon-text">Touch</span></h2>
          <div className="section-divider" />
          <p className="section-subtitle">Have a project in mind? Let&apos;s talk.</p>
        </div>

        <div className="contact-grid">
          <div className="contact-info fade-in">
            <h3 className="contact-heading">Let&apos;s Work Together</h3>
            <p className="contact-text">
              I&apos;m always open to discussing new projects, creative ideas, or opportunities
              to be part of an amazing team. Drop me a message and I&apos;ll get back to you.
            </p>

            <div className="contact-details">
              <div className="contact-item">
                <div className="contact-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <a href="mailto:eportela-dev@outlook.com" className="contact-link">eportela-dev@outlook.com</a>
              </div>
              <div className="contact-item">
                <div className="contact-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z" />
                  </svg>
                </div>
                <a href="tel:+17865548551" className="contact-link">(786) 554-8551</a>
              </div>
              <div className="contact-item">
                <div className="contact-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </div>
                <span>Miami, FL</span>
              </div>
            </div>

            <div className="social-links">
              {socials.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="social-link"
                  aria-label={social.name}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <form className="contact-form fade-in" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">Name</label>
              <input
                id="name"
                type="text"
                name="name"
                className="form-input"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                className="form-input"
                placeholder="your@email.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="message" className="form-label">Message</label>
              <textarea
                id="message"
                name="message"
                className="form-input form-textarea"
                placeholder="Tell me about your project..."
                rows={5}
                value={form.message}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn-primary form-submit">
              <span>Send Message</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
