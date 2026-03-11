import { useState, useEffect, useRef } from 'react'
import './RobotTerminal.css'

const BOOT_LINES = [
  '> initializing neural core...',
  '> calibrating optical sensors...',
  '> loading personality.exe...',
  '> STATUS: ONLINE',
]

export default function RobotTerminal({ talking = false, evil = false, onClose }) {
  const [phase,     setPhase]     = useState(0)
  const [bootLines, setBootLines] = useState([])
  const [blinking,  setBlinking]  = useState(false)
  const eyesRef  = useRef(null)
  const blinkRef = useRef(null)
  const lookRef  = useRef(null)
  const evilRef  = useRef(evil)

  useEffect(() => { evilRef.current = evil }, [evil])

  // Boot sequence
  useEffect(() => {
    const t = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setBootLines([BOOT_LINES[0]]),                        700),
      setTimeout(() => setBootLines(l => [...l, BOOT_LINES[1]]),            1300),
      setTimeout(() => setBootLines(l => [...l, BOOT_LINES[2]]),            1850),
      setTimeout(() => setBootLines(l => [...l, BOOT_LINES[3]]),            2350),
      setTimeout(() => setPhase(2),                                          2750),
      setTimeout(() => setPhase(3),                                          3350),
    ]
    return () => t.forEach(clearTimeout)
  }, [])

  // Look around — skips update when evil (eyes stay in menacing position)
  useEffect(() => {
    if (phase < 3) return
    const look = () => {
      if (eyesRef.current && !evilRef.current) {
        eyesRef.current.style.setProperty('--px', `${(Math.random() - 0.5) * 16}px`)
        eyesRef.current.style.setProperty('--py', `${(Math.random() - 0.5) * 10}px`)
      }
      lookRef.current = setTimeout(look, 1400 + Math.random() * 2200)
    }
    lookRef.current = setTimeout(look, 600)
    return () => clearTimeout(lookRef.current)
  }, [phase])

  // Fix pupils to menacing inward stare when evil
  useEffect(() => {
    if (!eyesRef.current) return
    if (evil) {
      eyesRef.current.style.setProperty('--px', '4px')
      eyesRef.current.style.setProperty('--py', '5px')
    }
  }, [evil])

  // Random blink
  useEffect(() => {
    if (phase < 3) return
    const scheduleBlink = () => {
      blinkRef.current = setTimeout(() => {
        setBlinking(true)
        setTimeout(() => { setBlinking(false); scheduleBlink() }, 160)
      }, 2500 + Math.random() * 3000)
    }
    scheduleBlink()
    return () => clearTimeout(blinkRef.current)
  }, [phase])

  return (
    <div className={`robot-terminal rt-phase-${phase}${evil ? ' rt-evil' : ''}`}>

      {/* Title bar */}
      <div className="rt-titlebar">
        <span className="rt-dot rt-dot-red"    />
        <span className="rt-dot rt-dot-yellow" />
        <span className="rt-dot rt-dot-green"  />
        <span className="rt-title-text">system.exe</span>
        <span className="rt-status-dot" />
        {onClose && (
          <button className="rt-close" onClick={onClose} aria-label="Close">✕</button>
        )}
      </div>

      {/* Screen */}
      <div className="rt-screen">
        <div className="rt-scanlines" />
        <div className="rt-flicker"   />

        {/* Boot text */}
        <div className="rt-boot-text">
          {bootLines.map((line, i) => (
            <div key={i} className="rt-boot-line" style={{ animationDelay: `${i * 0.06}s` }}>
              {line}
            </div>
          ))}
        </div>

        {/* Robot face */}
        <div className="rt-face">

          {/* Eyebrows */}
          <div className="rt-eyebrows">
            <div className="rt-eyebrow rt-eyebrow-left"  />
            <div className="rt-eyebrow rt-eyebrow-right" />
          </div>

          {/* Eyes */}
          <div className="rt-eyes" ref={eyesRef}>
            {['left', 'right'].map((side) => (
              <div key={side} className={`rt-eye rt-eye-${side}${blinking ? ' rt-blink' : ''}`}>
                <div className="rt-iris">
                  <div className="rt-pupil" />
                  <div className="rt-pupil-glow" />
                </div>
                <div className="rt-shine rt-shine-1" />
                <div className="rt-shine rt-shine-2" />
                <div className="rt-eye-ring" />
              </div>
            ))}
          </div>

          {/* Mouth — equalizer bars */}
          <div className={`rt-mouth${talking ? ' rt-talking' : ''}`}>
            {[...Array(7)].map((_, i) => (
              <div key={i} className="rt-bar" style={{ '--i': i }} />
            ))}
          </div>

        </div>

        {/* Corner decorations */}
        <span className="rt-corner rt-corner-tl" />
        <span className="rt-corner rt-corner-tr" />
        <span className="rt-corner rt-corner-bl" />
        <span className="rt-corner rt-corner-br" />
      </div>

    </div>
  )
}
