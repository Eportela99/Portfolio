import { useEffect, useState } from 'react'
import './Hero.css'
import profileImg from '../assets/Profile-Updated.png'

const roles = [
  'Full Stack Developer',
  'Database Administrator',
  'IT Support Specialist',
  'IT Field Service Technician',
  'Problem Solver',
]

export default function Hero() {
  const [displayText, setDisplayText] = useState('')
  const [roleIndex, setRoleIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  // Typing effect
  useEffect(() => {
    const current = roles[roleIndex]
    const speed = isDeleting ? 50 : 100

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(current.slice(0, charIndex + 1))
        if (charIndex + 1 === current.length) {
          setTimeout(() => setIsDeleting(true), 1500)
        } else {
          setCharIndex((c) => c + 1)
        }
      } else {
        setDisplayText(current.slice(0, charIndex - 1))
        if (charIndex - 1 === 0) {
          setIsDeleting(false)
          setCharIndex(0)
          setRoleIndex((r) => (r + 1) % roles.length)
        } else {
          setCharIndex((c) => c - 1)
        }
      }
    }, speed)

    return () => clearTimeout(timer)
  }, [charIndex, isDeleting, roleIndex])

  return (
    <section className="hero" id="hero">

      <div className="hero-content">
        <div className="hero-greeting">Hello World, I&apos;m</div>
        <h1 className="hero-name" data-text="Enrique L. Portela">
          Enrique L. <span className="neon-text">Portela</span>
        </h1>
        <div className="hero-role">
          <span className="role-text">{displayText}</span>
          <span className="cursor">|</span>
        </div>
        <p className="hero-description">
          I craft elegant digital experiences with clean code and creative thinking.
          Passionate about building products that make a difference.
        </p>
        <div className="hero-cta">
          <a href="#projects" className="btn-primary">
            <span>View My Work</span>
          </a>
          <a href="/Resume-Enrique-Portela.pdf" target="_blank" rel="noreferrer" className="btn-outline">
            Download Resume
          </a>
        </div>
      </div>

      {/* Profile photo */}
      <div className="hero-photo-wrap">
        <div className="hero-photo">
          <img src={profileImg} alt="Enrique Portela" />
          <div className="hero-photo-vignette" />
          <div className="hero-photo-tint" />
        </div>
      </div>

      {/* Desktop: mouse icon */}
      <div className="scroll-indicator scroll-indicator-mouse">
        <div className="scroll-dot" />
      </div>

      {/* Mobile: phone icon */}
      <div className="scroll-indicator scroll-indicator-phone">
        <div className="phone-body">
          <div className="phone-dot" />
        </div>
      </div>
    </section>
  )
}
