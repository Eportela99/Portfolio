import { useState, useEffect, useRef } from 'react'
import './RobotTerminal.css'

const BOOT_LINES = [
  '> initializing neural core...',
  '> calibrating optical sensors...',
  '> loading personality.exe...',
  '> STATUS: ONLINE',
]

export default function RobotTerminal() {
  const [phase, setPhase]       = useState(0) // 0=hidden 1=booting 2=eyes-open 3=alive
  const [bootLines, setBootLines] = useState([])
  const [blinking, setBlinking]   = useState(false)
  const eyesRef   = useRef(null)
  const blinkRef  = useRef(null)
  const lookRef   = useRef(null)

  // ── Boot sequence ──────────────────────────────────────────────
  useEffect(() => {
    const t = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setBootLines([BOOT_LINES[0]]),  700),
      setTimeout(() => setBootLines(l => [...l, BOOT_LINES[1]]), 1300),
      setTimeout(() => setBootLines(l => [...l, BOOT_LINES[2]]), 1850),
      setTimeout(() => setBootLines(l => [...l, BOOT_LINES[3]]), 2350),
      setTimeout(() => setPhase(2), 2750),
      setTimeout(() => setPhase(3), 3350),
    ]
    return () => t.forEach(clearTimeout)
  }, [])

  // ── Look around (random recursive setTimeout) ──────────────────
  useEffect(() => {
    if (phase < 3) return
    const look = () => {
      if (!eyesRef.current) return
      const x = (Math.random() - 0.5) * 16
      const y = (Math.random() - 0.5) * 10
      eyesRef.current.style.setProperty('--px', `${x}px`)
      eyesRef.current.style.setProperty('--py', `${y}px`)
      lookRef.current = setTimeout(look, 1400 + Math.random() * 2200)
    }
    lookRef.current = setTimeout(look, 600)
    return () => clearTimeout(lookRef.current)
  }, [phase])

  // ── Random blink ───────────────────────────────────────────────
  useEffect(() => {
    if (phase < 3) return
    const scheduleBlink = () => {
      blinkRef.current = setTimeout(() => {
        setBlinking(true)
        setTimeout(() => {
          setBlinking(false)
          scheduleBlink()
        }, 160)
      }, 2500 + Math.random() * 3000)
    }
    scheduleBlink()
    return () => clearTimeout(blinkRef.current)
  }, [phase])

  return (
    <div className={`robot-terminal rt-phase-${phase}`}>

      {/* Title bar */}
      <div className="rt-titlebar">
        <span className="rt-dot rt-dot-red"    />
        <span className="rt-dot rt-dot-yellow" />
        <span className="rt-dot rt-dot-green"  />
        <span className="rt-title-text">system.exe</span>
        <span className="rt-status-dot" />
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

          {/* Eyes */}
          <div className="rt-eyes" ref={eyesRef}>
            {['left', 'right'].map((side) => (
              <div
                key={side}
                className={`rt-eye rt-eye-${side}${blinking ? ' rt-blink' : ''}`}
              >
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

          {/* Mouth — scanning bar */}
          <div className="rt-mouth">
            <div className="rt-mouth-scan" />
            <span className="rt-mouth-label">scanning...</span>
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
