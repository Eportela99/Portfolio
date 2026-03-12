import { useState, useEffect, useRef, forwardRef, useImperativeHandle, useCallback } from 'react'
import './RobotTerminal.css'

const BOOT_LINES = [
  '> initializing neural core...',
  '> calibrating optical sensors...',
  '> loading personality.exe...',
  '> STATUS: ONLINE',
]

const INTRO = [
  { text: '┌─[EN-01 v1.0]──[✔ online]', speed: 28, pause: 260, cls: 'term-header' },
  { text: '└─❯ greet.sh --verbose',       speed: 45, pause: 520, cls: 'term-prompt' },
  { text: '', pause: 140 },
  { text: "  Hey! I'm EN-01 👋",                   speed: 50, pause: 300 },
  { text: "  Enrique's digital assistant.",         speed: 46, pause: 240 },
  { text: '', pause: 130 },
  { text: '  ◆ Full-stack dev',           speed: 42, pause: 160, cls: 'term-accent' },
  { text: '  ◆ IT infra & security',      speed: 42, pause: 160, cls: 'term-accent' },
  { text: '  ◆ Creative problem solver',  speed: 42, pause: 360, cls: 'term-accent' },
  { text: '', pause: 120 },
  { text: '  ↓ scroll to explore',        speed: 44, pause: 0,   cls: 'term-dim' },
]

const RobotTerminal = forwardRef(function RobotTerminal({ onClose }, ref) {
  const [phase,       setPhase]       = useState(0)
  const [bootLines,   setBootLines]   = useState([])
  const [blinking,    setBlinking]    = useState(false)
  const [evil,        setEvil]        = useState(false)
  const [talking,     setTalking]     = useState(false)
  const [lines,       setLines]       = useState([])
  const [current,     setCurrent]     = useState('')
  const [currentCls,  setCurrentCls]  = useState('')
  const [termVisible, setTermVisible] = useState(false)

  const eyesRef    = useRef(null)
  const blinkRef   = useRef(null)
  const lookRef    = useRef(null)
  const evilRef    = useRef(false)
  const talkingRef = useRef(false)
  const queueRef   = useRef([...INTRO])
  const timeoutRef = useRef(null)
  const runningRef = useRef(false)
  const bodyRef    = useRef(null)

  useEffect(() => { evilRef.current   = evil    }, [evil])
  useEffect(() => { talkingRef.current = talking }, [talking])

  // ── Boot sequence ──────────────────────────────────
  useEffect(() => {
    const t = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setBootLines([BOOT_LINES[0]]),                     700),
      setTimeout(() => setBootLines(l => [...l, BOOT_LINES[1]]),         1300),
      setTimeout(() => setBootLines(l => [...l, BOOT_LINES[2]]),         1850),
      setTimeout(() => setBootLines(l => [...l, BOOT_LINES[3]]),         2350),
      setTimeout(() => setPhase(2),                                       2750),
      setTimeout(() => setPhase(3),                                       3350),
      setTimeout(() => setTermVisible(true),                              3750),
    ]
    return () => t.forEach(clearTimeout)
  }, [])

  // ── Look around ────────────────────────────────────
  useEffect(() => {
    if (phase < 3) return
    const look = () => {
      if (eyesRef.current && !evilRef.current && !talkingRef.current) {
        eyesRef.current.style.setProperty('--px', `${(Math.random() - 0.5) * 18}px`)
        eyesRef.current.style.setProperty('--py', `${(Math.random() - 0.5) * 12}px`)
      }
      lookRef.current = setTimeout(look, 1400 + Math.random() * 2200)
    }
    lookRef.current = setTimeout(look, 600)
    return () => clearTimeout(lookRef.current)
  }, [phase])

  // ── Eyes look down when typing, fixed stare when evil ──
  useEffect(() => {
    if (!eyesRef.current) return
    if (evil) {
      eyesRef.current.style.setProperty('--px', '5px')
      eyesRef.current.style.setProperty('--py', '6px')
    } else if (talking) {
      eyesRef.current.style.setProperty('--px', '0px')
      eyesRef.current.style.setProperty('--py', '9px')
    }
  }, [evil, talking])

  // ── Blink ──────────────────────────────────────────
  useEffect(() => {
    if (phase < 3) return
    const scheduleBlink = () => {
      blinkRef.current = setTimeout(() => {
        if (!evilRef.current) {
          setBlinking(true)
          setTimeout(() => { setBlinking(false); scheduleBlink() }, 140)
        } else {
          scheduleBlink()
        }
      }, 2500 + Math.random() * 3000)
    }
    scheduleBlink()
    return () => clearTimeout(blinkRef.current)
  }, [phase])

  // ── Text queue ─────────────────────────────────────
  const processNext = useCallback(() => {
    if (queueRef.current.length === 0) {
      setTalking(false)
      runningRef.current = false
      return
    }
    runningRef.current = true
    const item = queueRef.current.shift()

    if (item.__cb) {
      item.__cb()
      timeoutRef.current = setTimeout(processNext, 0)
      return
    }

    if (!item.text) {
      setTalking(false)
      setLines(prev => [...prev, { text: '', cls: '' }])
      timeoutRef.current = setTimeout(processNext, item.pause ?? 300)
      return
    }

    let idx = 0
    const typeChar = () => {
      if (idx < item.text.length) {
        setTalking(true)
        setCurrent(item.text.slice(0, idx + 1))
        setCurrentCls(item.cls || '')
        idx++
        timeoutRef.current = setTimeout(typeChar, item.speed ?? 50)
      } else {
        setTalking(false)
        setLines(prev => [...prev, { text: item.text, cls: item.cls || '' }])
        setCurrent('')
        setCurrentCls('')
        timeoutRef.current = setTimeout(processNext, item.pause ?? 300)
      }
    }
    typeChar()
  }, [])

  useEffect(() => {
    if (!termVisible) return
    timeoutRef.current = setTimeout(processNext, 400)
    return () => clearTimeout(timeoutRef.current)
  }, [termVisible, processNext])

  // Auto-scroll
  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight
  }, [lines, current])

  // ── Exposed API ────────────────────────────────────
  useImperativeHandle(ref, () => ({
    appendLines(newLines, { onStart, onEnd } = {}) {
      if (onStart) queueRef.current.push({ __cb: onStart })
      newLines.forEach(text => queueRef.current.push({ text, speed: 48, pause: 350 }))
      if (onEnd)   queueRef.current.push({ __cb: onEnd })
      if (!runningRef.current) timeoutRef.current = setTimeout(processNext, 400)
    },
    setEvil(val) { setEvil(val) },
  }))

  return (
    <div className={`robot-terminal rt-phase-${phase}${evil ? ' rt-evil' : ''}`}>

      {/* Title bar */}
      <div className="rt-titlebar">
        <button className="rt-dot rt-dot-red" onClick={onClose} aria-label="Close" />
        <span className="rt-dot rt-dot-yellow" />
        <span className="rt-dot rt-dot-green"  />
        <span className="rt-title-text">EN-01 — system.exe</span>
        <span className="rt-status-dot" />
      </div>

      {/* Screen */}
      <div className="rt-screen">
        <div className="rt-scanlines" />
        <div className="rt-flicker"   />
        <div className="rt-poweron"   />

        {/* Boot text */}
        <div className="rt-boot-text">
          {bootLines.map((line, i) => (
            <div key={i} className="rt-boot-line" style={{ animationDelay: `${i * 0.06}s` }}>
              {line}
            </div>
          ))}
        </div>

        {/* Face: eyes + pixel teeth mouth */}
        <div className="rt-face">
          <div className="rt-eyes" ref={eyesRef}>
            {['left', 'right'].map((side) => (
              <div key={side} className={`rt-eye rt-eye-${side}${blinking ? ' rt-blink' : ''}`}>
                <div className="rt-eye-ring" />
                <div className="rt-iris">
                  <div className="rt-pupil">
                    <div className="rt-pupil-glow" />
                  </div>
                </div>
                <div className="rt-shine rt-shine-1" />
                <div className="rt-shine rt-shine-2" />
              </div>
            ))}
          </div>

          <div className={`rt-mouth${talking ? ' rt-talking' : ''}`}>
            {[...Array(7)].map((_, i) => (
              <div key={i} className="rt-tooth" style={{ '--i': i }} />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className={`rt-divider${termVisible ? ' rt-divider-visible' : ''}`} />

        {/* Terminal text */}
        <div className={`rt-term-body${termVisible ? ' rt-term-visible' : ''}`} ref={bodyRef}>
          {lines.map((line, i) => (
            <div key={i} className={`rt-term-line ${line.cls}`}>
              {line.text || '\u00A0'}
            </div>
          ))}
          {current && (
            <div className={`rt-term-line ${currentCls}`}>
              {current}<span className="rt-cursor">▋</span>
            </div>
          )}
          {!current && termVisible && (
            <span className="rt-cursor rt-cursor-idle">▋</span>
          )}
        </div>

        {/* Corner decorations */}
        <span className="rt-corner rt-corner-tl" />
        <span className="rt-corner rt-corner-tr" />
        <span className="rt-corner rt-corner-bl" />
        <span className="rt-corner rt-corner-br" />
      </div>

    </div>
  )
})

export default RobotTerminal
