import { useEffect, useRef, useState } from 'react'
import './Hero.css'

const roles = [
  'Full Stack Developer',
  'Database Administrator',
  'IT Support Specialist',
  'IT Field Service Technician',
  'Problem Solver',
]

export default function Hero() {
  const canvasRef = useRef(null)
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

  // Particle canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    // Disable on mobile — prevents visual overlap with content
    if (window.innerWidth <= 768) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles = []
    const count = window.innerWidth <= 768 ? 30 : 80

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.5,
        dx: (Math.random() - 0.5) * 0.4,
        dy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.6 + 0.2,
      })
    }

    let animId
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(0, 212, 255, ${0.15 * (1 - dist / 120)})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      // Draw dots
      particles.forEach((p) => {
        p.x += p.dx
        p.y += p.dy

        if (p.x < 0 || p.x > canvas.width) p.dx *= -1
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0, 212, 255, ${p.alpha})`
        ctx.fill()
      })

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <section className="hero" id="hero">
      <canvas ref={canvasRef} className="hero-canvas" />

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
