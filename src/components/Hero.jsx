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
  const [typingStarted, setTypingStarted] = useState(false)
  const [entered, setEntered] = useState(false)

  // Trigger entrance sequence on mount
  useEffect(() => {
    // Small delay so the browser paints the initial state first
    const t = requestAnimationFrame(() => setEntered(true))
    // Start typing after the name has revealed
    const typingDelay = setTimeout(() => setTypingStarted(true), 1800)
    return () => {
      cancelAnimationFrame(t)
      clearTimeout(typingDelay)
    }
  }, [])

  // Typing effect — only runs after entrance finishes
  useEffect(() => {
    if (!typingStarted) return

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
  }, [charIndex, isDeleting, roleIndex, typingStarted])

  return (
    <section className={`hero ${entered ? 'hero--entered' : ''}`} id="hero">

      <div className="hero-content">
        <div className="hero-greeting hero-anim hero-anim--greeting">Hello World, I&apos;m</div>
        <h1 className="hero-name hero-anim hero-anim--name" data-text="Enrique L. Portela">
          Enrique L. <span className="neon-text">Portela</span>
        </h1>
        <div className="hero-role hero-anim hero-anim--role">
          <span className="role-text">{displayText}</span>
          <span className="cursor">|</span>
        </div>
        <p className="hero-description hero-anim hero-anim--desc">
          I craft elegant digital experiences with clean code and creative thinking.
          Passionate about building products that make a difference.
        </p>
        <div className="hero-cta hero-anim hero-anim--cta">
          <a href="#projects" className="btn-primary hero-anim--btn1">
            <span>View My Work</span>
          </a>
          <a href="/Resume-Enrique-Portela.pdf" target="_blank" rel="noreferrer" className="btn-outline hero-anim--btn2">
            Download Resume
          </a>
        </div>
      </div>

      {/* Profile photo */}
      <div className="hero-photo-wrap hero-anim hero-anim--photo">
        <div className="hero-photo">
          <img src={profileImg} alt="Enrique Portela" />
          <div className="hero-photo-vignette" />
          <div className="hero-photo-tint" />
        </div>
      </div>

      {/* Desktop: mouse icon */}
      <div className="scroll-indicator scroll-indicator-mouse hero-anim hero-anim--scroll">
        <div className="scroll-dot" />
      </div>

      {/* Mobile: phone icon */}
      <div className="scroll-indicator scroll-indicator-phone hero-anim hero-anim--scroll">
        <div className="phone-body">
          <div className="phone-dot" />
        </div>
      </div>
    </section>
  )
}
