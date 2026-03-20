import { useEffect, useRef, useState } from 'react'
import './CertCarousel.css'

import comptiaImg    from '../assets/certs/comptia-aplus-1.png'
import windowsImg   from '../assets/certs/windows-os-1.png'
import photoshopImg from '../assets/certs/photoshop-1.png'
import illustratorImg from '../assets/certs/illustrator-1.png'
import degreeImg      from '../assets/certs/degree.png'

const CERTS = [
  { img: degreeImg,      title: 'B.S. Computer Science', issuer: 'Florida International University' },
  { img: comptiaImg,     title: 'CompTIA A+',          issuer: 'CompTIA' },
  { img: windowsImg,     title: 'Windows OS',          issuer: 'Microsoft / Certiport' },
  { img: photoshopImg,   title: 'Adobe Photoshop CS6', issuer: 'Adobe / Certiport' },
  { img: illustratorImg, title: 'Adobe Illustrator CS6', issuer: 'Adobe / Certiport' },
]

const N = CERTS.length

// Returns the visual "slot" offset for a card relative to active
// slot: 0=center, 1=right, -1=left, ±2=back (hidden)
function slot(cardIndex, active) {
  let d = cardIndex - active
  // wrap to [-N/2, N/2]
  if (d >  N / 2) d -= N
  if (d < -N / 2) d += N
  return d
}

export default function CertCarousel() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const intervalRef = useRef(null)

  // Auto-advance
  useEffect(() => {
    if (paused) return
    intervalRef.current = setInterval(() => {
      setActive(a => (a + 1) % N)
    }, 3500)
    return () => clearInterval(intervalRef.current)
  }, [paused])

  const prev = () => { setActive(a => (a - 1 + N) % N); bump() }
  const next = () => { setActive(a => (a + 1) % N);       bump() }
  const bump = () => {
    clearInterval(intervalRef.current)
    setPaused(true)
    setTimeout(() => setPaused(false), 6000)
  }

  return (
    <div className="cc-wrap">
      <div
        className="cc-stage"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {CERTS.map((cert, i) => {
          const s = slot(i, active)
          const isCenter = s === 0

          let cls = 'cc-card'
          if      (s ===  0) cls += ' cc-pos-center'
          else if (s ===  1) cls += ' cc-pos-right'
          else if (s === -1) cls += ' cc-pos-left'
          else               cls += ' cc-pos-back'

          return (
            <div
              key={i}
              className={cls}
              onClick={() => { if (!isCenter) { setActive(i); bump() } }}
            >
              <div className="cc-card-inner">
                <img src={cert.img} alt={cert.title} draggable={false} />
                <div className="cc-card-overlay" />
                {isCenter && (
                  <div className="cc-card-label">
                    <span className="cc-card-title">{cert.title}</span>
                    <span className="cc-card-issuer">{cert.issuer}</span>
                  </div>
                )}
              </div>
              {isCenter && <div className="cc-glow" />}
            </div>
          )
        })}
      </div>

      {/* Nav */}
      <div className="cc-nav">
        <button className="cc-btn" onClick={prev} aria-label="Previous">&#8592;</button>
        <div className="cc-dots">
          {CERTS.map((_, i) => (
            <button
              key={i}
              className={`cc-dot ${i === active ? 'active' : ''}`}
              onClick={() => { setActive(i); bump() }}
              aria-label={`Cert ${i + 1}`}
            />
          ))}
        </div>
        <button className="cc-btn" onClick={next} aria-label="Next">&#8594;</button>
      </div>
    </div>
  )
}
